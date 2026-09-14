import { motion } from 'framer-motion';
import { LogoMark } from '@/components/brand/LogoMark';

// Oturum durumu netleşene kadar (tryRestoreSession, admin oturum kontrolü vb.)
// gösterilen tam sayfa yükleme ekranı — markasız çıplak bir dönen ikon yerine
// logo + "SAHNEM" yazısı ve altında ince bir yükleniyor çubuğu gösteriyor,
// böylece giriş/çıkış gibi geçişlerde de aynı tutarlı, markalı an yaşanıyor.
export function AppBootLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-gold"
      >
        <LogoMark size={34} withWordmark />
      </motion.div>
      <div className="h-0.5 w-28 overflow-hidden rounded-full bg-card">
        <motion.div
          className="h-full w-1/3 rounded-full bg-gold"
          animate={{ x: ['-100%', '260%'] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
