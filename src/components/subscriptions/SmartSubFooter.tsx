'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { trackDiscountUnlocked, trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Trash2, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';

// Using a simpler swipe implementation to avoid type issues
const SwipeableItem = ({ 
  children, 
  onSwipeLeft,
  serviceId
}: { 
  children: React.ReactNode; 
  onSwipeLeft: (id: ServiceId) => void;
  serviceId: ServiceId;
}) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    // Only allow swiping left
    if (diff > 0) {
      setOffsetX(-Math.min(diff, 100)); // Max swipe distance of 100px
    }
  };

  const handleTouchEnd = () => {
    if (offsetX < -60) { // Threshold for swipe action
      onSwipeLeft(serviceId);
    }
    setIsSwiping(false);
    setOffsetX(0);
  };

  return (
    <div 
      ref={itemRef}
      className="relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="transition-transform duration-300"
        style={{ transform: `translateX(${offsetX}px)` }}
      >
        {children}
      </div>
      <div 
        className="absolute top-0 right-0 h-full flex items-center justify-end pr-4 bg-red-500 text-white"
        style={{ width: '100px', transform: `translateX(${offsetX < 0 ? '100%' : '0'})` }}
      >
        <Trash2 size={20} />
        <span className="ml-2">Remove</span>
      </div>
    </div>
  );
};

const MAX_SELECTION_LIMIT = 4;

// Types
import type { ServiceId } from '@/lib/types';

interface SmartSubFooterProps {
  selectionCount: number;
  subtotal: number;
  savings: number;
  total: number;
  onNext: () => void;
  selectedServices: Set<ServiceId>;
  onRemoveService?: (serviceId: ServiceId) => void;
  isDiscountEngineDown?: boolean;
  nextBillingDate?: Date;
  locale?: string;
  currency?: string;
}

