
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService, OfferGroup, ServiceId } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronUp, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import { WeTVIcon } from '@/components/icons/wetv-icon';
import { OneDIcon } from '@/components/icons/oned-icon';
import { TrueIDIcon } from '@/components/icons/trueid-icon';
import { Card } from '@/components/ui/card';
import { OfferCard } from '@/components/subscriptions/offer-card';

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
  
    for (const offer of offerGroups) {
      const offerServicesSorted = [...offer.services].sort();
      
      const isMatch = selectedArray.every(id => offerServicesSorted.includes(id));

      if (isMatch && offerServicesSorted.length === selectedArray.length) {
         if (!bestOffer || offer.sellingPrice < bestOffer.sellingPrice) {
            bestOffer = offer;
          }
      }
    }

    if(bestOffer) return bestOffer;

    // find best offer for subsets
    for (const offer of offerGroups) {
        const offerServicesSorted = [...offer.services].sort();
        
        const isMatch = offerServicesSorted.every(id => selectedArray.includes(id));
  
        if (isMatch) {
           if (!bestOffer || offer.sellingPrice < bestOffer.sellingPrice) {
              bestOffer = offer;
            }
        }
      }

    return bestOffer;
}

const NETFLIX_PLANS: ServiceId[] = ['netflix-mobile', 'netflix-basic', 'netflix-standard', 'netflix-premium'];
const MAX_SELECTION_LIMIT = 4;

const allServices = subscriptionServices;
const heroBundle = offerGroups.find(o => o.id === 'offerGroup12');

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

    if (matchedOffer && matchedOffer.services.length === selectedServices.size) {
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
  
  const handleNext = () => {
    if (selectedServices.size === 0) return;
    const serviceIds = Array.from(selectedServices).join(',');
    router.push(`/subscriptions/confirm?services=${serviceIds}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="Add bundle" />
      <main className="flex-grow overflow-y-auto pb-48">
        <div className="p-4 space-y-6">
          
          {heroBundle && (
            <div>
              <h2 className="text-xl font-bold text-center">Hero Bundle</h2>
              <p className="text-muted-foreground text-center mb-4">Our most popular bundle with great savings.</p>
              <OfferCard 
                offer={heroBundle} 
                allServices={allServices} 
                onSelect={() => setSelectedServices(new Set(heroBundle.services as ServiceId[]))} 
              />
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold text-center mb-4">Or build your own bundle</h2>
            <div className="space-y-3">
              {allServices.map(service => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  Icon={serviceDisplayConfig[service.id as ServiceId].Icon}
                  title={serviceDisplayConfig[service.id as ServiceId].title}
                  isSelected={selectedServices.has(service.id as ServiceId)}
                  onToggle={() => handleServiceToggle(service.id as ServiceId)}
                  selectedServices={selectedServices}
                />
              ))}
            </div>
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
                              <span className="text-gray-700 dark:text-gray-300">Bundle Discount</span>
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
                
                {!isValidBundle && selectedServices.size > 0 && (
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
  selectedServices: Set<ServiceId>;
}

function ServiceCard({ service, Icon, title, isSelected, onToggle, selectedServices }: ServiceCardProps) {
    const isNetflixConflict = NETFLIX_PLANS.includes(service.id as ServiceId) && 
        NETFLIX_PLANS.some(plan => selectedServices.has(plan) && plan !== service.id);

    const isDisabled = (!isSelected && selectedServices.size >= MAX_SELECTION_LIMIT) || isNetflixConflict;

    const getPriceInfo = useMemo(() => {
        // Find standalone promotional price (Pack0)
        const standaloneOffer = offerGroups.find(o => o.services.length === 1 && o.services[0] === service.id);
        const standalonePrice = standaloneOffer ? standaloneOffer.sellingPrice : service.plans[0].price;

        if (isSelected) {
            return (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                </div>
            );
        }
        
        // Calculate incremental cost
        const currentTotal = (() => {
            const matchedOffer = findBestOffer(selectedServices);
            if (matchedOffer) {
                return matchedOffer.sellingPrice;
            }
            return Array.from(selectedServices).reduce((acc, id) => {
                const s = subscriptionServices.find(s => s.id === id);
                const offer = offerGroups.find(o => o.services.length === 1 && o.services[0] === id);
                return acc + (offer ? offer.sellingPrice : (s?.plans[0].price || 0));
            }, 0);
        })();

        const potentialSelection = new Set(selectedServices);
        if (NETFLIX_PLANS.includes(service.id as ServiceId)) {
            NETFLIX_PLANS.forEach(plan => potentialSelection.delete(plan));
        }
        potentialSelection.add(service.id as ServiceId);
        
        const bestOfferForPotential = findBestOffer(potentialSelection);
        
        const newTotal = (() => {
            if (bestOfferForPotential && bestOfferForPotential.services.length === potentialSelection.size) {
                return bestOfferForPotential.sellingPrice;
            }
            return Array.from(potentialSelection).reduce((acc, id) => {
                const s = subscriptionServices.find(s => s.id === id);
                const offer = offerGroups.find(o => o.services.length === 1 && o.services[0] === id);
                return acc + (offer ? offer.sellingPrice : (s?.plans[0].price || 0));
            }, 0);
        })();

        const incrementalCost = newTotal - currentTotal;

        return (
            <div className="text-right">
                <p className="font-bold text-primary text-lg">+{incrementalCost.toFixed(0)} THB</p>
                <p className="text-xs text-muted-foreground line-through">{service.plans[0].price.toFixed(0)} THB</p>
            </div>
        );
    }, [service.id, service.plans, selectedServices, isSelected]);
  
  return (
    <div
      onClick={!isDisabled ? onToggle : undefined}
      className={cn(
        'p-3 rounded-xl border-2 bg-white dark:bg-gray-800 transition-all flex items-center gap-4 relative',
        isSelected ? 'border-primary shadow-lg' : 'border-gray-200 dark:border-gray-700',
        isDisabled ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
    >
        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0", isSelected ? "bg-primary border-primary" : "border-gray-300 dark:border-gray-600")}>
            {isSelected && <Check className="w-4 h-4 text-white" />}
        </div>

        <Icon 
          serviceId={service.id}
          className={cn("w-10 h-10 object-contain shrink-0", service.id.startsWith('netflix') && 'w-7 h-10')} 
        />
        <div className="flex-grow min-w-0">
          <p className={cn("font-bold text-base text-gray-800 dark:text-gray-200")}>{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{service.plans[0].features.join(' • ')}</p>
        </div>
        <div className="ml-auto text-right">
            {getPriceInfo}
        </div>
        {isNetflixConflict && <p className="text-xs text-destructive font-semibold absolute bottom-1 right-3">Only one Netflix plan allowed.</p>}
    </div>
  )
}

    