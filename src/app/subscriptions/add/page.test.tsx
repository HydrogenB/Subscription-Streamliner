import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AddBundlePage from './page';

// Mock useRouter and useSearchParams
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      back: () => null,
      push: () => null,
    };
  },
  usePathname() {
    return '/subscriptions/add';
  },
  useSearchParams() {
    return {
      get: (param: string) => {
        if (param === 'bundle') {
          return 'viu,oned';
        }
        return null;
      }
    };
  }
}));

describe('AddBundlePage', () => {
  it('renders the header title', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('Subscription hub')).toBeInTheDocument();
  });

  it('renders the initial informational banner', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('Buy up to 4 to get a special price!')).toBeInTheDocument();
  });

  it('renders the footer with initial state', () => {
    render(<AddBundlePage />);
    expect(screen.getByText('สรุปค่าบริการรายเดือน')).toBeInTheDocument();
    expect(screen.getByText('เริ่มต้นสร้าง')).toBeInTheDocument();
  });

  it('renders at least one service card', () => {
    render(<AddBundlePage />);
    // Check for a common service
    expect(screen.getByText('Youtube Premium')).toBeInTheDocument();
  });

  it('automatically selects services from bundle query parameter', () => {
    render(<AddBundlePage />);
    
    // Check that VIU and oneD are automatically selected
    const viuCard = screen.getByText('VIU').closest('.border-red-500');
    const onedCard = screen.getByText('oneD').closest('.border-red-500');
    
    expect(viuCard).toBeInTheDocument();
    expect(onedCard).toBeInTheDocument();
  });

  it('shows correct button text when bundle is valid', () => {
    render(<AddBundlePage />);
    
    // Since viu,oned is a valid 2-service bundle, the button should show "ถัดไป"
    expect(screen.getByText('ถัดไป')).toBeInTheDocument();
  });
});
