import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  // Verilirse butonlar yerine gerçek <a href> (react-router Link) render
  // edilir — Google'ın kendi rehberi, JavaScript onClick'e bağlı sayfalama
  // linklerini takip edemeyeceğini açıkça belirtiyor; sayfa numarasını URL'e
  // yazan listeler (bkz. Jobs.tsx) bunu kullanmalı ki 2. ve sonraki sayfalar
  // da keşfedilebilsin.
  hrefFor?: (page: number) => string;
}

export function Pagination({ page, totalPages, onChange, hrefFor }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const itemClass = (active: boolean, disabled?: boolean) => cn(
    'focus-ring flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors',
    active ? 'bg-gold text-white' : 'text-text-dim hover:bg-card hover:text-text',
    disabled && 'pointer-events-none opacity-30',
  );

  function renderItem(p: number, content: React.ReactNode, active: boolean, disabled?: boolean) {
    if (hrefFor) {
      return (
        <Link key={`${p}-${content}`} to={hrefFor(p)} onClick={() => onChange(p)} aria-current={active ? 'page' : undefined} className={itemClass(active, disabled)}>
          {content}
        </Link>
      );
    }
    return (
      <button key={`${p}-${content}`} onClick={() => onChange(p)} disabled={disabled} className={itemClass(active, disabled)}>
        {content}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      {renderItem(page - 1, <ChevronLeft size={16} />, false, page === 1)}
      {pages.map((p) => renderItem(p, p, p === page))}
      {renderItem(page + 1, <ChevronRight size={16} />, false, page === totalPages)}
    </div>
  );
}
