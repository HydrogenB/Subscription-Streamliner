'use client';

import { useMemo } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ProgressRing } from '@/components/ui/progress-ring';

const MAX_SELECTION_LIMIT = 4;

export interface OneTapPaySheetProps {
  selectionCount: number;
  subtotal: number;
  savings: number;
  total: number;
  onNext: () => void;
  isDiscountEngineDown?: boolean;
}

export default function OneTapPaySheet({ 
  selectionCount, 
  subtotal, 
  savings, 
  total, 
  onNext, 
  isDiscountEngineDown = false 
}: OneTapPaySheetProps) {
  const isVisible = selectionCount > 0;
  const isCtaDisabled = selectionCount === 0;
  const atCapacity = selectionCount === MAX_SELECTION_LIMIT;

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

  const progressColor = atCapacity ? 'stroke-red-500' : 'stroke-green-500';
  const ctaLabel = total === 0 && selectionCount > 0 ? 'Activate' : 'Next';

  const containerAnimation = useSpring({
    transform: isVisible ? 'translateY(0%)' : 'translateY(100%)',
    opacity: isVisible ? 1 : 0,
    config: { tension: 280, friction: 30 },
    immediate: prefersReducedMotion,
  });

  return (
    <animated.div 
      style={containerAnimation}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      aria-live="polite"
    >
      <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center gap-4">
        {/* Left Zone: Progress & Savings */}
        <div className="col-span-1 flex items-center gap-4">
          <ProgressRing 
            progress={(selectionCount / MAX_SELECTION_LIMIT) * 100} 
            strokeWidth={5}
            className={cn('w-14 h-14 transition-colors', progressColor)}
            animate={!prefersReducedMotion}
          >
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {selectionCount}
            </span>
            <span className="text-sm text-gray-500">/{MAX_SELECTION_LIMIT}</span>
          </ProgressRing>

          {isDiscountEngineDown ? (
            <span className="text-sm text-gray-400">No discounts available</span>
          ) : savings > 0 && (
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-green-600 dark:text-green-400 font-semibold text-center cursor-help">
                    <p className="text-sm">Save</p>
                    <animated.p className="text-lg">
                      {animatedSavings.to(s => `${s.toFixed(2)} THB`)}
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

        {/* Middle Zone: Mini Receipt */}
        <div className="col-span-1 flex flex-col items-center text-sm text-gray-600 dark:text-gray-400">
          {savings > 0 && (
            <p className="line-through">Subtotal: {subtotal.toFixed(2)}</p>
          )}
          {savings > 0 && (
            <p className="text-green-600 dark:text-green-400">Discount: -{savings.toFixed(2)}</p>
          )}
          <p className="text-base font-bold text-gray-900 dark:text-gray-100 mt-1">Total: {total.toFixed(2)} THB</p>
        </div>

        {/* Right Zone: CTA */}
        <div className="col-span-1 flex justify-end">
          <Button 
            size="lg"
            onClick={onNext}
            disabled={isCtaDisabled}
            className={cn(
              'w-48 h-12 text-lg',
              {
                'opacity-40 bg-gray-300 dark:bg-gray-600 cursor-not-allowed': isCtaDisabled,
                'animate-pulse': !isCtaDisabled && !atCapacity && !prefersReducedMotion,
                'animate-wiggle': atCapacity && !prefersReducedMotion,
              }
            )}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </animated.div>
  );
}
