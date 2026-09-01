import { render, screen } from '@testing-library/preact';

import Game from '../src/routes/game';

describe('the Game component', () => {
  it('renders the score header', () => {
    const props = { rhyme: { word: 'say', rhyme: 'ej' } };
    render(<Game {...props} />);
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
  });
});
