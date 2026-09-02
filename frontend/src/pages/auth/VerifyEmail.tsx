import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw, Trash2 } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatApiError } from '@/lib/apiClient';
import * as authService from '@/services/authService';

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmail() {
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  // Kayıt anında backend zaten bir kod gönderdiği için sayaç sayfa açılır
  // açılmaz dolu başlıyor — kullanıcı hemen "yeniden gönder"e basıp Zoho
  // kotasını/kendi kutusunu spam'lemesin.
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleVerify() {
    if (code.trim().length !== 6) {
      setError('6 haneli kodu eksiksiz gir.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await authService.verifyEmail(code.trim());
      await refreshUser();
      toast('E-posta doğrulandı!', 'success');
      navigate('/profile-setup', { replace: true });
    } catch (e) {
      setError(formatApiError(e, 'Kod doğrulanamadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await authService.resendVerificationEmail();
      toast('Yeni kod gönderildi.', 'success');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (e) {
      const message = formatApiError(e, 'Kod gönderilemedi.');
      // Backend "Please wait N seconds before requesting a new code" diyorsa
      // sayacı sunucudaki gerçek kalan süreyle senkronla.
      const match = message.match(/(\d+)\s*seconds?/i);
      if (match) setCooldown(Number(match[1]));
      setError(message);
    } finally {
      setResending(false);
    }
  }

  async function handleCancelRegistration() {
    setCancelling(true);
    try {
      await authService.deleteAccount();
      logout();
      toast('Kayıt iptal edildi.', 'success');
      navigate('/register', { replace: true });
    } catch (e) {
      toast(formatApiError(e, 'Hesap silinemedi.'), 'error');
    } finally {
      setCancelling(false);
      setCancelOpen(false);
    }
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
        <MailCheck size={24} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold">E-postanı doğrula</h1>
      <p className="mt-2 text-sm text-text-dim">
        <span className="text-text">{user?.email}</span> adresine 6 haneli bir kod gönderdik.
      </p>

      <div className="mt-7 space-y-4 text-left">
        <Field label="Doğrulama Kodu" error={error ?? undefined}>
          <Input
            inputMode="numeric"
            autoFocus
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-lg tracking-[0.5em]"
            invalid={!!error}
          />
        </Field>
        <Button type="button" full size="lg" loading={submitting} onClick={handleVerify}>
          Doğrula
        </Button>
      </div>

      <button
        type="button"
        onClick={handleResend}
        disabled={cooldown > 0 || resending}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-gold-soft hover:underline disabled:cursor-not-allowed disabled:text-text-faint disabled:no-underline"
      >
        <RefreshCw size={14} className={resending ? 'animate-spin' : undefined} />
        {cooldown > 0 ? `Yeniden gönder (${cooldown}sn)` : 'Kodu yeniden gönder'}
      </button>

      {/* Kayıt sırasında burada takılıp kalan (yanlış e-posta girdi, vazgeçti vb.)
          bir kullanıcının çıkış yolu olmalı — aksi halde ne devam edebilir ne de
          o e-postayla tekrar kayıt olabilir. "Çıkış yap" ilerlemesini korur (sonra
          giriş yapıp devam edebilir), "hesabı sil" tamamen sıfırlar. */}
      <div className="mt-8 flex items-center justify-center gap-4 border-t border-border pt-5 text-xs text-text-faint">
        <button type="button" onClick={() => { logout(); navigate('/login', { replace: true }); }} className="hover:text-text-dim hover:underline">
          Çıkış yap, sonra devam et
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={() => setCancelOpen(true)}
          className="inline-flex items-center gap-1 hover:text-danger hover:underline"
        >
          <Trash2 size={12} /> Kaydı iptal et
        </button>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title="Kaydı iptal et"
        description="Bu hesap tamamen silinecek ve baştan kayıt olman gerekecek. Emin misin?"
        confirmLabel="Evet, sil"
        danger
        loading={cancelling}
        onConfirm={handleCancelRegistration}
        onClose={() => setCancelOpen(false)}
      />
    </div>
  );
}
