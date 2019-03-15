import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Home from '../routes/home';
import Game from '../routes/game';
import Loss from '../routes/loss';
import Win from '../routes/win';

import * as data from '../data/words.json';

// Fischer-Yates shuffle
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

/**
 * helper function to generate a shuffled array of cards
 */
function generateGridCards () {
	const ay = data.ay;
	const ee = data.ee;

	const shuffledAy = ay.sort(() => Math.random() - Math.random());
	const shuffledEe = ee.sort(() => Math.random() - Math.random());

	const randoArray = [...shuffledAy.slice(0, 8), ...shuffledEe.slice(0, 8)];

	console.log({randoArray});
	const shuffledRando = randoArray.sort(() => Math.random() - Math.random());
    console.log({ shuffledRando });
	return [...shuffledRando]
		.map((card, idx) => ({ key: idx, values: card }));
}

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Home exact path="/" />
					<Game path="/game" />
					<Loss path="/loss" />
					<Win path="/win" />
				</Router>
			</div>
		);
	}
}
