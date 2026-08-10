import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarClock, CalendarDays, Loader2, MapPin, Send, Wrench } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { AdvertStatusBadge, OfferStatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as advertService from '@/services/advertService';
import * as offerService from '@/services/offerService';
import { CITY_LABELS, MUSIC_BRANCH_LABELS, type Advert, type Offer } from '@/types';
import { formatDate, formatPrice } from '@/lib/format';

const offerSchema = z.object({
  message: z.string().min(10, 'Mesajın en az 10 karakter olmalı.'),
  proposedPrice: z.coerce.number().min(1, 'Geçerli bir fiyat gir.'),
});
type OfferFormInput = z.input<typeof offerSchema>;
type OfferFormData = z.infer<typeof offerSchema>;

export function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [advert, setAdvert] = useState<Advert | null | undefined>(null);
  const [existingOffer, setExistingOffer] = useState<Offer | undefined>();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OfferFormInput, unknown, OfferFormData>({
    resolver: zodResolver(offerSchema),
  });

  useEffect(() => {
    advertService.getAdvertById(Number(id)).then((a) => setAdvert(a ?? undefined));
  }, [id]);

  useEffect(() => {
    if (user?.role === 'Musician' && advert) {
      offerService.listOffersByMusician(user.id).then((offers) => {
        setExistingOffer(offers.find((o) => o.advertId === advert.id));
      });
    }
  }, [user, advert]);

  async function onSubmit(data: OfferFormData) {
    if (!user || !advert) return;
    try {
      const offer = await offerService.createOffer(user.id, `${user.firstName} ${user.lastName}`, 'Vocal', {
        advertId: advert.id, message: data.message, proposedPrice: data.proposedPrice,
      });
      setExistingOffer(offer);
      toast('Teklifin gönderildi.', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Bir hata oluştu.', 'error');
    }
  }

  if (advert === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }
  if (advert === undefined) {
    return (
      <Container className="py-20 text-center">
        <h2 className="font-display text-xl font-bold">İlan bulunamadı</h2>
        <Link to="/jobs" className="mt-3 inline-block text-sm text-gold-soft hover:underline">İlanlara dön</Link>
      </Container>
    );
  }

  return (
    <Container className="max-w-5xl py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link to={`/employers/${advert.creatorId}`} className="flex items-center gap-2.5 group">
          <Avatar name={advert.creatorName} size={40} />
          <span className="text-sm font-medium text-text-dim group-hover:text-text">{advert.creatorName}</span>
        </Link>
        <span className="text-text-faint">·</span>
        <AdvertStatusBadge status={advert.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{advert.title}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-dim">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {CITY_LABELS[advert.city]}{advert.district ? `, ${advert.district}` : ''}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(advert.eventTime)}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarClock size={14} /> Son başvuru: {formatDate(advert.applicationDeadline)}</span>
          </div>

          <Card className="mt-6">
            <h3 className="mb-2 font-display text-base font-bold">Açıklama</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-text-dim">{advert.description}</p>
          </Card>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {advert.branch && (
              <Card className="text-center">
                <Badge variant="gold">{MUSIC_BRANCH_LABELS[advert.branch]}</Badge>
                <p className="mt-2 text-xs text-text-faint">Aranan branş</p>
              </Card>
            )}
            <Card className="text-center">
              <Wrench size={18} className="mx-auto text-gold-soft" />
              <p className="mt-2 text-sm font-semibold">{advert.equipmentProvided ? 'Sağlanıyor' : 'Sağlanmıyor'}</p>
              <p className="text-xs text-text-faint">Ekipman</p>
            </Card>
            {!!advert.minimumExperienceYears && (
              <Card className="text-center">
                <p className="mt-1 text-sm font-semibold">{advert.minimumExperienceYears}+ yıl</p>
                <p className="text-xs text-text-faint">Min. deneyim</p>
              </Card>
            )}
          </div>
        </div>

        <aside>
          <Card className="sticky top-24">
            <p className="text-xs text-text-faint">Bütçe</p>
            <p className="mt-1 font-display text-2xl font-bold text-gold-soft">{formatPrice(advert.budget)}</p>

            <div className="mt-5 border-t border-border pt-5">
              {!user ? (
                <div className="text-center">
                  <p className="text-sm text-text-dim">Teklif göndermek için giriş yapmalısın.</p>
                  <Button className="mt-3" full onClick={() => navigate('/login')}>Giriş Yap</Button>
                </div>
              ) : user.role !== 'Musician' ? (
                <p className="text-sm text-text-dim">Bu ilana yalnızca müzisyenler teklif gönderebilir.</p>
              ) : advert.status !== 'Open' ? (
                <p className="text-sm text-text-dim">Bu ilan artık teklif kabul etmiyor.</p>
              ) : existingOffer ? (
                <div>
                  <p className="mb-2 text-sm text-text-dim">Bu ilana teklif gönderdin.</p>
                  <div className="flex items-center justify-between rounded-md border border-border bg-deep px-3.5 py-2.5">
                    <span className="text-sm font-semibold text-text">{formatPrice(existingOffer.proposedPrice)}</span>
                    <OfferStatusBadge status={existingOffer.offerStatus} />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <h4 className="flex items-center gap-1.5 text-sm font-semibold text-text">
                    <Send size={14} /> Teklif Gönder
                  </h4>
                  <Field label="Mesajın" error={errors.message?.message}>
                    <Textarea placeholder="Kendini tanıt, neden uygun olduğunu anlat..." rows={4} {...register('message')} invalid={!!errors.message} />
                  </Field>
                  <Field label="Teklif ettiğin fiyat (₺)" error={errors.proposedPrice?.message}>
                    <Input type="number" placeholder="15000" {...register('proposedPrice')} invalid={!!errors.proposedPrice} />
                  </Field>
                  <Button type="submit" full loading={isSubmitting}>Teklifi Gönder</Button>
                </form>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
