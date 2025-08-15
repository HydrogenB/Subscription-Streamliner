'use client';

import { useState, useEffect } from 'react';

const CACHE_PREFIX = 'promoCopyCache_';
const API_ENDPOINT = '/api/ai/promo-copy';
const TIMEOUT_MS = 2000;
const TIMEOUT_FALLBACK_COPY = 'Unlock big savings!';
const ERROR_FALLBACK_COPY = 'Unlock big savings!';

/**
 * A client-side hook to fetch and cache AI-generated promotional copy for a bundle.
 * Handles loading, caching, timeouts, and API errors.
 *
 * @param bundleId The ID of the bundle to fetch copy for.
 * @returns An object containing the copy and the loading state.
 */
export function usePromoCopy(bundleId: string): { copy: string; loading: boolean } {
  const [copy, setCopy] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!bundleId) {
      setLoading(false);
      return;
    }

    const cacheKey = `${CACHE_PREFIX}${bundleId}`;
    let isMounted = true;

    const fetchCopy = async () => {
      // 1. Check sessionStorage first
      try {
        const cachedCopy = sessionStorage.getItem(cacheKey);
        if (cachedCopy) {
          if (isMounted) {
            setCopy(cachedCopy);
            setLoading(false);
          }
          return;
        }
      } catch (e) {
        console.warn('Session storage is not available.', e);
      }

      // 2. Fetch from API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort('timeout');
      }, TIMEOUT_MS);

      try {
        const response = await fetch(`${API_ENDPOINT}?bundleId=${bundleId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // This will be caught by the catch block
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        const fetchedCopy = data.copy || ERROR_FALLBACK_COPY;

        if (isMounted) {
          setCopy(fetchedCopy);
          // 3. Cache the result
          try {
            sessionStorage.setItem(cacheKey, fetchedCopy);
          } catch (e) {
            console.warn('Could not write to session storage.', e);
          }
        }
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (isMounted) {
          if (error.name === 'AbortError' || error.message === 'timeout') {
            console.warn(`Promo copy request for '${bundleId}' timed out.`);
            setCopy(TIMEOUT_FALLBACK_COPY);
          } else {
            // Log to Sentry/other logging service here
            console.error(`Failed to fetch promo copy for '${bundleId}':`, error);
            setCopy(ERROR_FALLBACK_COPY);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCopy();

    return () => {
      isMounted = false;
    };
  }, [bundleId]);

  return { copy, loading };
}
