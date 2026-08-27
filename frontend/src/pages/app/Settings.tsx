import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, KeyRound, LogOut, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Switch } from '@/components/ui/Switch';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as authService from '@/services/authService';
import { USER_TYPE_LABELS } from '@/types';
import { formatApiError } from '@/lib/apiClient';

const TAB_ITEMS = [
  { key: 'notifications', label: 'Bildirimler' },
  { key: 'privacy', label: 'Gizlilik' },
  { key: 'account', label: 'Hesap' },
];

export function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('notifications');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({ offers: true, messages: true, marketing: false });
  const [privacyPrefs, setPrivacyPrefs] = useState({ showProfile: true, showContact: false });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  async function handleChangePassword() {
    setChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast('Şifren güncellendi.', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (e) {
      toast(formatApiError(e, 'Şifre güncellenemedi.'), 'error');
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    try {
      await authService.deleteAccount();
      toast('Hesabın silindi.', 'success');
      logout();
      navigate('/');
    } finally {
      setDeleting(false);
    }
  }

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Ayarlar" description="Hesap tercihlerini ve gizlilik ayarlarını yönet." />

      <Tabs items={TAB_ITEMS} active={tab} onChange={setTab} className="mb-6" />

      {tab === 'notifications' && (
        <Card className="max-w-xl divide-y divide-border">
          <div className="pb-4">
            <Switch checked={notifPrefs.offers} onChange={(v) => setNotifPrefs((p) => ({ ...p, offers: v }))} label="Teklif bildirimleri" description="Yeni teklif ve durum değişikliklerinde bildirim al." />
          </div>
          <div className="py-4">
            <Switch checked={notifPrefs.messages} onChange={(v) => setNotifPrefs((p) => ({ ...p, messages: v }))} label="Mesaj bildirimleri" description="Yeni mesaj geldiğinde bildirim al." />
          </div>
          <div className="pt-4">
            <Switch checked={notifPrefs.marketing} onChange={(v) => setNotifPrefs((p) => ({ ...p, marketing: v }))} label="Kampanya & duyurular" description="Sahnem'den kampanya ve ürün duyuruları al." />
          </div>
        </Card>
      )}

      {tab === 'privacy' && (
        <Card className="max-w-xl divide-y divide-border">
          <div className="pb-4">
            <Switch checked={privacyPrefs.showProfile} onChange={(v) => setPrivacyPrefs((p) => ({ ...p, showProfile: v }))} label="Profilimi herkese açık göster" description="Kapatırsan profilin arama sonuçlarında görünmez." />
          </div>
          <div className="pt-4">
            <Switch checked={privacyPrefs.showContact} onChange={(v) => setPrivacyPrefs((p) => ({ ...p, showContact: v }))} label="İletişim bilgilerimi paylaş" description="Telefon numaran doğrulanmış işverenlerle paylaşılsın." />
          </div>
        </Card>
      )}

      {tab === 'account' && (
        <div className="max-w-xl space-y-5">
          <Card>
            <h3 className="mb-1 text-sm font-semibold text-text">Hesap bilgisi</h3>
            <p className="text-sm text-text-dim">{user.email} · {USER_TYPE_LABELS[user.role]}</p>
          </Card>

          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
              <KeyRound size={15} /> Şifre değiştir
            </h3>
            <div className="space-y-3">
              <Field label="Mevcut şifre">
                <Input type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </Field>
              <Field label="Yeni şifre">
                <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </Field>
              <Button
                variant="secondary"
                size="sm"
                loading={changingPassword}
                disabled={!currentPassword || newPassword.length < 6}
                onClick={handleChangePassword}
              >
                Şifreyi Güncelle
              </Button>
            </div>
          </Card>

          <Card>
            <Button variant="ghost" icon={<LogOut size={16} />} onClick={() => { logout(); navigate('/'); }}>
              Çıkış Yap
            </Button>
          </Card>

          <Card className="border-danger/30">
            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-danger">
              <AlertTriangle size={15} /> Tehlikeli bölge
            </h3>
            <p className="mb-4 text-sm text-text-dim">Hesabını sildiğinde tüm profil verilerin kalıcı olarak silinir.</p>
            <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setDeleteOpen(true)}>Hesabımı Sil</Button>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Hesabını silmek istediğine emin misin?"
        description="Bu işlem geri alınamaz, tüm profil ve teklif verilerin silinecek."
        confirmLabel="Hesabı Sil"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
