import type { OfferGroup, ServiceId, SubscriptionService } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface OfferCardProps {
  offer: OfferGroup;
  allServices: SubscriptionService[];
  onSelect: () => void;
}

export function OfferCard({ offer, allServices, onSelect }: OfferCardProps) {
  const savings = offer.fullPrice - offer.sellingPrice;

  const serviceDetails = offer.services.map(id => allServices.find(s => s.id === id)).filter(Boolean) as SubscriptionService[];

  return (
    <Card 
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl w-full h-full flex flex-col cursor-pointer transition-all hover:shadow-primary/20 hover:border-primary"
        onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
            <div className='flex items-center gap-2'>
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <CardTitle className="text-lg font-bold">{offer.id}</CardTitle>
            </div>
            <div className="flex items-center space-x-[-8px]">
                {serviceDetails.slice(0, 3).map(service => (
                    <div key={service.id} className="w-7 h-7 rounded-full bg-white flex items-center justify-center border-2 border-white">
                        <service.logo className="w-full h-full object-contain" />
                    </div>
                ))}
            </div>
        </div>
        <CardDescription className="text-sm">
            {serviceDetails.map(s => s.name).join(' + ')}
        </CardDescription>
        <p className="text-xs text-muted-foreground italic">"Unlock big savings!"</p>
      </CardHeader>
      
      <CardFooter className="mt-auto p-4 flex justify-between items-end bg-gray-50/50 dark:bg-gray-900/20 rounded-b-2xl">
        <div>
            {savings > 0 && (
                <span className="text-sm font-semibold text-green-600">
                    Save {savings.toFixed(0)} THB
                </span>
            )}
        </div>
        <div className="text-right">
            <p className="text-2xl font-bold text-primary">
                {offer.sellingPrice.toFixed(0)}
                <span className="text-base font-normal text-muted-foreground"> THB</span>
            </p>
        </div>
      </CardFooter>
    </Card>
  );
}
