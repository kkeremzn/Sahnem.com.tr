import { Navigate, Link } from 'react-router-dom';
import { LogoMark } from '@/components/brand/LogoMark';
import { useAuth } from '@/context/AuthContext';
import { ScrollToTop } from './ScrollToTop';
import { PageTransition } from './PageTransition';

export function AuthLayout() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to={user.isProfileCompleted ? '/dashboard' : '/profile-setup'} replace />;
  }

  return (
    <div className="grid min-h-screen bg-black lg:grid-cols-2">
      <ScrollToTop />
      <div className="bg-noise relative hidden flex-col justify-between overflow-hidden bg-deep p-12 lg:flex">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <Link to="/" className="relative z-10 text-gold">
          <LogoMark size={30} withWordmark />
        </Link>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-text">
            Sahnede olması <span className="text-gradient">gereken</span> herkes burada.
          </h2>
          <p className="mt-4 text-base text-text-dim">
            Müzisyenleri organizatör ve mekanlarla buluşturan müzik profesyonelleri ağı. Teklif ver, ilan aç, sahneni bul.
          </p>
        </div>
        <p className="relative z-10 text-sm text-text-faint">© {new Date().getFullYear()} Sahnem</p>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 lg:hidden">
          <Link to="/" className="text-gold">
            <LogoMark size={28} withWordmark />
          </Link>
        </div>
        <div className="w-full max-w-md">
          <PageTransition />
        </div>
      </div>
    </div>
  );
}
