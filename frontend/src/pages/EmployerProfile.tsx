import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Camera, Link2, Loader2, MapPin, MessageCircle, PlayCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdvertCard } from '@/components/advert/AdvertCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import * as profileService from '@/services/profileService';
import * as advertService from '@/services/advertService';
import { CITY_LABELS, ORGANIZER_TYPE_LABELS, VENUE_TYPE_LABELS, type Advert, type EmployerProfile as EmployerProfileType } from '@/types';
import { resolveAssetUrl } from '@/lib/apiClient';

export function EmployerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employer, setEmployer] = useState<EmployerProfileType | null | undefined>(null);
  const [adverts, setAdverts] = useState<Advert[]>([]);

  useEffect(() => {
    profileService.getEmployerByUserId(Number(id)).then((e) => setEmployer(e ?? undefined));
    advertService.listAdvertsByCreator(Number(id)).then((list) => setAdverts(list.filter((a) => a.status === 'Open')));
  }, [id]);

  if (employer === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }
  if (employer === undefined) {
    return (
      <Container className="py-20 text-center">
        <h2 className="font-display text-xl font-bold">Profil bulunamadı</h2>
        <Link to="/jobs" className="mt-3 inline-block text-sm text-gold-soft hover:underline">İlanlara dön</Link>
      </Container>
    );
  }

  const name = employer.kind === 'Organizer' ? employer.organizerName : employer.venueName;
  const typeLabel = employer.kind === 'Organizer' ? ORGANIZER_TYPE_LABELS[employer.organizerType] : VENUE_TYPE_LABELS[employer.venueType];
  const socials = [
    { url: employer.instagramUrl, Icon: Camera },
    { url: employer.youtubeUrl, Icon: PlayCircle },
    { url: employer.linkedinUrl, Icon: Link2 },
  ].filter((s) => s.url);

  return (
    <div>
      <div className="h-40 bg-gradient-to-r from-accent/20 via-deep to-gold-dim/30 sm:h-56" />
      <Container className="relative -mt-14 pb-14 sm:-mt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <Avatar name={name} src={resolveAssetUrl(employer.avatarUrl)} size={110} className="border-4 border-black text-3xl" />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold sm:text-3xl">{name}</h1>
              </div>
              <p className="mt-1 text-sm text-text-dim">{typeLabel}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-text-faint">
                <MapPin size={12} /> {CITY_LABELS[employer.city]}{employer.district ? `, ${employer.district}` : ''}
              </div>
            </div>
          </div>
          {user?.role === 'Musician' && (
            <Button
              icon={<MessageCircle size={15} />}
              onClick={() => navigate('/messages', { state: { recipient: { id: Number(id), name } } })}
            >
              Mesaj Gönder
            </Button>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <Card>
              <h3 className="mb-2 font-display text-base font-bold">Hakkında</h3>
              <p className="text-sm leading-relaxed text-text-dim">{employer.bio}</p>
            </Card>

            <h3 className="mb-4 mt-8 font-display text-base font-bold">Açık ilanlar ({adverts.length})</h3>
            {adverts.length === 0 ? (
              <EmptyState title="Aktif ilan yok" description="Bu profilin şu anda açık bir ilanı bulunmuyor." />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {adverts.map((a) => <AdvertCard key={a.id} advert={a} />)}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <Card>
              <h4 className="mb-2 text-sm font-semibold">Adres</h4>
              <p className="text-sm text-text-dim">{employer.address}</p>
            </Card>
            {employer.kind === 'Venue' && (
              <Card>
                <h4 className="mb-2 text-sm font-semibold">Mekan bilgisi</h4>
                <p className="text-sm text-text-dim">Kapasite: {employer.capacity} kişi</p>
                <p className="mt-1 text-sm text-text-dim">Ses sistemi: {employer.hasSoundSystem ? 'Mevcut' : 'Yok'}</p>
              </Card>
            )}
            {(socials.length > 0 || employer.websiteUrl) && (
              <Card>
                <h4 className="mb-3 text-sm font-semibold">Bağlantılar</h4>
                {employer.websiteUrl && (
                  <a href={employer.websiteUrl} target="_blank" rel="noreferrer" className="mb-3 block text-sm text-gold-soft hover:underline">
                    {employer.websiteUrl}
                  </a>
                )}
                <div className="flex gap-2">
                  {socials.map(({ url, Icon }, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-dim hover:border-gold/40 hover:text-gold-soft">
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </Card>
            )}
          </aside>
        </div>
      </Container>
    </div>
  );
}
