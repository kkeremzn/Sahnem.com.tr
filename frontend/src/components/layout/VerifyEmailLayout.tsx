import { Navigate, Outlet, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';
import { getHomeRoute } from '@/lib/homeRoute';

export function VerifyEmailLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.isEmailConfirmed) return <Navigate to={getHomeRoute(user)} replace />;

  return (
    <div className="min-h-screen bg-black">
      <header className="border-b border-border py-5">
        <Container className="flex items-center justify-between">
          <Link to="/" className="text-gold">
            <LogoMark size={26} withWordmark />
          </Link>
          <span className="text-sm text-text-dim">{user.email}</span>
        </Container>
      </header>
      <main className="flex items-center justify-center py-16">
        <Container className="max-w-md">
          <Outlet />
        </Container>
      </main>
    </div>
  );
}
