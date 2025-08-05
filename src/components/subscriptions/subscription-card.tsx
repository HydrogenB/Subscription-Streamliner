import type { SubscriptionService } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Tag } from 'lucide-react';

interface SubscriptionCardProps {
  service: SubscriptionService;
  onCustomizeClick: (service: SubscriptionService) => void;
}

export function SubscriptionCard({ service, onCustomizeClick }: SubscriptionCardProps) {
  const { name, logo: Logo, description, plans, promotion } = service;

  return (
    <Card className="flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <CardHeader className="flex-row gap-4 items-center">
        <Logo className="w-12 h-12" />
        <div>
          <CardTitle className="font-headline">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {promotion && (
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">
            <Tag className="w-4 h-4 mr-2" />
            {promotion}
          </Badge>
        )}
        <div className="text-muted-foreground">
          <span className="text-sm">Plans from </span>
          <span className="text-2xl font-bold text-foreground">${Math.min(...plans.map(p => p.price)).toFixed(2)}</span>
          <span className="text-sm">/month</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onCustomizeClick(service)} className="w-full group">
          Customize Plan
          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}
