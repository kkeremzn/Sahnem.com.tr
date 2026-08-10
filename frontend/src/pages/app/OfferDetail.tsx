import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, Loader2, MapPin, MessageCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OfferStatusBadge } from '@/components/ui/StatusBadge';
import * as offerService from '@/services/offerService';
import * as advertService from '@/services/advertService';
import type { Advert, Offer } from '@/types';
import { CITY_LABELS } from '@/types';
import { formatDate, formatPrice } from '@/lib/format';

export function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<Offer | null | undefined>(null);
  const [advert, setAdvert] = useState<Advert | null>(null);

  useEffect(() => {
    offerService.getOfferById(Number(id)).then((o) => {
      setOffer(o ?? undefined);
      if (o) advertService.getAdvertById(o.advertId).then((a) => setAdvert(a ?? null));
    });
  }, [id]);

  if (offer === null) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-gold" size={26} /></div>;
  }
  if (offer === undefined) {
    return (
      <Container className="py-16 text-center">
        <h2 className="font-display text-xl font-bold">Teklif bulunamadı</h2>
        <Link to="/offers" className="mt-3 inline-block text-sm text-gold-soft hover:underline">Tekliflerime dön</Link>
      </Container>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{offer.advertTitle}</h1>
          <p className="mt-1 text-sm text-text-dim">{formatDate(offer.createdDate)} tarihinde gönderildi</p>
        </div>
        <OfferStatusBadge status={offer.offerStatus} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <Card>
            <h3 className="mb-2 font-display text-base font-bold">Mesajın</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-text-dim">{offer.message}</p>
          </Card>
          {advert && (
            <Card>
              <h3 className="mb-3 font-display text-base font-bold">İlan detayları</h3>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-dim">
                <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {CITY_LABELS[advert.city]}</span>
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(advert.eventTime)}</span>
              </div>
              <p className="mt-3 text-sm text-text-dim">{advert.description}</p>
              <Link to={`/jobs/${advert.id}`} className="mt-3 inline-block text-sm font-semibold text-gold-soft hover:underline">
                İlanı görüntüle
              </Link>
            </Card>
          )}
        </div>

        <aside>
          <Card className="sticky top-24 text-center">
            <p className="text-xs text-text-faint">Teklif ettiğin fiyat</p>
            <p className="mt-1 font-display text-2xl font-bold text-gold-soft">{formatPrice(offer.proposedPrice)}</p>
            <div className="mt-5 border-t border-border pt-5">
              {offer.offerStatus === 'Pending' && <p className="text-sm text-text-dim">İşverenin yanıtı bekleniyor.</p>}
              {offer.offerStatus === 'Accepted' && (
                <>
                  <p className="mb-3 text-sm text-success">Teklifin kabul edildi!</p>
                  <Button full icon={<MessageCircle size={15} />} onClick={() => navigate('/messages')}>Mesajlaş</Button>
                </>
              )}
              {offer.offerStatus === 'Rejected' && <p className="text-sm text-text-dim">Bu teklif reddedildi. Başka ilanlara göz atabilirsin.</p>}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
