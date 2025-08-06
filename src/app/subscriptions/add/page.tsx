'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Tv, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GiftIcon } from '@/components/icons/gift-icon';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import { WeTVIcon } from '@/components/icons/wetv-icon';
import { OneDIcon } from '@/components/icons/oned-icon';
import { TrueIDIcon } from '@/components/icons/trueid-icon';
import { Progress } from '@/components/ui/progress';


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

function findBestOffer(selectedIds: Set<ServiceId>) {
    if (selectedIds.size === 0) {
      return null;
    }
    const selectedArray = Array.from(selectedIds).sort();

    const matchedOffers = offerGroups.filter(offer => {
      if (offer.services.length !== selectedArray.length) {
        return false;
      }
      const offerServicesSorted = [...offer.services].sort();
      return JSON.stringify(offerServicesSorted) === JSON.stringify(selectedArray);
    });

    if (matchedOffers.length > 0) {
        return matchedOffers.reduce((best, current) => 
            current.sellingPrice < best.sellingPrice ? current : best
        , matchedOffers[0]);
    }
    return null;
}

const NETFLIX_PLANS: ServiceId[] = ['netflix-mobile', 'netflix-basic', 'netflix-standard', 'netflix-premium'];

export default function AddBundlePage() {
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(new Set());
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);

  const handleServiceToggle = (serviceId: ServiceId) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      
      if (newSelection.has(serviceId)) {
        newSelection.delete(serviceId);
      } else {
        newSelection.add(serviceId);
        // If the added service is a Netflix plan, remove other Netflix plans
        if (NETFLIX_PLANS.includes(serviceId)) {
          for (const plan of NETFLIX_PLANS) {
            if (plan !== serviceId) {
              newSelection.delete(plan);
            }
          }
        }
      }
      return newSelection;
    });
  };

  const { total, savings, packName, isValidBundle } = useMemo(() => {
    const matchedOffer = findBestOffer(selectedServices);

    if (matchedOffer) {
      const savings = matchedOffer.fullPrice - matchedOffer.sellingPrice;
      return { total: matchedOffer.sellingPrice, savings, packName: matchedOffer.id, isValidBundle: true };
    }
    
    // For single selections that have a standalone offer
    if (selectedServices.size === 1) {
      const singleServiceId = Array.from(selectedServices)[0];
      const service = subscriptionServices.find(s => s.id === singleServiceId);
       const singleOffer = offerGroups.find(o => o.services.length === 1 && o.services[0] === singleServiceId);
      if (service && singleOffer) {
         return { total: singleOffer.sellingPrice, savings: 0, packName: singleOffer.id, isValidBundle: true };
      }
    }
    
    // If no valid bundle, but items are selected
    if (selectedServices.size > 0) {
        return { total: 0, savings: 0, packName: "Invalid Bundle Combination", isValidBundle: false };
    }

    return { total: 0, savings: 0, packName: "Choose your bundle", isValidBundle: false };
  }, [selectedServices]);

  const allServices = subscriptionServices;

  const getPriceInfo = (serviceId: ServiceId): { text: string; originalPrice?: string; isIncremental: boolean } => {
    const service = subscriptionServices.find(s => s.id === serviceId);
    if (!service) return { text: '', isIncremental: false };
  
    if (selectedServices.has(serviceId)) {
      return { text: '', isIncremental: false };
    }
  
    if (selectedServices.size === 0) {
      const singleOffer = offerGroups.find(o => o.services.length === 1 && o.services[0] === serviceId);
      return { text: `${singleOffer?.sellingPrice || service.plans[0].price} THB`, isIncremental: false };
    }
  
    if (!isValidBundle) {
      return { text: '', isIncremental: false };
    }
  
    const potentialSelection = new Set(selectedServices);
    potentialSelection.add(serviceId);
  
    // Conflict handling for Netflix
    const selectedNetflix = NETFLIX_PLANS.find(p => selectedServices.has(p));
    if (selectedNetflix && NETFLIX_PLANS.includes(serviceId) && selectedNetflix !== serviceId) {
      potentialSelection.delete(selectedNetflix);
    }
  
    const nextOffer = findBestOffer(potentialSelection);
  
    if (nextOffer) {
      const increment = nextOffer.sellingPrice - total;
      const standaloneOffer = offerGroups.find(o => o.services.length === 1 && o.services[0] === serviceId);
      const standalonePrice = standaloneOffer?.sellingPrice || service.plans[0].price;
      
      const priceInfo: { text: string; originalPrice?: string; isIncremental: boolean } = {
        text: `+${increment.toFixed(0)} THB`,
        isIncremental: true,
      };

      if (increment < standalonePrice) {
        priceInfo.originalPrice = `${standalonePrice.toFixed(0)} THB`;
      }
      
      return priceInfo;
    }
  
    return { text: '', isIncremental: false };
  };

  const isNetflixConflict = (serviceId: ServiceId): boolean => {
    if (!NETFLIX_PLANS.includes(serviceId)) {
      return false;
    }
    const selectedNetflixPlan = NETFLIX_PLANS.find(plan => selectedServices.has(plan));
    return !!selectedNetflixPlan && selectedNetflixPlan !== serviceId;
  }
  
  const maxSavings = Math.max(...offerGroups.filter(o => o.services.length === 4).map(o => o.fullPrice - o.sellingPrice));

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header showBackButton title="Add bundle" />
      <div className="p-4 space-y-4 flex-grow overflow-y-auto pb-48">
        <h2 className="text-xl font-bold">{packName}</h2>
        { !isValidBundle && selectedServices.size > 0 ? (
          <div className="bg-destructive/10 border-l-4 border-destructive text-destructive p-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>This combination is not available as a bundle. Please adjust your selection.</span>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg flex items-center gap-3 text-sm text-gray-700">
            <GiftIcon className="w-5 h-5 text-indigo-500" />
            <span>Select your favorite services to see bundle deals!</span>
          </div>
        )}

        <div className="space-y-3">
          {allServices.map(service => (
            <ServiceCard 
              key={service.id}
              service={service}
              Icon={serviceDisplayConfig[service.id as ServiceId].Icon}
              title={serviceDisplayConfig[service.id as ServiceId].title}
              isSelected={selectedServices.has(service.id as ServiceId)}
              onToggle={() => handleServiceToggle(service.id as ServiceId)}
              priceInfo={getPriceInfo(service.id as ServiceId)}
              isConflicting={isNetflixConflict(service.id as ServiceId)}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-10">
        <div className="relative">
          <button 
            onClick={() => setIsSummaryOpen(!isSummaryOpen)}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border"
          >
            {isSummaryOpen ? <ChevronDown className="w-5 h-5 text-red-500" /> : <ChevronUp className="w-5 h-5 text-red-500" />}
          </button>
        </div>
        <div className={cn("bg-white rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)] p-4 transition-all duration-300 ease-in-out", isSummaryOpen ? "translate-y-0" : "translate-y-[calc(100%-80px)]")}>
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-lg">สรุปค่าบริการรายเดือน</h3>
          </div>
          <div className={cn("space-y-4 transition-all duration-300 ease-in-out", isSummaryOpen ? "max-h-screen opacity-100 mt-2" : "max-h-0 opacity-0")}>
            {isValidBundle && savings > 0 && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold">
                ส่วนลดสูงสุด {savings.toFixed(0)} บาท เมื่อเลือกสูงสุด {selectedServices.size} แอป
              </div>
            )}
             {(!isValidBundle || savings <= 0) && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold">
                ส่วนลดสูงสุด {maxSavings.toFixed(0)} บาท เมื่อเลือกสูงสุด 4 แอป
              </div>
            )}
            <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ค่าบริการ (ไม่รวมภาษีมูลค่าเพิ่ม)</span>
                <span className="text-red-600 font-bold text-xl">{isValidBundle ? total.toFixed(0) : '0'} บาท</span>
            </div>
            
            <div className="flex items-center gap-2">
                {[1,2,3,4].map(step => (
                    <div key={step} className={cn("h-1.5 rounded-full", selectedServices.size >= step ? 'bg-red-500 flex-1' : 'bg-gray-200 flex-1')}></div>
                ))}
            </div>

            <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 rounded-full" disabled={!isValidBundle || selectedServices.size === 0}>
                ถัดไป
            </Button>
          </div>
        </div>
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
  priceInfo: { text: string; originalPrice?: string; isIncremental: boolean };
  isConflicting: boolean;
}

