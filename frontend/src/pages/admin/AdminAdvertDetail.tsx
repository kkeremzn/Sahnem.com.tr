import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Ban, CalendarDays, Loader2, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { AdvertStatusBadge, OfferStatusBadge } from '@/components/ui/StatusBadge';
import { useToast } from '@/context/ToastContext';
import * as adminService from '@/services/adminService';
import { CITY_LABELS, type Advert, type Offer } from '@/types';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';
import { formatApiError } from '@/lib/apiClient';

export function AdminAdvertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [advert, setAdvert] = useState<Advert | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  function load() {
    setAdvert(null);
    Promise.all([
      adminService.getAdvertDetail(Number(id)),
      adminService.getAdvertOffers(Number(id)),
    ]).then(([a, o]) => {
      setAdvert(a);
      setOffers(o);
    }).catch((e) => {
      toast(formatApiError(e, 'İlan yüklenemedi.'), 'error');
      navigate('/backstage/adverts');
    });
  }

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCancel() {
    if (!advert) return;
    setCancelling(true);
    try {
      await adminService.cancelAdvertAsAdmin(advert.id);
      toast('İlan iptal edildi.', 'success');
      setCancelOpen(false);
      load();
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setCancelling(false);
    }
  }

  if (advert === null) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={26} /></div>;
  }

  return (
    <div>
      <Link to="/backstage/adverts" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text">
        <ArrowLeft size={14} /> İlanlara dön
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-text">{advert.title}</h1>
            <AdvertStatusBadge status={advert.status} />
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-dim">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {CITY_LABELS[advert.city]}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(advert.eventTime)}</span>
            <span>{advert.creatorName} ({advert.creatorRole})</span>
          </div>
        </div>
        {advert.status === 'Open' && (
          <Button variant="danger" icon={<Ban size={15} />} onClick={() => setCancelOpen(true)}>Admin Olarak İptal Et</Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div>
          <h3 className="mb-3 font-display text-base font-bold">Gelen teklifler ({offers.length})</h3>
          {offers.length === 0 ? (
            <EmptyState title="Henüz teklif yok" description="" />
          ) : (
            <div className="space-y-3">
              {offers.map((o) => (
                <Card key={o.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={o.musicianName} size={40} />
                      <div>
                        <p className="text-sm font-semibold text-text">{o.musicianName}</p>
                        <p className="text-xs text-text-faint">{o.musicianBranch} · {formatDateTime(o.createdDate)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-base font-bold text-gold-soft">{formatPrice(o.proposedPrice)}</p>
                      <OfferStatusBadge status={o.offerStatus} />
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-text-dim">{o.message}</p>
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside>
          <Card className="sticky top-8 space-y-3 text-sm">
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
            <div className="border-t border-border pt-3">
              <p className="text-xs text-text-faint">Açıklama</p>
              <p className="text-text-dim">{advert.description}</p>
            </div>
          </Card>
        </aside>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title="İlanı iptal et"
        description={`"${advert.title}" ilanını admin olarak iptal etmek istediğine emin misin?`}
        confirmLabel="İptal Et"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  );
}
