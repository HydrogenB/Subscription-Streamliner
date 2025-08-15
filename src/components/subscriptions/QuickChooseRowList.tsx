'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import ServiceRowCard from './ServiceRowCard';
import PromoBundleCarousel from './PromoBundleCarousel';
import type { SubscriptionService, ServiceId } from '@/lib/types';
import type { Promo } from '@/hooks/usePromoBundles';
import { useRowState } from '@/hooks/useRowState';
import { cn } from '@/lib/utils';

// --- Constants ---
const VIRTUALIZE_THRESHOLD = 12;
const ROW_HEIGHT = 88; // p-3 (12*2=24) + icon h-10 (40) + padding = ~88px
const SCROLL_INDICATOR_HEIGHT = '4rem';

// --- Props Interface ---
export interface QuickChooseRowListProps {
  allServices: SubscriptionService[];
  selectedServices: Set<ServiceId>;
  handleServiceToggle: (serviceId: ServiceId) => void;
  getPriceInfo: (serviceId: ServiceId) => { text: string; originalPrice?: string; type: 'bundle' | 'promo' | 'default' | 'none' };
  
  // Promo Carousel Props
  promos: Promo[];
  isPromoLoading: boolean;
  selectedBundleId: string | null;
  onSelectBundle: (bundle: Promo | null) => void;
}

// --- Main Component ---
export default function QuickChooseRowList({ 
  allServices, 
  selectedServices, 
  handleServiceToggle, 
  getPriceInfo,
  promos,
  isPromoLoading,
  selectedBundleId,
  onSelectBundle
}: QuickChooseRowListProps) {
  const listContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const [listHeight, setListHeight] = useState(500); // Default height

  // --- Effects ---
  // Respect reduced motion
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Scroll to selected bundle's first service
  useEffect(() => {
    if (selectedBundleId) {
      const selectedPromo = promos.find(p => p.id === selectedBundleId);
      if (selectedPromo && selectedPromo.services.length > 0) {
        const firstServiceId = selectedPromo.services[0];
        const serviceIndex = allServices.findIndex(s => s.id === firstServiceId);
        
        if (serviceIndex !== -1) {
          if (allServices.length > VIRTUALIZE_THRESHOLD) {
            listRef.current?.scrollToItem(serviceIndex, 'center');
          } else {
            const element = document.getElementById(`service-row-${firstServiceId}`);
            element?.scrollIntoView({ 
              behavior: prefersReducedMotion ? 'auto' : 'smooth', 
              block: 'center' 
            });
          }
        }
      }
    }
  }, [selectedBundleId, promos, allServices, prefersReducedMotion]);

  // Adjust list height for virtualization
  useEffect(() => {
    const updateHeight = () => {
      if (listContainerRef.current) {
        const availableHeight = window.innerHeight - listContainerRef.current.offsetTop - 200; // 200 is an estimate for footer/header
        setListHeight(Math.max(300, availableHeight));
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // --- Renderers ---
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const service = allServices[index];
    const { isNetflixConflict, isDisabled } = useRowState(service.id as ServiceId, selectedServices);

    return (
      <div style={style} id={`service-row-${service.id}`} className="px-1 py-1">
        <ServiceRowCard
          service={service}
          isSelected={selectedServices.has(service.id as ServiceId)}
          onToggle={() => handleServiceToggle(service.id as ServiceId)}
          priceInfo={getPriceInfo(service.id as ServiceId)}
          isConflicting={isNetflixConflict}
          isDisabled={isDisabled}
        />
      </div>
    );
  };

  const SkeletonRow = () => (
    <div className="flex items-center p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
      <div className="w-10 h-10 mr-4 rounded-md bg-gray-200 dark:bg-gray-700"></div>
      <div className="flex-grow space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="w-6 h-6 ml-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
    </div>
  );

  return (
    <div ref={listContainerRef} className="relative">
      <PromoBundleCarousel 
        promos={promos}
        isLoading={isPromoLoading}
        selectedBundleId={selectedBundleId}
        onSelectBundle={onSelectBundle}
      />
      
      {/* Sticky Header */}
      <h2 className="sticky top-0 z-10 text-lg font-semibold text-gray-900 dark:text-gray-100 px-1 py-3 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
        Or build your own bundle
      </h2>

      {/* Service List with Scroll Indicator */}
      <div 
        className="relative"
        style={{ 
          maskImage: `linear-gradient(to bottom, black calc(100% - ${SCROLL_INDICATOR_HEIGHT}), transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, black calc(100% - ${SCROLL_INDICATOR_HEIGHT}), transparent 100%)`
        }}
      >
        {isPromoLoading ? (
          <div className="space-y-2 pt-2">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : allServices.length > VIRTUALIZE_THRESHOLD ? (
          <List
            ref={listRef}
            height={listHeight}
            itemCount={allServices.length}
            itemSize={ROW_HEIGHT}
            width="100%"
          >
            {Row}
          </List>
        ) : (
          <div className="space-y-2 pt-2">
            {allServices.map((service) => {
              const { isNetflixConflict, isDisabled } = useRowState(service.id as ServiceId, selectedServices);
              return (
                <div id={`service-row-${service.id}`} key={service.id}>
                  <ServiceRowCard
                    service={service}
                    isSelected={selectedServices.has(service.id as ServiceId)}
                    onToggle={() => handleServiceToggle(service.id as ServiceId)}
                    priceInfo={getPriceInfo(service.id as ServiceId)}
                    isConflicting={isNetflixConflict}
                    isDisabled={isDisabled}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
