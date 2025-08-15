'use client';

import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import type { SubscriptionService, ServiceId } from '@/lib/types';
import { serviceDisplayConfig } from '@/lib/config';
import { AlertTriangle } from 'lucide-react';

export interface ServiceRowCardProps {
  service: SubscriptionService;
  isSelected: boolean;
  isDisabled: boolean;
  isConflicting: boolean;
  priceInfo: { text: string; originalPrice?: string; type: 'bundle' | 'promo' | 'default' | 'none' };
  onToggle: () => void;
}

export default function ServiceRowCard({ 
  service, 
  isSelected, 
  isDisabled, 
  isConflicting,
  priceInfo, 
  onToggle 
}: ServiceRowCardProps) {
  const { Icon, title } = serviceDisplayConfig[service.id as ServiceId] || {};

  if (!Icon) return null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (!isDisabled) {
        onToggle();
      }
    }
  };

  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      aria-labelledby={`service-title-${service.id}`}
      tabIndex={isDisabled ? -1 : 0}
      onClick={!isDisabled ? onToggle : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex items-center p-3 rounded-lg border-2 transition-all duration-200 ease-in-out',
        'bg-white dark:bg-gray-800',
        {
          'border-primary bg-primary/5 dark:bg-primary/10': isSelected,
          'border-gray-200 dark:border-gray-700': !isSelected,
          'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50': isDisabled && !isSelected,
          'cursor-pointer hover:border-primary/50': !isDisabled,
          'border-destructive/50': isConflicting
        }
      )}
    >
      {isConflicting && (
        <div className="absolute -top-2 -right-2 hidden group-hover:block z-10">
          <div className="relative flex items-center gap-2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Only one Netflix plan allowed
          </div>
        </div>
      )}
      <Icon className="w-10 h-10 mr-4" />
      <div className="flex-grow">
        <p id={`service-title-${service.id}`} className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{service.plans[0].features.join(', ')}</p>
      </div>
      <div className="flex items-center ml-4">
        <div className="text-right mr-4">
          {priceInfo.type !== 'none' && (
            <>
              <p className={cn(
                'font-bold text-sm',
                { 'text-green-600': priceInfo.type === 'bundle' },
                { 'text-blue-600': priceInfo.type === 'promo' },
                { 'text-gray-700 dark:text-gray-300': priceInfo.type === 'default' }
              )}>{priceInfo.text}</p>
              {priceInfo.originalPrice && <p className="text-xs line-through text-gray-400 dark:text-gray-500">{priceInfo.originalPrice}</p>}
            </>
          )}
        </div>
        <Checkbox checked={isSelected} onCheckedChange={onToggle} disabled={isDisabled} className="h-6 w-6" tabIndex={-1} />
      </div>
    </div>
  );
}
