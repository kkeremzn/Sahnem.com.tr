import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ListChecks } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { OfferStatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import * as offerService from '@/services/offerService';
import type { Offer, OfferStatus } from '@/types';
import { formatDate, formatPrice } from '@/lib/format';

const TABS: { key: 'all' | OfferStatus; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'Pending', label: 'Bekleyen' },
  { key: 'Accepted', label: 'Kabul edilen' },
  { key: 'Rejected', label: 'Reddedilen' },
];

export function Offers() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [tab, setTab] = useState<'all' | OfferStatus>('all');

  useEffect(() => {
    if (user) offerService.listMyOffers().then(setOffers);
  }, [user]);

  const filtered = useMemo(() => {
    if (!offers) return [];
    return tab === 'all' ? offers : offers.filter((o) => o.offerStatus === tab);
  }, [offers, tab]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: offers?.length ?? 0 };
    (['Pending', 'Accepted', 'Rejected'] as OfferStatus[]).forEach((s) => {
      c[s] = offers?.filter((o) => o.offerStatus === s).length ?? 0;
    });
    return c;
  }, [offers]);

  return (
    <div>
      <PageHeader title="Tekliflerim" description="Gönderdiğin tekliflerin durumunu takip et." />
      <Tabs items={TABS.map((t) => ({ ...t, count: counts[t.key] }))} active={tab} onChange={(k) => setTab(k as typeof tab)} className="mb-6" />

      {offers === null ? (
        <div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<ListChecks size={22} />} title="Teklif bulunamadı" description="İlanlara göz atarak yeni teklif gönderebilirsin." action={<Link to="/jobs" className="text-sm font-semibold text-gold-soft hover:underline">İlanları Keşfet</Link>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <Link key={o.id} to={`/offers/${o.id}`}>
              <Card hover className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text">{o.advertTitle}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-text-faint">
                    <CalendarDays size={12} /> {formatDate(o.createdDate)} tarihinde gönderildi
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-display text-base font-bold text-gold-soft">{formatPrice(o.proposedPrice)}</span>
                  <OfferStatusBadge status={o.offerStatus} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
