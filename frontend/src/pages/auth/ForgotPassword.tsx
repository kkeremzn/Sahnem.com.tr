import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { delay } from '@/lib/async';

const schema = z.object({ email: z.string().email('Geçerli bir e-posta gir.') });
type FormData = z.infer<typeof schema>;

export function ForgotPassword() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    await delay(500);
    setSentTo(data.email);
  }

  if (sentTo) {
    return (
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <MailCheck size={24} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">E-postanı kontrol et</h1>
        <p className="mt-2 text-sm text-text-dim">
          <span className="text-text">{sentTo}</span> adresine şifre sıfırlama bağlantısı gönderdik.
        </p>
        <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-soft hover:underline">
          <ArrowLeft size={14} /> Giriş sayfasına dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Şifreni mi unuttun?</h1>
      <p className="mt-1.5 text-sm text-text-dim">E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Field label="E-posta" error={errors.email?.message}>
          <Input type="email" placeholder="ornek@sahnem.com" leftIcon={<Mail size={15} />} {...register('email')} invalid={!!errors.email} />
        </Field>
        <Button type="submit" full size="lg" loading={isSubmitting}>Sıfırlama Bağlantısı Gönder</Button>
      </form>

      <Link to="/login" className="mt-6 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text">
        <ArrowLeft size={14} /> Giriş sayfasına dön
      </Link>
    </div>
  );
}
