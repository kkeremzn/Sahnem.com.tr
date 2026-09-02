import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Lock, MailCheck, RefreshCw, User } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useToast } from '@/context/ToastContext';
import { formatApiError } from '@/lib/apiClient';
import * as adminAuthService from '@/services/adminAuthService';

const RESEND_COOLDOWN_SECONDS = 60;
type Mode = 'login' | 'forgot-username' | 'forgot-code' | 'forgot-password';

export function AdminLogin() {
  const { login } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>('login');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [resetUsername, setResetUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate('/backstage', { replace: true });
    } catch (err) {
      setError(formatApiError(err, 'Giriş yapılamadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgotSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminAuthService.forgotPassword(resetUsername.trim());
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setMode('forgot-code');
    } catch (err) {
      setError(formatApiError(err, 'Kod gönderilemedi.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyCode() {
    if (code.trim().length !== 6) {
      setError('6 haneli kodu eksiksiz gir.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await adminAuthService.verifyResetCode(resetUsername.trim(), code.trim());
      setMode('forgot-password');
    } catch (err) {
      setError(formatApiError(err, 'Kod doğrulanamadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    try {
      await adminAuthService.forgotPassword(resetUsername.trim());
      toast('Yeni kod gönderildi.', 'success');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      const message = formatApiError(err, 'Kod gönderilemedi.');
      const match = message.match(/(\d+)\s*seconds?/i);
      if (match) setCooldown(Number(match[1]));
      setError(message);
    } finally {
      setResending(false);
    }
  }

  async function handleSetNewPassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await adminAuthService.resetPassword(resetUsername.trim(), code.trim(), newPassword);
      toast('Şifren güncellendi, giriş yapabilirsin.', 'success');
      setMode('login');
      setUsername(resetUsername);
      setPassword('');
      setResetUsername('');
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(formatApiError(err, 'Şifre sıfırlanamadı.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-7">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Lock size={20} />
          </div>
          <h1 className="mt-3 font-display text-xl font-bold text-text">Sahnem Backstage</h1>
          <p className="mt-1 text-xs text-text-faint">Yönetim erişimi</p>
        </div>

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Kullanıcı adı" error={error ?? undefined}>
              <Input autoFocus leftIcon={<User size={15} />} value={username} onChange={(e) => setUsername(e.target.value)} invalid={!!error} />
            </Field>
            <Field label="Şifre">
              <Input type="password" leftIcon={<Lock size={15} />} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Button type="submit" full loading={submitting}>Giriş Yap</Button>
            <button
              type="button"
              onClick={() => { setMode('forgot-username'); setError(null); }}
              className="w-full text-center text-xs text-text-faint hover:text-text-dim hover:underline"
            >
              Şifremi unuttum
            </button>
          </form>
        )}

        {mode === 'forgot-username' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <Field label="Kullanıcı adı" error={error ?? undefined} hint="Kayıtlı e-postana bir doğrulama kodu göndereceğiz.">
              <Input autoFocus leftIcon={<User size={15} />} value={resetUsername} onChange={(e) => setResetUsername(e.target.value)} invalid={!!error} />
            </Field>
            <Button type="submit" full loading={submitting}>Kod Gönder</Button>
            <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs text-text-faint hover:text-text-dim hover:underline">
              Girişe dön
            </button>
          </form>
        )}

        {mode === 'forgot-code' && (
          <div className="space-y-4 text-center">
            <MailCheck size={22} className="mx-auto text-gold" />
            <p className="text-xs text-text-dim">Kayıtlı e-postana 6 haneli bir kod gönderdik.</p>
            <Field label="Doğrulama Kodu" error={error ?? undefined}>
              <Input
                inputMode="numeric"
                autoFocus
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-[0.5em]"
                invalid={!!error}
              />
            </Field>
            <Button type="button" full loading={submitting} onClick={handleVerifyCode}>Devam Et</Button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className="inline-flex w-full items-center justify-center gap-1.5 text-xs text-text-faint hover:text-text-dim hover:underline disabled:cursor-not-allowed"
            >
              <RefreshCw size={12} className={resending ? 'animate-spin' : undefined} />
              {cooldown > 0 ? `Yeniden gönder (${cooldown}sn)` : 'Kodu yeniden gönder'}
            </button>
          </div>
        )}

        {mode === 'forgot-password' && (
          <form onSubmit={handleSetNewPassword} className="space-y-4">
            <div className="text-center">
              <KeyRound size={22} className="mx-auto text-gold" />
              <p className="mt-2 text-xs text-text-dim">Yeni bir şifre belirle.</p>
            </div>
            <Field label="Yeni şifre">
              <Input type="password" autoFocus value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Field>
            <Field label="Yeni şifre (tekrar)" error={error ?? undefined}>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} invalid={!!error} />
            </Field>
            <Button type="submit" full loading={submitting}>Şifreyi Güncelle</Button>
          </form>
        )}
      </div>
    </div>
  );
}
