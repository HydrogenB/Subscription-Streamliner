
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { OfferGroup, ServiceId } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Home, FileText } from 'lucide-react';

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

export function ReceiptContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceIds = useMemo(() => (searchParams.get('services')?.split(',') || []) as ServiceId[], [searchParams]);
  const orderId = searchParams.get('orderId');

  const { total } = useMemo(() => {
    const matchedOffer = findBestOffer(serviceIds);
    if (matchedOffer) {
      return { total: matchedOffer.sellingPrice * (1 + VAT_RATE) };
    }
    if (serviceIds.length > 0) {
        const currentFullPrice = serviceIds.reduce((acc, id) => {
            const service = subscriptionServices.find(s => s.id === id);
            return acc + (service?.plans[0].price || 0);
        }, 0);
        return { total: currentFullPrice * (1 + VAT_RATE) };
    }
    return { total: 0 };
  }, [serviceIds]);
  
  if (!orderId || serviceIds.length === 0) {
    return (
      <Card className="text-center shadow-lg">
        <CardHeader>
          <CardTitle>Invalid Receipt</CardTitle>
          <CardDescription>This receipt is invalid or has expired. Please start a new purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/')} className="rounded-full">
            <Home className="mr-2" /> Go Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-bold">Thank You For Your Purchase!</h1>
            <p className="text-muted-foreground">Your new subscriptions are now active.</p>
        </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Receipt</CardTitle>
          <CardDescription>
            Order ID: <span className="font-mono text-foreground">{orderId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Purchased Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
                {serviceIds.map(id => (
                    <li key={id} className="font-medium text-gray-700 dark:text-gray-300">• {serviceDisplayConfig[id].title}</li>
                ))}
            </ul>
          </div>

          <Separator />
          
          <div className="flex justify-between items-baseline font-bold text-lg">
            <span>Amount Paid</span>
            <span className="text-primary">{total.toFixed(2)} THB</span>
          </div>
        </CardContent>
      </Card>
      
        <div className="flex flex-col space-y-2">
            <Button size="lg" onClick={() => router.push('/account')} className="rounded-full font-bold">
                <FileText className="mr-2"/>
                View My Subscriptions
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/')} className="rounded-full font-bold">
                <Home className="mr-2"/>
                Back to Home
            </Button>
        </div>
    </div>
  );
}
