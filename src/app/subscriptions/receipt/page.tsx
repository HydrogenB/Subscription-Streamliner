
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, Package, Phone, Receipt } from 'lucide-react';
import { subscriptionServices, offerGroups } from '@/lib/data';
import type { ServiceId } from '@/lib/types';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import Image from 'next/image';

const serviceDisplayConfig: Record<ServiceId, { Icon: React.ElementType; title: string; logoUrl?: string; publicPrice: number }> = {
  youtube: { Icon: YouTubeIcon, title: 'Youtube premium', publicPrice: 179 },
  viu: { Icon: ViuIcon, title: 'VIU', publicPrice: 89 },
  'netflix-mobile': { Icon: NetflixIcon, title: 'Netflix mobile', logoUrl: 'https://icon-library.com/images/netflix-icon-transparent/netflix-icon-transparent-29.jpg', publicPrice: 199 },
  iqiyi: { Icon: IQIYIIcon, title: 'iQIYI VIP Standard', publicPrice: 89 },
  wetv: { Icon: ViuIcon, title: 'WeTV', publicPrice: 59 },
  oned: { Icon: ViuIcon, title: 'OneD', logoUrl: 'https://www.oned.net/_nuxt/oneD_logo_black.BJCu-mC7.png', publicPrice: 59 },
  trueplus: { Icon: ViuIcon, title: 'True Plus', logoUrl: 'https://t1.blockdit.com/photos/2023/06/649c2cb9c64e35aa66431f1c_800x0xcover_hx0HFaJw.jpg', publicPrice: 119 },
  trueidshort: { Icon: ViuIcon, title: 'True ID Short', logoUrl: 'https://cms.dmpcdn.com/trueyoumerchant/2025/05/16/a12119a0-3232-11f0-aef9-77bd2df9da99_webp_original.webp', publicPrice: 90 },
  'netflix-basic': { Icon: NetflixIcon, title: 'Netflix Basic', logoUrl: 'https://icon-library.com/images/netflix-icon-transparent/netflix-icon-transparent-29.jpg', publicPrice: 199 },
  'netflix-standard': { Icon: NetflixIcon, title: 'Netflix Standard', logoUrl: 'https://icon-library.com/images/netflix-icon-transparent/netflix-icon-transparent-29.jpg', publicPrice: 299 },
  'netflix-premium': { Icon: NetflixIcon, title: 'Netflix Premium', logoUrl: 'https://icon-library.com/images/netflix-icon-transparent/netflix-icon-transparent-29.jpg', publicPrice: 419 },
};

export default function ReceiptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bundleParam = searchParams.get('bundle');
  const orderId = searchParams.get('orderId') || `ORD-${Date.now()}`;

  const selectedServices = bundleParam ? bundleParam.split(',').filter(Boolean) as ServiceId[] : [];
  
  // Default bundle for demo purposes - matching the reference image exactly
  const defaultServices: ServiceId[] = ['youtube', 'viu', 'netflix-mobile', 'iqiyi'];
  const services = selectedServices.length > 0 ? selectedServices : defaultServices;
  
  const bundlePrice = 449.00;
  const phoneNumber = '0900000000';
  const orderDate = new Date();
  const orderDateString = orderDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const orderTime = orderDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  // Calculate total public price (what users would pay elsewhere)
  const totalPublicPrice = services.reduce((total, serviceId) => {
    const serviceConfig = serviceDisplayConfig[serviceId];
    return total + (serviceConfig?.publicPrice || 0);
  }, 0);

  // Calculate savings
  const savings = totalPublicPrice - bundlePrice;

  const handleGoToSubscriptions = () => {
    router.push('/subhub/subscriptions');
  };

  const renderServiceIcon = (serviceId: ServiceId) => {
    const serviceConfig = serviceDisplayConfig[serviceId];
    if (!serviceConfig) return null;

    // If we have a specific logo URL, use Image component
    if (serviceConfig.logoUrl) {
      return (
        <div className="w-5 h-5 relative">
          <Image
            src={serviceConfig.logoUrl}
            alt={serviceConfig.title}
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
      );
    }

    // Otherwise use the icon component
    const Icon = serviceConfig.Icon;
    return <Icon serviceid={serviceId} className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Thank you</h1>
      </div>

      <main className="flex-1 px-4 pb-32">
        {/* Main content card */}
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          {/* Subscription Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">True5G Postpaid</h2>
            <p className="text-lg font-semibold text-gray-900">{phoneNumber}</p>
          </div>

          {/* Auto-renew package details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-2">auto-renew package</p>
                <ul className="space-y-2">
                  {services.map(serviceId => {
                    const title = serviceDisplayConfig[serviceId]?.title;
                    const publicPrice = serviceDisplayConfig[serviceId]?.publicPrice;
                    
                    if (!title) return null;

                    return (
                      <li key={serviceId} className="flex items-center gap-2">
                        {renderServiceIcon(serviceId)}
                        <span className="text-sm text-gray-700">{title}</span>
                        <span className="text-sm text-gray-500 ml-auto">฿{publicPrice}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Order date */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mt-1">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Order date</p>
                <p className="text-sm text-gray-700">{orderDateString} {orderTime} GMT+7:00</p>
              </div>
            </div>

            {/* Total cost */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mt-1">
                <span className="text-yellow-600 font-bold text-lg">฿</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Total cost</p>
                <p className="text-sm text-gray-700">{bundlePrice.toFixed(2)} THB (Excl. VAT)</p>
              </div>
            </div>

            {/* Public price comparison */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                <span className="text-orange-600 font-bold text-lg">฿</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Public price (elsewhere)</p>
                <p className="text-sm text-gray-700 line-through">{totalPublicPrice.toFixed(2)} THB</p>
                <p className="text-sm text-green-600 font-semibold">You save ฿{savings.toFixed(2)}!</p>
              </div>
            </div>

            {/* Payment method */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                <Receipt className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Payment method</p>
                <p className="text-sm text-gray-700">True Bill</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Instructional message */}
        <div className="text-center mt-6 px-4">
          <p className="text-sm text-gray-600">
            The purchased package will be active after your received SMS.
          </p>
        </div>
      </main>

      {/* Bottom action button */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <Button 
            size="lg" 
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold rounded-xl"
            onClick={handleGoToSubscriptions}
          >
            Go to my subscriptions
          </Button>
          
          {/* Navigation indicator */}
          <div className="mt-2 flex justify-center">
            <div className="w-32 h-1 bg-black rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
