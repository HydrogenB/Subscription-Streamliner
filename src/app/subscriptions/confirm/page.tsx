

'use client';

import { Suspense } from 'react';
import { ConfirmationContent } from '@/components/subscriptions/confirmation-content';
import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function ConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header showBackButton title="Confirm Your Bundle" />
      <main className="flex-grow p-4 md:p-6">
        <Suspense fallback={<ConfirmationSkeleton />}>
          <ConfirmationContent />
        </Suspense>
      </main>
    </div>
  );
}

function ConfirmationSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-full" />
        </div>
    )
}
