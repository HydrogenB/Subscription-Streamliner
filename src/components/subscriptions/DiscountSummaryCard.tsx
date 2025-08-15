import { cn } from '@/lib/utils';
import { ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';

type Service = {
  id: string;
  name: string;
  price: number;
  isSelected: boolean;
};

type DiscountSummaryCardProps = {
  services: Service[];
  maxServicesForDiscount: number;
  maxDiscountAmount: number;
  className?: string;
  isExpandable?: boolean;
  onServiceToggle?: (serviceId: string) => void;
};

export function DiscountSummaryCard({
  services,
  maxServicesForDiscount = 4,
  maxDiscountAmount = 497,
  className,
  isExpandable = true,
  onServiceToggle,
}: DiscountSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Intelligent calculations
  const summary = useMemo(() => {
    const selectedServices = services.filter(service => service.isSelected);
    const totalOriginalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
    
    // Calculate discount based on number of selected services
    let discountPercentage = 0;
    if (selectedServices.length >= 2) discountPercentage = 0.1; // 10% for 2+ services
    if (selectedServices.length >= 3) discountPercentage = 0.15; // 15% for 3+ services
    if (selectedServices.length >= maxServicesForDiscount) discountPercentage = 0.25; // 25% for max services
    
    const calculatedDiscount = Math.min(
      Math.round(totalOriginalPrice * discountPercentage),
      maxDiscountAmount
    );
    
    const finalPrice = totalOriginalPrice - calculatedDiscount;
    const hasDiscount = calculatedDiscount > 0;
    
    return {
      selectedServices,
      totalOriginalPrice,
      calculatedDiscount,
      finalPrice,
      hasDiscount,
      discountPercentage: discountPercentage * 100,
      servicesCount: selectedServices.length,
      canGetMoreDiscount: selectedServices.length < maxServicesForDiscount,
      nextDiscountThreshold: selectedServices.length < maxServicesForDiscount ? 
        (selectedServices.length + 1) : null,
    };
  }, [services, maxServicesForDiscount, maxDiscountAmount]);

  // Dynamic text based on discount status
  const getDiscountText = () => {
    if (summary.hasDiscount) {
      return `ส่วนลดสูงสุด ${maxDiscountAmount} บาท เมื่อเลือกสูงสุด ${maxServicesForDiscount}`;
    }
    return `เลือก ${maxServicesForDiscount} แอปเพื่อรับส่วนลดสูงสุด ${maxDiscountAmount} บาท`;
  };

  const getDiscountSubtext = () => {
    if (summary.servicesCount === 0) {
      return 'เลือกบริการเพื่อเริ่มต้น';
    }
    if (summary.servicesCount === 1) {
      return 'เลือกอีก 1 แอปเพื่อรับส่วนลด 10%';
    }
    if (summary.servicesCount === 2) {
      return 'เลือกอีก 1 แอปเพื่อรับส่วนลด 15%';
    }
    if (summary.servicesCount === 3) {
      return 'เลือกอีก 1 แอปเพื่อรับส่วนลด 25%';
    }
    return 'คุณได้รับส่วนลดสูงสุดแล้ว!';
  };

  const getCongratulatoryMessage = () => {
    if (summary.hasDiscount && summary.calculatedDiscount >= maxDiscountAmount * 0.8) {
      return `ยินดีด้วย! คุณได้รับส่วนลดสูงสุด ${summary.calculatedDiscount} บาท!`;
    }
    if (summary.hasDiscount) {
      return `ยินดีด้วย! คุณได้รับส่วนลด ${summary.calculatedDiscount} บาท!`;
    }
    return null;
  };

  const getProgressPercentage = () => {
    return Math.min((summary.servicesCount / maxServicesForDiscount) * 100, 100);
  };

  const getProgressColor = () => {
    if (summary.servicesCount >= maxServicesForDiscount) return 'bg-green-500';
    if (summary.servicesCount >= 3) return 'bg-blue-500';
    if (summary.servicesCount >= 2) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-lg overflow-hidden',
      className
    )}>
      {/* Header Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 leading-tight">
              สรุปค่าบริการราย
              <br />
              เดือน
            </h2>
          </div>
          
          {/* Discount Information */}
          <div className="text-right ml-4">
            {summary.hasDiscount ? (
              <>
                <div className="text-green-600 font-semibold text-sm leading-tight">
                  ส่วนลดสูงสุด {maxDiscountAmount} บาท เมื่อเลือกสูงสุด {maxServicesForDiscount}
                  <br />
                  แอป
                </div>
                <div className="text-red-500 font-bold text-2xl mt-1">
                  {summary.finalPrice}
                </div>
                <div className="text-red-500 font-semibold text-sm">
                  บาท
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">
                เลือกบริการเพื่อดูส่วนลด
              </div>
            )}
          </div>

          {/* Expandable Chevron */}
          {isExpandable && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronUp 
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isExpanded ? 'rotate-0' : 'rotate-180'
                )} 
              />
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>ความคืบหน้า</span>
            <span>{summary.servicesCount}/{maxServicesForDiscount} แอป</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={cn('h-full transition-all duration-500 ease-out', getProgressColor())}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Discount Subtext */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {getDiscountSubtext()}
          </p>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          {/* Selected Services */}
          {summary.selectedServices.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">บริการที่เลือก</h3>
              <div className="space-y-2">
                {summary.selectedServices.map((service) => (
                  <div key={service.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                      <span className="text-gray-700">{service.name}</span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {service.price} บาท
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">ราคารวม:</span>
              <span className="text-gray-800">{summary.totalOriginalPrice} บาท</span>
            </div>
            {summary.hasDiscount && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">ส่วนลด ({summary.discountPercentage}%):</span>
                <span className="text-green-600">-{summary.calculatedDiscount} บาท</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
              <span className="text-gray-800">ราคาสุทธิ:</span>
              <span className="text-red-500 text-lg">{summary.finalPrice} บาท</span>
            </div>
          </div>

          {/* Service Selection (if interactive) */}
          {onServiceToggle && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">เลือกบริการเพิ่มเติม</h3>
              <div className="space-y-2">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={service.isSelected}
                      onChange={() => onServiceToggle(service.id)}
                      className="mr-3 text-red-500 focus:ring-red-500"
                    />
                    <span className="text-gray-700">{service.name}</span>
                    <span className="ml-auto text-gray-600">{service.price} บาท</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Congratulatory Banner */}
      {getCongratulatoryMessage() && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-center">
          <p className="text-white font-bold text-lg">
            {getCongratulatoryMessage()}
          </p>
        </div>
      )}
    </div>
  );
}
