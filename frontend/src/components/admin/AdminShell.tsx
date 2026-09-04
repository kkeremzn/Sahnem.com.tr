import { useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { Bell, KeyRound, LayoutDashboard, Loader2, Lock, LogOut, MessageSquare, Megaphone, Users } from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/context/ToastContext';
import * as adminAuthService from '@/services/adminAuthService';
import { formatApiError } from '@/lib/apiClient';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { to: '/backstage', label: 'Genel Bakış', icon: LayoutDashboard, end: true },
  { to: '/backstage/users', label: 'Kullanıcılar', icon: Users },
  { to: '/backstage/adverts', label: 'İlanlar', icon: Megaphone },
  { to: '/backstage/conversations', label: 'Sohbetler', icon: MessageSquare },
  { to: '/backstage/notify', label: 'Bildirim & Mail', icon: Bell },
];

// Bilinçli olarak Navbar/Footer/AppSidebar'ı (tüketici tarafı bileşenleri)
// kullanmıyor — admin alanı ayrı bir kimlik doğrulama sistemine bağlı olduğu
// gibi ayrı, daha yoğun/teknik bir kabuk kullanıyor.
export function AdminShell() {
  const { admin, loading, logout } = useAdminAuth();
  const { toast } = useToast();
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changing, setChanging] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-gold" size={26} />
      </div>
    );
  }
  if (!admin) {
    return <Navigate to="/backstage/login" replace />;
  }

  async function handleChangePassword() {
    if (newPassword.length < 8) {
      toast('Yeni şifre en az 8 karakter olmalı.', 'error');
      return;
    }
    setChanging(true);
    try {
      await adminAuthService.changePassword(currentPassword, newPassword);
      toast('Şifren güncellendi.', 'success');
      setPwOpen(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (e) {
      toast(formatApiError(e, 'Şifre güncellenemedi.'), 'error');
    } finally {
      setChanging(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-black">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-deep">
        <div className="flex items-center gap-2 border-b border-border px-5 py-5">
          <LogoMark size={22} />
          <span className="font-display text-sm font-bold text-text">Backstage</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-gold/10 text-gold-soft' : 'text-text-dim hover:bg-card hover:text-text',
                )
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3 text-xs">
          <div className="flex items-center gap-2 rounded-md px-2 py-2 text-text-dim">
            <Lock size={14} />
            <span className="truncate">{admin.username}</span>
          </div>
          <button
            onClick={() => setPwOpen(true)}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-text-dim transition-colors hover:bg-card hover:text-text"
          >
            <KeyRound size={15} /> Şifre Değiştir
          </button>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-text-dim transition-colors hover:bg-card hover:text-danger"
          >
            <LogOut size={15} /> Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-8">
        <Outlet />
      </main>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Şifre Değiştir">
        <div className="space-y-3">
          <Field label="Mevcut şifre">
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </Field>
          <Field label="Yeni şifre" hint="En az 8 karakter">
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Field>
          <Button full loading={changing} onClick={handleChangePassword}>Güncelle</Button>
        </div>
      </Modal>
    </div>
  );
}
