import { render, screen } from '@testing-library/preact';

import Home from '../src/routes/home';

describe('the Home component', () => {
  it('renders the title', () => {
    render(<Home />);
    expect(screen.getByText('Match Game')).toBeInTheDocument();
  });
});
