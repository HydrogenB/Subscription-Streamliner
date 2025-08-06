import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AddBundlePage from './page';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      back: () => null,
    };
  },
  usePathname() {
    return '/subscriptions/add';
  }
}));

describe('AddBundlePage', () => {
  it('renders the header title', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('Add bundle')).toBeInTheDocument();
  });

  it('renders the initial informational banner', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('Select your favorite services to see bundle deals!')).toBeInTheDocument();
  });

  it('renders the footer with initial state', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('Your Monthly Bill')).toBeInTheDocument();
    expect(screen.getByText('Choose your bundle')).toBeInTheDocument();
  });

  it('renders at least one service card', () => {
    render(<AddBundlePage />);
    // Check for a common service
    expect(screen.getByText('Youtube Premium')).toBeInTheDocument();
  });
});
