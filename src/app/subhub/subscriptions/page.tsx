'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { ServiceId } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
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

function parseServices(raw: string | null): ServiceId[] {
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

function SubscriptionsContent() {
  const searchParams = useSearchParams();
  const [scheduledCancelDate, setScheduledCancelDate] = useState<string | null>(null);

  const services = useMemo(() => parseServices(searchParams.get('services') || searchParams.get('bundle')), [searchParams]);
  const fullPrice = useMemo(() => services.reduce((sum, id) => sum + (subscriptionServices.find(s => s.id === id)?.plans[0].price || 0), 0), [services]);
  const bundlePrice = useMemo(() => findExactBundlePrice(services), [services]);
  const currentBill = bundlePrice ?? fullPrice;
  const savings = Math.max(0, fullPrice - currentBill);

  useEffect(() => {
    const saved = localStorage.getItem('subhub_scheduled_cancel_date');
    if (saved) setScheduledCancelDate(saved);
  }, []);

  const handleScheduleCancel = () => {
    // Schedule cancellation at next cycle: +30 days (mock)
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const formatted = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    localStorage.setItem('subhub_scheduled_cancel_date', formatted);
    setScheduledCancelDate(formatted);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="My subscriptions" />
      <main className="flex-grow p-4 md:p-6 max-w-xl mx-auto w-full space-y-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <h2 className="text-xl font-bold">Subscription bill</h2>
            <p className="text-muted-foreground">Total for this billing cycle</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <p className="text-4xl font-extrabold text-red-600">{currentBill.toFixed(0)} <span className="text-base">THB</span></p>
              {savings > 0 && <p className="text-muted-foreground line-through">{fullPrice.toFixed(0)} THB</p>}
            </div>
            {savings > 0 && (
              <div className="mt-4 rounded-2xl text-white font-semibold px-4 py-3"
                   style={{background: 'linear-gradient(90deg, #ff5e7a, #7b5bff)'}}>
                <span role="img" aria-label="party">🎉</span> Yay, you’ve saved {savings.toFixed(0)} THB!
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h3 className="text-2xl font-bold">My subscriptions</h3>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold">Bundle subscription</h4>
              <span className="text-primary font-semibold cursor-default">View details</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-4">
              <div className="space-y-5">
                {services.map((id) => {
                  const { title, Icon } = serviceDisplayConfig[id];
                  return (
                    <div key={id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white border flex items-center justify-center">
                          <Icon serviceid={id} className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{title}</p>
                          <p className="text-muted-foreground">Activate to start</p>
                        </div>
                      </div>
                      <span className="px-6 py-2 rounded-full bg-red-600 text-white font-bold">Active</span>
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <div>
                  {scheduledCancelDate ? (
                    <p className="text-sm text-muted-foreground">Bundle will end on <span className="font-semibold">{scheduledCancelDate}</span></p>
                  ) : (
                    <p className="text-sm text-muted-foreground">You can cancel the bundle at the next billing cycle.</p>
                  )}
                </div>
                <Button 
                  variant={scheduledCancelDate ? 'outline' : 'destructive'}
                  className="rounded-full"
                  onClick={handleScheduleCancel}
                  disabled={scheduledCancelDate !== null}
                >
                  {scheduledCancelDate ? 'Cancellation scheduled' : 'Cancel bundle'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No upsell/upgrade — per requirement */}
      </main>
    </div>
  );
}

export default function SubhubSubscriptionsPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionsContent />
    </Suspense>
  );
}


