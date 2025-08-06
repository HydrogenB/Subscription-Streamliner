import type { ComponentType, SVGProps } from 'react';

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
}

export interface OfferGroup {
    id: string;
    packName: string;
    services: string[];
    fullPrice: number;
    sellingPrice: number;
    promotion?: string;
}

export type ServiceId = 
  | 'youtube' 
  | 'viu' 
  | 'netflix-mobile' 
  | 'iqiyi'
  | 'wetv'
  | 'oned'
  | 'trueplus'
  | 'trueidshort'
  | 'netflix-basic'
  | 'netflix-standard'
  | 'netflix-premium';
