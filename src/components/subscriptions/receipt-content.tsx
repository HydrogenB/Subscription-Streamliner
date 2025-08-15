
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { OfferGroup, ServiceId } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Home } from 'lucide-react';

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
      <div className="text-center space-y-4">
        <p className="text-lg font-semibold">Invalid receipt</p>
        <Button onClick={() => router.push('/')} className="rounded-full">
          <Home className="mr-2" /> Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-600 font-bold">True5G Postpaid</span>
            <span className="text-xl font-semibold">0900000000</span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="font-bold text-lg">auto-renew package</p>
              <ul className="list-disc pl-5 space-y-1 text-lg">
                {serviceIds.map(id => (
                  <li key={id}>{serviceDisplayConfig[id].title}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-lg">Order date</p>
              <p className="text-lg">{new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: false, timeZoneName: 'short' })}</p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-lg">Total cost</p>
              <p className="text-xl font-bold">{(total / 1.07).toFixed(2)} THB (Excl. VAT)</p>
            </div>

            <div className="space-y-1">
              <p className="font-semibold text-lg">Payment method</p>
              <p className="text-lg">True Bill</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-muted-foreground">The purchased package will be active after your received SMS.</p>

      <div className="pt-8">
        <Button size="lg" className="w-full h-12 rounded-full text-lg font-bold" onClick={() => router.push('/account')}>
          Go to my subscriptions
        </Button>
      </div>
    </div>
  );
}
