'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { SubscriptionService, OfferGroup, ServiceId } from '@/lib/types';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import { WeTVIcon } from '@/components/icons/wetv-icon';
import { OneDIcon } from '@/components/icons/oned-icon';
import { TrueIDIcon } from '@/components/icons/trueid-icon';

const serviceDisplayConfig: Record<ServiceId, { Icon: React.ElementType; title: string; details: string }> = {
  youtube: { Icon: YouTubeIcon, title: 'Youtube premium', details: '480p, 1 screen, 1 device' },
  viu: { Icon: ViuIcon, title: 'VIU', details: '480p, 1 screen, 1 device' },
  'netflix-mobile': { Icon: NetflixIcon, title: 'Netflix Mobile', details: '480p, 1 screen, 1 device' },
  iqiyi: { Icon: IQIYIIcon, title: 'iQIYI VIP Standard', details: '480p, 1 screen, 1 device' },
  wetv: { Icon: WeTVIcon, title: 'WeTV', details: '480p, 1 screen, 1 device' },
  oned: { Icon: OneDIcon, title: 'OneD', details: '480p, 1 screen, 1 device' },
  trueplus: { Icon: TrueIDIcon, title: 'True Plus', details: '480p, 1 screen, 1 device' },
  trueidshort: { Icon: TrueIDIcon, title: 'True ID Short', details: '480p, 1 screen, 1 device' },
  'netflix-basic': { Icon: NetflixIcon, title: 'Netflix Basic', details: '480p, 1 screen, 1 device' },
  'netflix-standard': { Icon: NetflixIcon, title: 'Netflix Standard', details: '480p, 1 screen, 1 device' },
  'netflix-premium': { Icon: NetflixIcon, title: 'Netflix Premium', details: '480p, 1 screen, 1 device' },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bundleParam = searchParams.get('bundle');
  const [activeTab, setActiveTab] = useState('information');

  const selectedServices = useMemo(() => {
    if (!bundleParam) return [];
    return bundleParam.split(',').filter(Boolean) as ServiceId[];
  }, [bundleParam]);

  const bundleDetails = useMemo(() => {
    if (selectedServices.length === 0) return null;

    // Find the best offer for the selected services
    const matchedOffer = offerGroups.find(offer => {
      const offerServices = offer.services as ServiceId[];
      return offerServices.length === selectedServices.length && 
             offerServices.every(id => selectedServices.includes(id));
    });

    if (matchedOffer) {
      return {
        services: selectedServices,
        price: matchedOffer.sellingPrice,
        originalPrice: matchedOffer.fullPrice,
        savings: matchedOffer.fullPrice - matchedOffer.sellingPrice
      };
    }

    // Fallback to individual pricing
    const totalPrice = selectedServices.reduce((acc, id) => {
      const service = subscriptionServices.find(s => s.id === id);
      return acc + (service?.plans[0].price || 0);
    }, 0);

    return {
      services: selectedServices,
      price: totalPrice,
      originalPrice: totalPrice,
      savings: 0
    };
  }, [selectedServices]);

  const handleCheckout = () => {
    // Navigate directly to activation page with bundle parameter
    const bundleQuery = bundleParam ? `?bundle=${bundleParam}` : '';
    router.push(`/subscriptions/activation${bundleQuery}`);
  };

  if (!bundleDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Subscription plan</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No bundle selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 ml-2">Subscription plan</h1>
      </div>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-6">
          
          {/* Bundle subscription card */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bundle subscription</h2>
            
            {/* Services list */}
            <div className="space-y-4 mb-6">
              {bundleDetails.services.map(serviceId => {
                const Icon = serviceDisplayConfig[serviceId]?.Icon;
                const title = serviceDisplayConfig[serviceId]?.title;
                const details = serviceDisplayConfig[serviceId]?.details;
                
                if (!Icon || !title) return null;

                return (
                  <div key={serviceId} className="flex items-center gap-4">
                    {/* Service Icon */}
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Icon serviceid={serviceId} className="w-8 h-8" />
                    </div>
                    
                    {/* Service Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <p className="text-sm text-gray-600">{details}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bundle Price */}
            <div className="border-t pt-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-1">
                  {bundleDetails.price}
                </div>
                <div className="text-lg text-red-600 mb-2">THB/month</div>
                <div className="text-sm text-gray-500">EXCL. VAT</div>
              </div>
            </div>
          </Card>

          {/* Information/Terms tabs */}
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="information" 
                  className={activeTab === 'information' ? 'bg-red-600 text-white' : ''}
                >
                  Information
                </TabsTrigger>
                <TabsTrigger 
                  value="terms" 
                  className={activeTab === 'terms' ? 'bg-red-600 text-white' : ''}
                >
                  Terms of service
                </TabsTrigger>
              </TabsList>

              <TabsContent value="information" className="mt-4">
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Get extra 100 minutes from normal 200 minutes</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Price does not include VAT</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Check out GO+ Gifts for more details</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Free calls to any number 300 minutes at only 199 THB, valid for 30 days.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>The company reserves the right to cancel the promotion/change the bonus/conditions without prior notice.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>In the event of a dispute, the company's decision is an ultimatum.</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="mt-4">
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>This subscription will automatically renew monthly unless cancelled</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>You can cancel your subscription at any time through your account settings</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>All services are subject to their respective terms and conditions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Prices may change with 30 days notice</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Service availability may vary by region</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      {/* Bottom checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Total Excl. VAT</div>
            <div className="text-2xl font-bold text-red-600">
              {bundleDetails.price} THB/month
            </div>
          </div>
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
        
        {/* Home indicator */}
        <div className="max-w-md mx-auto mt-2">
          <div className="w-32 h-1 bg-black rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
          <h1 className="text-lg font-semibold text-gray-900 ml-2">Subscription plan</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}





