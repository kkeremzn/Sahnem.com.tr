import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Navbar } from './Navbar';
import { AppFooter } from './AppFooter';
import { AppSidebar } from './AppSidebar';
import { AppMobileNav } from './AppMobileNav';
import { ScrollToTop } from './ScrollToTop';
import { PageTransition } from './PageTransition';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

export function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user.isEmailConfirmed && user.role !== 'Admin') {
    return <Navigate to="/verify-email" replace />;
  }

  // Admin hesapları manuel olarak DB'den atanıyor ve hiç Musician/Organizer/Venue
  // profili kurmuyor — profil sihirbazının bu rol için hiç seçeneği yok, bu yüzden
  // isProfileCompleted kontrolü admin için atlanıyor (yoksa sonsuz yönlendirme olur).
  if (!user.isProfileCompleted && user.role !== 'Admin') {
    return <Navigate to="/profile-setup" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <ScrollToTop />
      <Navbar />
      <AppMobileNav />
      <main className="flex-1">
        <Container className="flex gap-8 py-8">
          <AppSidebar />
          <div className="min-w-0 flex-1">
            <PageTransition />
          </div>
        </Container>
      </main>
      <AppFooter />
    </div>
  );
}
