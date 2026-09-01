import { describe, expect, it } from 'vitest';
import words, { RHYME_FAMILIES, RHYME_SOUNDS } from '../src/data/words';
import { chooseNextRhyme, createDeck } from '../src/domain/game';

describe('rhyme progression', () => {
  it('always chooses a different rhyme family for the next round', () => {
    for (const rhyme of RHYME_SOUNDS) {
      expect(chooseNextRhyme(rhyme, () => 0)).not.toBe(rhyme);
      expect(chooseNextRhyme(rhyme, () => 0.5)).not.toBe(rhyme);
      expect(chooseNextRhyme(rhyme, () => 0.999)).not.toBe(rhyme);
    }
  });

  it('skips the previous rhyme even when it was first in the list', () => {
    expect(chooseNextRhyme('ɪt', () => 0)).toBe('ʌn');
  });
});

describe('rhyme data', () => {
  it('has enough same-syllable matches for every activity', () => {
    for (const family of RHYME_FAMILIES) {
      expect(family.words.length).toBeGreaterThanOrEqual(7);
      expect(words[family.sound].every((word) => word.syllables === family.syllables)).toBe(true);
    }
  });

  it('groups campaign with two-syllable rhymes', () => {
    const campaignRhyme = 'eɪn';
    expect(words[campaignRhyme].map((entry) => entry.word)).toEqual(
      expect.arrayContaining(['campaign', 'refrain', 'sustain']),
    );
  });

  it('does not include misleading unmatched words', () => {
    const allWords = Object.values(words).flatMap((family) => family.map((entry) => entry.word));
    expect(allWords).not.toEqual(expect.arrayContaining(['everyone', 'national', 'personal']));
  });
});

describe('rhyme decks', () => {
  it('uses distractors with the same syllable count as the target word', () => {
    for (const family of RHYME_FAMILIES) {
      const targetWord = family.words[0];
      if (!targetWord) throw new Error(`Missing target word for /${family.sound}/.`);

      const deck = createDeck({ rhyme: family.sound, word: targetWord }, () => 0);

      expect(deck).toHaveLength(12);
      expect(deck.every((card) => card.syllables === family.syllables)).toBe(true);
    }
  });
});
