import { NavLink } from 'react-router-dom';
import {
  Bell, Briefcase, Heart, LayoutDashboard, ListChecks, MessageCircle,
  PlusCircle, Search, Settings, User, type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const MUSICIAN_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { to: '/jobs', label: 'İlanlar', icon: Briefcase },
  { to: '/offers', label: 'Teklifler', icon: ListChecks },
  { to: '/messages', label: 'Mesajlar', icon: MessageCircle },
  { to: '/notifications', label: 'Bildirimler', icon: Bell },
  { to: '/profile/edit', label: 'Profil', icon: User },
  { to: '/settings', label: 'Ayarlar', icon: Settings },
];

const EMPLOYER_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { to: '/post-advert', label: 'İlan Ver', icon: PlusCircle },
  { to: '/my-adverts', label: 'İlanlarım', icon: ListChecks },
  { to: '/explore', label: 'Keşfet', icon: Search },
  { to: '/favorites', label: 'Favoriler', icon: Heart },
  { to: '/messages', label: 'Mesajlar', icon: MessageCircle },
  { to: '/notifications', label: 'Bildirimler', icon: Bell },
  { to: '/profile/edit', label: 'Profil', icon: User },
  { to: '/settings', label: 'Ayarlar', icon: Settings },
];

export function AppMobileNav() {
  const { isMusician } = useAuth();
  const items = isMusician ? MUSICIAN_ITEMS : EMPLOYER_ITEMS;

  return (
    <nav className="sticky top-16 z-40 flex gap-1 overflow-x-auto border-b border-border bg-black/95 px-4 py-2.5 backdrop-blur lg:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) =>
            cn(
              'flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-text-dim',
              isActive && 'bg-gold/10 text-gold-soft',
            )
          }
        >
          <item.icon size={14} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
