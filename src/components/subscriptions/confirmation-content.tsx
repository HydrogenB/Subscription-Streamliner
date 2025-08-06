
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { OfferGroup } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CreditCard } from 'lucide-react';

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


const serviceDisplayConfig: Record<ServiceId, { title: string }> = {
  youtube: { title: 'Youtube Premium' },
  viu: { title: 'VIU' },
  'netflix-mobile': { title: 'Netflix Mobile' },
  iqiyi: { title: 'iQIYI VIP Standard' },
  wetv: { title: 'WeTV' },
  oned: { title: 'oneD' },
  trueplus: { title: 'True Plus' },
  trueidshort: { title: 'True ID Short' },
  'netflix-basic': { title: 'Netflix Basic' },
  'netflix-standard': { title: 'Netflix Standard' },
  'netflix-premium': { title: 'Netflix Premium' },
};


function findBestOffer(selectedIds: ServiceId[]): OfferGroup | null {
  if (selectedIds.length === 0) {
    return null;
  }
  const selectedArray = [...selectedIds].sort();
  const matchedOffers = offerGroups.filter(offer => {
    if (offer.services.length !== selectedArray.length) {
      return false;
    }
    const offerServicesSorted = [...offer.services].sort();
    return JSON.stringify(offerServicesSorted) === JSON.stringify(selectedArray);
  });
  if (matchedOffers.length > 0) {
    return matchedOffers.reduce((best, current) => current.sellingPrice < best.sellingPrice ? current : best);
  }
  return null;
}

const VAT_RATE = 0.07;

export function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceIds = useMemo(() => (searchParams.get('services')?.split(',') || []) as ServiceId[], [searchParams]);

  const { bundle, subtotal, savings, vat, total } = useMemo(() => {
    const matchedOffer = findBestOffer(serviceIds);

    if (matchedOffer) {
      const calculatedSavings = matchedOffer.fullPrice - matchedOffer.sellingPrice;
      const calculatedVat = matchedOffer.sellingPrice * VAT_RATE;
      const calculatedTotal = matchedOffer.sellingPrice + calculatedVat;
      return {
        bundle: matchedOffer,
        subtotal: matchedOffer.sellingPrice,
        savings: calculatedSavings,
        vat: calculatedVat,
        total: calculatedTotal
      };
    }
    
    if (serviceIds.length > 0) {
        const currentFullPrice = serviceIds.reduce((acc, id) => {
            const service = subscriptionServices.find(s => s.id === id);
            return acc + (service?.plans[0].price || 0);
        }, 0);
        const calculatedVat = currentFullPrice * VAT_RATE;
        const calculatedTotal = currentFullPrice + calculatedVat;
        return { bundle: null, subtotal: currentFullPrice, savings: 0, vat: calculatedVat, total: calculatedTotal };
    }

    return { bundle: null, subtotal: 0, savings: 0, vat: 0, total: 0 };
  }, [serviceIds]);

  const handleConfirm = () => {
    if (!serviceIds) return;
    const servicesQuery = serviceIds.join(',');
    const orderId = `ORD-${Date.now()}`;
    router.push(`/subscriptions/receipt?orderId=${orderId}&services=${servicesQuery}`);
  };

  if (serviceIds.length === 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>No Services Selected</CardTitle>
          <CardDescription>Please go back and select a bundle.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/subscriptions/add')}>Choose Services</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Please review your bundle before confirming.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {serviceIds.map(id => {
              const service = subscriptionServices.find(s => s.id === id);
              if (!service) return null;
              const originalPrice = service.plans[0].price;
              
              return (
                <li key={id} className="flex justify-between items-center text-sm">
                  <span>{serviceDisplayConfig[id].title}</span>
                  <span className={cn(savings > 0 && 'text-muted-foreground line-through')}>{originalPrice.toFixed(2)} THB</span>
                </li>
              );
            })}
          </ul>

          <Separator />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{subtotal.toFixed(2)} THB</span>
            </div>
            {savings > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Bundle Discount</span>
                <span>-{savings.toFixed(2)} THB</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (7%)</span>
              <span>{vat.toFixed(2)} THB</span>
            </div>
            
            <Separator />

            <div className="flex justify-between items-baseline font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{total.toFixed(2)} THB</span>
            </div>
          </div>
          
           {bundle === null && serviceIds.length > 0 && (
              <div className="!mt-4 flex items-center gap-2 rounded-lg border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                  <AlertCircle className="h-5 w-5" />
                  <p>You have selected services without a bundle discount. Consider going back to find a cheaper deal.</p>
              </div>
           )}

        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>A default payment method will be used.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="font-semibold">Default Credit Card</p>
              <p className="text-sm text-muted-foreground">Ending in **** 1234</p>
            </div>
          </CardContent>
      </Card>

      <Button size="lg" className="w-full h-12 text-lg" onClick={handleConfirm}>
        Confirm & Pay
      </Button>
    </div>
  );
}

    