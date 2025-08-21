'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { subscriptionServices } from '@/lib/data';
import type { ServiceId } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { NetflixIcon } from '@/components/icons/netflix-icon';
import { YouTubeIcon } from '@/components/icons/youtube-icon';
import { ViuIcon } from '@/components/icons/viu-icon';
import { IQIYIIcon } from '@/components/icons/iqiyi-icon';
import { WeTVIcon } from '@/components/icons/wetv-icon';
import { OneDIcon } from '@/components/icons/oned-icon';
import { TrueIDIcon } from '@/components/icons/trueid-icon';

const serviceDisplayConfig: Record<ServiceId, { 
  Icon: React.ElementType; 
  title: string; 
  activationUrl: string;
  description: string;
}> = {
  youtube: { 
    Icon: YouTubeIcon, 
    title: 'Youtube Premium', 
    activationUrl: 'https://www.youtube.com/premium',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  viu: { 
    Icon: ViuIcon, 
    title: 'VIU', 
    activationUrl: 'https://www.viu.com',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  'netflix-mobile': { 
    Icon: NetflixIcon, 
    title: 'Netflix Mobile', 
    activationUrl: 'https://www.netflix.com',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  iqiyi: { 
    Icon: IQIYIIcon, 
    title: 'iQIYI VIP Standard', 
    activationUrl: 'https://www.iq.com',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  wetv: { 
    Icon: WeTVIcon, 
    title: 'WeTV', 
    activationUrl: 'https://wetv.vip',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  oned: { 
    Icon: OneDIcon, 
    title: 'oneD', 
    activationUrl: 'https://www.oned.net',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  trueplus: { 
    Icon: TrueIDIcon, 
    title: 'True Plus', 
    activationUrl: 'https://trueid.net',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  trueidshort: { 
    Icon: TrueIDIcon, 
    title: 'True ID Short', 
    activationUrl: 'https://trueid.net',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  'netflix-basic': { 
    Icon: NetflixIcon, 
    title: 'Netflix Basic', 
    activationUrl: 'https://www.netflix.com',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  'netflix-standard': { 
    Icon: NetflixIcon, 
    title: 'Netflix Standard', 
    activationUrl: 'https://www.netflix.com',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
  'netflix-premium': { 
    Icon: NetflixIcon, 
    title: 'Netflix Premium', 
    activationUrl: 'https://www.netflix.com',
    description: 'กรุณา Activate เพื่อเริ่มใช้งาน'
  },
};

export default function ActivationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bundleParam = searchParams.get('bundle');
  const orderId = searchParams.get('orderId');

  const selectedServices = useMemo(() => {
    if (bundleParam) {
      return bundleParam.split(',').filter(Boolean) as ServiceId[];
    }
    // Default services for demo purposes
    return ['youtube', 'viu', 'netflix-mobile', 'iqiyi'];
  }, [bundleParam]);

  const handleGoActivate = (serviceId: ServiceId) => {
    const serviceConfig = serviceDisplayConfig[serviceId];
    if (serviceConfig?.activationUrl) {
      window.open(serviceConfig.activationUrl, '_blank');
    }
  };

  const handleMarkAsActivated = (serviceId: ServiceId) => {
    // In a real app, this would update the service status
    // For now, we'll just show a visual feedback
    console.log(`Marked ${serviceId} as activated`);
  };

  const handleGoToSubscriptions = () => {
    router.push('/subhub/subscriptions');
  };

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
        <h1 className="text-lg font-semibold text-gray-900 ml-2">My subscriptions</h1>
      </div>

      <main className="flex-grow overflow-y-auto pb-6">
        <div className="p-4 space-y-6">
          
          {/* Subscription Bill Summary Card */}
          <Card className="bg-white rounded-xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Subscription bill</CardTitle>
              <p className="text-sm text-gray-600">Total for this billing cycle</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-bold text-red-600">379 THB</p>
                  <p className="text-sm text-gray-500 line-through">887 THB</p>
                </div>
              </div>
              
              {/* Savings Banner */}
              <div className="bg-gradient-to-r from-red-500 to-purple-500 rounded-lg p-4 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">🎉</span>
                </div>
                <p className="font-bold text-base">Yay, you've saved 438 THB!</p>
              </div>
            </CardContent>
          </Card>

          {/* My Subscriptions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">My subscriptions</h2>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Subscription plan</h3>
              
              {/* Service Cards */}
              {selectedServices.map((serviceId) => {
                const serviceConfig = serviceDisplayConfig[serviceId];
                if (!serviceConfig) return null;

                const Icon = serviceConfig.Icon;
                
                return (
                  <Card key={serviceId} className="bg-white rounded-xl shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Service Icon */}
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Icon serviceid={serviceId} className="w-12 h-12" />
                        </div>
                        
                        {/* Service Details */}
                        <div className="flex-grow">
                          <h4 className="font-bold text-base text-gray-900 mb-1">
                            {serviceConfig.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {serviceConfig.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleGoActivate(serviceId)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Go activate
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => handleMarkAsActivated(serviceId)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as activated
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 z-10 w-full max-w-md mx-auto p-4 bg-white border-t border-gray-200">
        <Button 
          onClick={handleGoToSubscriptions}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full h-12 text-base font-bold"
        >
          View All Subscriptions
        </Button>
      </div>
    </div>
  );
}
