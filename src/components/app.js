import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Home from '../routes/home';
import Game from '../routes/game';
import Loss from '../routes/loss';
import Select from '../routes/select';
import Win from '../routes/win';

export default class App extends Component {
	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Home exact path="/" />
					<Game path="/game" />
					<Loss path="/loss" />
					<Select path="/select" />
					<Win path="/win" />
				</Router>
			</div>
		);
	}
}
