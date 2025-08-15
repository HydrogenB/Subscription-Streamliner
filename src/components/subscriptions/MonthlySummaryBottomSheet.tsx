import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

type MonthlySummaryBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
};

export function MonthlySummaryBottomSheet({
  isOpen,
  onClose,
  className,
}: MonthlySummaryBottomSheetProps) {
  const services = [
    { name: 'Youtube premium', price: 119 },
    { name: 'VIU', price: 90 },
    { name: 'iQIYI VIP Standard', price: 90 },
  ];

  const totalPrice = services[0].price; // Only showing first service price as per image

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className={cn(
        'relative w-full bg-white rounded-t-[24px] shadow-2xl',
        'transform transition-transform duration-300 ease-out',
        'max-h-[85vh] overflow-hidden',
        className
      )}>
        {/* Handle and Collapse Icon */}
        <div className="flex flex-col items-center pt-4 pb-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-3" />
          <button
            onClick={onClose}
            className="p-2 -mt-1"
          >
            <ChevronDown className="w-7 h-7 text-red-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-8">
          {/* Header Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
              สรุปค่าบริการรายเดือน
            </h2>
            
            {/* Promotional Banner */}
            <div className="bg-gradient-to-r from-red-500 via-red-400 to-purple-500 rounded-xl p-5 mb-6 shadow-lg">
              <p className="text-white font-bold text-center text-base leading-relaxed">
                ส่วนลดสูงสุด 367 บาท เมื่อเลือกสูงสุด 4 แอป
              </p>
            </div>
          </div>

          {/* Services List Section */}
          <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">
              บริการของคุณ
            </h3>
            
            <div className="space-y-3 mb-4">
              {services.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full mr-4" />
                    <span className="text-gray-700 text-base">{service.name}</span>
                  </div>
                  <span className="text-gray-700 font-semibold text-base">
                    {service.price} บาท
                  </span>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              + เพิ่มบริการเพื่อรับส่วนลด (ไม่บังคับเลือก)
            </p>
          </div>

          {/* Total Cost Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-base">
                ค่าบริการ (ไม่รวมภาษีมูลค่าเพิ่ม)
              </span>
              <span className="text-3xl font-bold text-red-500">
                {totalPrice} บาท
              </span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full relative">
                <div className="absolute left-0 top-0 h-full w-3/4 bg-red-500 rounded-full" />
                <div className="absolute left-0 top-0 h-full w-3/4 flex justify-between items-center px-1">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-5 px-6 rounded-xl transition-colors text-lg shadow-lg">
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );
}
