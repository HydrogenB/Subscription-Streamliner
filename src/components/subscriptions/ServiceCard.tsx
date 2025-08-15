import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type ServiceCardProps = {
  id: string;
  name: string;
  logo: string;
  logoBgColor: string;
  incrementalPrice: number;
  originalPrice: number;
  isAdded: boolean;
  onToggle: (serviceId: string) => void;
  className?: string;
};

export function ServiceCard({
  id,
  name,
  logo,
  logoBgColor,
  incrementalPrice,
  originalPrice,
  isAdded,
  onToggle,
  className,
}: ServiceCardProps) {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg border-2 p-4 transition-all duration-200 cursor-pointer',
        isAdded 
          ? 'border-red-500 shadow-md' 
          : 'border-gray-200 hover:border-red-300 hover:shadow-sm',
        className
      )}
      onClick={() => onToggle(id)}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Logo and Service Name */}
        <div className="flex items-center space-x-3">
          <div 
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
              logoBgColor
            )}
          >
            {logo}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
            
            {/* Show prices only when NOT added */}
            {!isAdded && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-red-500 font-bold text-lg">
                  +{incrementalPrice} THB
                </span>
                <span className="text-gray-400 line-through text-sm">
                  {originalPrice} THB
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Action Button */}
        <div className="flex items-center">
          {isAdded ? (
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Added</span>
            </button>
          ) : (
            <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
