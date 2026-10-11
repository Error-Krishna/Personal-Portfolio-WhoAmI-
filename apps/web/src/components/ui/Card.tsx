import React, { type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils/cn.js';

export const Card = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl bg-[#131926]/80 border border-slate-800/80 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:border-slate-700/80',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
