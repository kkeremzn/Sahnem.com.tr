import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/brand/LogoMark';
import { usePageSeo } from '@/lib/seo';

export function NotFound() {
  // Bu bileşen hem gerçek yanlış URL'lerde hem de var olmayan bir kayda
  // (silinmiş ilan/profil id'si) gidildiğinde render ediliyor — ikisinde de
  // Google'a "bunu indeksleme" demek gerekiyor. Sunucu hâlâ HTTP 200
  // döndürüyor (SPA mimarisinin kendi sınırı, bkz. SEO denetimi Bulgu 3);
  // bu en azından içerik seviyesinde net bir sinyal veriyor.
  usePageSeo({ noindex: true });
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-gold opacity-70">
        <LogoMark size={40} />
      </div>
      <h1 className="mt-6 font-display text-7xl font-extrabold text-gradient">404</h1>
      <h2 className="mt-3 font-display text-xl font-bold text-text">Bu sahne boş görünüyor</h2>
      <p className="mt-2 max-w-sm text-sm text-text-dim">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <Link to="/">
        <Button className="mt-7" icon={<Home size={16} />}>Anasayfaya Dön</Button>
      </Link>
    </Container>
  );
}