function ServiceCard({ service, Icon, title, isSelected, onToggle, priceInfo, isConflicting }: ServiceCardProps) {
  const isDisabled = isConflicting;
  
  return (
    <div
      onClick={!isDisabled ? onToggle : undefined}
      className={cn(
        'p-4 rounded-xl border-2 bg-white transition-all',
        isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200',
        isDisabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox 
          checked={isSelected}
          disabled={isDisabled}
          className={cn(
            "w-5 h-5 mt-1", 
            isSelected && "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
            isDisabled && "data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-500"
          )} 
        />
        <Icon className={cn("w-8 h-8", service.id.startsWith('netflix') && 'w-6 h-10', service.id === 'youtube' && 'w-10 h-8')} />
        <div className="flex-grow">
          <span className={cn("font-bold", isDisabled && "text-gray-500")}>{title}</span>
           {isConflicting && <p className="text-xs text-destructive mt-1">Only one Netflix plan allowed.</p>}
          {isSelected && service.plans[0].features.length > 0 && (
            <div className="mt-3 space-y-1 text-gray-600 text-sm">
                {service.plans[0].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {feature.toLowerCase().includes('screen') || feature.toLowerCase().includes('480p') || feature.toLowerCase().includes('720p') || feature.toLowerCase().includes('1080p') || feature.toLowerCase().includes('4k') ? <Tv className="w-4 h-4"/> : <Globe className="w-4 h-4"/>}
                        <span>{feature}</span>
                    </div>
                ))}
            </div>
          )}
        </div>
        <div className="text-right">
            {priceInfo.originalPrice && <p className="text-sm text-muted-foreground line-through">{priceInfo.originalPrice}</p>}
            <p className={cn("font-bold text-lg whitespace-nowrap", priceInfo.isIncremental && 'text-green-600')}>{priceInfo.text}</p>
        </div>
      </div>
    </div>
  )
}
