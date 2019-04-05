import { h, Component } from 'preact';
import { route } from 'preact-router';

import Card from '../../components/card';
import style from './style.css';

import * as data from '../../data/words.json';

export function collectData(rhyme) {
	const rhymeArray = ['ay', 'ee', 'o', 'ou', 'iy'];
	const rhymeIndex = rhymeArray.indexOf(rhyme);

	const firstRhymeArray = data[rhyme];

  // get a rhyme that's not the one we selected
	let number = rhymeIndex;
	while (number === rhymeIndex) {
		number = Math.floor(Math.random() * Math.floor(rhymeArray.length));
	}

	const secondRhymeSound = rhymeArray[number];
	const secondRhymeArray = data[secondRhymeSound];

	const shuffledFirst = firstRhymeArray.sort(() => Math.random() - Math.random());
	const shuffledSecond = secondRhymeArray.sort(() => Math.random() - Math.random());

	return [shuffledFirst.slice(0, 7), shuffledSecond.slice(0, 7)];
}

export function generateGridCards(rhyme) {
	const [shuffledFirst, shuffledSecond] = collectData(rhyme);

	const randoArray = [...shuffledFirst.slice(0, 6), ...shuffledSecond.slice(0, 6)];

	const shuffledRando = randoArray.sort(() => Math.random() - Math.random());

	return [...shuffledRando]
		.map((card, idx) => ({ key: idx, values: card }));
}

export default class Game extends Component {
	state = {
		correctCards: {},
		deck: generateGridCards(this.props.rhyme.rhyme),
		flippedCards: {},
		rhymeToMatch: this.props.rhyme,
		score: 0,
		wrongCards: {},
	};

  getCardRhymeStatus = ({ key, values }) => {

    const { correctCards, flippedCards, wrongCards } = this.state;
    if (correctCards[values.word]) {
	    return 'MATCHED';
    }
      
    if (wrongCards[values.word]) {
	    return 'UNMATCHED';
    }

    if (flippedCards[key] ){
	    return 'FLIPPED'
    }
		
		return 'DEFAULT';
  }

  createCardClickListener = item => () => {
    this.checkCardStatus(item);
  }
	
	checkCardStatus = ({ key, values }) => {
		const { correctCards, flippedCards, rhymeToMatch, score, wrongCards } = this.state;

		this.setState({ flippedCards: { ...flippedCards, key } });
		if (values.rhyme === rhymeToMatch.rhyme) {
			this.setState({
				correctCards: { ...correctCards, [values.word] : true },
				score: score + 1
			}, () => {
				this.countScore();
			});
		} else {
			this.setState({ wrongCards: { ...wrongCards, [values.word] : true },
			}, ()=> {
				 this.countMistakes();
			});
		}
	}

  countScore = () => {
		const { score } = this.state;
		if (score === 6) {
			this.handleWin();
		}
	}

	countMistakes = () => {
		const { wrongCards } = this.state;
		if (Object.keys(wrongCards).length >= 3) {
			this.handleLoss();
		}
	}

	handleWin = () => {
		setTimeout(() => {
			this.setState({
				correctCards: {},
				flippedCards: {},
			});
			route('/win');
		}, 300);
	}

  handleLoss = () => {
	  setTimeout(() => {
	  	this.setState({
	  		correctCards: {},
	  		flippedCards: {},
	  	});
      route('/loss');
    }, 300);
	}
				
	render(props, state) {

		return (
			<div class={style.game}>
			  <div>
			    <header class={style.match}>Rhymes with:<br/> {state.rhymeToMatch.word}</header>
			  	<header class={style.score}>Score: {state.score}</header>
			  </div>
				<div class={style.grid}>
					{state.deck.map(item => (
						<Card
						onClick={this.createCardClickListener(item)}
						rhymeStatus={this.getCardRhymeStatus(item)}
						word={item.values.word}
						/>
					))}
				</div>
			</div>
		);
	}
}
