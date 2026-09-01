import { render, screen } from '@testing-library/preact';

import Loss from '../src/routes/loss';

describe('the Loss component', () => {
  it('renders the loss message', () => {
    render(<Loss />);
    expect(screen.getByText('You lost...')).toBeInTheDocument();
  });
});
