import { Navigate, Outlet, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

export function ProfileSetupLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.isProfileCompleted) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-border py-5">
        <Container className="flex items-center justify-between">
          <Link to="/" className="text-gold">
            <LogoMark size={26} withWordmark />
          </Link>
          <span className="text-sm text-text-dim">Merhaba, {user.firstName}</span>
        </Container>
      </header>
      <main className="py-10">
        <Container className="max-w-2xl">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
