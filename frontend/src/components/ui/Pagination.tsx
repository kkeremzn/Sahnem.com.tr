import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-text-dim hover:bg-card disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            'focus-ring flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
            p === page ? 'bg-gold text-white' : 'text-text-dim hover:bg-card hover:text-text',
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="focus-ring flex h-9 w-9 items-center justify-center rounded-full text-text-dim hover:bg-card disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
