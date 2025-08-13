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
    expect(screen.getByText('Create your bundle')).toBeInTheDocument();
  });

  it('renders the initial informational banner', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('Pick your services to unlock bundle savings.')).toBeInTheDocument();
  });

  it('renders the footer with initial state', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('Your monthly total')).toBeInTheDocument();
    expect(screen.getByText('Start building')).toBeInTheDocument();
  });

  it('renders at least one service card', () => {
    render(<AddBundlePage />);
    // Check for a common service
    expect(screen.getByText('Youtube Premium')).toBeInTheDocument();
  });
});
