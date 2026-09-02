import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Ban, CalendarDays, Loader2, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AdvertStatusBadge, OfferStatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/context/ToastContext';
import * as advertService from '@/services/advertService';
import * as offerService from '@/services/offerService';
import { CITY_LABELS, type Advert, type Offer } from '@/types';
import { formatDate, formatPrice } from '@/lib/format';

export function MyAdvertDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [advert, setAdvert] = useState<Advert | null | undefined>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [pendingOfferAction, setPendingOfferAction] = useState<{ offerId: number; status: 'Accepted' | 'Rejected'; musicianName: string } | null>(null);

  async function load() {
    const a = await advertService.getAdvertById(Number(id));
    setAdvert(a ?? undefined);
    if (a) setOffers(await offerService.listOffersByAdvert(a.id));
  }

  useEffect(() => { load(); }, [id]);

  async function handleOfferAction() {
    if (!pendingOfferAction) return;
    const { offerId, status } = pendingOfferAction;
    setBusyId(offerId);
    try {
      await offerService.updateOfferStatus(offerId, status);
      toast(status === 'Accepted' ? 'Teklif kabul edildi.' : 'Teklif reddedildi.', 'success');
      setPendingOfferAction(null);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancel() {
    if (!advert) return;
    setCancelling(true);
    try {
      await advertService.cancelAdvert(advert.id);
      toast('İlan iptal edildi.', 'success');
      setCancelOpen(false);
      await load();
    } finally {
      setCancelling(false);
    }
  }

  if (advert === null) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-gold" size={26} /></div>;
  }
  if (advert === undefined) {
    return (
      <Container className="py-16 text-center">
        <h2 className="font-display text-xl font-bold">İlan bulunamadı</h2>
        <Link to="/my-adverts" className="mt-3 inline-block text-sm text-gold-soft hover:underline">İlanlarıma dön</Link>
      </Container>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold">{advert.title}</h1>
            <AdvertStatusBadge status={advert.status} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-dim">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {CITY_LABELS[advert.city]}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(advert.eventTime)}</span>
          </div>
        </div>
        {advert.status === 'Open' && (
          <Button variant="secondary" icon={<Ban size={15} />} onClick={() => setCancelOpen(true)}>İlanı İptal Et</Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <h3 className="mb-3 font-display text-base font-bold">Gelen teklifler ({offers.length})</h3>
          {offers.length === 0 ? (
            <EmptyState title="Henüz teklif yok" description="Müzisyenler ilanını inceledikçe teklifler burada listelenecek." />
          ) : (
            <div className="space-y-3">
              {offers.map((o) => (
                <Card key={o.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={o.musicianName} size={44} />
                      <div>
                        <Link to={`/musicians/${o.musicianId}`} className="text-sm font-semibold text-text hover:text-gold-soft">{o.musicianName}</Link>
                        <p className="text-xs text-text-faint">{o.musicianBranch}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-lg font-bold text-gold-soft">{formatPrice(o.proposedPrice)}</p>
                      <OfferStatusBadge status={o.offerStatus} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-text-dim">{o.message}</p>
                  {o.offerStatus === 'Pending' && (
                    <div className="mt-4 flex gap-2 border-t border-border pt-4">
                      <Button size="sm" onClick={() => setPendingOfferAction({ offerId: o.id, status: 'Accepted', musicianName: o.musicianName })} loading={busyId === o.id}>Kabul Et</Button>
                      <Button size="sm" variant="secondary" onClick={() => setPendingOfferAction({ offerId: o.id, status: 'Rejected', musicianName: o.musicianName })} loading={busyId === o.id}>Reddet</Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside>
          <Card className="sticky top-24 space-y-3 text-sm">
            <div>
              <p className="text-xs text-text-faint">Bütçe</p>
              <p className="font-display text-xl font-bold text-gold-soft">{formatPrice(advert.budget)}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-text-faint">Son başvuru</p>
              <p className="text-text-dim">{formatDate(advert.applicationDeadline)}</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-text-faint">Adres</p>
              <p className="text-text-dim">{advert.address}</p>
            </div>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title="İlanı iptal et"
        description="Bu ilanı iptal etmek istediğine emin misin? Bu işlem geri alınamaz."
        confirmLabel="İptal Et"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => setCancelOpen(false)}
      />

      <ConfirmDialog
        open={!!pendingOfferAction}
        title={pendingOfferAction?.status === 'Accepted' ? 'Teklifi kabul et' : 'Teklifi reddet'}
        description={
          pendingOfferAction
            ? `${pendingOfferAction.musicianName} adlı müzisyenin teklifini ${pendingOfferAction.status === 'Accepted' ? 'kabul etmek' : 'reddetmek'} istediğine emin misin?`
            : undefined
        }
        confirmLabel={pendingOfferAction?.status === 'Accepted' ? 'Kabul Et' : 'Reddet'}
        danger={pendingOfferAction?.status === 'Rejected'}
        loading={busyId === pendingOfferAction?.offerId}
        onConfirm={handleOfferAction}
        onClose={() => setPendingOfferAction(null)}
      />
    </div>
  );
}