// Format currency based on locale
export const formatCurrency = (value: number, locale = 'th-TH', currency = 'THB') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Calculate days until next billing
export const getDaysUntilBilling = (nextBillingDate?: Date) => {
  if (!nextBillingDate) return null;
  const today = new Date();
  const diffTime = nextBillingDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function SmartSubFooter({ 
  selectionCount, 
  subtotal, 
  savings, 
  total, 
  onNext, 
  selectedServices,
  onRemoveService,
  isDiscountEngineDown = false,
  nextBillingDate,
  locale = 'th-TH',
  currency = 'THB'
}: SmartSubFooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasShownDiscount, setHasShownDiscount] = useState(false);
  const countdownRef = useRef<HTMLDivElement>(null);
  const [isCountdownInView, setIsCountdownInView] = useState(false);
  
  // Simple intersection observer implementation
  useEffect(() => {
    const element = countdownRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCountdownInView(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -50% 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Track discount unlock for analytics and haptic feedback
  useEffect(() => {
    if (savings > 0 && !hasShownDiscount && typeof window !== 'undefined') {
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate([10, 30, 10]);
      }
      setHasShownDiscount(true);
      
      // Track discount unlocked event
      trackDiscountUnlocked(savings, 'dynamic_bundle');
    }
  }, [savings, hasShownDiscount]);

  // Track countdown view for analytics
  useEffect(() => {
    if (isCountdownInView && nextBillingDate) {
      const daysLeft = getDaysUntilBilling(nextBillingDate);
      if (daysLeft !== null) {
        trackEvent('countdown_view', {
          daysLeft,
          event_label: 'billing_countdown_viewed',
        });
      }
    }
  }, [isCountdownInView, nextBillingDate]);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track footer expand for analytics
  const handleToggleExpand = useCallback(() => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    if (newExpandedState) {
      trackEvent('footer_expand', {
        selectionCount,
        subtotal,
        event_label: 'footer_expanded',
      });
    }
  }, [isExpanded, selectionCount, subtotal]);

  // Handle service removal with analytics
  const handleRemoveService = useCallback((serviceId: string) => {
    // Convert string to ServiceId type
    const validServiceId = serviceId as ServiceId;
    if (onRemoveService) {
      onRemoveService(validServiceId);
      
      trackEvent('service_swipe_remove', {
        serviceId: validServiceId,
        event_label: 'service_removed',
      });
    }
  }, [onRemoveService]);

  // Animation configs
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const { animatedSavings } = useSpring({
    from: { animatedSavings: 0 },
    to: { animatedSavings: savings },
    config: { duration: 800 },
    reset: true,
    immediate: prefersReducedMotion,
  });

  const progressColor = selectionCount === MAX_SELECTION_LIMIT ? 'stroke-red-500' : 'stroke-green-500';
  const ctaLabel = total === 0 && selectionCount > 0 ? 'Activate' : 'Next';
  const daysUntilBilling = nextBillingDate ? getDaysUntilBilling(nextBillingDate) : null;
  const formattedBillingDate = nextBillingDate?.toLocaleDateString(locale, { 
    day: 'numeric', 
    month: 'short',
    year: '2-digit' 
  });

  // Animation for the main container
  const containerAnimation = useSpring({
    transform: selectionCount > 0 ? 'translateY(0%)' : 'translateY(100%)',
    opacity: selectionCount > 0 ? 1 : 0,
    config: { tension: 280, friction: 30 },
    immediate: prefersReducedMotion,
  });

  // Animation for the expanded content
  const expandAnimation = useSpring({
    height: isExpanded ? 'auto' : '0px',
    opacity: isExpanded ? 1 : 0,
    config: { tension: 300, friction: 30 },
    immediate: prefersReducedMotion,
  });

  return (
    <>
      {/* Main Footer */}
      <animated.div 
        style={containerAnimation}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 border-t',
          'bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
          'dark:bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))]',
          'from-10% via-30% to-90%',
          'border-gray-200 dark:border-gray-700',
          'shadow-[0_-4px_20px_rgba(0,0,0,0.08)]',
          'pb-[env(safe-area-inset-bottom,0)]'
        )}
        aria-live="polite"
      >
        {/* Progress Trail */}
        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
          <div 
            className={cn(
              'h-full transition-all duration-300',
              progressColor.replace('stroke-', 'bg-')
            )} 
            style={{ width: `${(selectionCount / MAX_SELECTION_LIMIT) * 100}%` }}
          />
        </div>

        <div className="container mx-auto px-4 py-3">
          {/* Collapsed View */}
          <div className="grid grid-cols-3 items-center gap-4">
            {/* Left: Progress & Savings */}
            <div className="col-span-1 flex items-center gap-4">
              <div className="relative w-14 h-14">
                <ProgressRing 
                  progress={(selectionCount / MAX_SELECTION_LIMIT) * 100} 
                  strokeWidth={5}
                  className={cn('w-full h-full transition-colors', progressColor)}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {selectionCount}
                  </span>
                  <span className="text-xs text-gray-500">/{MAX_SELECTION_LIMIT}</span>
                </div>
              </div>
              {isDiscountEngineDown ? (
                <span className="text-sm text-gray-400">No discounts available</span>
              ) : savings > 0 && (
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-green-600 dark:text-green-400 font-semibold text-center cursor-help">
                        <p className="text-sm">Save</p>
                        <animated.p className="text-lg">
                          {animatedSavings.to(s => formatCurrency(s, locale, currency))}
                        </animated.p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Compared to paying for each service individually.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Middle: Total */}
            <div className="col-span-1 flex flex-col items-center">
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(total, locale, currency)}
              </p>
              <button 
                onClick={handleToggleExpand}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1 mt-1"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                {isExpanded ? (
                  <>
                    Hide details <ChevronDown size={14} />
                  </>
                ) : (
                  <>
                    Show details <ChevronUp size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Right: CTA */}
            <div className="col-span-1 flex justify-end">
              <Button 
                size="lg"
                onClick={onNext}
                disabled={selectionCount === 0}
                className={cn(
                  'w-full max-w-48 h-12 text-lg',
                  {
                    'opacity-40 bg-gray-300 dark:bg-gray-600 cursor-not-allowed': selectionCount === 0,
                    'animate-pulse': selectionCount > 0 && selectionCount < MAX_SELECTION_LIMIT && !prefersReducedMotion,
                    'animate-wiggle': selectionCount === MAX_SELECTION_LIMIT && !prefersReducedMotion,
                  }
                )}
              >
                {ctaLabel}
              </Button>
            </div>
          </div>

          {/* Expanded View */}
          <animated.div 
            style={expandAnimation}
            className="overflow-hidden"
            aria-hidden={!isExpanded}
          >
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              {/* Offline Banner */}
              {!isOnline && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-2 rounded-md flex items-center gap-2 mb-3 text-sm">
                  <AlertCircle size={16} />
                  <span>Offline – totals may be outdated</span>
                </div>
              )}

              {/* Selected Services */}
              {selectedServices.size > 0 && onRemoveService && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Selected Services</h4>
                  <div className="space-y-2">
              {Array.from(selectedServices).map((serviceId) => (
                <SwipeableItem 
                  key={serviceId}
                  serviceId={serviceId}
                  onSwipeLeft={handleRemoveService}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {serviceId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {formatCurrency(100, locale, currency)} {/* Placeholder price */}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwipeableItem>
              ))}
            </div>
                </div>
              )}

              {/* Receipt */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  {savings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {formatCurrency(subtotal, locale, currency)}
                      </span>
                    </div>
                  )}
                  
                  {savings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-600 dark:text-green-400">Discount</span>
                      <span className="text-green-600 dark:text-green-400">
                        -{formatCurrency(savings, locale, currency)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-lg">
                      {formatCurrency(total, locale, currency)}
                    </span>
                  </div>

                  {/* Next Billing Countdown */}
                  {daysUntilBilling !== null && (
                    <div 
                      ref={countdownRef}
                      className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-1.5"
                    >
                      <span>🕒</span>
                      <span>
                        Renews in {daysUntilBilling} {daysUntilBilling === 1 ? 'day' : 'days'} ({formattedBillingDate})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </animated.div>
        </div>
      </animated.div>

      {/* Safe area spacer */}
      <div 
        className="transition-all duration-300"
        style={{
          height: selectionCount > 0 
            ? isExpanded 
              ? '280px' 
              : '80px' 
            : '0px'
        }}
      />
    </>
  );
}
