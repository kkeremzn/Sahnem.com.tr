import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { AdvertStatusBadge } from '@/components/ui/StatusBadge';
import * as adminService from '@/services/adminService';
import type { Advert } from '@/types';
import { formatDateTime, formatPrice } from '@/lib/format';

const PAGE_SIZE = 20;

export function AdminAdverts() {
  const navigate = useNavigate();
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  function load() {
    setAdverts(null);
    adminService.listAllAdverts(page, PAGE_SIZE, search || undefined).then((res) => {
      setAdverts(res.items);
      setTotalPages(Math.max(1, res.totalPages));
    });
  }

  useEffect(() => { load(); }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text">İlanlar</h1>

      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2.5">
        <Input placeholder="İlan başlığı veya açıklamasında ara..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="max-w-sm" />
        <Button type="submit" variant="secondary">Ara</Button>
      </form>

      {adverts === null ? (
        <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
      ) : adverts.length === 0 ? (
        <EmptyState icon={<Megaphone size={22} />} title="İlan bulunamadı" description="Filtreleri değiştirip tekrar dene." />
      ) : (
        <>
          <div className="space-y-2">
            {adverts.map((a) => (
              <Card key={a.id} hover className="flex cursor-pointer flex-wrap items-center justify-between gap-3" onClick={() => navigate(`/backstage/adverts/${a.id}`)}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-text">{a.title}</p>
                    <AdvertStatusBadge status={a.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-text-faint">
                    {a.creatorName} · {formatPrice(a.budget)} · {a.offerCount} teklif · {formatDateTime(a.createdDate)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-6"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
        </>
      )}
    </div>
  );
}
