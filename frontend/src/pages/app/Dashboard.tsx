import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, Briefcase, Heart, ListChecks, MessageCircle, PlusCircle, Search, Star, Users,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { MusicianCard } from '@/components/musician/MusicianCard';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import * as advertService from '@/services/advertService';
import * as offerService from '@/services/offerService';
import * as messageService from '@/services/messageService';
import * as profileService from '@/services/profileService';
import type { Advert, MusicianProfile, Offer } from '@/types';
import { AdvertCard } from '@/components/advert/AdvertCard';

// Girişten sonra artık doğrudan bir liste sayfasına düşmek yerine, role özel
// hızlı istatistikler + öne çıkan içerik gösteren gerçek bir "panel" var —
// önceki tasarım (bkz. git geçmişi) bunu bilinçli olarak kaldırmıştı ama
// kullanıcı geri bildiriminde uygulamanın girişte "ıssız" hissettirdiğini,
// müzisyen/mekan/organizatör keşfine ulaşmanın zor olduğunu belirtti.
export function Dashboard() {
  const { user, isMusician } = useAuth();

  if (!user) return null;
  return isMusician ? <MusicianDashboard firstName={user.firstName} /> : <EmployerDashboard firstName={user.firstName} />;
}

function StatLink({ to, label, value, icon }: { to: string; label: string; value: number | string; icon: ReactNode }) {
  const navigate = useNavigate();
  return (
    <Card hover onClick={() => navigate(to)}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-faint">{label}</p>
        <span className="text-text-faint">{icon}</span>
      </div>
      <p className="mt-1.5 font-display text-2xl font-bold text-text">{value}</p>
    </Card>
  );
}

function MusicianDashboard({ firstName }: { firstName: string }) {
  const { unreadCount } = useNotifications();
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [suggested, setSuggested] = useState<Advert[] | null>(null);

  useEffect(() => {
    offerService.listMyOffers().then(setOffers);
    messageService.listConversations().then((list) => setUnreadMessages(list.reduce((s, c) => s + c.unreadCount, 0)));
    profileService.getMyProfile().then((profile) => {
      const branch = 'branch' in profile ? profile.branch[0] : undefined;
      advertService.listAdverts({ city: profile.city, branch, pageSize: 4 }).then((res) => setSuggested(res.items));
    });
  }, []);

  const pending = offers?.filter((o) => o.offerStatus === 'Pending').length ?? 0;
  const accepted = offers?.filter((o) => o.offerStatus === 'Accepted').length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Merhaba, {firstName}</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatLink to="/offers" label="Bekleyen Tekliflerim" value={offers === null ? '—' : pending} icon={<ListChecks size={16} />} />
        <StatLink to="/offers" label="Kabul Edilen" value={offers === null ? '—' : accepted} icon={<Star size={16} />} />
        <StatLink to="/messages" label="Okunmamış Mesaj" value={unreadMessages} icon={<MessageCircle size={16} />} />
        <StatLink to="/notifications" label="Bildirimler" value={unreadCount} icon={<Bell size={16} />} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction to="/jobs" label="İlanları Keşfet" icon={<Briefcase size={17} />} />
        <QuickAction to="/explore" label="Mekan & Organizatör Keşfet" icon={<Search size={17} />} />
        <QuickAction to="/profile/edit" label="Profilimi Düzenle" icon={<Users size={17} />} />
      </div>

      <div>
        <h3 className="mb-3 font-display text-base font-bold">Sana uygun ilanlar</h3>
        {suggested === null ? (
          <div className="grid gap-4 sm:grid-cols-2">{Array.from({ length: 2 }, (_, i) => <CardSkeleton key={i} />)}</div>
        ) : suggested.length === 0 ? (
          <Card><p className="text-sm text-text-faint">Şu an branşına/şehrine uygun açık ilan yok. <Link to="/jobs" className="text-gold-soft hover:underline">Tüm ilanlara göz at</Link>.</p></Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {suggested.map((a) => <AdvertCard key={a.id} advert={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function EmployerDashboard({ firstName }: { firstName: string }) {
  const { unreadCount } = useNotifications();
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [musicians, setMusicians] = useState<MusicianProfile[] | null>(null);

  useEffect(() => {
    advertService.listMyAdverts().then(setAdverts);
    messageService.listConversations().then((list) => setUnreadMessages(list.reduce((s, c) => s + c.unreadCount, 0)));
    profileService.listMusicians({ pageSize: 4 }).then((res) => setMusicians(res.items));
  }, []);

  const openCount = adverts?.filter((a) => a.status === 'Open').length ?? 0;
  const totalOffers = adverts?.reduce((s, a) => s + a.offerCount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Merhaba, {firstName}</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatLink to="/my-adverts" label="Açık İlanlarım" value={adverts === null ? '—' : openCount} icon={<Briefcase size={16} />} />
        <StatLink to="/my-adverts" label="Toplam Gelen Teklif" value={adverts === null ? '—' : totalOffers} icon={<ListChecks size={16} />} />
        <StatLink to="/messages" label="Okunmamış Mesaj" value={unreadMessages} icon={<MessageCircle size={16} />} />
        <StatLink to="/notifications" label="Bildirimler" value={unreadCount} icon={<Bell size={16} />} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction to="/post-advert" label="İlan Ver" icon={<PlusCircle size={17} />} />
        <QuickAction to="/explore" label="Müzisyen Keşfet" icon={<Search size={17} />} />
        <QuickAction to="/favorites" label="Favori Müzisyenlerim" icon={<Heart size={17} />} />
      </div>

      <div>
        <h3 className="mb-3 font-display text-base font-bold">Öne çıkan müzisyenler</h3>
        {musicians === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {musicians.map((m) => <MusicianCard key={m.id} musician={m} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <Link to={to} className="focus-ring flex items-center gap-2.5 rounded-md border border-border bg-card px-4 py-3.5 text-sm font-medium text-text transition-colors hover:border-gold/40 hover:text-gold-soft">
      {icon} {label}
    </Link>
  );
}
