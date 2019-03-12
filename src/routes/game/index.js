import { Component } from 'preact';
import { route } from 'preact-router';

import Card from '../../components/card';
import style from './style';

import * as data from '../../data/words.json';

function collectData() {
	const ay = data.ay;
	const ee = data.ee;

	const shuffledAy = ay.sort(() => Math.random() - Math.random());
	const shuffledEe = ee.sort(() => Math.random() - Math.random());

	return [shuffledAy, shuffledEe];
}

function generateGridCards() {
	const [shuffledAy, shuffledEe] = collectData();

	const randoArray = [...shuffledAy.slice(0, 6), ...shuffledEe.slice(0, 6)];

	const shuffledRando = randoArray.sort(() => Math.random() - Math.random());

	return [...shuffledRando]
		.map((card, idx) => ({ key: idx, values: card }));
}

function getRandomRhyme() {
	const [shuffledAy, shuffledEe] = collectData();

	const rhymes = [...shuffledAy.slice(-1), ...shuffledEe.slice(-1)];
	const randoRhymes = rhymes.sort(() => Math.random() - Math.random());

	return randoRhymes[0];
}

export default class Game extends Component {
	state = {
		correctCards: {},
		deck: generateGridCards(),
		flippedCards: {},
		rhymeToMatch: getRandomRhyme(),
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
