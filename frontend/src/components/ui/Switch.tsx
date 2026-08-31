import { cn } from '@/lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-1">
      {(label || description) && (
        <span>
          {label && <span className="block text-sm font-medium text-text">{label}</span>}
          {description && <span className="block text-xs text-text-dim">{description}</span>}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'focus-ring relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-gold' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-[2px]',
          )}
        />
      </button>
    </label>
  );
}
