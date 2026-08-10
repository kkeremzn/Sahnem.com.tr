import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'focus-ring w-full resize-y rounded-md border bg-deep px-3.5 py-2.5 text-sm text-text placeholder:text-text-faint transition-colors',
        invalid ? 'border-danger' : 'border-border hover:border-border-hover focus:border-gold',
        className,
      )}
      rows={4}
      {...props}
    />
  );
});
