'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Tv, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GiftIcon } from '@/components/icons/gift-icon';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import { WeTVIcon } from '@/components/icons/wetv-icon';
import { OneDIcon } from '@/components/icons/oned-icon';
import { TrueIDIcon } from '@/components/icons/trueid-icon';

type ServiceId = 
  | 'youtube' 
  | 'viu' 
  | 'netflix-mobile' 
  | 'iqiyi'
  | 'wetv'
  | 'oned'
  | 'trueplus'
  | 'trueidshort'
  | 'netflix-basic'
  | 'netflix-standard'
  | 'netflix-premium';


const serviceDisplayConfig: Record<ServiceId, { Icon: React.ElementType; title: string }> = {
  youtube: { Icon: YouTubeIcon, title: 'Youtube Premium' },
  viu: { Icon: ViuIcon, title: 'VIU' },
  'netflix-mobile': { Icon: NetflixIcon, title: 'Netflix Mobile' },
  iqiyi: { Icon: IQIYIIcon, title: 'iQIYI VIP Standard' },
  wetv: { Icon: WeTVIcon, title: 'WeTV' },
  oned: { Icon: OneDIcon, title: 'oneD' },
  trueplus: { Icon: TrueIDIcon, title: 'True Plus' },
  trueidshort: { Icon: TrueIDIcon, title: 'True ID Short' },
  'netflix-basic': { Icon: NetflixIcon, title: 'Netflix Basic' },
  'netflix-standard': { Icon: NetflixIcon, title: 'Netflix Standard' },
  'netflix-premium': { Icon: NetflixIcon, title: 'Netflix Premium' },
};

export default function AddBundlePage() {
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(new Set());

  const handleServiceToggle = (serviceId: ServiceId) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(serviceId)) {
        newSelection.delete(serviceId);
      } else {
        newSelection.add(serviceId);
      }
      return newSelection;
    });
  };

  const { total, savings, packName } = useMemo(() => {
    if (selectedServices.size === 0) {
      return { total: 0, savings: 0, packName: "Choose your bundle" };
    }
    
    const selectedArray = Array.from(selectedServices).sort();

    const matchedOffer = offerGroups.find(offer => {
      if (offer.services.length !== selectedArray.length) {
        return false;
      }
      const offerServicesSorted = [...offer.services].sort();
      return JSON.stringify(offerServicesSorted) === JSON.stringify(selectedArray);
    });

    if (matchedOffer) {
      const savings = matchedOffer.fullPrice - matchedOffer.sellingPrice;
      return { total: matchedOffer.sellingPrice, savings, packName: matchedOffer.packName };
    }

    const individualTotal = Array.from(selectedServices).reduce((acc, s) => {
      const service = subscriptionServices.find(sub => sub.id === s);
      return acc + (service?.plans[0]?.price || 0);
    }, 0);
    
    return { total: individualTotal, savings: 0, packName: "Custom Bundle" };
  }, [selectedServices]);

  const allServices = subscriptionServices;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header showBackButton title="Add bundle" />
      <div className="p-4 space-y-4 flex-grow overflow-y-auto">
        <h2 className="text-xl font-bold">{packName}</h2>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg flex items-center gap-3 text-sm text-gray-700">
          <GiftIcon className="w-5 h-5 text-indigo-500" />
          <span>Select your favorite services to see bundle deals!</span>
        </div>

        <div className="space-y-3">
          {allServices.map(service => (
            <ServiceCard 
              key={service.id}
              service={service}
              Icon={serviceDisplayConfig[service.id as ServiceId].Icon}
              title={serviceDisplayConfig[service.id as ServiceId].title}
              isSelected={selectedServices.has(service.id as ServiceId)}
              onToggle={() => handleServiceToggle(service.id as ServiceId)}
              price={service.plans[0].price}
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
        <Button size="lg" className="w-full" disabled={selectedServices.size === 0}>
          Confirm bundle
        </Button>
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
}

function ServiceCard({ service, Icon, title, isSelected, onToggle, price }: ServiceCardProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        'p-4 rounded-xl border-2 bg-white transition-all cursor-pointer',
        isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox checked={isSelected} className={cn("w-5 h-5 mt-1", isSelected && "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500")} />
        <Icon className={cn("w-8 h-8", service.id.startsWith('netflix') && 'w-6 h-10', service.id === 'youtube' && 'w-10 h-8')} />
        <div className="flex-grow">
          <span className="font-bold">{title}</span>
          {isSelected && service.plans[0].features.length > 0 && (
            <div className="mt-3 space-y-1 text-gray-600 text-sm">
                {service.plans[0].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {feature.toLowerCase().includes('screen') ? <Tv className="w-4 h-4"/> : <Globe className="w-4 h-4"/>}
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
          )}
        </div>
        <div className="text-right">
            <p className="font-bold text-lg">{price} THB</p>
        </div>
      </div>
    </div>
  )
}
