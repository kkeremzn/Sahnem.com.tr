import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mic2, Store, UserPlus } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { USER_TYPE_LABELS, type UserType } from '@/types';
import { cn } from '@/lib/cn';
import { formatApiError } from '@/lib/apiClient';

const schema = z
  .object({
    firstName: z.string().min(2, 'Ad gerekli.'),
    lastName: z.string().min(2, 'Soyad gerekli.'),
    email: z.string().email('Geçerli bir e-posta gir.'),
    phoneNumber: z.string().min(10, 'Geçerli bir telefon numarası gir.'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı.'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, { message: 'Devam etmek için koşulları kabul etmelisin.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor.',
    path: ['confirmPassword'],
  });
type FormData = z.infer<typeof schema>;

const ROLES: { value: UserType; icon: typeof Mic2 }[] = [
  { value: 'Musician', icon: Mic2 },
  { value: 'Organizer', icon: Building2 },
  { value: 'Venue', icon: Store },
];

export function Register() {
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserType>('Musician');
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      // Backend'in register uçları hiç "role" almıyor — rol ancak profil
      // oluşturulunca atanıyor. Buradaki seçim sadece profil kurulum
      // sihirbazına hangi formun gösterileceğini söylemek için taşınıyor.
      const { confirmPassword: _confirmPassword, terms: _terms, ...registerInput } = data;
      // Not: registerUser() sonrası AuthContext'teki user state'i değişince
      // AuthLayout kendi Navigate guard'ı ile /profile-setup'a state'siz olarak
      // ZATEN yönlendiriyor (bkz. AuthLayout.tsx) — bu yüzden aşağıdaki navigate
      // çağrısı bu redirect'le yarışıyor ve state kaybolabiliyor. sessionStorage,
      // navigasyondan bağımsız olduğu için bu yarış durumundan etkilenmiyor.
      sessionStorage.setItem('sahnem_pending_role', role);
      await registerUser(registerInput);
      toast('Hesabın oluşturuldu, profilini tamamlayalım.', 'success');
      navigate('/profile-setup', { state: { role } });
    } catch (e) {
      setError('root', { message: formatApiError(e, 'Kayıt olunamadı.') });
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Hesap oluştur</h1>
      <p className="mt-1.5 text-sm text-text-dim">Sahnem'e katılmak için birkaç adım yeterli.</p>

      <div className="mt-6 grid grid-cols-3 gap-2">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-md border px-3 py-3 text-xs font-medium transition-colors',
              role === r.value ? 'border-gold bg-gold/10 text-gold-soft' : 'border-border text-text-dim hover:border-border-hover',
            )}
          >
            <r.icon size={18} />
            {USER_TYPE_LABELS[r.value]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Ad" error={errors.firstName?.message}>
            <Input placeholder="Elif" {...register('firstName')} invalid={!!errors.firstName} />
          </Field>
          <Field label="Soyad" error={errors.lastName?.message}>
            <Input placeholder="Yıldız" {...register('lastName')} invalid={!!errors.lastName} />
          </Field>
        </div>
        <Field label="E-posta" error={errors.email?.message}>
          <Input type="email" placeholder="ornek@sahnem.com" {...register('email')} invalid={!!errors.email} />
        </Field>
        <Field label="Telefon" error={errors.phoneNumber?.message}>
          <Input type="tel" placeholder="532 111 22 33" {...register('phoneNumber')} invalid={!!errors.phoneNumber} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Şifre" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register('password')} invalid={!!errors.password} />
          </Field>
          <Field label="Şifre (tekrar)" error={errors.confirmPassword?.message}>
            <Input type="password" placeholder="••••••••" {...register('confirmPassword')} invalid={!!errors.confirmPassword} />
          </Field>
        </div>
        <label className="flex items-start gap-2.5 text-xs text-text-dim">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-gold" {...register('terms')} />
          <span>
            <Link to="/help" className="text-gold-soft hover:underline">Kullanım Koşulları</Link> ve{' '}
            <Link to="/help" className="text-gold-soft hover:underline">Gizlilik Politikası</Link>'nı okudum, kabul ediyorum.
          </span>
        </label>
        {errors.terms && <p className="-mt-2 text-xs text-danger">{errors.terms.message}</p>}
        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}
        <Button type="submit" full size="lg" icon={<UserPlus size={16} />} loading={isSubmitting}>
          Kayıt Ol
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-dim">
        Zaten hesabın var mı? <Link to="/login" className="font-semibold text-gold-soft hover:underline">Giriş Yap</Link>
      </p>
    </div>
  );
}
