import { Component } from 'preact';
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
 * helper function to generate a schuffled array of cards
 */
function generateGridCards () {
	const ay = data.ay;
	const ee = data.ee;

	shuffleArray(ay)
	shuffleArray(ee);

	const randoArray = [...ay.slice(0, 8), ...ee.slice(0, 8)];

	shuffleArray(randoArray);

	return [...randoArray];
}

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Game path="/game" cards={generateGridCards()} />
					<Loss path="/loss" />
					<Win path="/win" />
				</Router>
			</div>
		);
	}
}
