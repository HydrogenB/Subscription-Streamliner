import { useMemo } from 'react';
import type { SubscriptionService, OfferGroup, ServiceId } from '@/lib/types';

const NETFLIX_PLANS: ServiceId[] = ['netflix-mobile', 'netflix-basic', 'netflix-standard', 'netflix-premium'];
const MAX_BUNDLE_SIZE = 4;

export interface Promo extends OfferGroup {
  savings: number;
  name: string;
}

/**
 * A hook to compute the top promotional bundles based on savings.
 * 
 * @param services - The list of all available subscription services.
 * @param offers - The list of all available offer groups.
 * @param maxPromos - The maximum number of promotional bundles to return.
 * @returns An array of the top promotional bundles.
 */
export function usePromoBundles(
  services: SubscriptionService[],
  offers: OfferGroup[],
  maxPromos = 5
): Promo[] {
  return useMemo(() => {
    const promos: Promo[] = offers
      .map(offer => ({
        ...offer,
        name: offer.id, // The 'id' from data is the human-readable name
        savings: offer.fullPrice - offer.sellingPrice,
      }))
      .filter(promo => {
        // 1. Filter out bundles that are not actual savings
        if (promo.savings <= 0) {
          return false;
        }

        // 2. Filter bundles with more than MAX_BUNDLE_SIZE services
        if (promo.services.length > MAX_BUNDLE_SIZE) {
          return false;
        }

        // 3. Filter bundles with more than one Netflix plan
        const netflixPlansInBundle = promo.services.filter(serviceId => 
          NETFLIX_PLANS.includes(serviceId as ServiceId)
        );
        if (netflixPlansInBundle.length > 1) {
          return false;
        }

        return true;
      });

    // Sort promos: 1st by savings (desc), 2nd by selling price (asc)
    promos.sort((a, b) => {
      if (b.savings !== a.savings) {
        return b.savings - a.savings;
      }
      return a.sellingPrice - b.sellingPrice;
    });

    // Return the top N promos
    return promos.slice(0, maxPromos);
  }, [services, offers, maxPromos]);
}
