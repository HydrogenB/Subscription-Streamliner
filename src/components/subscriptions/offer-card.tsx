import type { OfferGroup, SubscriptionService } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Tag } from 'lucide-react';
import { Separator } from '../ui/separator';

interface OfferCardProps {
  offer: OfferGroup;
  allServices: SubscriptionService[];
  highlight?: Set<string>;
}

export function OfferCard({ offer, allServices, highlight = new Set() }: OfferCardProps) {
  const savings = offer.fullPrice - offer.sellingPrice;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-xl">{offer.packName}</CardTitle>
                 <CardDescription>This bundle includes the following services:</CardDescription>
            </div>
            {offer.promotion && (
                 <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30 text-xs whitespace-nowrap">
                    <Tag className="w-3 h-3 mr-1" />
                    {offer.promotion}
                </Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {offer.services.map(serviceId => {
            const service = allServices.find(s => s.id === serviceId);
            if (!service) return null;
            return (
              <div key={serviceId} className={`flex items-center gap-2 p-2 rounded-md ${highlight.has(serviceId) ? 'bg-primary/10' : ''}`}>
                <service.logo className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-medium">{service.name}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 p-6 bg-primary/10 rounded-b-lg">
        <div className="w-full flex justify-between items-center">
            <span className="text-sm text-muted-foreground line-through">
                Original Price: THB {offer.fullPrice.toFixed(2)}
            </span>
            {savings > 0 && (
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                    You save THB {savings.toFixed(2)}!
                </Badge>
            )}
        </div>
        <div className="w-full flex justify-between items-baseline">
            <span className="text-lg font-semibold">Total Price:</span>
            <p className="text-3xl font-bold text-primary">
                THB {offer.sellingPrice.toFixed(2)}
                <span className="text-base font-normal text-muted-foreground">/month</span>
            </p>
        </div>
      </CardFooter>
    </Card>
  );
}