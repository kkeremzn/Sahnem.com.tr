import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

// Veri gelip iskeletin yerini gerçek içeriğin aldığı an için kısa bir
// geçiş — içerik aniden "şap" diye belirmek yerine yumuşakça beliriyor.
export function FadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
