

'use client';

import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { ReceiptContent } from '@/components/subscriptions/receipt-content';
import { Skeleton } from '@/components/ui/skeleton';

export default function ReceiptPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Purchase Receipt" />
      <main className="flex-grow p-4 md:p-6">
        <Suspense fallback={<ReceiptSkeleton />}>
          <ReceiptContent />
        </Suspense>
      </main>
    </div>
  );
}


function ReceiptSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-80" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-12 w-full rounded-full" />
                <Skeleton className="h-12 w-full rounded-full" />
            </div>
        </div>
    )
}
