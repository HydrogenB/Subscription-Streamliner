'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService, OfferGroup, ServiceId } from '@/lib/types';
import { ServiceCard } from '@/components/subscriptions/ServiceCard';
import { BillingSummary } from '@/components/subscriptions/BillingSummary';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Menu, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { serviceDisplayConfig } from '@/lib/config';

// Constants
const NETFLIX_PLANS: ServiceId[] = ['netflix-mobile', 'netflix-basic', 'netflix-standard', 'netflix-premium'];
const MAX_SELECTION_LIMIT = 4;

// Helper Functions
function findBestOffer(selectedIds: Set<ServiceId>): OfferGroup | null {
  if (selectedIds.size === 0) return null;
  const selectedArray = Array.from(selectedIds).sort();
  const matchedOffers = offerGroups.filter(offer => {
    if (offer.services.length !== selectedArray.length) return false;
    const offerServicesSorted = [...offer.services].sort();
    return JSON.stringify(offerServicesSorted) === JSON.stringify(selectedArray);
  });
  if (matchedOffers.length > 0) {
    return matchedOffers.reduce((best, current) =>
        current.sellingPrice < best.sellingPrice ? current : best
    );
  }
  return null;
}

function findNextBestOffer(selectedIds: Set<ServiceId>): OfferGroup | null {
    if (selectedIds.size === 0 || selectedIds.size >= MAX_SELECTION_LIMIT) return null;
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

// Main Page Component
export default function AddBundlePage() {
  // All hooks must be called unconditionally at the top level
  const [allServices, setAllServices] = useState<SubscriptionService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Set<ServiceId>>(new Set(['viu']));
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);
  const [notification, setNotification] = useState('');
  const [isBillingExpanded, setIsBillingExpanded] = useState(false);
  const [isIssueExpanded, setIsIssueExpanded] = useState(false);
  const router = useRouter();
  
  // Memoized values
  const { total, savings, isValidBundle, fullPrice } = useMemo(() => {
    const matchedOffer = findBestOffer(selectedServices);
    if (matchedOffer) {
      return { 
        total: matchedOffer.sellingPrice, 
        savings: matchedOffer.fullPrice - matchedOffer.sellingPrice, 
        isValidBundle: true,
        fullPrice: matchedOffer.fullPrice
      };
    }
    const currentFullPrice = Array.from(selectedServices).reduce((acc, id) => {
      const service = allServices.find(s => s.id === id);
      return acc + (service?.plans[0].price || 0);
    }, 0);
    return { total: currentFullPrice, savings: 0, isValidBundle: false, fullPrice: currentFullPrice };
  }, [selectedServices, allServices]);

  const nextBestOffer = useMemo(() => {
    if (isValidBundle) return null;
    return findNextBestOffer(selectedServices);
  }, [selectedServices, isValidBundle]);
  
  // Get selected services with their details
  const selectedServicesList = useMemo(() => {
    return Array.from(selectedServices).map(id => {
      const service = allServices.find(s => s.id === id);
      const config = serviceDisplayConfig[id as keyof typeof serviceDisplayConfig];
      return {
        id,
        name: service?.name || id,
        price: service?.plans[0]?.price || 0,
        description: service?.description || '',
        logo: config?.Icon
      };
    });
  }, [selectedServices, allServices]);

  // Fetch data on mount
  useEffect(() => {
    // In a real app, this would be an API call
    setAllServices(subscriptionServices);
    setIsLoading(false);
  }, []);

  const handleSelectBundle = (bundle: { id: string; services: ServiceId[] } | null) => {
    if (bundle) {
      setSelectedBundleId(bundle.id);
      setSelectedServices(new Set(bundle.services));
    } else {
      setSelectedBundleId(null);
      // Keep current selection when deselecting bundle
    }
  };

  const handleServiceToggle = (serviceId: ServiceId) => {
    // Deselect any active bundle when manually changing services
    if (selectedBundleId) {
      setSelectedBundleId(null);
    }

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

  // Helper function to get price info - moved outside of hooks to prevent recreation
  const getPriceInfo = useCallback((serviceId: ServiceId): { text: string; originalPrice?: string; type: 'bundle' | 'promo' | 'default' | 'none' } => {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return { text: '', type: 'none' };
    if (selectedServices.has(serviceId)) return { text: '', type: 'none' };
    if (selectedServices.size >= MAX_SELECTION_LIMIT) return { text: '', type: 'none' };

    const selectedNetflixPlan = Array.from(selectedServices).find(id => NETFLIX_PLANS.includes(id));
    if (NETFLIX_PLANS.includes(serviceId) && selectedNetflixPlan) {
        const currentNetflixService = allServices.find(s => s.id === selectedNetflixPlan);
        if (!currentNetflixService) return {text: '', type: 'none'};
        const increment = service.plans[0].price - currentNetflixService.plans[0].price;
        return { text: `+${increment.toFixed(0)} THB`, originalPrice: `${service.plans[0].price.toFixed(0)} THB`, type: 'default' };
    }
    
    if (selectedServices.size > 0) {
      const potentialSelection = new Set(selectedServices);
      potentialSelection.add(serviceId);
      const nextOffer = findBestOffer(potentialSelection);
      if (nextOffer) {
          const increment = nextOffer.sellingPrice - total;
          return { text: `+${increment.toFixed(0)} THB`, type: 'bundle' };
      } else {
          return { text: `+${service.plans[0].price.toFixed(0)} THB`, type: 'default' };
      }
    }
  
    const singleOffer = offerGroups.find(o => o.services.length === 1 && o.services[0] === serviceId);
    if (singleOffer && singleOffer.sellingPrice < service.plans[0].price) {
      return { text: `${singleOffer.sellingPrice.toFixed(0)} THB`, originalPrice: `${service.plans[0].price.toFixed(0)} THB`, type: 'promo' };
    }
    
    return { text: `${service.plans[0].price.toFixed(0)} THB`, type: 'default' };
  }, [allServices, selectedServices, total]);

  // getPriceInfo is already defined above with useCallback, removing duplicate

  const handleNext = () => {
    if (selectedServices.size === 0) return;
    const serviceIds = Array.from(selectedServices).join(',');
    router.push(`/subscriptions/confirm?services=${serviceIds}`);
  };

  const isServiceListEmpty = allServices.length === 0;

  const handleNextClick = () => {
    // TODO: Navigate to the next step, e.g., payment
    router.push('/subscriptions/confirm');
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper skeleton screen
  }



  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </button>
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">Add bundle</h1>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Menu className="h-5 w-5 text-gray-900 dark:text-gray-100" />
          </button>
        </div>
      </header>

      <main className="flex-grow px-4 py-6 pb-32">
        {notification && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
            <span className="block sm:inline">{notification}</span>
          </div>
        )}

        {isServiceListEmpty ? (
          <div className="text-center py-20">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Services Available</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">There are currently no subscription services to bundle.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Service List */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Select services</h2>
              
              {allServices.map(service => {
                const serviceId = service.id as ServiceId;
                const isSelected = selectedServices.has(serviceId);
                const priceInfo = getPriceInfo(serviceId);
                const price = priceInfo.text.replace(/[^0-9.]/g, '') || '0';
                const config = serviceDisplayConfig[serviceId as keyof typeof serviceDisplayConfig];
                
                return (
                  <ServiceCard
                    key={service.id}
                    id={serviceId}
                    name={service.name}
                    description={service.description || 'Standard Plan'}
                    price={parseFloat(price)}
                    originalPrice={service.plans[0]?.price}
                    isSelected={isSelected}
                    onSelect={handleServiceToggle}
                    logo={config?.Icon}
                  />
                );
              })}
            </div>

            {/* Billing Summary */}
            <BillingSummary
              total={total}
              savings={savings}
              services={selectedServicesList.map(s => ({
                name: s.name,
                price: s.price
              }))}
              isExpanded={isBillingExpanded}
              onToggleExpand={() => setIsBillingExpanded(!isBillingExpanded)}
              className="sticky bottom-24 z-10"
            />
          </div>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center justify-between">
            {selectedServices.size > 0 && (
              <button 
                onClick={() => setIsIssueExpanded(!isIssueExpanded)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors",
                  isIssueExpanded 
                    ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <AlertCircle className="h-4 w-4 mr-1.5" />
                <span>1 Issue</span>
                {isIssueExpanded && <X className="h-4 w-4 ml-1.5" />}
              </button>
            )}
            
            <Button 
              onClick={handleNextClick}
              disabled={selectedServices.size === 0}
              className={cn(
                "flex-1 ml-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-full",
                selectedServices.size === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              Next
            </Button>
          </div>
          
          {isIssueExpanded && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded-lg">
              <p>You can only select one Netflix plan at a time. Please remove the current Netflix plan before selecting a different one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
