import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook that observes the intersection of a target element with its ancestor
 * @param elementRef - The ref of the element to observe
 * @param options - Intersection observer options
 * @returns Boolean indicating whether the target is intersecting
 */
function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: IntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const frozen = isIntersecting && freezeOnceVisible;
    if (frozen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, isIntersecting, freezeOnceVisible]);

  return isIntersecting;
}

export { useIntersectionObserver };
