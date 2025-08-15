import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';

type BillingSummaryProps = {
  total: number;
  savings: number;
  services: Array<{
    name: string;
    price: number;
  }>;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
};

export function BillingSummary({
  total,
  savings,
  services,
  isExpanded = false,
  onToggleExpand,
  className,
}: BillingSummaryProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm', className)}>
      <button 
        className="w-full px-4 py-3 flex justify-between items-center text-left"
        onClick={onToggleExpand}
      >
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your Monthly Bill</p>
          <div className="flex items-center mt-1">
            <span className="text-green-600 dark:text-green-400 font-medium">
              Save {savings} THB
            </span>
            <span className="ml-3 text-red-500 font-bold">{total} THB</span>
          </div>
        </div>
        <ChevronUp 
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform',
            isExpanded ? 'rotate-0' : 'rotate-180'
          )} 
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Services</h4>
            <div className="space-y-2">
              {services.map((service, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{service.name}</span>
                  <span className="text-gray-900 dark:text-white">{service.price} THB</span>
                </div>
              ))}
            </div>

            {savings > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Bundle Discount</span>
                  <span className="text-green-600 dark:text-green-400">-{savings} THB</span>
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between font-medium">
                <span className="text-gray-900 dark:text-white">Total (excl. VAT)</span>
                <span className="text-gray-900 dark:text-white">{total} THB</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
