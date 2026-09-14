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
//
// Sayaçlar (KPI'lar) bilinçli olarak sayfanın ALTINDA, küçük bir şeritte —
// asıl işlevsel içerik (uygun ilanlar/müzisyenler) yukarıda. Aksi halde panel
// bir ürün paneli değil bir "admin dashboard" gibi hissettiriyordu.
export function Dashboard() {
  const { user, isMusician } = useAuth();

  if (!user) return null;
  return isMusician ? <MusicianDashboard firstName={user.firstName} /> : <EmployerDashboard firstName={user.firstName} />;
}

function StatStrip({ items }: { items: { to: string; label: string; value: number | string; icon: ReactNode }[] }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 divide-y divide-border rounded-md border border-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.to)}
          className="flex cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left transition-colors hover:bg-card-hover sm:flex-col sm:items-start sm:justify-center"
        >
          <span className="flex items-center gap-1.5 text-xs text-text-faint">{item.icon} {item.label}</span>
          <span className="font-display text-lg font-bold text-text">{item.value}</span>
        </button>
      ))}
    </div>
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

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction to="/jobs" label="İlanları Keşfet" icon={<Briefcase size={17} />} />
        <QuickAction to="/explore?tab=employers" label="Mekan & Organizatör Keşfet" icon={<Search size={17} />} />
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

      <StatStrip items={[
        { to: '/offers', label: 'Bekleyen Tekliflerim', value: offers === null ? '—' : pending, icon: <ListChecks size={13} /> },
        { to: '/offers', label: 'Kabul Edilen', value: offers === null ? '—' : accepted, icon: <Star size={13} /> },
        { to: '/messages', label: 'Okunmamış Mesaj', value: unreadMessages, icon: <MessageCircle size={13} /> },
        { to: '/notifications', label: 'Bildirimler', value: unreadCount, icon: <Bell size={13} /> },
      ]} />
    </div>
  );
}

function EmployerDashboard({ firstName }: { firstName: string }) {
  const { unreadCount } = useNotifications();
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [musicians, setMusicians] = useState<MusicianProfile[] | null>(null);
  const [personalized, setPersonalized] = useState(false);

  useEffect(() => {
    advertService.listMyAdverts().then(setAdverts);
    messageService.listConversations().then((list) => setUnreadMessages(list.reduce((s, c) => s + c.unreadCount, 0)));
    // Kendi şehrindeki müzisyenlerle öneriyi anlamlı kılmaya çalışıyoruz — hiç
    // sonuç yoksa şehir filtresi olmadan geneli gösteriyoruz.
    profileService.getMyProfile().then(async (profile) => {
      const res = await profileService.listMusicians({ cities: [profile.city], pageSize: 4 });
      if (res.items.length > 0) {
        setMusicians(res.items);
        setPersonalized(true);
      } else {
        const fallback = await profileService.listMusicians({ pageSize: 4 });
        setMusicians(fallback.items);
      }
    });
  }, []);

  const openCount = adverts?.filter((a) => a.status === 'Open').length ?? 0;
  const totalOffers = adverts?.reduce((s, a) => s + a.offerCount, 0) ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Merhaba, {firstName}</h1>

      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction to="/post-advert" label="İlan Ver" icon={<PlusCircle size={17} />} />
        <QuickAction to="/explore?tab=musicians" label="Müzisyen Keşfet" icon={<Search size={17} />} />
        <QuickAction to="/favorites" label="Favori Müzisyenlerim" icon={<Heart size={17} />} />
      </div>

      <div>
        <h3 className="mb-3 font-display text-base font-bold">{personalized ? 'Sana uygun müzisyenler' : 'Keşfedebileceğin müzisyenler'}</h3>
        {musicians === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {musicians.map((m) => <MusicianCard key={m.id} musician={m} />)}
          </div>
        )}
      </div>

      <StatStrip items={[
        { to: '/my-adverts', label: 'Açık İlanlarım', value: adverts === null ? '—' : openCount, icon: <Briefcase size={13} /> },
        { to: '/my-adverts', label: 'Toplam Gelen Teklif', value: adverts === null ? '—' : totalOffers, icon: <ListChecks size={13} /> },
        { to: '/messages', label: 'Okunmamış Mesaj', value: unreadMessages, icon: <MessageCircle size={13} /> },
        { to: '/notifications', label: 'Bildirimler', value: unreadCount, icon: <Bell size={13} /> },
      ]} />
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
