import { Link } from 'react-router-dom';
import { Camera, Link2, PlayCircle } from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { Container } from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

const PRODUCT_LINKS = [
  { label: 'Müzisyen Keşfet', to: '/explore' },
  { label: 'İlanları İncele', to: '/jobs' },
  { label: 'Nasıl Çalışır', to: '/about' },
];

const COMPANY_LINKS = [
  { label: 'Hakkımızda', to: '/about' },
  { label: 'Yardım Merkezi', to: '/help' },
];

const LEGAL_LINKS = [
  { label: 'Kullanım Koşulları', to: '/help' },
  { label: 'Gizlilik Politikası', to: '/help' },
  { label: 'KVKK', to: '/help' },
];

export function Footer() {
  const { user } = useAuth();

  // Oturum durumuna göre değişen tek sütun: çıkış yapmış ziyaretçiye Giriş/Kayıt,
  // oturum açık kullanıcıya hesap kısayolları gösterilir — ikisi asla aynı anda
  // görünmez (daha önce burada oturum açıkken bile "Giriş Yap/Kayıt Ol" gösteriliyordu).
  const accountLinks = user
    ? [
        { label: 'Panel', to: '/dashboard' },
        { label: 'Profilim', to: '/profile/edit' },
        { label: 'Ayarlar', to: '/settings' },
      ]
    : [
        { label: 'Giriş Yap', to: '/login' },
        { label: 'Kayıt Ol', to: '/register' },
      ];

  const columns = [
    { title: 'Ürün', links: PRODUCT_LINKS },
    { title: 'Hesap', links: accountLinks },
    { title: 'Şirket', links: COMPANY_LINKS },
    { title: 'Yasal', links: LEGAL_LINKS },
  ];

  return (
    <footer className="border-t border-border bg-deep">
      <Container className="grid grid-cols-2 gap-8 py-14 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 lg:col-span-2">
          <Link to="/" className="text-gold">
            <LogoMark size={26} withWordmark />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-text-dim">
            Müzisyenleri organizatör ve mekanlarla buluşturan müzik profesyonelleri ağı.
          </p>
          <div className="mt-5 flex gap-2">
            {[Camera, PlayCircle, Link2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-dim transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold text-text">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-text-dim transition-colors hover:text-text">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-border py-5">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-text-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Sahnem. Tüm hakları saklıdır.</p>
          <p>İstanbul, Türkiye</p>
        </Container>
      </div>
    </footer>
  );
}
