import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoMark } from '@/components/brand/LogoMark';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/cn';
import { resolveAssetUrl } from '@/lib/apiClient';

const PUBLIC_LINKS = [
  { to: '/explore', label: 'Keşfet' },
  { to: '/jobs', label: 'İlanlar' },
  { to: '/about', label: 'Hakkımızda' },
  { to: '/help', label: 'Yardım' },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-black/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-gold" aria-label="Sahnem anasayfa">
          <LogoMark size={26} withWordmark />
        </Link>

        {/* Oturum açıkken bu bağlantılar AppSidebar/AppMobileNav'da rol bazlı karşılığıyla
            zaten var — burada tekrar göstermek yerine sadece çıkış yapmamış ziyaretçilere
            gösteriliyor, böylece uygulama içi ve pazarlama navigasyonu birbirine karışmıyor. */}
        {!user && (
          <nav className="hidden items-center gap-1 md:flex">
            {PUBLIC_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium text-text-dim transition-colors hover:text-text',
                    isActive && 'bg-card text-text',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/notifications"
                className="focus-ring relative hidden h-10 w-10 items-center justify-center rounded-full text-text-dim transition-colors hover:bg-card hover:text-text sm:flex"
                aria-label="Bildirimler"
              >
                <Bell size={19} />
                {unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />}
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="focus-ring flex items-center gap-2 rounded-full border border-border p-1 pr-2 transition-colors hover:border-border-hover"
                >
                  <Avatar name={`${user.firstName} ${user.lastName}`} src={resolveAssetUrl(user.avatarUrl)} size={32} />
                  <span className="hidden text-sm font-medium sm:inline">{user.firstName}</span>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-card shadow-card"
                    >
                      <div className="border-b border-border px-4 py-3">
                        <p className="truncate text-sm font-semibold">{user.firstName} {user.lastName}</p>
                        <p className="truncate text-xs text-text-dim">{user.email}</p>
                      </div>
                      <Link to="/profile/edit" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-dim hover:bg-card-hover hover:text-text">
                        <User size={16} /> Profilim
                      </Link>
                      <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-dim hover:bg-card-hover hover:text-text">
                        <Settings size={16} /> Ayarlar
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-left text-sm text-danger hover:bg-card-hover">
                        <LogOut size={16} /> Çıkış Yap
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="focus-ring rounded-full px-4 py-2 text-sm font-medium text-text-dim hover:text-text">
                Giriş Yap
              </Link>
              <Link to="/register" className="focus-ring rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white shadow-glow-sm transition-transform hover:scale-[1.03]">
                Kayıt Ol
              </Link>
            </div>
          )}

          {/* Oturum açıkken mobil hamburger menüsü gereksiz: rol bazlı navigasyon
              AppMobileNav'da, hesap işlemleri de yukarıdaki avatar menüsünde zaten var. */}
          {!user && (
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="focus-ring flex h-10 w-10 items-center justify-center rounded-full text-text-dim hover:bg-card hover:text-text md:hidden"
              aria-label="Menü"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-black md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {PUBLIC_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-dim hover:bg-card hover:text-text"
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <div className="mt-2 flex gap-2 border-t border-border pt-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm font-medium">
                    Giriş Yap
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-full bg-gold px-4 py-2 text-center text-sm font-semibold text-white">
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
