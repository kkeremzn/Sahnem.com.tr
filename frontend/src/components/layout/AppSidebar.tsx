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
  { to: '/jobs', label: 'İlanları Keşfet', icon: Briefcase },
  { to: '/offers', label: 'Tekliflerim', icon: ListChecks },
  { to: '/messages', label: 'Mesajlar', icon: MessageCircle },
  { to: '/notifications', label: 'Bildirimler', icon: Bell },
  { to: '/profile/edit', label: 'Profilim', icon: User },
  { to: '/settings', label: 'Ayarlar', icon: Settings },
];

const EMPLOYER_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { to: '/post-advert', label: 'İlan Ver', icon: PlusCircle },
  { to: '/my-adverts', label: 'İlanlarım', icon: ListChecks },
  { to: '/explore', label: 'Müzisyen Keşfet', icon: Search },
  { to: '/favorites', label: 'Favori Müzisyenler', icon: Heart },
  { to: '/messages', label: 'Mesajlar', icon: MessageCircle },
  { to: '/notifications', label: 'Bildirimler', icon: Bell },
  { to: '/profile/edit', label: 'Profilim', icon: User },
  { to: '/settings', label: 'Ayarlar', icon: Settings },
];

export function AppSidebar() {
  const { isMusician } = useAuth();
  const items = isMusician ? MUSICIAN_ITEMS : EMPLOYER_ITEMS;

  return (
    <aside className="sticky top-20 hidden h-fit w-60 shrink-0 lg:block">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'focus-ring flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-text-dim transition-colors hover:bg-card hover:text-text',
                isActive && 'bg-gold/10 text-gold-soft',
              )
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
