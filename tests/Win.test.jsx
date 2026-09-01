import { render, screen } from '@testing-library/preact';

import Win from '../src/routes/win';

describe('the Win component', () => {
  it('renders the win message', () => {
    render(<Win />);
    expect(screen.getByText('You won!')).toBeInTheDocument();
  });
});
