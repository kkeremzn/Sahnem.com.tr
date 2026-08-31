import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';

// AppLayout (giriş yapılmış panel ekranları) için minimal footer. Pazarlama
// sitesindeki tam Footer'ı (logo tanıtımı, 4 sütun, sosyal ikonlar) burada
// tekrarlamak, panel ekranlarını anasayfayla neredeyse ayırt edilemez kılıyordu —
// bu ayrım daha net olsun diye sadece gerekli kısayollar bırakıldı.
export function AppFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-text-faint sm:flex-row">
        <p>© {new Date().getFullYear()} Sahnem. Tüm hakları saklıdır.</p>
        <div className="flex items-center gap-5">
          <Link to="/help" className="transition-colors hover:text-text-dim">Yardım</Link>
          <Link to="/settings" className="transition-colors hover:text-text-dim">Ayarlar</Link>
        </div>
      </Container>
    </footer>
  );
}
