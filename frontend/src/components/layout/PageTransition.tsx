import { motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';

// Route değişimlerinde küçük bir fade/kaydırma geçişi — sayfalar arasında
// sert bir "kesme" yerine yumuşak bir devamlılık hissi verir. key={pathname}
// değiştiğinde React motion.div'i tamamen yeniden mount ediyor (AnimatePresence'ın
// exit/enter koreografisi yerine) — daha basit ve mount/unmount zamanlamasına
// bağlı takılma riski taşımıyor.
export function PageTransition() {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <Outlet />
    </motion.div>
  );
}
