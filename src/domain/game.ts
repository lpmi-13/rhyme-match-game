import words, { RHYME_SOUNDS, type RhymeSound, type RhymeWord } from '../data/words';

export interface RhymeSelection {
  rhyme: RhymeSound;
  word: string;
}

export interface GameCard extends RhymeWord {
  id: string;
}

export type RoundStatus = 'active' | 'won' | 'lost';

export type CardSelectionResult =
  | { kind: 'match'; card: GameCard }
  | { kind: 'miss'; card: GameCard }
  | { kind: 'ignored' };

const MATCH_COUNT = 6;
const DISTRACTOR_COUNT = 6;

export function createRhymeSelections(random: () => number = Math.random): RhymeSelection[] {
  return RHYME_SOUNDS.map((rhyme) => {
    const rhymeWords = words[rhyme];
    const selection = rhymeWords[randomIndex(rhymeWords.length, random)];
    if (!selection) throw new Error(`No example is available for rhyme /${rhyme}/.`);
    return { rhyme, word: selection.word };
  });
}

export function createDeck(
  selection: RhymeSelection,
  random: () => number = Math.random,
): GameCard[] {
  const matches = words[selection.rhyme].filter((entry) => entry.word !== selection.word);
  const distractorRhymes = RHYME_SOUNDS.filter(
    (rhyme) => rhyme !== selection.rhyme && words[rhyme].length >= DISTRACTOR_COUNT,
  );
  const distractorRhyme = distractorRhymes[randomIndex(distractorRhymes.length, random)];

  if (matches.length < MATCH_COUNT) {
    throw new RangeError(`Rhyme /${selection.rhyme}/ does not have enough matching words.`);
  }
  if (!distractorRhyme) {
    throw new RangeError(`No distractor rhyme is available for /${selection.rhyme}/.`);
  }

  const matchCards = shuffle(matches, random)
    .slice(0, MATCH_COUNT)
    .map((entry, index) => card(entry, `match-${index}`));
  const distractorCards = shuffle(words[distractorRhyme], random)
    .slice(0, DISTRACTOR_COUNT)
    .map((entry, index) => card(entry, `distractor-${index}`));

  return shuffle([...matchCards, ...distractorCards], random);
}

export class RhymeRound {
  readonly cards: readonly GameCard[];
  readonly selection: RhymeSelection;
  readonly selectedIds = new Set<string>();
  matches = 0;
  misses = 0;
  status: RoundStatus = 'active';

  constructor(selection: RhymeSelection, random: () => number = Math.random) {
    this.selection = selection;
    this.cards = createDeck(selection, random);
  }

  selectCard(cardId: string): CardSelectionResult {
    if (this.status !== 'active' || this.selectedIds.has(cardId)) return { kind: 'ignored' };

    const selected = this.cards.find((cardItem) => cardItem.id === cardId);
    if (!selected) throw new RangeError(`Unknown card: ${cardId}.`);
    this.selectedIds.add(cardId);

    if (selected.rhyme === this.selection.rhyme) {
      this.matches += 1;
      if (this.matches === MATCH_COUNT) this.status = 'won';
      return { kind: 'match', card: selected };
    }

    this.misses += 1;
    if (this.misses === 3) this.status = 'lost';
    return { kind: 'miss', card: selected };
  }
}

export function rhymeDescription(rhyme: RhymeSound): string {
  return `Words ending in the sound /${rhyme}/`;
}

function card(entry: RhymeWord, id: string): GameCard {
  return { id: `${id}-${entry.rhyme}-${entry.word}`, ...entry };
}

function randomIndex(length: number, random: () => number): number {
  if (length < 1) throw new RangeError('Cannot choose from an empty list.');
  return Math.min(length - 1, Math.floor(random() * length));
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const shuffled = [...values];
  for (let current = shuffled.length - 1; current > 0; current -= 1) {
    const target = randomIndex(current + 1, random);
    const currentValue = shuffled[current];
    const targetValue = shuffled[target];
    if (currentValue === undefined || targetValue === undefined) {
      throw new Error('Unable to shuffle the card deck.');
    }
    shuffled[current] = targetValue;
    shuffled[target] = currentValue;
  }
  return shuffled;
}
