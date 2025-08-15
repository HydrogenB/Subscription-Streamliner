'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps extends React.SVGProps<SVGSVGElement> {
  progress: number; // A value between 0 and 100
  strokeWidth?: number;
  text?: string;
}

const ProgressRing = React.forwardRef<SVGSVGElement, ProgressRingProps>(
  ({ className, progress, strokeWidth = 4, text, ...props }, ref) => {
    const radius = 50 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
      <svg
        ref={ref}
        className={cn('w-full h-full', className)}
        viewBox="0 0 100 100"
        {...props}
      >
        <circle
          className="text-gray-200 dark:text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
        {text && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            className="text-2xl font-bold text-gray-900 dark:text-gray-100"
          >
            {text}
          </text>
        )}
      </svg>
    );
  }
);

ProgressRing.displayName = 'ProgressRing';

export { ProgressRing };
