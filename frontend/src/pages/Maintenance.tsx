import { Wrench } from 'lucide-react';
import { LogoMark } from '@/components/brand/LogoMark';
import { usePageSeo } from '@/lib/seo';

// App.tsx bu sayfayı AuthProvider/RouterProvider'ın DIŞINDA render ediyor —
// API zaten kapalıyken oturum geri yükleme isteği atıp sessizce 401/zaman
// aşımına düşmesinin bir anlamı yok, bu yüzden hiçbir ağ isteği yapmıyor.
export function Maintenance() {
  usePageSeo({
    title: 'Bakımdayız | Sahnem',
    description: 'Sahnem şu anda kısa süreliğine bakımda. En kısa sürede geri döneceğiz.',
    noindex: true,
  });

  return (
    <div className="bg-noise relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-center">
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative z-10 flex max-w-md flex-col items-center">
        <span className="text-gold"><LogoMark size={32} withWordmark /></span>

        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <Wrench size={24} />
        </div>

        <h1 className="mt-6 font-display text-2xl font-extrabold text-text">Şu anda bakımdayız</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-dim">
          Sahnem kısa bir süreliğine erişime kapalı. Altyapımız üzerinde çalışıyoruz, en kısa
          sürede tekrar yayında olacağız. Anlayışın için teşekkürler.
        </p>

        <a
          href="mailto:support@sahnem.com.tr"
          className="mt-8 text-sm font-medium text-gold-soft hover:text-gold"
        >
          support@sahnem.com.tr
        </a>
      </div>
    </div>
  );
}
