'use client';

import { Sparkles } from 'lucide-react';
import { usePromoCopy } from '@/hooks/usePromoCopy';
import type { Promo } from '@/hooks/usePromoBundles';
import { cn } from '@/lib/utils';
import { serviceDisplayConfig } from '@/lib/config'; // Assuming config is moved here

export interface PromoBundleCardProps {
  promo: Promo;
  selected: boolean;
  onSelect: () => void;
}

export default function PromoBundleCard({ promo, selected, onSelect }: PromoBundleCardProps) {
  const { copy, loading } = usePromoCopy(promo.id);

  // Get the first 3 service icons for display
  const serviceIcons = promo.services
    .slice(0, 3)
    .map(serviceId => serviceDisplayConfig[serviceId]?.Icon)
    .filter(Boolean);

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-60 h-44 shrink-0 rounded-2xl border-2 shadow-md p-4 flex flex-col justify-between scroll-snap-center transition-all',
        'bg-white dark:bg-gray-800',
        selected 
          ? 'border-primary transform scale-105 shadow-lg'
          : 'border-transparent hover:border-primary/50'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-gray-100">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{promo.name}</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
            {promo.services.map(id => serviceDisplayConfig[id]?.title || id).join(' + ')}
          </div>
        </div>
        <div className="flex -space-x-2 rtl:space-x-reverse">
            {serviceIcons.map((Icon, index) => (
                <Icon key={index} className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800" />
            ))}
        </div>
      </div>

      <div className="text-left text-xs italic text-gray-500 dark:text-gray-400 min-h-[28px]">
        {loading ? (
          <div className="space-y-1.5 animate-pulse">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-3/4"></div>
          </div>
        ) : (
          `"${copy}"`
        )}
      </div>

      <div className="mt-auto flex items-baseline gap-2">
        <span className="text-green-600 text-sm font-semibold">Save {promo.savings.toFixed(0)} THB</span>
        <span className="ml-auto text-primary font-bold text-lg">{promo.sellingPrice.toFixed(0)} THB</span>
      </div>
    </button>
  );
}
