import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ActivationPage from './page';

// Mock useRouter and useSearchParams
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      back: () => null,
      push: () => null,
    };
  },
  useSearchParams() {
    return {
      get: (param: string) => {
        if (param === 'bundle') {
          return 'viu,oned';
        }
        if (param === 'orderId') {
          return 'ORD-123456';
        }
        return null;
      }
    };
  }
}));

// Mock window.open
const mockOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockOpen,
});

describe('ActivationPage', () => {
  beforeEach(() => {
    mockOpen.mockClear();
  });

  it('renders the header title', () => {
    render(<ActivationPage />);
    expect(screen.getByText('My subscriptions')).toBeInTheDocument();
  });

  it('renders the subscription bill summary', () => {
    render(<ActivationPage />);
    expect(screen.getByText('Subscription bill')).toBeInTheDocument();
    expect(screen.getByText('Total for this billing cycle')).toBeInTheDocument();
    expect(screen.getByText('379 THB')).toBeInTheDocument();
    expect(screen.getByText('887 THB')).toBeInTheDocument();
  });

  it('renders the savings banner', () => {
    render(<ActivationPage />);
    expect(screen.getByText('Yay, you\'ve saved 438 THB!')).toBeInTheDocument();
  });

  it('renders services from bundle parameter', () => {
    render(<ActivationPage />);
    expect(screen.getByText('VIU')).toBeInTheDocument();
    expect(screen.getByText('oneD')).toBeInTheDocument();
  });

  it('renders activation description for each service', () => {
    render(<ActivationPage />);
    const descriptions = screen.getAllByText('กรุณา Activate เพื่อเริ่มใช้งาน');
    expect(descriptions).toHaveLength(2); // viu and oned
  });

  it('renders Go activate and Mark as activated buttons for each service', () => {
    render(<ActivationPage />);
    const goActivateButtons = screen.getAllByText('Go activate');
    const markActivatedButtons = screen.getAllByText('Mark as activated');
    
    expect(goActivateButtons).toHaveLength(2);
    expect(markActivatedButtons).toHaveLength(2);
  });

  it('opens external URL when Go activate is clicked', () => {
    render(<ActivationPage />);
    
    const goActivateButtons = screen.getAllByText('Go activate');
    fireEvent.click(goActivateButtons[0]); // Click first service (VIU)
    
    expect(mockOpen).toHaveBeenCalledWith('https://www.viu.com', '_blank');
  });

  it('logs when Mark as activated is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<ActivationPage />);
    
    const markActivatedButtons = screen.getAllByText('Mark as activated');
    fireEvent.click(markActivatedButtons[0]); // Click first service (VIU)
    
    expect(consoleSpy).toHaveBeenCalledWith('Marked viu as activated');
    
    consoleSpy.mockRestore();
  });

  it('renders View All Subscriptions button at bottom', () => {
    render(<ActivationPage />);
    expect(screen.getByText('View All Subscriptions')).toBeInTheDocument();
  });
});
