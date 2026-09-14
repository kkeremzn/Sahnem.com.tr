import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// URL'de bir hash varsa (ör. footer'daki "Nasıl Çalışır" linki gibi /#nasil-calisir)
// o id'ye kaydırıyor — React Router client-side navigasyonda tarayıcının
// kendiliğinden yaptığı hash-scroll davranışını taklit etmiyor, bu olmadan
// hash'li bir linke tıklamak sayfayı en üste götürüyordu (hedef bölüm hiç
// görünmeden).
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
