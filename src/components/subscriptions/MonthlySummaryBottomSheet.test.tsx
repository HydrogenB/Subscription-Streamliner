import { render, screen } from '@testing-library/react';
import { MonthlySummaryBottomSheet } from './MonthlySummaryBottomSheet';

// Mock the cn utility function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

describe('MonthlySummaryBottomSheet', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <MonthlySummaryBottomSheet
        isOpen={false}
        onClose={mockOnClose}
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders the bottom sheet when isOpen is true', () => {
    render(
      <MonthlySummaryBottomSheet
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    // Check for main elements
    expect(screen.getByText('สรุปค่าบริการรายเดือน')).toBeInTheDocument();
    expect(screen.getByText('บริการของคุณ')).toBeInTheDocument();
    expect(screen.getByText('ถัดไป')).toBeInTheDocument();
    
    // Check for services
    expect(screen.getByText('Youtube premium')).toBeInTheDocument();
    expect(screen.getByText('VIU')).toBeInTheDocument();
    expect(screen.getByText('iQIYI VIP Standard')).toBeInTheDocument();
    
    // Check for prices
    expect(screen.getByText('119 บาท')).toBeInTheDocument();
    expect(screen.getByText('90 บาท')).toBeInTheDocument();
    
    // Check for promotional text
    expect(screen.getByText('ส่วนลดสูงสุด 367 บาท เมื่อเลือกสูงสุด 4 แอป')).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <MonthlySummaryBottomSheet
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const backdrop = screen.getByRole('button', { hidden: true });
    backdrop.click();
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when chevron button is clicked', () => {
    render(
      <MonthlySummaryBottomSheet
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    const chevronButton = screen.getByRole('button', { name: '' });
    chevronButton.click();
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
