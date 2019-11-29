import collectData from './collectData';
import shuffle from './shuffle';

export default function generateGridCards(rhyme) {
  const randoArray = collectData(rhyme);

  const shuffledRando = shuffle(randoArray);

  return [...shuffledRando].map((card, idx) => ({ key: idx, values: card }));
}
