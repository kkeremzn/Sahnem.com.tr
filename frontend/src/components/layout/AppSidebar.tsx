import { NavLink } from 'react-router-dom';
import {
  Bell, Briefcase, Heart, ListChecks, MessageCircle,
  PlusCircle, Search, Settings, ShieldCheck, User, type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// "primary": her girişte doğrudan işe yarayan, sık kullanılan akışlar.
// "account": kendi profil/ayar/geçmiş bilgisi — "Hesabım" başlığı altında toplanır.
const MUSICIAN_PRIMARY: NavItem[] = [
  { to: '/jobs', label: 'İlanları Keşfet', icon: Briefcase },
  { to: '/messages', label: 'Mesajlar', icon: MessageCircle },
];
const MUSICIAN_ACCOUNT: NavItem[] = [
  { to: '/offers', label: 'Tekliflerim', icon: ListChecks },
  { to: '/profile/edit', label: 'Profilim', icon: User },
  { to: '/settings', label: 'Ayarlar', icon: Settings },
];

const EMPLOYER_PRIMARY: NavItem[] = [
  { to: '/explore', label: 'Müzisyen Keşfet', icon: Search },
  { to: '/post-advert', label: 'İlan Ver', icon: PlusCircle },
  { to: '/my-adverts', label: 'İlanlarım', icon: ListChecks },
  { to: '/messages', label: 'Mesajlar', icon: MessageCircle },
];
const EMPLOYER_ACCOUNT: NavItem[] = [
  { to: '/favorites', label: 'Favori Müzisyenler', icon: Heart },
  { to: '/profile/edit', label: 'Profilim', icon: User },
  { to: '/settings', label: 'Ayarlar', icon: Settings },
];

const ADMIN_PRIMARY: NavItem[] = [
  { to: '/admin', label: 'Yönetim Paneli', icon: ShieldCheck },
];
const ADMIN_ACCOUNT: NavItem[] = [
  { to: '/settings', label: 'Ayarlar', icon: Settings },
];

export function AppSidebar() {
  const { isMusician, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const primary = isAdmin ? ADMIN_PRIMARY : isMusician ? MUSICIAN_PRIMARY : EMPLOYER_PRIMARY;
  const account = isAdmin ? ADMIN_ACCOUNT : isMusician ? MUSICIAN_ACCOUNT : EMPLOYER_ACCOUNT;

  function linkClass({ isActive }: { isActive: boolean }) {
    return cn(
      'focus-ring flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-text-dim transition-colors hover:bg-card hover:text-text',
      isActive && 'bg-gold/10 text-gold-soft',
    );
  }

  return (
    <aside className="sticky top-20 hidden h-fit w-60 shrink-0 lg:block">
      <nav className="flex flex-col gap-1">
        {primary.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
        {!isAdmin && (
          <NavLink key="/notifications" to="/notifications" className={linkClass}>
            <span className="relative">
              <Bell size={17} />
              {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gold" />}
            </span>
            Bildirimler
          </NavLink>
        )}
      </nav>

      <p className="mb-1.5 mt-6 px-3.5 text-xs font-semibold uppercase tracking-wide text-text-faint">Hesabım</p>
      <nav className="flex flex-col gap-1">
        {account.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
