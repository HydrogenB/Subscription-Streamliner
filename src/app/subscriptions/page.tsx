'use client';
import { useState, useMemo } from 'react';
import { subscriptionServices, offerGroups, type OfferGroup } from '@/lib/data';
import type { SubscriptionService } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Package, Tag, ArrowRight } from 'lucide-react';
import { OfferCard } from '@/components/subscriptions/offer-card';

export default function SubscriptionsPage() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(serviceId)) {
        newSelection.delete(serviceId);
      } else {
        newSelection.add(serviceId);
      }
      return newSelection;
    });
  };

  const matchedOffer = useMemo((): OfferGroup | null => {
    if (selectedServices.size === 0) return null;

    const selectedIds = Array.from(selectedServices);

    let bestMatch: OfferGroup | null = null;
    let maxMatchingServices = 0;

    for (const offer of offerGroups) {
      const offerServiceIds = new Set(offer.services);
      const matchingServices = selectedIds.filter(id => offerServiceIds.has(id));

      if (
        matchingServices.length === selectedIds.size && // All selected services are in the offer
        offerServiceIds.size >= selectedIds.size // The offer can contain more services, but not less
      ) {
        if (!bestMatch || offerServiceIds.size < new Set(bestMatch.services).size) {
          bestMatch = offer;
        }
      }
    }

    // A less-perfect match finding. If no perfect match found.
    if (!bestMatch) {
       for (const offer of offerGroups) {
         const offerServiceIds = new Set(offer.services);
         const matchingServices = selectedIds.filter(id => offerServiceIds.has(id));

         if (matchingServices.length > maxMatchingServices) {
           maxMatchingServices = matchingServices.length;
           bestMatch = offer;
         } else if (matchingServices.length === maxMatchingServices && bestMatch) {
            if (offer.sellingPrice < bestMatch.sellingPrice) {
                bestMatch = offer;
            }
         }
       }
    }


    return bestMatch;
  }, [selectedServices]);

  const totalIndividualPrice = useMemo(() => {
    return Array.from(selectedServices).reduce((total, serviceId) => {
      const service = subscriptionServices.find(s => s.id === serviceId);
      const plan = service?.plans[0];
      return total + (plan?.price || 0);
    }, 0);
  }, [selectedServices]);


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Build Your Own Bundle</h1>
        <p className="text-muted-foreground">Select the services you want and we'll find the best deal for you.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {subscriptionServices.map((service) => (
          <Label
            key={service.id}
            htmlFor={service.id}
            className={`relative flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
              selectedServices.has(service.id) ? 'border-primary shadow-lg scale-105' : 'border-border'
            }`}
          >
            <service.logo className="w-12 h-12 mb-2" />
            <span className="text-center text-xs font-medium">{service.name}</span>
            <Checkbox
              id={service.id}
              checked={selectedServices.has(service.id)}
              onCheckedChange={() => handleServiceToggle(service.id)}
              className="absolute top-2 right-2"
            />
          </Label>
        ))}
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold font-headline">Your Custom Package</h2>
        {selectedServices.size > 0 ? (
           <Card className="shadow-lg">
             <CardHeader>
               <CardTitle>Summary</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
              {matchedOffer ? (
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Best Deal Found: {matchedOffer.packName}
                  </h3>
                  <OfferCard offer={matchedOffer} allServices={subscriptionServices} highlight={selectedServices} />
                </div>
              ) : (
                 <div className="text-center py-8">
                  <p className="text-muted-foreground mb-2">No special bundle available for your selection.</p>
                  <p className="text-2xl font-bold">
                    Total: THB {totalIndividualPrice.toFixed(2)}
                    <span className="text-base font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
              )}
               <Button size="lg" className="w-full group">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                </Button>
             </CardContent>
           </Card>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Select services above to create your package.</p>
          </div>
        )}
      </div>

    </div>
  );
}