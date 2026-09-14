import { Navigate, Outlet, Link } from 'react-router-dom';
import { LogoMark } from '@/components/brand/LogoMark';
import { AppBootLoader } from './AppBootLoader';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';
import { getHomeRoute } from '@/lib/homeRoute';

export function ProfileSetupLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppBootLoader />;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!user.isEmailConfirmed && user.role !== 'Admin') return <Navigate to="/verify-email" replace />;
  if (user.isProfileCompleted) return <Navigate to={getHomeRoute(user)} replace />;

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
