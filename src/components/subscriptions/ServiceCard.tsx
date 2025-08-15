import { cn } from '@/lib/utils';
import type { ServiceId } from '@/lib/types';
import { Check } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { createElement } from 'react';

type ServiceCardProps = {
  id: ServiceId;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  isSelected: boolean;
  onSelect: (id: ServiceId) => void;
  logo: ComponentType<SVGProps<SVGSVGElement>> | string;
};

export function ServiceCard({
  id,
  name,
  description,
  price,
  originalPrice,
  isSelected,
  onSelect,
  logo,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        'flex items-center p-4 rounded-lg border bg-white dark:bg-gray-800 transition-colors',
        isSelected
          ? 'border-red-500 ring-2 ring-red-500/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
      )}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 mr-3">
        {typeof logo === 'string' ? (
          <img src={logo} alt={name} className="w-6 h-6" />
        ) : (
          <div className="w-6 h-6">
            {createElement(logo, { className: 'w-full h-full' })}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{description}</p>
      </div>
      
      <div className="flex flex-col items-end ml-4">
        <div className="flex items-center">
          {isSelected && (
            <Check className="h-5 w-5 text-red-500 mr-2" />
          )}
          <span className={cn(
            'font-medium',
            isSelected ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'
          )}>
            {price > 0 ? `+${price} THB` : 'Included'}
          </span>
        </div>
        {originalPrice && originalPrice > price && (
          <span className="text-xs text-gray-400 line-through">{originalPrice} THB</span>
        )}
      </div>
    </div>
  );
}
