import { Component } from 'preact';
import { route } from 'preact-router';

import Card from '../../components/card';
import style from './style';

export default class Game extends Component {
	state = {
		correctCards: [],
		wrongCards: [],
		rhymeToMatch: 'ay',
		score: 0
	};

	createCardClickListener = card => () => {
		console.log(card);
		this.checkCardStatus(card);
	}
	
	checkCardStatus = card => {
		const { correctCards, rhymeToMatch, score, wrongCards } = this.state;

		if (card.rhyme === rhymeToMatch) {
			this.setState({
				correctCards: [ ...correctCards, card ],
				score: score + 1
			});
		} else {
			this.setState({ wrongCards: [ ...wrongCards, card ] });
		}
		if(score >= 8) {
			this.handleWin();
		}
	}

	handleWin = () => {
		setTimeout(() => {
			route('/win');
		}, 300);
	}

	render(props, state) {
		return (
			<div class={style.game}>
				<header class={style.score}>Score: {state.score}</header>
				<div class={style.grid}>
					{props.cards.map(card => (
						<Card
							rhymeValue={card.rhyme}
							onClick={this.createCardClickListener(card)}
							word={card.word}
						/>
					))}
				</div>
			</div>
		);
	}

}