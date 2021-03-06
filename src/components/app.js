import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Home from '../routes/home';
import Game from '../routes/game';
import Loss from '../routes/loss';
import Select from '../routes/select';
import Win from '../routes/win';
import setupPath from '../utils/setupPath';

export default class App extends Component {
  state = {
    selectedRhyme: '',
  };

  selectRhyme = selectedRhyme => this.setState({ selectedRhyme });

  render() {
    return (
      <div id="app">
        <Router onChange={this.handleRoute}>
          <Home path={`${setupPath()}/`} />
          <Game path={`${setupPath()}/game`} rhyme={this.state.selectedRhyme} />
          <Loss path={`${setupPath()}/loss`} />
          <Select path={`${setupPath()}/select`} onSelectRhyme={this.selectRhyme} />
          <Win path={`${setupPath()}/win`} />
        </Router>
      </div>
    );
  }
}
