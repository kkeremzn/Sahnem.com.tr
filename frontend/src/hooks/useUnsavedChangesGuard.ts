import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

// isDirty true iken sekmeyi kapatma/yenileme (beforeunload) VE uygulama içi
// route değişimi (useBlocker, data router'da çalışır) aynı anda kapatılıyor —
// sadece biri olsaydı kullanıcı diğer yoldan kaydetmeden çıkabilirdi.
export function useUnsavedChangesGuard(isDirty: boolean) {
  useEffect(() => {
    if (!isDirty) return;
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return useBlocker(isDirty);
}
