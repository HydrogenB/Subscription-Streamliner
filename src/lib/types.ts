import type { ComponentType, SVGProps } from 'react';

export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export interface SubscriptionService {
  id: string;
  name: string;
  logo: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
  plans: Plan[];
  addons: Addon[];
  promotion?: string;
}
