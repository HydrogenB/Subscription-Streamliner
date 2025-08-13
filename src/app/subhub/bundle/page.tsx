'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ServiceId } from '@/lib/types';
import { subscriptionServices } from '@/lib/data';

function parseBundleParam(raw: string | null): ServiceId[] {
  if (!raw) return [] as ServiceId[];
  const ids = raw.split(',').map((id) => id.trim()).filter(Boolean);
  const validIds = new Set(subscriptionServices.map((s) => s.id));
  return ids.filter((id) => validIds.has(id)) as ServiceId[];
}

function BundleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceIds = useMemo(() => parseBundleParam(searchParams.get('bundle')), [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="Selected Bundle" />
      <main className="flex-grow p-4 md:p-6 max-w-xl mx-auto w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Bundle Selection</CardTitle>
            <CardDescription>
              {serviceIds.length > 0 ? 'The following services were preselected from the link.' : 'No services provided in bundle parameter.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceIds.length > 0 ? (
              <ul className="list-disc pl-6 text-sm">
                {serviceIds.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Try adding <code>bundle=viu,iqiyi</code> to the URL.</p>
            )}

            <div className="flex gap-2">
              <Button
                className="rounded-full"
                disabled={serviceIds.length === 0}
                onClick={() => router.push(`/subscriptions/confirm?services=${serviceIds.join(',')}`)}
              >
                Continue to Confirm
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.push('/subscriptions/add')}
              >
                Change Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function SubhubBundlePage() {
  return (
    <Suspense fallback={null}>
      <BundleContent />
    </Suspense>
  );
}



