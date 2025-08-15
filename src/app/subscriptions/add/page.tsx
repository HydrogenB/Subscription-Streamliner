
'use client';

import { useState, useMemo, useRef } from 'react';
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
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

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

function getParentServiceName(serviceId: ServiceId): string {
    const service = subscriptionServices.find(s => s.id === serviceId);
    if (!service) return serviceId;
    // Extracts the base name, e.g., "Netflix" from "Netflix Mobile"
    return service.name.split(' ')[0];
}

const serviceGroups: Record<string, ServiceId[]> = subscriptionServices.reduce((acc, service) => {
    const parentName = getParentServiceName(service.id as ServiceId);
    if (!acc[parentName]) {
        acc[parentName] = [];
    }
    acc[parentName].push(service.id as ServiceId);
    return acc;
}, {} as Record<string, ServiceId[]>);


function findBestOffer(selectedIds: Set<ServiceId>): OfferGroup | null {
    if (selectedIds.size === 0) {
      return null;
    }
  
    const selectedArray = Array.from(selectedIds).sort();
    let bestOffer: OfferGroup | null = null;
    let bestMatchLength = 0;
  
    for (const offer of offerGroups) {
      const offerServicesSorted = [...offer.services].sort();
      const isExactMatch = offerServicesSorted.length === selectedArray.length && 
          offerServicesSorted.every((id, index) => id === selectedArray[index]);

      if (isExactMatch) {
        // Prioritize exact matches
        if (!bestOffer || offer.sellingPrice < bestOffer.sellingPrice) {
          bestOffer = offer;
          bestMatchLength = offerServicesSorted.length;
        }
      } else if (selectedArray.every(id => offerServicesSorted.includes(id))) {
        // This is a superset offer, consider if it's better
        if (!bestOffer || offer.sellingPrice < bestOffer.sellingPrice) {
           bestOffer = offer;
           bestMatchLength = offerServicesSorted.length;
        }
      }
    }

    // Now check for subset offers if no exact or superset match is best
    if (!bestOffer || bestMatchLength < selectedArray.length) {
      for (const offer of offerGroups) {
        const offerServicesSorted = [...offer.services].sort();
        if (offerServicesSorted.every(id => selectedArray.includes(id as ServiceId))) {
           if (!bestOffer || offer.sellingPrice < bestOffer.sellingPrice || offer.services.length > bestMatchLength) {
              bestOffer = offer;
              bestMatchLength = offer.services.length;
            }
        }
      }
    }

    return bestOffer;
}

const MAX_SELECTION_LIMIT = 4;

const allServices = subscriptionServices;
const heroBundles = [
  offerGroups.find(o => o.id === 'offerGroup12'), // Viu + WeTV
  offerGroups.find(o => o.id === 'offerGroup33'), // Viu + WeTV + Netflix Mobile
  offerGroups.find(o => o.id === 'offerGroup63'), // Viu + WeTV + Netflix Mobile + YouTube
].filter(Boolean) as OfferGroup[];


