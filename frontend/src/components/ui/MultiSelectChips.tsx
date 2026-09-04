import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
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
  placeholder?: string;
}

// Branş/tür/şehir gibi "listeden birden fazla seç" alanları için — eskiden
// tüm seçenekler tek seferde büyük bir buton duvarı olarak basılıyordu (36
// tür, 81 şehir gibi listelerde acemice görünüyordu). Artık arama kutusuna
// yazıp filtreleyerek eklenen, LinkedIn/GitHub tarzı bir "seçili etiketler +
// arama açılır listesi" deseni kullanıyor.
export function MultiSelectChips<T extends string>({ options, selected, onChange, max, placeholder = 'Ara ve ekle...' }: MultiSelectChipsProps<T>) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const atLimit = max !== undefined && selected.length >= max;

  const selectedOptions = useMemo(
    () => selected.map((v) => options.find((o) => o.value === v)).filter((o): o is Option<T> => !!o),
    [selected, options],
  );

  const matches = useMemo(() => {
    if (atLimit) return [];
    const q = query.trim().toLocaleLowerCase('tr');
    // Sorgu boşken de TÜM seçenekler gösterilir (önceden ilk 8'e kesiliyordu —
    // kullanıcı arama yapmadan listeye baktığında bazı seçenekler (ör. "Tulum")
    // hiç yokmuş gibi görünüyordu). Açılır liste zaten kaydırılabilir.
    return options
      .filter((o) => !selected.includes(o.value))
      .filter((o) => !q || o.label.toLocaleLowerCase('tr').includes(q));
  }, [options, selected, query, atLimit]);

  function add(value: T) {
    if (atLimit || selected.includes(value)) return;
    onChange([...selected, value]);
    setQuery('');
    inputRef.current?.focus();
  }

  function remove(value: T) {
    onChange(selected.filter((v) => v !== value));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matches[0]) add(matches[0].value);
    } else if (e.key === 'Backspace' && !query && selected.length > 0) {
      remove(selected[selected.length - 1]);
    }
  }

  return (
    <div>
      {selectedOptions.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedOptions.map((opt) => (
            <span key={opt.value} className="inline-flex items-center gap-1 rounded-full border border-gold bg-gold/10 py-1 pl-3 pr-1.5 text-xs font-medium text-gold-soft">
              {opt.label}
              <button type="button" onClick={() => remove(opt.value)} className="focus-ring flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-gold/20">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={handleKeyDown}
          disabled={atLimit}
          placeholder={atLimit ? 'Limite ulaşıldı' : placeholder}
          className="focus-ring h-10 w-full rounded-md border border-border bg-deep pl-9 pr-3 text-sm text-text placeholder:text-text-faint disabled:opacity-50"
        />
        {open && matches.length > 0 && (
          <div className="absolute z-10 mt-1.5 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-card shadow-card">
            {matches.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(opt.value)}
                className={cn(
                  'flex w-full cursor-pointer items-center px-3.5 py-2 text-left text-sm text-text-dim hover:bg-card-hover hover:text-text',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {max !== undefined && (
        <p className="mt-1.5 text-[11px] text-text-faint">{selected.length}/{max} seçildi</p>
      )}
    </div>
  );
}
