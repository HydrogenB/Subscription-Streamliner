'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ServiceId } from '@/lib/types';
import { subscriptionServices, offerGroups } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { WeTVIcon } from '@/components/icons/wetv-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import { OneDIcon } from '@/components/icons/oned-icon';
import { TrueIDIcon } from '@/components/icons/trueid-icon';

const serviceDisplayConfig: Record<ServiceId, { title: string; Icon: React.ElementType }> = {
  youtube: { title: 'Youtube premium', Icon: YouTubeIcon },
  viu: { title: 'VIU', Icon: ViuIcon },
  'netflix-mobile': { title: 'Netflix mobile', Icon: NetflixIcon },
  iqiyi: { title: 'iQIYI VIP Standard', Icon: IQIYIIcon },
  wetv: { title: 'WeTV', Icon: WeTVIcon },
  oned: { title: 'oneD', Icon: OneDIcon },
  trueplus: { title: 'True Plus', Icon: TrueIDIcon },
  trueidshort: { title: 'True ID Short', Icon: TrueIDIcon },
  'netflix-basic': { title: 'Netflix Basic', Icon: NetflixIcon },
  'netflix-standard': { title: 'Netflix Standard', Icon: NetflixIcon },
  'netflix-premium': { title: 'Netflix Premium', Icon: NetflixIcon },
};

function parseBundleParam(raw: string | null): ServiceId[] {
  if (!raw) return [] as ServiceId[];
  const ids = raw.split(',').map((id) => id.trim()).filter(Boolean);
  const validIds = new Set(subscriptionServices.map((s) => s.id));
  return ids.filter((id) => validIds.has(id)) as ServiceId[];
}

function findExactBundlePrice(ids: ServiceId[]): number | null {
  if (ids.length === 0) return null;
  const sorted = [...ids].sort();
  const match = offerGroups.find(o => o.services.length === sorted.length && [...o.services].sort().every((id, i) => id === sorted[i]));
  return match ? match.sellingPrice : null;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceIds = useMemo(() => parseBundleParam(searchParams.get('bundle')), [searchParams]);
  const bundlePrice = useMemo(() => findExactBundlePrice(serviceIds), [serviceIds]);
  const fallbackPrice = useMemo(() => serviceIds.reduce((sum, id) => sum + (subscriptionServices.find(s => s.id === id)?.plans[0].price || 0), 0), [serviceIds]);
  const price = bundlePrice ?? fallbackPrice;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="Subscription plan" />
      <main className="flex-grow p-4 md:p-6 max-w-xl mx-auto w-full">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-bold">Bundle subscription</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {serviceIds.map((id) => {
                const service = subscriptionServices.find(s => s.id === id);
                if (!service) return null;
                const { title, Icon } = serviceDisplayConfig[id];
                return (
                  <div key={id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center">
                      <Icon serviceid={id} className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                      <p className="text-muted-foreground text-sm">480p, 1 screen, 1 device</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-2">
              <p className="text-4xl font-extrabold text-red-600">{price.toFixed(0)}<span className="ml-2 text-base align-top">THB/month</span></p>
              <p className="text-xs text-muted-foreground mt-1">EXCL. VAT</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-2 bg-transparent">
              <TabsTrigger value="info" className="data-[state=active]:font-bold data-[state=active]:text-primary">Information</TabsTrigger>
              <TabsTrigger value="terms" className="data-[state=active]:font-bold data-[state=active]:text-primary">Terms of service</TabsTrigger>
            </TabsList>
            <Separator className="my-2" />
            <TabsContent value="info" className="text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li>Get extra 100 minutes from normal 200 minutes</li>
                <li>Price does not include VAT</li>
                <li>Check out GO+ Gifts for more details</li>
                <li>Free calls to any number 300 minutes at only 199 THB, valid for 30 days.</li>
                <li>The company reserves the right to cancel the promotion/change the bonus/conditions without prior notice.</li>
                <li>In the event of a dispute, the company’s decision is an ultimatum.</li>
              </ul>
            </TabsContent>
            <TabsContent value="terms" className="text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li>All subscriptions renew monthly until canceled.</li>
                <li>VAT will be applied at checkout where applicable.</li>
                <li>Usage is subject to individual service provider policies.</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t">
        <div className="max-w-xl mx-auto w-full p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Total Excl. VAT</p>
            <p className="text-xl font-extrabold text-primary">{price.toFixed(0)} <span className="text-sm font-semibold">THB/month</span></p>
          </div>
          <Button className="rounded-full h-12 px-6 text-lg font-bold" onClick={() => router.push(`/subscriptions/receipt?orderId=ORD-${Date.now()}&services=${serviceIds.join(',')}`)}>
            Checkout
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default function SubhubCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}