export default function AddBundlePage() {
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(new Set([]));
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const router = useRouter();

  const handleServiceToggle = (serviceId: ServiceId) => {
    setSelectedServices(prev => {
        const newSelection = new Set(prev);
        const parentName = getParentServiceName(serviceId);
        const serviceGroup = serviceGroups[parentName];
        const isSelected = newSelection.has(serviceId);
        const isGroupMemberSelected = serviceGroup.some(id => newSelection.has(id));

        if (isSelected) {
            newSelection.delete(serviceId);
        } else {
            // Count selected parent services
            const selectedParentServices = new Set(
                Array.from(newSelection).map(id => getParentServiceName(id))
            );

            if (!isGroupMemberSelected && selectedParentServices.size >= MAX_SELECTION_LIMIT) {
                alert(`You can select a maximum of ${MAX_SELECTION_LIMIT} services.`);
                return prev;
            }
            
            // If another plan from the same service is selected, swap it
            if (serviceGroup) {
                for (const plan of serviceGroup) {
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

  // Promotion Offer Badge suggestion (docs §3.1)
  const promotionSuggestion = useMemo(() => {
    if (selectedServices.size === 0) return null;
    if (selectedServices.size >= MAX_SELECTION_LIMIT) return null;

    // Show only when current selection is NOT an exact bundle
    const matchedOffer = findBestOffer(selectedServices);
    if (matchedOffer && matchedOffer.services.length === selectedServices.size) return null;

    const currentSelection = Array.from(selectedServices) as ServiceId[];
    const remainingSlots = MAX_SELECTION_LIMIT - currentSelection.length;

    const candidates = offerGroups
      .filter(o => currentSelection.every(id => o.services.includes(id as string)))
      .map(o => ({ offer: o, addCount: o.services.length - currentSelection.length }))
      .filter(x => x.addCount > 0 && x.addCount <= remainingSlots);

    if (candidates.length === 0) return null;

    const best = candidates.reduce((acc, cur) => cur.offer.sellingPrice < acc.offer.sellingPrice ? cur : acc);

    const currentTotal = currentSelection.reduce((sum, id) => {
      const svc = subscriptionServices.find(s => s.id === id);
      return sum + (svc?.plans[0].price || 0);
    }, 0);

    const delta = best.offer.sellingPrice - currentTotal;
    const needCount = best.addCount;

    const message = delta > 0
      ? `Add ${needCount} more service(s) for just ${delta.toFixed(0)} THB more to unlock savings.`
      : `Complete your bundle for only ${best.offer.sellingPrice.toFixed(0)} THB/month — save ${(currentTotal - best.offer.sellingPrice).toFixed(0)} THB.`;

    const missing = best.offer.services.filter(id => !currentSelection.includes(id as ServiceId)) as ServiceId[];

    return { offer: best.offer, needCount, delta, message, missing } as const;
  }, [selectedServices]);

  // CMO-driven suggestion: also suggest removing or swapping plans to unlock a bundle
  const cmoSuggestion = useMemo(() => {
    if (selectedServices.size === 0) return null;

    // Helper: calculate current full total with standard prices (no bundle applied)
    const currentFullPrice = Array.from(selectedServices).reduce((acc, id) => {
      const svc = subscriptionServices.find(s => s.id === id);
      return acc + (svc?.plans[0].price || 0);
    }, 0);

    type Suggestion = {
      kind: 'add' | 'remove' | 'swap' | 'replace';
      message: string;
      cta: string;
      suggestedSelection: Set<ServiceId>;
      icons?: ServiceId[];
      newTotal: number;
      savings: number;
      badge?: string;
    };

    const suggestions: Suggestion[] = [];

    // 1) Swap within same parent service to unlock an exact bundle
    const currentArray = Array.from(selectedServices) as ServiceId[];
    const parentToSelected: Record<string, ServiceId> = {};
    currentArray.forEach(id => {
      parentToSelected[getParentServiceName(id)] = id;
    });

    Object.entries(parentToSelected).forEach(([parent, selectedId]) => {
      const group = serviceGroups[parent] || [];
      group.forEach(candidateId => {
        if (candidateId === selectedId) return;
        const swapped = new Set(currentArray);
        swapped.delete(selectedId);
        swapped.add(candidateId);
        const offer = findBestOffer(swapped as Set<ServiceId>);
        if (offer && offer.services.length === swapped.size) {
          const newTotal = offer.sellingPrice;
          const savings = currentFullPrice - newTotal;
          const fromTitle = serviceDisplayConfig[selectedId].title;
          const toTitle = serviceDisplayConfig[candidateId as ServiceId].title;
          const deltaUp = newTotal - currentFullPrice;
          const message = savings > 0
            ? `Switch ${parent} plan: ${fromTitle.split(' ').slice(1).join(' ')} → ${toTitle.split(' ').slice(1).join(' ')} to pay only ${newTotal.toFixed(0)} THB/month — save ${savings.toFixed(0)} THB.`
            : `Upgrade ${parent} plan: ${fromTitle.split(' ').slice(1).join(' ')} → ${toTitle.split(' ').slice(1).join(' ')} to unlock a bundle for ${newTotal.toFixed(0)} THB/month (+${deltaUp.toFixed(0)} THB).`;
          suggestions.push({
            kind: 'swap',
            message,
            cta: `Switch plan`,
            suggestedSelection: swapped as Set<ServiceId>,
            icons: Array.from(swapped) as ServiceId[],
            newTotal,
            savings,
            badge: savings > 0 ? 'Best value' : (deltaUp <= 50 ? 'Small upgrade' : 'Unlock savings'),
          });
        }
      });
    });

    // 2) Replace exactly one service to match a same-size bundle
    const sameSizeOffers = offerGroups.filter(o => o.services.length === currentArray.length);
    sameSizeOffers.forEach(o => {
      const overlap = (o.services as string[]).filter(id => currentArray.includes(id as ServiceId)).length;
      if (overlap === currentArray.length - 1) {
        const addId = (o.services as ServiceId[]).find(id => !currentArray.includes(id));
        const removeId = currentArray.find(id => !(o.services as string[]).includes(id));
        if (!addId || !removeId) return;
        const suggestedSelection = new Set(o.services as ServiceId[]);
        const newTotal = o.sellingPrice;
        const savings = currentFullPrice - newTotal;
        const removeTitle = serviceDisplayConfig[removeId].title;
        const addTitle = serviceDisplayConfig[addId].title;
        suggestions.push({
          kind: 'replace',
          message: `Replace ${removeTitle} with ${addTitle} to pay only ${newTotal.toFixed(0)} THB/month — save ${Math.max(0, savings).toFixed(0)} THB.`,
          cta: 'Replace service',
          suggestedSelection,
          icons: Array.from(suggestedSelection),
          newTotal,
          savings,
          badge: 'High impact',
        });
      }
    });

    // 3) Remove services to match the best subset bundle
    const subsetCandidates = offerGroups
      .filter(o => (o.services as string[]).every(id => currentArray.includes(id as ServiceId)) && o.services.length < currentArray.length);
    subsetCandidates.forEach(o => {
      const newTotal = o.sellingPrice;
      const savings = currentFullPrice - newTotal;
      if (savings > 0) {
        const keep = new Set(o.services as ServiceId[]);
        const extras = currentArray.filter(id => !keep.has(id));
        suggestions.push({
          kind: 'remove',
          message: `Remove ${extras.length} item(s) to pay only ${newTotal.toFixed(0)} THB/month — save ${savings.toFixed(0)} THB.`,
          cta: `Apply best price`,
          suggestedSelection: keep,
          icons: Array.from(keep),
          newTotal,
          savings,
        });
      }
    });

    // 4) Prefer upsell via add (if available and within limit) – reuse promotionSuggestion
    if (promotionSuggestion) {
      const newTotal = promotionSuggestion.offer.sellingPrice;
      const savings = currentFullPrice - newTotal;
      suggestions.push({
        kind: 'add',
        message: promotionSuggestion.message,
        cta: 'Complete bundle',
        suggestedSelection: new Set(promotionSuggestion.offer.services as ServiceId[]),
        icons: promotionSuggestion.offer.services as ServiceId[],
        newTotal,
        savings,
        badge: savings > 0 ? 'Great deal' : 'Unlock offer',
      });
    }

    if (suggestions.length === 0) return null;

    // Prioritize: swap (lowest friction), then replace (same count), then add (upsell), then remove (downsell).
    const priority: Record<Suggestion['kind'], number> = { swap: 4, replace: 3, add: 2, remove: 1 } as const;
    suggestions.sort((a, b) => {
      if (priority[b.kind] !== priority[a.kind]) return priority[b.kind] - priority[a.kind];
      return b.savings - a.savings;
    });

    return suggestions[0];
  }, [selectedServices, promotionSuggestion]);
  
  const handleNext = () => {
    if (selectedServices.size === 0) return;
    const serviceIds = Array.from(selectedServices).join(',');
    router.push(`/subhub/checkout?bundle=${serviceIds}`);
  };

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="Create your bundle" />
      <main className="flex-grow overflow-y-auto pb-48">
        <div className="p-4 space-y-6">
          
          {heroBundles.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-center">Top picks</h2>
              <p className="text-muted-foreground text-center mb-4">Our most popular bundles—curated for the best value.</p>
              <Carousel
                plugins={[plugin.current]}
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full max-w-sm mx-auto"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                  <CarouselContent>
                      {heroBundles.map((bundle) => (
                          <CarouselItem key={bundle.id} className="basis-11/12">
                              <div className="p-1 h-full">
                                <OfferCard 
                                    offer={bundle} 
                                    allServices={allServices} 
                                    onSelect={() => {
                                      setSelectedServices(new Set(bundle.services as ServiceId[]));
                                      setIsSummaryOpen(true);
                                    }} 
                                  />
                              </div>
                          </CarouselItem>
                      ))}
                  </CarouselContent>
              </Carousel>
            </div>
          )}
          
          <div>
            <h2 className="text-xl font-bold text-center mb-4 mt-8">Or create your own</h2>
            {selectedServices.size === 0 && (
              <div className="mb-4">
                <Card className="border-gray-200 bg-white dark:bg-gray-800">
                  <div className="p-3 md:p-4 flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Pick your services to unlock bundle savings.</p>
                      <p className="text-sm text-muted-foreground">Choose up to 4 different services. We’ll automatically apply the best deal.</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            {/* Special Offer moved to bottom sheet */}
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
                     Your monthly total
                    </h3>
                   <ChevronUp className={cn("w-5 h-5 text-gray-500 transition-transform", !isSummaryOpen && "rotate-180")} />
              </div>
              <div className="flex items-center gap-3">
                   {savings > 0 && (
                      <span className="text-sm font-semibold text-green-600">You save {savings.toFixed(0)} THB</span>
                   )}
                  <span className="font-bold text-lg text-primary">{selectedServices.size > 0 ? `${total.toFixed(0)} THB` : `0 THB`}</span>
              </div>
          </div>
          
          <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isSummaryOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0")}>
             <div className="px-4 pb-4 space-y-4">
                
                 {selectedServices.size > 0 ? (
                  <div className="space-y-4 pt-2">
                    <div>
                       <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-base">Your selection</h4>
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
                         <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 text-base">Bundle discount</h4>
                        <ul className="space-y-1.5 text-sm">
                          <li className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-5 flex justify-center"></div>
                             <span className="text-gray-700 dark:text-gray-300">Auto-applied savings</span>
                            </div>
                            <span className="font-medium text-green-600">-{savings.toFixed(0)} THB</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Select at least one service to get started.
                  </div>
                )}
                
                {!isValidBundle && selectedServices.size > 0 && !promotionSuggestion && !cmoSuggestion && (
                  <Card className="mt-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                    <div className="p-3 flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive" />
                      <p className="text-sm text-destructive">No bundle found for this mix. Try a different combination to save more.</p>
                    </div>
                  </Card>
                )}

                {!isValidBundle && !cmoSuggestion && promotionSuggestion && (
                  <Card 
                    className="mt-4 border-amber-300 bg-amber-50 dark:bg-amber-900/20 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedServices(new Set(promotionSuggestion.offer.services as ServiceId[]))}
                  >
                    <div className="p-3 md:p-4 flex items-start gap-3">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-amber-400" />
                      <div className="flex-1">
                        <p className="font-semibold text-amber-800 dark:text-amber-200">Limited-time offer</p>
                        <p className="text-sm text-amber-900 dark:text-amber-100">{promotionSuggestion.message}</p>
                        <p className="text-xs text-amber-900/70 dark:text-amber-200/80 mt-1">Tap to apply</p>
                        {promotionSuggestion.missing.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            {promotionSuggestion.missing.map(id => {
                              const Icon = serviceDisplayConfig[id].Icon;
                              return <Icon key={id} serviceid={id} className="w-5 h-5" />
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {!isValidBundle && cmoSuggestion && (
                  <Card 
                    className="mt-2 border-amber-300 bg-amber-50 dark:bg-amber-900/20 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedServices(new Set(cmoSuggestion.suggestedSelection))}
                  >
                    <div className="p-3 md:p-4 flex items-start gap-3">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-amber-400" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-amber-800 dark:text-amber-200">Smart suggestion</p>
                          {cmoSuggestion.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold uppercase tracking-wide">{cmoSuggestion.badge}</span>
                          )}
                        </div>
                        <p className="text-sm text-amber-900 dark:text-amber-100">{cmoSuggestion.message}</p>
                        <p className="text-xs text-amber-900/70 dark:text-amber-200/80 mt-1">Tap to apply</p>
                        {cmoSuggestion.icons && cmoSuggestion.icons.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            {cmoSuggestion.icons.map(id => {
                              const Icon = serviceDisplayConfig[id].Icon;
                              return <Icon key={id} serviceid={id} className="w-5 h-5" />
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}


                <div className="flex justify-between items-end pt-4 border-t mt-2 dark:border-gray-700">
                     <span className="text-base font-semibold text-gray-800 dark:text-gray-200">Subtotal (excl. VAT)</span>
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
                        className={cn(
                          "w-full rounded-full h-12 text-lg font-bold",
                          selectedServices.size === 0 || !isValidBundle
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-primary hover:bg-primary/90 text-white"
                        )}
                        disabled={selectedServices.size === 0 || !isValidBundle}
                        onClick={handleNext}
                     >
                        {selectedServices.size === 0 ? "Start building" : (isValidBundle ? "Continue" : "Choose a bundle to continue")}
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
    const parentName = getParentServiceName(service.id as ServiceId);
    const serviceGroup = serviceGroups[parentName];
    const selectedPlanInGroup = serviceGroup.find((plan: ServiceId) => selectedServices.has(plan));
    const isPlanSwitch = selectedPlanInGroup && selectedPlanInGroup !== service.id;

    const selectedParentServicesCount = new Set(Array.from(selectedServices).map(id => getParentServiceName(id))).size;
    const isDisabled = !isSelected && !selectedPlanInGroup && selectedParentServicesCount >= MAX_SELECTION_LIMIT;

    const getPriceInfo = useMemo(() => {
        const calculateTotalPrice = (services: Set<ServiceId>): number => {
            const bestOffer = findBestOffer(services);
            if (bestOffer && bestOffer.services.length === services.size) {
                return bestOffer.sellingPrice;
            }
            return Array.from(services).reduce((acc, id) => {
                const s = subscriptionServices.find(s => s.id === id);
                const promotionalOffer = offerGroups.find(o => o.packName === 'Pack0' && o.services[0] === id);
                return acc + (promotionalOffer?.sellingPrice || s?.plans[0].price || 0);
            }, 0);
        };

        if (isSelected) {
            return null;
        }
        
        let incrementalCost: number;
        const currentTotal = calculateTotalPrice(selectedServices);

        if (selectedPlanInGroup) {
            // This is a plan replacement scenario
            const tempSelectionWithoutOldPlan = new Set(selectedServices);
            tempSelectionWithoutOldPlan.delete(selectedPlanInGroup);
            const totalWithoutOldPlan = calculateTotalPrice(tempSelectionWithoutOldPlan);

            const tempSelectionWithNewPlan = new Set(tempSelectionWithoutOldPlan);
            tempSelectionWithNewPlan.add(service.id as ServiceId);
            const newTotal = calculateTotalPrice(tempSelectionWithNewPlan);

            incrementalCost = newTotal - totalWithoutOldPlan;
        } else {
            // Standard addition scenario
            const potentialSelection = new Set(selectedServices);
            potentialSelection.add(service.id as ServiceId);
            const newTotal = calculateTotalPrice(potentialSelection);
            incrementalCost = newTotal - currentTotal;
        }
        
        const displayCost = Math.abs(incrementalCost);

        if (incrementalCost < 0) {
            return (
                <div className="text-right">
                    <p className="font-bold text-lg text-green-600">
                      ({incrementalCost.toFixed(0)}) THB
                    </p>
                    <p className="text-xs text-muted-foreground line-through">{service.plans[0].price.toFixed(0)} THB</p>
                </div>
            )
        }
        
        return (
            <div className="text-right">
                <p className={cn("font-bold text-lg", incrementalCost > 0 ? "text-primary" : "text-gray-500")}>
                  +{displayCost.toFixed(0)} THB
                </p>
                <p className="text-xs text-muted-foreground line-through">{service.plans[0].price.toFixed(0)} THB</p>
            </div>
        );
    }, [service.id, service.plans, selectedServices, isSelected, selectedPlanInGroup]);
  
  return (
    <div
      onClick={!isDisabled ? onToggle : undefined}
      className={cn(
        'p-3 rounded-xl border-2 bg-white dark:bg-gray-800 transition-all flex items-center gap-4 relative',
        isSelected ? 'border-primary shadow-lg' : 'border-gray-200 dark:border-gray-700',
        isDisabled ? 'bg-gray-100 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
    >
        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0", isSelected ? "bg-primary border-primary" : "border-gray-300 dark:border-gray-600")}></div>

        <Icon 
          serviceid={service.id}
          className={cn("w-10 h-10 object-contain shrink-0", service.id.startsWith('netflix') && 'w-7 h-10')} 
        />
        <div className="flex-grow min-w-0">
          <p className={cn("font-bold text-base text-gray-800 dark:text-gray-200")}>{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{service.plans[0].features.join(' • ')}</p>
        </div>
        <div className="ml-auto text-right">
            {getPriceInfo}
        </div>
        {isPlanSwitch && <p className="text-xs text-destructive font-semibold absolute bottom-1 right-3">Only one {parentName} plan allowed.</p>}
    </div>
  )
}

    