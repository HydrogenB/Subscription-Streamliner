
'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService, OfferGroup } from '@/lib/types';
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
import { Card } from '@/components/ui/card';

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

function findBestOffer(selectedIds: Set<ServiceId>): OfferGroup | null {
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
    // If it's a single service and it's a Pack0 promo, return that.
    if (selectedArray.length === 1 && matchedOffers.some(o => o.packName === 'Pack0')) {
        return matchedOffers.find(o => o.packName === 'Pack0')!;
    }
    // Otherwise, return the best offer that is NOT a Pack0 (which are standalone promos)
    const nonPack0Offers = matchedOffers.filter(o => o.packName !== 'Pack0');
    if (nonPack0Offers.length > 0) {
        return nonPack0Offers.reduce((best, current) =>
            current.sellingPrice < best.sellingPrice ? current : best
        );
    }
    // Fallback to any matched offer if only Pack0 was found for a multi-selection (should not happen with current data)
    return matchedOffers.reduce((best, current) =>
        current.sellingPrice < best.sellingPrice ? current : best
    );
  }
  
  return null;
}

function findNextBestOffer(selectedIds: Set<ServiceId>): OfferGroup | null {
    if (selectedIds.size === 0 || selectedIds.size >= MAX_SELECTION_LIMIT) {
        return null;
    }

    const potentialOffers = offerGroups.filter(offer => {
        if (offer.services.length <= selectedIds.size) return false;
        const selectedIdArray = Array.from(selectedIds);
        return selectedIdArray.every(id => offer.services.includes(id));
    });

    if (potentialOffers.length > 0) {
        return potentialOffers.reduce((best, current) => {
            const bestSavings = best.fullPrice - best.sellingPrice;
            const currentSavings = current.fullPrice - current.sellingPrice;
            return currentSavings > bestSavings ? current : best;
        });
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

  const nextBestOffer = useMemo(() => {
    if (isValidBundle) return null;
    return findNextBestOffer(selectedServices);
  }, [selectedServices, isValidBundle]);


  const getPriceInfo = (serviceId: ServiceId): { text: string; originalPrice?: string; type: 'bundle' | 'promo' | 'default' | 'none' } => {
    const service = subscriptionServices.find(s => s.id === serviceId);
    if (!service) return { text: '', type: 'none' };
  
    if (selectedServices.has(serviceId)) {
      return { text: '', type: 'none' };
    }
  
    if (selectedServices.size >= MAX_SELECTION_LIMIT) {
      return { text: '', type: 'none' };
    }
  
    const standalonePrice = service.plans[0].price;
  
    // If nothing is selected, show standalone promos or default prices.
    if (selectedServices.size === 0) {
      const singleOffer = findBestOffer(new Set([serviceId]));
      if (singleOffer && singleOffer.sellingPrice < standalonePrice) {
        return {
          text: `${singleOffer.sellingPrice.toFixed(0)} THB`,
          originalPrice: `${standalonePrice.toFixed(0)} THB`,
          type: 'promo',
        };
      }
      return {
        text: `${standalonePrice.toFixed(0)} THB`,
        type: 'default',
      };
    }
  
    // If items are selected, always show the incremental price.
    const potentialSelection = new Set(selectedServices);
    if (NETFLIX_PLANS.includes(serviceId)) {
      NETFLIX_PLANS.forEach(p => potentialSelection.delete(p));
    }
    potentialSelection.add(serviceId);
  
    const nextOffer = findBestOffer(potentialSelection);
  
    if (nextOffer) {
      const increment = nextOffer.sellingPrice - total;
      return {
        text: `+${increment.toFixed(0)} THB`,
        type: 'bundle',
      };
    }
    
    // Fallback: if adding the service doesn't create a bundle, add its standalone price.
    const increment = standalonePrice;
     return {
        text: `+${increment.toFixed(0)} THB`,
        type: 'default',
      };
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
        <div
          onClick={() => setIsSummaryOpen(prev => !prev)}
          className={cn("bg-white rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out cursor-pointer", isSummaryOpen && "pb-safe-bottom")}
        >
          {/* Always visible footer summary */}
          <div className="px-4 py-3 flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                   <h3 className="font-semibold text-base text-gray-800">
                     {selectedServices.size > 0 ? 'Your Monthly Bill' : 'Choose your bundle'}
                   </h3>
              </div>
              <div className="flex items-center gap-3">
                  {selectedServices.size > 0 ? (
                    <span className="text-red-600 font-bold text-lg">{total.toFixed(0)} บาท</span>
                  ) : <span className="text-lg font-semibold text-gray-400">ยังไม่ได้เลือกบริการ</span>}

                  {!isSummaryOpen && (
                    <Button 
                        size="lg" 
                        className="bg-red-600 hover:bg-red-700 rounded-full h-10 text-base font-bold px-5" 
                        disabled={selectedServices.size === 0}
                        onClick={(e) => { e.stopPropagation(); /* Handle navigation */ }}
                    >
                        ถัดไป
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  )}
                  {isSummaryOpen && (
                     <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
              </div>
          </div>
          
          {/* Collapsible detailed summary */}
          <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isSummaryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0")}>
             <div className="px-4 pb-4 space-y-4">
                
                {selectedServices.size > 0 && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2 text-base">Your Services</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        {Array.from(selectedServices).map(id => {
                          const service = subscriptionServices.find(s => s.id === id);
                          if (!service) return null;
                          const individualPrice = service.plans[0].price;
                          return (
                            <li key={id} className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="w-5 flex justify-center">•</div>
                                <span>{serviceDisplayConfig[id as ServiceId].title}</span>
                              </div>
                              <span className={cn(savings > 0 && "text-muted-foreground line-through")}>{individualPrice.toFixed(0)} บาท</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                
                    {savings > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-2 text-base">ส่วนลด</h4>
                        <ul className="space-y-1.5 text-sm">
                          <li className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-5 flex justify-center"></div>
                              <span className="text-gray-700">ส่วนลดสำหรับ {selectedServices.size} บริการ</span>
                            </div>
                            <span className="font-medium text-green-600">-{savings.toFixed(0)} บาท</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {nextBestOffer && (
                    <Card 
                        className="mt-4 bg-yellow-50 border-yellow-400 cursor-pointer hover:bg-yellow-100"
                        onClick={() => setSelectedServices(new Set(nextBestOffer.services as ServiceId[]))}
                    >
                        <div className="p-3">
                            <p className="font-bold text-sm text-yellow-900 mb-1">ข้อเสนอสุดพิเศษ!</p>
                            <p className="text-xs text-yellow-800">
                                Add {nextBestOffer.services.length - selectedServices.size} more service(s) for just <span className="font-bold">{nextBestOffer.sellingPrice - total} THB</span> to get a discount!
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                {nextBestOffer.services.filter(s => !selectedServices.has(s as ServiceId)).map(s_id => {
                                    const s = serviceDisplayConfig[s_id as ServiceId];
                                    return <s.Icon key={s_id} className="w-5 h-5" />;
                                })}
                            </div>
                        </div>
                    </Card>
                )}

                {!isValidBundle && selectedServices.size > 0 && !nextBestOffer && (
                  <Card className="mt-4 bg-red-50 border-red-200">
                    <div className="p-3 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-800">No bundle available for this combination.</p>
                    </div>
                  </Card>
                )}


                <div className="flex justify-between items-end pt-4 border-t mt-2">
                    <span className="text-base font-semibold text-gray-800">Total (excl. VAT)</span>
                    <span className="text-red-600 font-bold text-2xl">{total.toFixed(0)} บาท</span>
                </div>
            </div>

            <div className="px-4 pb-4 pt-2">
                {selectedServices.size > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map(step => (
                                <div key={step} className={cn("h-1.5 rounded-full flex-1", selectedServices.size >= step ? 'bg-red-500' : 'bg-gray-200')}></div>
                            ))}
                        </div>
                         <Button 
                            size="lg" 
                            className="w-full bg-red-600 hover:bg-red-700 rounded-full h-12 text-lg font-bold" 
                            disabled={selectedServices.size === 0 || (!isValidBundle && selectedServices.size > 1)}
                         >
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
  priceInfo: { text: string; originalPrice?: string; type: 'bundle' | 'promo' | 'default' | 'none' };
  isConflicting: boolean;
  isDisabled: boolean;
}

function ServiceCard({ service, Icon, title, isSelected, onToggle, priceInfo, isConflicting, isDisabled }: ServiceCardProps) {
  const finalIsDisabled = isDisabled && !isSelected;
  
  return (
    <div
      onClick={!finalIsDisabled && !isConflicting ? onToggle : undefined}
      className={cn(
        'p-4 rounded-xl border-2 bg-white transition-all',
        isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200',
        finalIsDisabled || isConflicting ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
            <Checkbox 
              checked={isSelected}
              disabled={finalIsDisabled || isConflicting}
              className={cn(
                "w-5 h-5 mt-1", 
                isSelected && "data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500",
                (finalIsDisabled || isConflicting) && "data-[state=checked]:bg-gray-400 data-[state=checked]:border-gray-500"
              )} 
            />
            <Icon 
              className={cn("w-10 h-10 object-contain", service.id.startsWith('netflix') && 'w-7 h-10')} 
              serviceId={service.id}
            />
            <div className="flex-grow">
              <span className={cn("font-bold", (finalIsDisabled || isConflicting) && "text-gray-500")}>{title}</span>
              <div className="min-h-[1.25rem] mt-1 pr-2">
                 {isConflicting && <p className="text-xs text-destructive font-semibold">Only one Netflix plan allowed.</p>}
                 {isDisabled && !isSelected && !isConflicting && <p className="text-xs text-destructive font-semibold">Maximum of {MAX_SELECTION_LIMIT} services allowed.</p>}
              </div>
            </div>
        </div>

        <div className="text-right flex-shrink-0">
            {priceInfo.originalPrice && priceInfo.type === 'promo' && (
              <p className="text-sm text-muted-foreground line-through">{priceInfo.originalPrice}</p>
            )}
            <p className={cn(
              "font-bold text-lg whitespace-nowrap",
              priceInfo.type === 'promo' && 'text-red-600',
              (priceInfo.type === 'bundle' || (priceInfo.type === 'default' && priceInfo.text.startsWith('+'))) && 'text-green-600'
            )}>
              {priceInfo.text}
            </p>
             {priceInfo.type === 'bundle' && priceInfo.originalPrice && (
              <p className="text-xs text-muted-foreground">{priceInfo.originalPrice}</p>
            )}
        </div>
      </div>
       {(isSelected || service.plans[0].features.length > 0) && (
        <div className="pl-12 mt-3 space-y-1 text-gray-600 text-sm">
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

    
