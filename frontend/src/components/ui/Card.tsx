import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-card p-5',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-glow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
