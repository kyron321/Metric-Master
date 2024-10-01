import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { useSession } from 'next-auth/react';

// Mock the useSession hook from next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('Home Component', () => {
  it('displays loading message when session is loading', () => {
    // Mock the useSession hook to return loading state
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    });

    render(<Home />);
    
    // Assert that the loading message is displayed
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
