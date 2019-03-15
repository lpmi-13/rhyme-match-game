import { h, render } from 'preact'; 
import { expect } from 'chai';

import Game from '../src/routes/game';

describe('the Game component', () => {
  it('renders the title', () => {
    const game = <Game />;
    expect(game).to.contain('header');
  });
});
