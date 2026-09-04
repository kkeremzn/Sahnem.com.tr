import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface MultiSelectChipsProps<T extends string> {
  options: Option<T>[];
  selected: T[];
  onChange: (values: T[]) => void;
  max?: number;
}

// Branş/tür/şehir gibi "listeden birden fazla seç" alanları için — seçili
// olmayanlara tıklayınca eklenir, seçili olana tıklayınca çıkarılır. max
// verilirse limit dolunca seçili olmayan chip'ler devre dışı kalır.
export function MultiSelectChips<T extends string>({ options, selected, onChange, max }: MultiSelectChipsProps<T>) {
  const atLimit = max !== undefined && selected.length >= max;

  function toggle(value: T) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (!atLimit) {
      onChange([...selected, value]);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          const disabled = !isSelected && atLimit;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => toggle(opt.value)}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isSelected
                  ? 'border-gold bg-gold/10 text-gold-soft'
                  : disabled
                    ? 'cursor-not-allowed border-border text-text-faint opacity-40'
                    : 'border-border text-text-dim hover:border-border-hover hover:text-text',
              )}
            >
              {isSelected && <Check size={11} />}
              {opt.label}
            </button>
          );
        })}
      </div>
      {max !== undefined && (
        <p className="mt-1.5 text-[11px] text-text-faint">{selected.length}/{max} seçildi</p>
      )}
    </div>
  );
}
