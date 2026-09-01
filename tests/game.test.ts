import { describe, expect, it } from 'vitest';
import { RHYME_SOUNDS } from '../src/data/words';
import { chooseNextRhyme } from '../src/domain/game';

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
