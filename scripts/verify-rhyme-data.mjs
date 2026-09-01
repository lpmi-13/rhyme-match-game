import { RHYME_FAMILIES } from '../src/data/words.ts';

const CMUDICT_REVISION = '74790861f652b15e4ac49015a90074ad62a27690';
const CMUDICT_URL = `https://raw.githubusercontent.com/cmusphinx/cmudict/${CMUDICT_REVISION}/cmudict.dict`;

const response = await fetch(CMUDICT_URL);
if (!response.ok) {
  throw new Error(`Could not download CMUdict: ${response.status} ${response.statusText}`);
}

const pronunciations = parseDictionary(await response.text());
const errors = [];
const seenWords = new Set();
let wordCount = 0;

for (const family of RHYME_FAMILIES) {
  if (family.words.length < 7) {
    errors.push(`/${family.sound}/ has ${family.words.length} words; at least 7 are required.`);
  }

  for (const word of family.words) {
    wordCount += 1;

    if (seenWords.has(word)) errors.push(`${word}: appears in more than one family.`);
    seenWords.add(word);

    const candidates = pronunciations.get(word);
    if (!candidates) {
      errors.push(`${word}: missing from CMUdict.`);
      continue;
    }

    const isMatch = candidates.some((phones) => {
      const syllables = phones.filter((phone) => /\d$/.test(phone)).length;
      return syllables === family.syllables && rhymeFromFinalStress(phones) === family.arpabetRhyme;
    });

    if (!isMatch) {
      const found = candidates
        .map((phones) => {
          const syllables = phones.filter((phone) => /\d$/.test(phone)).length;
          return `${syllables} syllable(s), ${rhymeFromFinalStress(phones)}`;
        })
        .join('; ');
      errors.push(
        `${word}: expected ${family.syllables} syllable(s), ${family.arpabetRhyme}; found ${found}.`,
      );
    }
  }
}

if (errors.length > 0) {
  throw new Error(`Rhyme data failed CMUdict validation:\n- ${errors.join('\n- ')}`);
}

console.log(
  `Verified ${wordCount} words in ${RHYME_FAMILIES.length} rhyme families against CMUdict ${CMUDICT_REVISION.slice(0, 8)}.`,
);

function parseDictionary(source) {
  const dictionary = new Map();

  for (const line of source.split('\n')) {
    if (!line || line.startsWith(';;;')) continue;
    const [entry, ...phones] = line.split(' ');
    const word = entry?.replace(/\(\d+\)$/, '');
    if (!word || phones.length === 0) continue;

    const existing = dictionary.get(word) ?? [];
    existing.push(phones);
    dictionary.set(word, existing);
  }

  return dictionary;
}

function rhymeFromFinalStress(phones) {
  const stressIndex = phones.findLastIndex((phone) => /[12]$/.test(phone));
  if (stressIndex < 0) return '';
  return phones
    .slice(stressIndex)
    .map((phone) => phone.replace(/\d$/, ''))
    .join(' ');
}
