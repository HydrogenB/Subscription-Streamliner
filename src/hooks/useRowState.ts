'use client';

import { useMemo } from 'react';
import type { ServiceId } from '@/lib/types';

const NETFLIX_PLANS: ServiceId[] = ['netflix-mobile', 'netflix-basic', 'netflix-standard', 'netflix-premium'];
const MAX_SELECTION_LIMIT = 4;

/**
 * A hook to compute the state of a service row in the selection list.
 *
 * @param serviceId - The ID of the service for the row.
 * @param selectedServices - The set of currently selected service IDs.
 * @returns An object with boolean states for the row.
 */
export function useRowState(serviceId: ServiceId, selectedServices: Set<ServiceId>) {
  const isNetflixConflict = useMemo((): boolean => {
    if (!NETFLIX_PLANS.includes(serviceId)) return false;
    const selectedNetflixPlan = NETFLIX_PLANS.find(plan => selectedServices.has(plan));
    return !!selectedNetflixPlan && selectedNetflixPlan !== serviceId;
  }, [serviceId, selectedServices]);

  const isMaxSelectionReached = useMemo((): boolean => {
    return selectedServices.size >= MAX_SELECTION_LIMIT && !selectedServices.has(serviceId);
  }, [serviceId, selectedServices]);

  const isDisabled = isNetflixConflict || isMaxSelectionReached;

  return {
    isNetflixConflict,
    isMaxSelectionReached,
    isDisabled,
  };
}
