import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { PageTransition } from './PageTransition';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <PageTransition />
      </main>
      <Footer />
    </div>
  );
}
