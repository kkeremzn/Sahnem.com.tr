import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CalendarDays, MapPin, PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { AdvertStatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import * as advertService from '@/services/advertService';
import { CITY_LABELS, type Advert, type AdvertStatus } from '@/types';
import { formatDate, formatPrice } from '@/lib/format';

const TABS: { key: 'all' | AdvertStatus; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'Open', label: 'Açık' },
  { key: 'Closed', label: 'Kapalı' },
  { key: 'Completed', label: 'Tamamlandı' },
  { key: 'Cancelled', label: 'İptal' },
];

export function MyAdverts() {
  const { user } = useAuth();
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [tab, setTab] = useState<'all' | AdvertStatus>('all');

  useEffect(() => {
    if (user) advertService.listAdvertsByCreator(user.id).then(setAdverts);
  }, [user]);

  const filtered = useMemo(() => {
    if (!adverts) return [];
    return tab === 'all' ? adverts : adverts.filter((a) => a.status === tab);
  }, [adverts, tab]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: adverts?.length ?? 0 };
    (['Open', 'Closed', 'Completed', 'Cancelled'] as AdvertStatus[]).forEach((s) => {
      c[s] = adverts?.filter((a) => a.status === s).length ?? 0;
    });
    return c;
  }, [adverts]);

  return (
    <div>
      <PageHeader
        title="İlanlarım"
        description="Yayınladığın ilanları ve gelen teklifleri yönet."
        action={<Link to="/post-advert"><Button icon={<PlusCircle size={15} />}>Yeni İlan</Button></Link>}
      />
      <Tabs items={TABS.map((t) => ({ ...t, count: counts[t.key] }))} active={tab} onChange={(k) => setTab(k as typeof tab)} className="mb-6" />

      {adverts === null ? (
        <div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Briefcase size={22} />} title="İlan bulunamadı" description="Yeni bir ilan yayınlayarak başvuru almaya başla." />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Link key={a.id} to={`/my-adverts/${a.id}`}>
              <Card hover className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-text">{a.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-faint">
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {CITY_LABELS[a.city]}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {formatDate(a.eventTime)}</span>
                    <span>{a.offerCount} teklif</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-base font-bold text-gold-soft">{formatPrice(a.budget)}</span>
                  <AdvertStatusBadge status={a.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
