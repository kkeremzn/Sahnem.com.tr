import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, leftIcon, className, ...props },
  ref,
) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint">
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          'focus-ring h-11 w-full rounded-md border bg-deep px-3.5 text-sm text-text placeholder:text-text-faint transition-colors',
          invalid ? 'border-danger' : 'border-border hover:border-border-hover focus:border-gold',
          leftIcon && 'pl-10',
          className,
        )}
        {...props}
      />
    </div>
  );
});
