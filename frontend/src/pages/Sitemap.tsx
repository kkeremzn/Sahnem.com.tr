import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';

const GROUPS = [
  {
    title: 'Genel',
    links: [
      { to: '/', label: 'Anasayfa' },
      { to: '/explore', label: 'Müzisyen Keşfet' },
      { to: '/jobs', label: 'İlanlar' },
      { to: '/about', label: 'Hakkımızda' },
      { to: '/help', label: 'Yardım Merkezi' },
    ],
  },
  {
    title: 'Kimlik doğrulama',
    links: [
      { to: '/login', label: 'Giriş Yap' },
      { to: '/register', label: 'Kayıt Ol' },
      { to: '/forgot-password', label: 'Şifremi Unuttum' },
      { to: '/profile-setup', label: 'Profil Kurulumu' },
    ],
  },
  {
    title: 'Panel',
    links: [
      { to: '/dashboard', label: 'Panel' },
      { to: '/profile/edit', label: 'Profili Düzenle' },
      { to: '/settings', label: 'Ayarlar' },
      { to: '/notifications', label: 'Bildirimler' },
      { to: '/messages', label: 'Mesajlar' },
    ],
  },
  {
    title: 'Müzisyen',
    links: [
      { to: '/offers', label: 'Tekliflerim' },
    ],
  },
  {
    title: 'İşveren',
    links: [
      { to: '/post-advert', label: 'İlan Ver' },
      { to: '/my-adverts', label: 'İlanlarım' },
      { to: '/favorites', label: 'Favori Müzisyenler' },
    ],
  },
];

export function Sitemap() {
  return (
    <Container className="py-14">
      <h1 className="font-display text-2xl font-bold">Site Haritası</h1>
      <p className="mt-1.5 text-sm text-text-dim">Geliştirme amaçlı tüm route'ların listesi.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map((group) => (
          <Card key={group.title}>
            <h3 className="mb-3 text-sm font-semibold text-gold-soft">{group.title}</h3>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-text-dim hover:text-text hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Container>
  );
}
