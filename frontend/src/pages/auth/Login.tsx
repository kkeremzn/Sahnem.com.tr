import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail } from 'lucide-react';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

const schema = z.object({
  email: z.string().email('Geçerli bir e-posta gir.'),
  password: z.string().min(1, 'Şifre gerekli.'),
});
type FormData = z.infer<typeof schema>;

export function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await login(data);
      toast('Tekrar hoş geldin!', 'success');
      navigate('/dashboard');
    } catch (e) {
      setError('root', { message: e instanceof Error ? e.message : 'Giriş yapılamadı.' });
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Tekrar hoş geldin</h1>
      <p className="mt-1.5 text-sm text-text-dim">Hesabına giriş yaparak devam et.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <Field label="E-posta" error={errors.email?.message}>
          <Input type="email" placeholder="ornek@sahnem.com" leftIcon={<Mail size={15} />} {...register('email')} invalid={!!errors.email} />
        </Field>
        <Field label="Şifre" error={errors.password?.message}>
          <Input type="password" placeholder="••••••••" {...register('password')} invalid={!!errors.password} />
        </Field>
        {errors.root && <p className="text-sm text-danger">{errors.root.message}</p>}
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs font-medium text-gold-soft hover:underline">Şifremi unuttum</Link>
        </div>
        <Button type="submit" full size="lg" icon={<LogIn size={16} />} loading={isSubmitting}>
          Giriş Yap
        </Button>
      </form>

      <div className="mt-6 rounded-md border border-border bg-deep px-4 py-3 text-xs text-text-faint">
        Demo hesap: <span className="text-text-dim">elif@sahnem.com</span> veya <span className="text-text-dim">bosphorus@sahnem.com</span> · şifre: <span className="text-text-dim">sahnem123</span>
      </div>

      <p className="mt-6 text-center text-sm text-text-dim">
        Hesabın yok mu? <Link to="/register" className="font-semibold text-gold-soft hover:underline">Kayıt Ol</Link>
      </p>
    </div>
  );
}
