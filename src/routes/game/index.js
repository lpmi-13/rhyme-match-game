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

    getCardRhymeStatus = ({ rhyme }) => {
      const { rhymeToMatch } = this.state;
      if (rhymeToMatch === rhyme) {
        return 'MATCHED';
      }
      return 'DEFAULT';
    }

	createCardClickListener = card => () => {
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

		if (correctCards.length >= 8) {
			this.handleWin();
		}

                if (wrongCards.length >= 3) {
                        this.handleLoss();
                }
	}

	handleWin = () => {
		setTimeout(() => {
			route('/win');
		}, 300);
	}

        handleLoss = () => {
                setTimeout(() => {
                        route('/loss');
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
                            rhymeStatus={this.getCardRhymeStatus(card)}
							word={card.word}
						/>
					))}
				</div>
			</div>
		);
	}

}
