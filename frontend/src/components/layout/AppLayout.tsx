import { Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AppSidebar } from './AppSidebar';
import { AppMobileNav } from './AppMobileNav';
import { ScrollToTop } from './ScrollToTop';
import { PageTransition } from './PageTransition';
import { AppBootLoader } from './AppBootLoader';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';
import { usePageSeo } from '@/lib/seo';

export function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  // Bu layout'un altındaki her ekran (Panel, Mesajlar, İlanlarım, Ayarlar vb.)
  // kullanıcıya özel veri gösteriyor — tek bir yerden noindex uygulanıyor,
  // tek tek her sayfaya eklemeye gerek yok.
  usePageSeo({ noindex: true });

  if (loading) {
    return <AppBootLoader />;
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
      <Footer />
    </div>
  );
}
