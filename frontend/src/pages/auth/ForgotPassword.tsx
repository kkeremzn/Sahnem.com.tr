import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, KeyRound, Lock, Mail, MailCheck, RefreshCw } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { formatApiError } from '@/lib/apiClient';
import * as authService from '@/services/authService';

const RESEND_COOLDOWN_SECONDS = 60;

type Step = 'email' | 'code' | 'password';

const emailSchema = z.object({ email: z.string().email('Geçerli bir e-posta gir.') });
type EmailFormData = z.infer<typeof emailSchema>;

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, 'Şifre en az 6 karakter olmalı.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor.',
    path: ['confirmPassword'],
  });
type PasswordFormData = z.infer<typeof passwordSchema>;

export function ForgotPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const emailForm = useForm<EmailFormData>({ resolver: zodResolver(emailSchema) });
  const passwordForm = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  async function onSubmitEmail(data: EmailFormData) {
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setStep('code');
    } catch (e) {
      emailForm.setError('root', { message: formatApiError(e, 'Kod gönderilemedi.') });
    }
  }

  async function handleVerifyCode() {
    if (code.trim().length !== 6) {
      setCodeError('6 haneli kodu eksiksiz gir.');
      return;
    }
    setCodeError(null);
    setVerifyingCode(true);
    try {
      await authService.verifyResetCode(email, code.trim());
      setStep('password');
    } catch (e) {
      setCodeError(formatApiError(e, 'Kod doğrulanamadı.'));
    } finally {
      setVerifyingCode(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setCodeError(null);
    try {
      await authService.forgotPassword(email);
      toast('Yeni kod gönderildi.', 'success');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (e) {
      const message = formatApiError(e, 'Kod gönderilemedi.');
      // Backend "Please wait N seconds before requesting a new code" diyorsa
      // sayacı sunucudaki gerçek kalan süreyle senkronla.
      const match = message.match(/(\d+)\s*seconds?/i);
      if (match) setCooldown(Number(match[1]));
      setCodeError(message);
    } finally {
      setResending(false);
    }
  }

  async function onSubmitPassword(data: PasswordFormData) {
    try {
      await authService.resetPassword(email, code.trim(), data.newPassword);
      toast('Şifren güncellendi, giriş yapabilirsin.', 'success');
      navigate('/login', { replace: true });
    } catch (e) {
      passwordForm.setError('root', { message: formatApiError(e, 'Şifre sıfırlanamadı.') });
    }
  }

  if (step === 'code') {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <MailCheck size={24} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">Kodu gir</h1>
        <p className="mt-2 text-sm text-text-dim">
          <span className="text-text">{email}</span> adresine 6 haneli bir kod gönderdik.
        </p>

        <div className="mt-7 space-y-4 text-left">
          <Field label="Doğrulama Kodu" error={codeError ?? undefined}>
            <Input
              inputMode="numeric"
              autoFocus
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-[0.5em]"
              invalid={!!codeError}
            />
          </Field>
          <Button type="button" full size="lg" loading={verifyingCode} onClick={handleVerifyCode}>
            Devam Et
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

        <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm text-text-dim hover:text-text">
          <ArrowLeft size={14} /> Giriş sayfasına dön
        </Link>
      </div>
    );
  }

  if (step === 'password') {
    return (
      <div>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
          <KeyRound size={24} />
        </div>
        <h1 className="mt-5 text-center font-display text-2xl font-bold">Yeni şifre belirle</h1>
        <p className="mt-2 text-center text-sm text-text-dim">Hesabın için yeni bir şifre gir.</p>

        <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="mt-7 space-y-4">
          <Field label="Yeni Şifre" error={passwordForm.formState.errors.newPassword?.message}>
            <Input
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={15} />}
              {...passwordForm.register('newPassword')}
              invalid={!!passwordForm.formState.errors.newPassword}
            />
          </Field>
          <Field label="Yeni Şifre (tekrar)" error={passwordForm.formState.errors.confirmPassword?.message}>
            <Input
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock size={15} />}
              {...passwordForm.register('confirmPassword')}
              invalid={!!passwordForm.formState.errors.confirmPassword}
            />
          </Field>
          {passwordForm.formState.errors.root && (
            <p className="text-sm text-danger">{passwordForm.formState.errors.root.message}</p>
          )}
          <Button type="submit" full size="lg" loading={passwordForm.formState.isSubmitting}>
            Şifreyi Güncelle
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Şifreni mi unuttun?</h1>
      <p className="mt-1.5 text-sm text-text-dim">E-posta adresini gir, sana bir doğrulama kodu gönderelim.</p>

      <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="mt-7 space-y-4">
        <Field label="E-posta" error={emailForm.formState.errors.email?.message}>
          <Input
            type="email"
            placeholder="ornek@sahnem.com"
            leftIcon={<Mail size={15} />}
            {...emailForm.register('email')}
            invalid={!!emailForm.formState.errors.email}
          />
        </Field>
        {emailForm.formState.errors.root && (
          <p className="text-sm text-danger">{emailForm.formState.errors.root.message}</p>
        )}
        <Button type="submit" full size="lg" loading={emailForm.formState.isSubmitting}>
          Kod Gönder
        </Button>
      </form>

      <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text">
        <ArrowLeft size={14} /> Giriş sayfasına dön
      </Link>
    </div>
  );
}
