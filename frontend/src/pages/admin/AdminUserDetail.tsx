import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, KeyRound, Mail, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { FadeIn } from '@/components/ui/FadeIn';
import { useToast } from '@/context/ToastContext';
import * as adminService from '@/services/adminService';
import { USER_TYPE_LABELS, type AdminUserDetail as AdminUserDetailType } from '@/types';
import { formatDateTime } from '@/lib/format';
import { formatApiError } from '@/lib/apiClient';

const SUSPEND_REASONS = [
  'Kullanım koşullarının ihlali',
  'Şüpheli veya sahte hesap aktivitesi',
  'Hesap etkinliklerinin incelenmesi gerekiyor',
  'Kullanıcının kendi talebi üzerine',
] as const;

export function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [detail, setDetail] = useState<AdminUserDetailType | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resetPwOpen, setResetPwOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [sendingCode, setSendingCode] = useState<'verify' | 'reset' | null>(null);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState<string>(SUSPEND_REASONS[0]);

  function load() {
    setDetail(null);
    adminService.getUserDetail(Number(id)).then(setDetail).catch((e) => {
      toast(formatApiError(e, 'Kullanıcı yüklenemedi.'), 'error');
      navigate('/backstage/users');
    });
  }

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Askıya alma gerekçesi artık serbest metin ya da (daha önce olduğu gibi)
  // hep aynı sabit metin değil — birkaç önceden tanımlı seçenekten biri
  // seçiliyor ve kullanıcıya giden bildirim e-postasında da bu gerçek
  // gerekçe görünüyor.
  async function handleConfirmSuspend() {
    if (!detail) return;
    setBusy(true);
    try {
      await adminService.suspendUser(detail.user.id, suspendReason);
      toast('Kullanıcı askıya alındı. Açık oturumları sonlandırıldı, tekrar giriş yapamaz.', 'success');
      setSuspendOpen(false);
      load();
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleReactivate() {
    if (!detail) return;
    setBusy(true);
    try {
      await adminService.reactivateUser(detail.user.id);
      toast('Kullanıcı yeniden aktifleştirildi.', 'success');
      load();
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleSendVerificationCode() {
    if (!detail) return;
    setSendingCode('verify');
    try {
      await adminService.sendVerificationCodeToUser(detail.user.id);
      toast('Doğrulama kodu kullanıcının e-postasına gönderildi.', 'success');
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setSendingCode(null);
    }
  }

  async function handleSendResetCode() {
    if (!detail) return;
    setSendingCode('reset');
    try {
      await adminService.sendPasswordResetCodeToUser(detail.user.id);
      toast('Şifre sıfırlama kodu kullanıcının e-postasına gönderildi.', 'success');
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setSendingCode(null);
    }
  }

  async function handleResetPassword() {
    if (!detail) return;
    setBusy(true);
    try {
      await adminService.resetUserPassword(detail.user.id, newPassword);
      toast('Şifre değiştirildi. Kullanıcının açık oturumları sonlandırıldı.', 'success');
      setResetPwOpen(false);
      setNewPassword('');
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!detail) return;
    setBusy(true);
    try {
      await adminService.deleteUser(detail.user.id);
      toast('Kullanıcı ve tüm ilişkili verileri silindi.', 'success');
      navigate('/backstage/users');
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setBusy(false);
      setDeleteOpen(false);
    }
  }

  if (detail === null) {
    return (
      <div className="max-w-2xl">
        <Skeleton className="mb-4 h-4 w-32" />
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="mt-4 rounded-md border border-border bg-card p-5 first:mt-0">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-3 h-3 w-2/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const { user } = detail;

  return (
    <FadeIn>
    <div className="max-w-2xl">
      <Link to="/backstage/users" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text">
        <ArrowLeft size={14} /> Kullanıcılara dön
      </Link>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-xl font-bold text-text">{user.firstName} {user.lastName}</h1>
          {!user.isActive && <Badge variant="danger">Askıda</Badge>}
          <Badge variant="accent">{user.role === 'Admin' ? 'Admin' : USER_TYPE_LABELS[user.role]}</Badge>
        </div>
        <p className="mt-1.5 text-sm text-text-dim">{user.email} · {user.phoneNumber}</p>
        {detail.profileSummary && <p className="mt-1 text-sm text-text-faint">{detail.profileSummary}</p>}
        <p className="mt-3 text-xs text-text-faint">
          Kayıt: {formatDateTime(user.createdDate)} ·{' '}
          {user.isEmailConfirmed ? 'E-posta doğrulandı' : 'E-posta doğrulanmadı'} ·{' '}
          {user.isProfileCompleted ? 'Profil tamam' : 'Profil eksik'}
        </p>
      </Card>

      <Card className="mt-4">
        <h3 className="mb-3 text-sm font-semibold text-text">Etkinlik</h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          <div><p className="font-display text-lg font-bold text-text">{detail.advertCount}</p><p className="text-xs text-text-faint">İlan</p></div>
          <div><p className="font-display text-lg font-bold text-text">{detail.offerCount}</p><p className="text-xs text-text-faint">Teklif</p></div>
          <div><p className="font-display text-lg font-bold text-text">{detail.conversationCount}</p><p className="text-xs text-text-faint">Sohbet</p></div>
          <div><p className="font-display text-lg font-bold text-text">{detail.messageCount}</p><p className="text-xs text-text-faint">Mesaj</p></div>
          <div><p className="font-display text-lg font-bold text-text">{detail.favoriteCount}</p><p className="text-xs text-text-faint">Favori</p></div>
        </div>
      </Card>

      <Card className="mt-4">
        <h3 className="mb-1 text-sm font-semibold text-text">Destek</h3>
        <p className="mb-4 text-xs text-text-faint">
          Kullanıcı koda/e-postaya ulaşamadığını söylerse buradan tekrar gönderebilir ya da doğrudan şifresini değiştirebilirsin.
        </p>
        <div className="flex flex-wrap gap-2">
          {!user.isEmailConfirmed && (
            <Button variant="secondary" size="sm" icon={<Mail size={14} />} loading={sendingCode === 'verify'} onClick={handleSendVerificationCode}>
              Doğrulama Kodu Gönder
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<Mail size={14} />} loading={sendingCode === 'reset'} onClick={handleSendResetCode}>
            Şifre Sıfırlama Kodu Gönder
          </Button>
          <Button variant="secondary" size="sm" icon={<KeyRound size={14} />} onClick={() => setResetPwOpen(true)}>
            Şifreyi Doğrudan Değiştir
          </Button>
        </div>
      </Card>

      <Card className="mt-4 border-danger/30">
        <h3 className="mb-1 text-sm font-semibold text-danger">İşlemler</h3>
        <p className="mb-4 text-xs text-text-faint">
          Askıya almak hesabı hemen kilitler: kullanıcı giriş yapamaz ve açık oturumları (refresh token'ları) sonlandırılır.
          Silmek geri alınamaz, ilan/teklif/mesaj/favori dahil tüm verisini kalıcı olarak kaldırır.
        </p>
        <div className="flex gap-2">
          <Button
            variant={user.isActive ? 'secondary' : 'primary'}
            icon={user.isActive ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
            loading={busy}
            onClick={() => (user.isActive ? setSuspendOpen(true) : handleReactivate())}
          >
            {user.isActive ? 'Askıya Al' : 'Aktifleştir'}
          </Button>
          <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setDeleteOpen(true)}>Hesabı Sil</Button>
        </div>
      </Card>

      <Modal open={resetPwOpen} onClose={() => setResetPwOpen(false)} title="Şifreyi doğrudan değiştir">
        <p className="mb-3 text-xs text-text-faint">
          Yeni şifreyi kullanıcıya güvenli bir kanaldan (telefon vb.) sen ileteceksin. Kaydedilince kullanıcının tüm açık oturumları sonlandırılır.
        </p>
        <Field label="Yeni şifre">
          <Input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </Field>
        <Button className="mt-4" full loading={busy} disabled={newPassword.length < 6} onClick={handleResetPassword}>
          Şifreyi Kaydet
        </Button>
      </Modal>

      <Modal open={suspendOpen} onClose={() => setSuspendOpen(false)} title="Kullanıcıyı askıya al">
        <p className="mb-3 text-xs text-text-faint">
          Hesap hemen kilitlenir, açık oturumları sonlandırılır. Seçtiğin gerekçe kullanıcıya gönderilen bilgilendirme e-postasında görünecek.
        </p>
        <Field label="Gerekçe">
          <Select value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)}>
            {SUSPEND_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
        </Field>
        <Button className="mt-4" variant="danger" full loading={busy} onClick={handleConfirmSuspend}>
          Askıya Al
        </Button>
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Kullanıcıyı sil"
        description={`${user.firstName} ${user.lastName} adlı kullanıcıyı ve tüm ilişkili verilerini kalıcı olarak silmek istediğine emin misin? Bu işlem geri alınamaz.`}
        confirmLabel="Kalıcı Olarak Sil"
        danger
        loading={busy}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
    </FadeIn>
  );
}
