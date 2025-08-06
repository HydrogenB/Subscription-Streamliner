'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService, OfferGroup } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Tv, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GiftIcon } from '@/components/icons/gift-icon';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';

type ServiceId = 'youtube' | 'viu' | 'netflix-mobile' | 'iqiyi';

const serviceDisplayConfig: Record<ServiceId, { Icon: React.ElementType; title: string }> = {
  youtube: { Icon: YouTubeIcon, title: 'Youtube premium' },
  viu: { Icon: ViuIcon, title: 'VIU' },
  'netflix-mobile': { Icon: NetflixIcon, title: 'Netflix Mobile' },
  iqiyi: { Icon: IQIYIIcon, title: 'iQIYI VIP Standard' },
};

export default function AddBundlePage() {
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(new Set(['youtube']));

  const handleServiceToggle = (serviceId: ServiceId) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(serviceId)) {
        if (newSelection.size > 1) { // Prevent unselecting the last item
            newSelection.delete(serviceId);
        }
      } else {
        newSelection.add(serviceId);
      }
      return newSelection;
    });
  };

  const { bestOffer, total, savings } = useMemo(() => {
    let bestOffer: OfferGroup | null = null;
    let maxMatched = 0;

    for (const offer of offerGroups) {
      const offerServices = new Set(offer.services);
      const matchedServices = new Set([...selectedServices].filter(s => offerServices.has(s)));
      
      if (matchedServices.size === selectedServices.size && offerServices.size >= selectedServices.size) {
        if (!bestOffer || offer.sellingPrice < bestOffer.sellingPrice) {
          bestOffer = offer;
          maxMatched = matchedServices.size;
        }
      }
    }
    
    // Fallback to find any matching offer if no perfect one is found
    if (!bestOffer) {
        for (const offer of offerGroups) {
            const offerServices = new Set(offer.services);
            const matchedServices = new Set([...selectedServices].filter(s => offerServices.has(s)));
            if (matchedServices.size > maxMatched) {
                bestOffer = offer;
                maxMatched = matchedServices.size;
            }
        }
    }

    const individualTotal = Array.from(selectedServices).reduce((acc, s) => {
      const service = subscriptionServices.find(sub => sub.id === s);
      return acc + (service?.plans[0]?.price || 0);
    }, 0);

    const total = bestOffer ? bestOffer.sellingPrice : individualTotal;
    const savings = bestOffer ? individualTotal - total : 0;
    
    return { bestOffer, total, savings };
  }, [selectedServices]);

  const youtubeService = subscriptionServices.find(s => s.id === 'youtube')!;
  const otherServices = (['viu', 'netflix-mobile', 'iqiyi'] as ServiceId[]).map(id => 
    subscriptionServices.find(s => s.id === id)!
  );

  const getPriceInfo = (serviceId: ServiceId) => {
    if (serviceId === 'youtube') return { price: 179, originalPrice: null };
    
    const baseYoutubePrice = 179;
    const fourAppsOffer = offerGroups.find(o => o.id === 'offerGroup78'); // Viu, WeTV, Netflix Mobile, YouTube Premium (proxy for 4 apps)
    
    if (fourAppsOffer && selectedServices.size >=2) {
      const pricePerAddon = (339 - baseYoutubePrice) / 3;
      return { price: Math.round(pricePerAddon), originalPrice: 119 };
    }
    
    return { price: 90, originalPrice: 119 };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header showBackButton title="Add bundle" />
      <div className="p-4 space-y-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-bold">Choose your bundle</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg flex items-center gap-3 text-sm text-gray-700">
          <GiftIcon className="w-5 h-5 text-indigo-500" />
          <span>Save up to 367 THB when you select all 4 apps</span>
        </div>

        <div className="space-y-3">
          {/* YouTube Premium */}
          <ServiceCard 
            service={youtubeService}
            Icon={serviceDisplayConfig.youtube.Icon}
            title={serviceDisplayConfig.youtube.title}
            isSelected={selectedServices.has('youtube')}
            onToggle={() => handleServiceToggle('youtube')}
            price={getPriceInfo('youtube').price}
          />

          {/* Other Services */}
          {otherServices.map(service => (
            <ServiceCard 
              key={service.id}
              service={service}
              Icon={serviceDisplayConfig[service.id as ServiceId].Icon}
              title={serviceDisplayConfig[service.id as ServiceId].title}
              isSelected={selectedServices.has(service.id as ServiceId)}
              onToggle={() => handleServiceToggle(service.id as ServiceId)}
              price={getPriceInfo(service.id as ServiceId).price}
              originalPrice={getPriceInfo(service.id as ServiceId).originalPrice}
            />
          ))}
        </div>
      </div>
      <div className="p-4 border-t bg-white sticky bottom-0">
        <div className="flex justify-between items-center mb-2">
            <span className="text-muted-foreground">Total price</span>
            <div>
                {savings > 0 && <span className="text-sm text-muted-foreground line-through mr-2">THB {(total + savings).toFixed(2)}</span>}
                <span className="font-bold text-xl">THB {total.toFixed(2)}</span>
            </div>
        </div>
        <Button size="lg" className="w-full">Confirm bundle</Button>
      </div>
    </div>
  );
}

interface ServiceCardProps {
  service: SubscriptionService;
  Icon: React.ElementType;
  title: string;
  isSelected: boolean;
  onToggle: () => void;
  price: number;
  originalPrice?: number | null;
}

function ServiceCard({ service, Icon, title, isSelected, onToggle, price, originalPrice }: ServiceCardProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        'p-4 rounded-xl border-2 bg-white transition-all cursor-pointer',
        isSelected ? 'border-red-500 bg-red-50' : 'border-transparent'
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox checked={isSelected} className="w-5 h-5" />
        <Icon className="w-8 h-8" />
        <span className="font-bold flex-grow">{title}</span>
        <div className="text-right">
            <p className="font-bold text-red-600">{isSelected && !originalPrice ? '' : '+'}{price} THB</p>
            {originalPrice && <p className="text-sm text-muted-foreground line-through">{originalPrice} THB</p>}
        </div>
      </div>
      {isSelected && service.id === 'youtube' && (
        <div className="mt-3 pl-8 space-y-1 text-gray-600">
            <div className="flex items-center gap-2">
                <Globe className="w-4 h-4"/> <span>480 GB (SD resolution)</span>
            </div>
            <div className="flex items-center gap-2">
                <Tv className="w-4 h-4"/> <span>1 screen mobile/tablet only</span>
            </div>
             <div className="flex items-center gap-2">
                <Download className="w-4 h-4"/> <span>1 download device</span>
            </div>
        </div>
      )}
    </div>
  )
}
