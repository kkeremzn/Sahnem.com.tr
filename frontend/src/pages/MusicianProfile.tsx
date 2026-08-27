import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader2, MapPin, MessageCircle, Music2, Plane, Star, Wrench } from 'lucide-react';
import { Camera, Link2, PlayCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StarRating } from '@/components/ui/StarRating';
import { VerificationBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as profileService from '@/services/profileService';
import * as favoriteService from '@/services/favoriteService';
import { CITY_LABELS, MUSIC_BRANCH_LABELS, TRAVEL_LABELS, WORK_STATUS_LABELS, type MusicianProfile as MusicianProfileType } from '@/types';
import { formatPrice } from '@/lib/format';
import { resolveAssetUrl } from '@/lib/apiClient';

export function MusicianProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isEmployer, user } = useAuth();
  const { toast } = useToast();
  const [musician, setMusician] = useState<MusicianProfileType | null | undefined>(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    profileService.getMusicianByUserId(Number(id)).then((m) => setMusician(m ?? undefined));
  }, [id]);

  useEffect(() => {
    if (isEmployer && musician) {
      favoriteService.listFavoriteMusicianIds().then((ids) => setFavorite(ids.includes(musician.appUserId)));
    }
  }, [isEmployer, musician]);

  async function handleToggleFavorite() {
    if (!musician) return;
    const now = await favoriteService.toggleFavorite(musician.appUserId);
    setFavorite(now);
    toast(now ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.', 'success');
  }

  function handleMessage() {
    if (!user || !musician) return navigate('/login');
    navigate('/messages', { state: { recipient: { id: musician.appUserId, name: `${musician.firstName} ${musician.lastName}` } } });
  }

  if (musician === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }
  if (musician === undefined) {
    return (
      <Container className="py-20 text-center">
        <h2 className="font-display text-xl font-bold">Müzisyen bulunamadı</h2>
        <Link to="/explore" className="mt-3 inline-block text-sm text-gold-soft hover:underline">Keşfet sayfasına dön</Link>
      </Container>
    );
  }

  const socials = [
    { url: musician.instagramUrl, Icon: Camera },
    { url: musician.youtubeUrl, Icon: PlayCircle },
    { url: musician.linkedinUrl, Icon: Link2 },
  ].filter((s) => s.url);

  return (
    <div>
      <div className="h-40 bg-gradient-to-r from-gold-dim/40 via-deep to-accent/20 sm:h-56" />
      <Container className="relative -mt-14 pb-14 sm:-mt-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <Avatar name={`${musician.firstName} ${musician.lastName}`} src={resolveAssetUrl(musician.avatarUrl)} size={110} className="border-4 border-black text-3xl" />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold sm:text-3xl">{musician.firstName} {musician.lastName}</h1>
                <VerificationBadge status={musician.verificationStatus} />
              </div>
              <p className="mt-1 text-sm text-text-dim">{MUSIC_BRANCH_LABELS[musician.branch]} · {musician.genres}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-faint">
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {CITY_LABELS[musician.city]}{musician.district ? `, ${musician.district}` : ''}</span>
                {musician.ratingAvg !== undefined && (
                  <StarRating rating={musician.ratingAvg} count={musician.ratingCount} showValue />
                )}
              </div>
            </div>
          </div>
          {isEmployer && (
            <div className="flex gap-2">
              <Button variant={favorite ? 'primary' : 'secondary'} icon={<Star size={15} fill={favorite ? 'currentColor' : 'none'} />} onClick={handleToggleFavorite}>
                {favorite ? 'Favoride' : 'Favorile'}
              </Button>
              <Button icon={<MessageCircle size={15} />} onClick={handleMessage}>Mesaj Gönder</Button>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <h2 className="font-display text-base font-bold">Hakkında</h2>
            <div className="mt-4 space-y-6">
              <Card>
                <h3 className="mb-2 font-display text-base font-bold">Biyografi</h3>
                <p className="text-sm leading-relaxed text-text-dim">{musician.bio}</p>
              </Card>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Card className="text-center">
                  <Music2 size={18} className="mx-auto text-gold-soft" />
                  <p className="mt-2 text-sm font-semibold">{musician.experienceYears} yıl</p>
                  <p className="text-xs text-text-faint">Deneyim</p>
                </Card>
                <Card className="text-center">
                  <Wrench size={18} className="mx-auto text-gold-soft" />
                  <p className="mt-2 text-sm font-semibold">{musician.hasOwnEquipment ? 'Var' : 'Yok'}</p>
                  <p className="text-xs text-text-faint">Kendi ekipmanı</p>
                </Card>
                <Card className="text-center">
                  <Plane size={18} className="mx-auto text-gold-soft" />
                  <p className="mt-2 text-sm font-semibold">{TRAVEL_LABELS[musician.isAvailableToTravel]}</p>
                  <p className="text-xs text-text-faint">Seyahat</p>
                </Card>
                <Card className="text-center">
                  <Star size={18} className="mx-auto text-gold-soft" />
                  <p className="mt-2 text-sm font-semibold">{WORK_STATUS_LABELS[musician.workStatus]}</p>
                  <p className="text-xs text-text-faint">Çalışma şekli</p>
                </Card>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            {musician.priceFrom && (
              <Card>
                <p className="text-xs text-text-faint">Başlangıç fiyatı</p>
                <p className="mt-1 font-display text-2xl font-bold text-gold-soft">{formatPrice(musician.priceFrom)}</p>
              </Card>
            )}
            {socials.length > 0 && (
              <Card>
                <h4 className="mb-3 text-sm font-semibold">Sosyal medya</h4>
                <div className="flex gap-2">
                  {socials.map(({ url, Icon }, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-dim hover:border-gold/40 hover:text-gold-soft">
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </Card>
            )}
            <Card>
              <h4 className="mb-2 text-sm font-semibold">Genre etiketleri</h4>
              <div className="flex flex-wrap gap-1.5">
                {musician.genres.split(',').map((g) => (
                  <Badge key={g} variant="neutral">{g.trim()}</Badge>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </Container>
    </div>
  );
}
