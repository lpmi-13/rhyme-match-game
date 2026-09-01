import { collectData } from '../src/utils';

describe('`collectData`', () => {
  const rhyme = { word: 'say', rhyme: 'ej' };

  it('excludes the source word from the returned cards', () => {
    const actual = collectData(rhyme);
    expect(actual.map((card) => card.word)).not.toContain(rhyme.word);
  });

  it('returns twelve cards (six per rhyme group)', () => {
    const actual = collectData(rhyme);
    expect(actual).toHaveLength(12);
  });
});
