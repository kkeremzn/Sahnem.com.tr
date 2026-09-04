import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AppSidebar } from './AppSidebar';
import { AppMobileNav } from './AppMobileNav';
import { ScrollToTop } from './ScrollToTop';
import { PageTransition } from './PageTransition';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

// Keşfet, İlanlar, müzisyen/işveren profilleri gibi sayfalar hem çıkış yapmış
// ziyaretçiye hem de giriş yapmış kullanıcıya açık — bu yüzden AppLayout'un
// aksine burada auth zorunlu değil. Ama giriş yapmış bir kullanıcı bu
// sayfalara AppSidebar'daki bir bağlantıdan geldiğinde (ör. "İlanları Keşfet")
// sidebar'ın birden kaybolması kafa karıştırıcıydı — bu yüzden profili
// tamamlanmış kullanıcılar için sidebar burada da gösteriliyor.
export function PublicLayout() {
  const { user } = useAuth();
  const showSidebar = !!user && user.isProfileCompleted && user.role !== 'Admin';

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <ScrollToTop />
      <Navbar />
      {showSidebar && <AppMobileNav />}
      <main className="flex-1">
        {showSidebar ? (
          <Container className="flex gap-8 py-8">
            <AppSidebar />
            <div className="min-w-0 flex-1">
              <PageTransition />
            </div>
          </Container>
        ) : (
          <PageTransition />
        )}
      </main>
      <Footer />
    </div>
  );
}
