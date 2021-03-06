import data from '../data/expanded-words.js';
import shuffle from './shuffle';

export default function collectData(rhyme) {
  const rhymeArray = Object.keys(data);
  const rhymeIndex = rhymeArray.indexOf(rhyme.rhyme);

  const firstRhymeArray = data[rhyme.rhyme];
  // make sure the word that we "rhyme with" isn't in the cards to click
  const filteredFirstRhymeArray = firstRhymeArray.filter(
    t => t.word !== rhyme.word
  );

  // get a rhyme that's not the one we selected
  let number = rhymeIndex;
  while (number === rhymeIndex) {
    number = Math.floor(Math.random() * Math.floor(rhymeArray.length));
  }

  const secondRhymeSound = rhymeArray[number];
  const secondRhymeArray = data[secondRhymeSound];

  const shuffledFirst = shuffle(filteredFirstRhymeArray);
  const shuffledSecond = shuffle(secondRhymeArray);

  return [...shuffledFirst.slice(0, 6), ...shuffledSecond.slice(0, 6)];
}
