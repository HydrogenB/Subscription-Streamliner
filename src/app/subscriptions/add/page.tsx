
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService, OfferGroup, ServiceId } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tv, Gift, ChevronUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import { WeTVIcon } from '@/components/icons/wetv-icon';
import { OneDIcon } from '@/components/icons/oned-icon';
import { TrueIDIcon } from '@/components/icons/trueid-icon';
import { Card } from '@/components/ui/card';

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
  
  let bestOffer: OfferGroup | null = null;

  // Check for exact match first
  const matchedOffers = offerGroups.filter(offer => {
    if (offer.services.length !== selectedArray.length) {
      return false;
    }
    const offerServicesSorted = [...offer.services].sort();
    return JSON.stringify(offerServicesSorted) === JSON.stringify(selectedArray);
  });

  if (matchedOffers.length > 0) {
     bestOffer = matchedOffers.reduce((best, current) =>
        current.sellingPrice < best.sellingPrice ? current : best
    );
  }
  
  // If no exact match, check for single service offers ("Pack0")
  if (!bestOffer && selectedIds.size === 1) {
    const singleServiceId = selectedArray[0];
    const singleOffer = offerGroups.find(o => 
        o.services.length === 1 && o.services[0] === singleServiceId
    );
    if (singleOffer) {
        return singleOffer;
    }
  }

  return bestOffer;
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
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(new Set([]));
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const router = useRouter();

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

        if (NETFLIX_PLANS.includes(serviceId)) {
          for (const plan of NETFLIX_PLANS) {
            newSelection.delete(plan);
          }
        }
        newSelection.add(serviceId);
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

  const isNetflixConflict = (serviceId: ServiceId): boolean => {
    if (!NETFLIX_PLANS.includes(serviceId)) {
      return false;
    }
    const selectedNetflixPlan = NETFLIX_PLANS.find(plan => selectedServices.has(plan));
    return !!selectedNetflixPlan && selectedNetflixPlan !== serviceId;
  }
  
  const handleNext = () => {
    if (selectedServices.size === 0) return;
    const serviceIds = Array.from(selectedServices).join(',');
    router.push(`/subscriptions/confirm?services=${serviceIds}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="Add bundle" />
      <main className="flex-grow overflow-y-auto pb-48">
        <div className="p-4 space-y-4">
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-center gap-3 text-sm text-blue-800 dark:text-blue-300">
            <Gift className="w-5 h-5 text-blue-500" />
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

      <footer className="fixed bottom-0 left-0 right-0 z-10 w-full max-w-md mx-auto">
        <div
          onClick={() => setIsSummaryOpen(prev => !prev)}
          className={cn("bg-white dark:bg-gray-800 rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out cursor-pointer", isSummaryOpen && "pb-safe-bottom")}
        >
          <div className="px-4 py-3 flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                   <h3 className="font-semibold text-base text-gray-800 dark:text-gray-200">
                    Your Monthly Bill
                   </h3>
                   <ChevronUp className={cn("w-5 h-5 text-gray-500 transition-transform", !isSummaryOpen && "rotate-180")} />
              </div>
              <div className="flex items-center gap-3">
                  {savings > 0 && (
                     <span className="text-sm font-semibold text-green-600">Save {savings.toFixed(0)} THB</span>
                  )}
                  <span className="font-bold text-lg text-primary">{selectedServices.size > 0 ? `${total.toFixed(0)} THB` : `0 THB`}</span>
              </div>
          </div>
          
          <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isSummaryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0")}>
             <div className="px-4 pb-4 space-y-4">
                
                {selectedServices.size > 0 ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-base">Your Services</h4>
                      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
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
                              <span className={cn(savings > 0 && "text-muted-foreground line-through")}>{individualPrice.toFixed(0)} THB</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                
                    {savings > 0 && (
                       <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-base">Discount</h4>
                        <ul className="space-y-1.5 text-sm">
                          <li className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-5 flex justify-center"></div>
                              <span className="text-gray-700 dark:text-gray-300">Bundle Discount for {selectedServices.size} services</span>
                            </div>
                            <span className="font-medium text-green-600">-{savings.toFixed(0)} THB</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Please select at least one service.
                  </div>
                )}
                
                {nextBestOffer && (
                    <Card 
                        className="mt-4 bg-yellow-50 dark:bg-yellow-900/40 border-yellow-400 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/60"
                        onClick={() => setSelectedServices(new Set(nextBestOffer.services as ServiceId[]))}
                    >
                        <div className="p-3">
                            <p className="font-bold text-sm text-yellow-900 dark:text-yellow-200 mb-1">Special Offer!</p>
                            <p className="text-xs text-yellow-800 dark:text-yellow-300">
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
                  <Card className="mt-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                    <div className="p-3 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <p className="text-sm text-destructive">No bundle available for this combination.</p>
                    </div>
                  </Card>
                )}


                <div className="flex justify-between items-end pt-4 border-t mt-2 dark:border-gray-700">
                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Total (excl. VAT)</span>
                    <span className="font-bold text-2xl text-primary">{selectedServices.size > 0 ? `${total.toFixed(0)} THB` : '0 THB'}</span>
                </div>
            </div>

            <div className="px-4 pb-4 pt-2">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4].map(step => (
                            <div key={step} className={cn("h-1.5 rounded-full flex-1", selectedServices.size >= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600')}></div>
                        ))}
                    </div>
                     <Button 
                        size="lg" 
                        className="w-full bg-primary hover:bg-primary/90 rounded-full h-12 text-lg font-bold text-white" 
                        disabled={selectedServices.size === 0}
                        onClick={handleNext}
                     >
                        {selectedServices.size > 0 ? "Next" : "Choose your bundle"}
                    </Button>
                </div>
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
  isConflicting: boolean;
  isDisabled: boolean;
}

function ServiceCard({ service, Icon, title, isSelected, onToggle, isConflicting, isDisabled }: ServiceCardProps) {
  const finalIsDisabled = isDisabled && !isSelected;
  
  return (
    <div
      onClick={!finalIsDisabled ? onToggle : undefined}
      className={cn(
        'p-4 rounded-xl border-2 bg-white dark:bg-gray-800 transition-all',
        isSelected ? 'border-primary' : 'border-gray-200 dark:border-gray-700',
        finalIsDisabled ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
    >
      <div className="flex items-center gap-4">
        <Icon 
          className={cn("w-10 h-10 object-contain shrink-0", service.id.startsWith('netflix') && 'w-7 h-10')} 
          serviceId={service.id}
        />
        <div className="flex-grow min-w-0">
          <p className={cn("font-bold text-base text-gray-800 dark:text-gray-200", finalIsDisabled && "text-gray-500")}>{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{service.plans[0].features.join(', ')}</p>
        </div>
      </div>
      {(isConflicting || (isDisabled && !isSelected)) && (
         <div className="mt-2 pl-14">
            {isConflicting && <p className="text-xs text-destructive font-semibold">Only one Netflix plan can be selected.</p>}
            {isDisabled && !isSelected && !isConflicting && <p className="text-xs text-destructive font-semibold">Maximum of {MAX_SELECTION_LIMIT} services allowed.</p>}
        </div>
      )}
    </div>
  )
}

    