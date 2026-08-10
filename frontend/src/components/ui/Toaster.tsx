import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/cn';

const ICONS = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
};

const COLORS = {
  default: 'border-border text-text',
  success: 'border-success/40 text-success',
  error: 'border-danger/40 text-danger',
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return createPortal(
    <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-full max-w-sm flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-md border bg-card px-4 py-3 shadow-card',
                COLORS[t.kind],
              )}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-sm text-text">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-text-faint hover:text-text">
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body,
  );
}
