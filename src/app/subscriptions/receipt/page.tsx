
'use client';

import { Suspense } from 'react';
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

function ReceiptContent() {
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
        {/* Receipt Card */}
        <Card className="mb-6">
          <div className="p-6">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Receipt className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Confirmed</h2>
                  <p className="text-sm text-gray-600">Order #{orderId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-900">{orderDateString}</p>
                <p className="text-sm text-gray-500">{orderTime}</p>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-gray-900">Services Ordered</h3>
              {services.map((serviceId) => {
                const serviceConfig = serviceDisplayConfig[serviceId];
                if (!serviceConfig) return null;

                return (
                  <div key={serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {renderServiceIcon(serviceId)}
                      <span className="font-medium text-gray-900">{serviceConfig.title}</span>
                    </div>
                    <span className="text-gray-600">{serviceConfig.publicPrice} THB</span>
                  </div>
                );
              })}
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Public Price Total:</span>
                <span className="text-gray-900">{totalPublicPrice} THB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bundle Price:</span>
                <span className="text-green-600 font-semibold">{bundlePrice} THB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">You Saved:</span>
                <span className="text-green-600 font-semibold">{savings} THB</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{phoneNumber}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">Next billing: {new Date(orderDate.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-3">
                <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                <span>Your services will be activated within 24 hours</span>
              </div>
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                <span>Payment will be processed on your next billing cycle</span>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                <span>You can manage your subscriptions anytime</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <div className="mt-6 space-y-3">
          <Button 
            onClick={handleGoToSubscriptions}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
          >
            View My Subscriptions
          </Button>
          
          <Button 
            onClick={() => {
              const bundleQuery = bundleParam ? `?bundle=${bundleParam}` : '';
              router.push(`/subscriptions/activation${bundleQuery}`);
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
          >
            Activate Services
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Thank you</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading receipt...</p>
          </div>
        </div>
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}
