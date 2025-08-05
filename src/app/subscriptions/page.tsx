'use client';
import { useState } from 'react';
import type { SubscriptionService, Plan, Addon } from '@/lib/types';
import { subscriptionServices } from '@/lib/data';
import { SubscriptionCard } from '@/components/subscriptions/subscription-card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

export default function SubscriptionsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SubscriptionService | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleCustomizeClick = (service: SubscriptionService) => {
    setSelectedService(service);
    const defaultPlan = service.plans[0];
    setSelectedPlan(defaultPlan);
    setSelectedAddons([]);
    setTotalPrice(defaultPlan?.price || 0);
    setIsSheetOpen(true);
  };

  const handlePlanChange = (planId: string) => {
    const plan = selectedService?.plans.find(p => p.id === planId);
    if (plan) {
      setSelectedPlan(plan);
      const addonPrice = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
      setTotalPrice(plan.price + addonPrice);
    }
  };

  const handleAddonToggle = (addon: Addon) => {
    const isSelected = selectedAddons.some(a => a.id === addon.id);
    let newAddons: Addon[];
    if (isSelected) {
      newAddons = selectedAddons.filter(a => a.id !== addon.id);
    } else {
      newAddons = [...selectedAddons, addon];
    }
    setSelectedAddons(newAddons);
    const addonPrice = newAddons.reduce((sum, a) => sum + a.price, 0);
    setTotalPrice((selectedPlan?.price || 0) + addonPrice);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Explore Subscriptions</h1>
        <p className="text-muted-foreground">Find and customize the perfect plans for you.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionServices.map((service) => (
          <SubscriptionCard key={service.id} service={service} onCustomizeClick={handleCustomizeClick} />
        ))}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
          {selectedService && (
            <>
              <SheetHeader className="p-6">
                <SheetTitle className="text-2xl font-headline">Customize {selectedService.name}</SheetTitle>
                <SheetDescription>
                  Tailor your plan to your needs. Your changes will be reflected in the total price.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto px-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Choose a Base Plan</h3>
                  <RadioGroup value={selectedPlan?.id} onValueChange={handlePlanChange}>
                    {selectedService.plans.map(plan => (
                      <Label key={plan.id} htmlFor={plan.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[[data-state=checked]]:border-primary">
                        <div className="space-y-1">
                          <span className="font-semibold">{plan.name}</span>
                          <span className="text-sm text-muted-foreground">${plan.price.toFixed(2)}/month</span>
                        </div>
                        <RadioGroupItem value={plan.id} id={plan.id} />
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                {selectedService.addons.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Available Add-ons</h3>
                    <div className="space-y-4">
                      {selectedService.addons.map(addon => (
                        <div key={addon.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <Label htmlFor={addon.id} className="font-semibold cursor-pointer">{addon.name}</Label>
                            <p className="text-sm text-muted-foreground">{addon.description}</p>
                            <p className="text-sm font-medium text-primary">+${addon.price.toFixed(2)}/month</p>
                          </div>
                          <Checkbox
                            id={addon.id}
                            checked={selectedAddons.some(a => a.id === addon.id)}
                            onCheckedChange={() => handleAddonToggle(addon)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <SheetFooter className="p-6 mt-auto bg-card border-t">
                <div className="w-full space-y-4">
                  <Separator />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}<span className="text-base font-normal text-muted-foreground">/month</span></span>
                  </div>
                  <Button size="lg" className="w-full">Add to Cart</Button>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
