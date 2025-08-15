'use client';

import PromoBundleCard from './PromoBundleCard';
import type { Promo } from '@/hooks/usePromoBundles';

export interface PromoBundleCarouselProps {
  promos: Promo[];
  isLoading: boolean;
  selectedBundleId: string | null;
  onSelectBundle: (bundle: Promo | null) => void;
}

const MIN_PROMOS_TO_SHOW = 3;

export default function PromoBundleCarousel({ 
  promos, 
  isLoading, 
  selectedBundleId, 
  onSelectBundle 
}: PromoBundleCarouselProps) {

  if (isLoading) {
    return <PromoBundleCarousel.Skeleton />;
  }

  if (promos.length < MIN_PROMOS_TO_SHOW) {
    return null; // Don't show the carousel if there are not enough promos
  }

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto py-2 space-x-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
        {promos.map((promo) => (
          <PromoBundleCard
            key={promo.id}
            promo={promo}
            selected={promo.id === selectedBundleId}
            onSelect={() => {
              if (promo.id === selectedBundleId) {
                onSelectBundle(null); // Deselect if tapping the same card
              } else {
                onSelectBundle(promo);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

PromoBundleCarousel.Skeleton = function Skeleton() {
  return (
    <div className="w-full">
      <div className="flex overflow-x-auto py-2 space-x-4 scroll-smooth snap-x snap-mandatory scrollbar-hide">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-60 h-44 shrink-0 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
