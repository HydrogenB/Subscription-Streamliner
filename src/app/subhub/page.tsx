'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ServiceId } from '@/lib/types';
import { subscriptionServices } from '@/lib/data';

function parseBundleParam(raw: string | null): ServiceId[] {
  if (!raw) return [] as ServiceId[];
  const decoded = raw;
  const ids = decoded.split(',').map((id) => id.trim()).filter(Boolean);
  const validIds = new Set(subscriptionServices.map((s) => s.id));
  return ids.filter((id) => validIds.has(id)) as ServiceId[];
}

function buildTrueAppLink(path: string, params: Record<string, string>) {
  const search = new URLSearchParams(params).toString();
  return `trueapp://app.true.th${path}${search ? `?${search}` : ''}`;
}

export default function SubhubIndexPage() {
  const searchParams = useSearchParams();
  const initialBundle = useMemo(() => parseBundleParam(searchParams.get('bundle')), [searchParams]);
  const [bundleInput, setBundleInput] = useState(initialBundle.join(','));

  const exampleBundle = 'viu,iqiyi';
  const deepLink = buildTrueAppLink('/subhub/bundle', { bundle: bundleInput.replace(/\s+/g, '') });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Subhub Link Schema" />
      <main className="flex-grow p-4 md:p-6 space-y-6 max-w-xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Supported Routes</CardTitle>
            <CardDescription>Use these URLs (or the deep link scheme) to open specific flows.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1">
              <p className="font-semibold">Web</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><code>https://app.true.th/subhub/</code></li>
                <li><code>https://app.true.th/subhub/bundle?bundle=viu,iqiyi</code></li>
                <li><code>https://app.true.th/subhub/checkout?bundle=viu,iqiyi</code></li>
                <li><code>https://app.true.th/subhub/activation?service=viu</code></li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Deep link</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <code>
                    trueapp://app.true.th/subhub/bundle?bundle=viu%2Ciqiyi
                  </code>
                </li>
                <li>
                  <code>
                    trueapp://app.true.th/subhub/checkout?bundle=viu%2Ciqiyi
                  </code>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deep Link Generator</CardTitle>
            <CardDescription>Enter comma-separated service IDs (e.g., {exampleBundle}).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={bundleInput}
              onChange={(e) => setBundleInput(e.target.value)}
              placeholder="viu,iqiyi"
            />
            <div className="flex flex-col gap-2">
              <div className="text-xs text-muted-foreground">Bundle deep link</div>
              <code className="break-all text-xs p-2 rounded bg-muted">
                {deepLink}
              </code>
            </div>
            <div className="flex gap-2">
              <Link href={`/subhub/bundle?bundle=${encodeURIComponent(bundleInput.replace(/\s+/g, ''))}`}>
                <Button className="rounded-full">Open Web Bundle</Button>
              </Link>
              <Link href={`/subhub/checkout?bundle=${encodeURIComponent(bundleInput.replace(/\s+/g, ''))}`}>
                <Button variant="outline" className="rounded-full">Go to Checkout</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}





