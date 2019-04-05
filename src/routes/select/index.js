
import { h, Component } from 'preact';
import { route } from 'preact-router';
import style from './style.css';

const rhymeSelections = [
	{"word": "say", "rhyme": "ay"},
	{"word": "be", "rhyme": "ee"},
	{"word": "go", "rhyme": "o"},
	{"word": "you", "rhyme": "ou"},
	{"word": "why", "rhyme": "iy"},
];

export default class Select extends Component {

	startGame = (selection) => {
    this.props.onSelectRhyme(selection);
		route('/game');
	};

	render() {
		return (
			<div class={style.select}>
				<div class={style.head}>
					<h2>Choose a rhyme</h2>
				</div>
				<div class={style.rhymeSection}>
				{rhymeSelections.map((selection) =>
					<button class={style.button} onClick={() => this.startGame(selection)}>{selection.word}</button>
				)}
				</div>
			</div>
		)
	}
}
