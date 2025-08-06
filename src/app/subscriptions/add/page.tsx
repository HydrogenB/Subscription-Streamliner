

'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Tv, AlertCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
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
const MAX_SELECTION_LIMIT = 4;

const allServices = subscriptionServices;

export default function AddBundlePage() {
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(new Set());
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const handleServiceToggle = (serviceId: ServiceId) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      
      if (newSelection.has(serviceId)) {
        newSelection.delete(serviceId);
      } else {
        if (newSelection.size >= MAX_SELECTION_LIMIT) {
          alert(`You can select a maximum of ${MAX_SELECTION_LIMIT} services.`);
          return prev;
        }

        newSelection.add(serviceId);
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

  const { total, savings, packName, isValidBundle, fullPrice } = useMemo(() => {
    const matchedOffer = findBestOffer(selectedServices);

    if (matchedOffer) {
      return { 
        total: matchedOffer.sellingPrice, 
        savings: matchedOffer.fullPrice - matchedOffer.sellingPrice, 
        packName: matchedOffer.id, 
        isValidBundle: true,
        fullPrice: matchedOffer.fullPrice
      };
    }
    
    if (selectedServices.size > 0) {
        const currentFullPrice = Array.from(selectedServices).reduce((acc, id) => {
            const service = subscriptionServices.find(s => s.id === id);
            return acc + (service?.plans[0].price || 0);
        }, 0);
        return { total: currentFullPrice, savings: 0, packName: "Custom Bundle", isValidBundle: false, fullPrice: currentFullPrice };
    }

    return { total: 0, savings: 0, packName: "Choose your bundle", isValidBundle: false, fullPrice: 0 };
  }, [selectedServices]);

  const getPriceInfo = (serviceId: ServiceId): { text: string; originalPrice?: string; isIncremental: boolean } => {
    const service = subscriptionServices.find(s => s.id === serviceId);
    if (!service) return { text: '', isIncremental: false };
    
    const standalonePrice = service.plans[0].price;

    if (selectedServices.has(serviceId)) {
      return { text: '', isIncremental: false };
    }

    if (selectedServices.size === 0) {
      return { text: `${standalonePrice.toFixed(0)} THB`, isIncremental: false };
    }
    
    if (selectedServices.size >= MAX_SELECTION_LIMIT) {
        return { text: '', isIncremental: false };
    }

    const currentOffer = findBestOffer(selectedServices);
    
    const currentTotal = currentOffer ? currentOffer.sellingPrice : Array.from(selectedServices).reduce((acc, id) => {
      const service = subscriptionServices.find(s => s.id === id);
      return acc + (service?.plans[0].price || 0);
    }, 0);

    const potentialSelection = new Set(selectedServices);
    if (NETFLIX_PLANS.includes(serviceId)) {
        NETFLIX_PLANS.forEach(p => potentialSelection.delete(p));
    }
    potentialSelection.add(serviceId);
    
    const nextOffer = findBestOffer(potentialSelection);
    
    if (nextOffer) {
        const increment = nextOffer.sellingPrice - total;
        if (increment < 0) {
           return { text: `+${standalonePrice.toFixed(0)} THB`, isIncremental: true, originalPrice: `${standalonePrice.toFixed(0)} THB`};
        }
        const priceInfo: { text: string; originalPrice?: string; isIncremental: boolean } = {
            text: `+${Math.max(0, increment).toFixed(0)} THB`,
            isIncremental: true,
        };

        if (increment < standalonePrice) {
            priceInfo.originalPrice = `${standalonePrice.toFixed(0)} THB`;
        }
        return priceInfo;
    } else {
        if (!currentOffer) {
            return { text: `+${standalonePrice.toFixed(0)} THB`, isIncremental: true };
        }
        return { text: `${standalonePrice.toFixed(0)} THB`, isIncremental: false };
    }
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header showBackButton title="Add bundle" />
      <main className="flex-grow overflow-y-auto pb-48">
        <div className="p-4 space-y-4">
          
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
                priceInfo={getPriceInfo(service.id as ServiceId)}
                isConflicting={isNetflixConflict(service.id as ServiceId)}
                isDisabled={
                    !selectedServices.has(service.id as ServiceId) &&
                    selectedServices.size >= MAX_SELECTION_LIMIT
                }
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-10 max-w-md mx-auto">
        <div className={cn("bg-white rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out", isSummaryOpen && "pb-safe-bottom")}>
           <div 
              className={cn("px-4 cursor-pointer", !isSummaryOpen && 'py-4 border-t')}
              onClick={() => setIsSummaryOpen(prev => !prev)}
            >
              {!isSummaryOpen ? (
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                         <h3 className="font-bold text-lg">สรุปค่าบริการรายเดือน</h3>
                         <ChevronUp className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-red-600 font-bold text-xl">{total.toFixed(0)} บาท</span>
                        <Button 
                            size="lg" 
                            className="bg-red-600 hover:bg-red-700 rounded-full h-12 text-lg font-bold px-6" 
                            disabled={!isValidBundle || selectedServices.size === 0}
                            onClick={(e) => { e.stopPropagation(); /* Handle navigation */ }}
                        >
                            ถัดไป
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full pt-4" >
                    <h3 className="font-bold text-lg">สรุปค่าบริการรายเดือน</h3>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
          
          <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isSummaryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0")}>
             <div className="px-4 pb-4 space-y-4">
                <div className="p-3 mt-4 rounded-lg bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold text-center text-sm">
                    ส่วนลดสูงสุด {maxSavings.toFixed(0)} บาท เมื่อเลือกสูงสุด 4 แอป
                </div>

                {selectedServices.size > 0 ? (
                    <div className="space-y-4 pt-2">
                        <div>
                            <h4 className="font-bold text-gray-800 mb-2 text-base">บริการของคุณ</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                {Array.from(selectedServices).map(id => {
                                    const service = subscriptionServices.find(s => s.id === id);
                                    if (!service) return null;
                                    const individualPrice = service.plans[0].price;
                                    return (
                                        <li key={id} className="flex justify-between items-center">
                                            <span>• {serviceDisplayConfig[id as ServiceId].title}</span>
                                            <span>{individualPrice.toFixed(0)} บาท</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {isValidBundle && savings > 0 && (
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2 text-base">ส่วนลด</h4>
                                <ul className="space-y-1.5 text-sm">
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-700">• ส่วนลดสำหรับ {selectedServices.size} บริการ</span>
                                    <span className="font-medium text-green-600">-{savings.toFixed(0)} บาท</span>
                                </li>
                                </ul>
                            </div>
                        )}
                        
                        {!isValidBundle && selectedServices.size > 0 && selectedServices.size < 4 && (
                            <p className="text-xs text-muted-foreground italic text-center pt-2">
                                + เพิ่มบริการเพื่อรับส่วนลด (ไม่บังคับเลือก)
                            </p>
                        )}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-4">
                        Please select at least one service.
                    </p>
                )}

                <div className="flex justify-between items-end pt-4 border-t mt-2">
                    <span className="text-base font-medium text-gray-800">ค่าบริการ (ไม่รวมภาษีมูลค่าเพิ่ม)</span>
                    <span className="text-red-600 font-bold text-2xl">{total.toFixed(0)} บาท</span>
                </div>
            </div>

            <div className="px-4 pb-4 pt-2">
                {selectedServices.size > 0 && (
                    <div className="space-y-3">
                        {!isValidBundle && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-3 rounded-r-lg flex items-center gap-3 text-sm">
                                <AlertCircle className="w-5 h-5" />
                                <span>This combination is not available as a bundle. Please adjust your selection.</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map(step => (
                                <div key={step} className={cn("h-1.5 rounded-full flex-1", selectedServices.size >= step ? 'bg-red-500' : 'bg-gray-200')}></div>
                            ))}
                        </div>
                        <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 rounded-full h-12 text-lg font-bold" disabled={!isValidBundle || selectedServices.size === 0}>
                            ถัดไป
                        </Button>
                    </div>
                )}
            </div>
          </div>
        </div>
      </footer>
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
  isDisabled: boolean;
}

function ServiceCard({ service, Icon, title, isSelected, onToggle, priceInfo, isConflicting, isDisabled }: ServiceCardProps) {
  const finalIsDisabled = isDisabled && !isSelected;
  
  return (
    <div
      onClick={!finalIsDisabled ? onToggle : undefined}
      className={cn(
        'p-4 rounded-xl border-2 bg-white transition-all',
        isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200',
        finalIsDisabled ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
            <Checkbox 
              checked={isSelected}
              disabled={finalIsDisabled}
              className={cn(
                "w-5 h-5 mt-1", 
                isSelected && "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
                finalIsDisabled && "data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-500"
              )} 
            />
            <Icon 
              className={cn("w-10 h-10 object-contain", service.id.startsWith('netflix') && 'w-7 h-10')} 
              serviceId={service.id}
            />
            <div className="flex-grow">
              <span className={cn("font-bold", finalIsDisabled && "text-gray-500")}>{title}</span>
              <div className="min-h-[1.25rem] mt-1">
                {isConflicting && <p className="text-xs text-destructive">Only one Netflix plan allowed.</p>}
                {isDisabled && !isSelected && !isConflicting && <p className="text-xs text-destructive">Maximum of {MAX_SELECTION_LIMIT} services allowed.</p>}
              </div>
            </div>
        </div>

        <div className="text-right flex-shrink-0">
            {priceInfo.originalPrice && <p className="text-sm text-muted-foreground line-through">{priceInfo.originalPrice}</p>}
            <p className={cn("font-bold text-lg whitespace-nowrap", priceInfo.isIncremental && 'text-green-600')}>{priceInfo.text}</p>
        </div>
      </div>
       {isSelected && service.plans[0].features.length > 0 && (
        <div className="pl-8 mt-3 space-y-1 text-gray-600 text-sm">
            {service.plans[0].features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                    {feature.toLowerCase().includes('screen') || feature.toLowerCase().includes('480p') || feature.toLowerCase().includes('720p') || feature.toLowerCase().includes('1080p') || feature.toLowerCase().includes('4k') ? <Tv className="w-4 h-4"/> : <Globe className="w-4 h-4"/>}
                    <span>{feature}</span>
                </div>
            ))}
        </div>
      )}
    </div>
  )
}
