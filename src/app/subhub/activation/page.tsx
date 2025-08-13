'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ServiceId } from '@/lib/types';
import { subscriptionServices } from '@/lib/data';

function ActivationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = (searchParams.get('service') || '').trim() as ServiceId;

  const service = useMemo(() => subscriptionServices.find((s) => s.id === serviceId), [serviceId]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="Activation" />
      <main className="flex-grow p-4 md:p-6 max-w-xl mx-auto w-full">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Activation Instructions</CardTitle>
            <CardDescription>
              {service ? `Activate your ${service.name} subscription` : 'Unknown or missing service.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {service ? (
              <div className="space-y-3">
                <p>
                  To activate <span className="font-semibold">{service.name}</span>, follow these steps:
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Open the {service.name} app or website.</li>
                  <li>Sign in with the mobile number used for your purchase.</li>
                  <li>Your plan should be automatically recognized and activated. If not, use the code sent via SMS.</li>
                </ol>
                <p className="text-muted-foreground">Need help? Contact support via the Account page.</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Try <code>/subhub/activation?service=viu</code></p>
            )}

            <div className="flex gap-2 pt-2">
              <Button className="rounded-full" onClick={() => router.push('/account')}>Go to Account</Button>
              <Button variant="outline" className="rounded-full" onClick={() => router.push('/')}>Back Home</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function SubhubActivationPage() {
  return (
    <Suspense fallback={null}>
      <ActivationContent />
    </Suspense>
  );
}





