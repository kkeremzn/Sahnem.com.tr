import { useEffect } from 'react';

const SITE_ORIGIN = 'https://sahnem.com.tr';
const DEFAULT_TITLE = 'Sahnem — Müzik Profesyonelleri Ağı';
const DEFAULT_DESCRIPTION = 'Sahnem — müzisyenleri organizatör ve mekanlarla buluşturan müzik profesyonelleri ağı.';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

interface PageSeoOptions {
  // Sekme/arama sonucu başlığı — sayfa kendi formatını belirler (ör. "İlanlar | Sahnem").
  title?: string;
  description?: string;
  // "/jobs/12" gibi köke göre yol — sondaki "?query" ve "/" farklarını tek bir
  // adrese indirger (bkz. Bulgu 5/7: aynı içeriğin birden fazla URL'de olması).
  canonicalPath?: string;
  // Giriş gerektiren, yönetim paneli veya içeriği kaldırılmış/bulunamayan
  // sayfalar için true — Google'a "bunu indeksleme" der.
  noindex?: boolean;
}

// SPA client-side render olduğu için sayfa başlığı/meta'sı tek bir statik
// index.html'den geliyordu — her sayfa Google'a birebir aynı title/description
// ile gidiyordu (bkz. SEO denetimi Bulgu 2). Bu hook, react-helmet gibi bir
// bağımlılık eklemeden (bu proje SSR kullanmıyor, ihtiyaç yok) sayfa geçişinde
// document.head'i günceller.
export function usePageSeo({ title, description, canonicalPath, noindex = false }: PageSeoOptions) {
  useEffect(() => {
    document.title = title ? title : DEFAULT_TITLE;
    upsertMeta('name', 'description', description ?? DEFAULT_DESCRIPTION);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (!noindex) {
      const path = canonicalPath ?? window.location.pathname;
      upsertCanonical(`${SITE_ORIGIN}${path}`);
    } else {
      // noindex sayfalarda canonical bırakmıyoruz — çelişkili sinyal olmasın.
      document.querySelector('link[rel="canonical"]')?.remove();
    }

    // Sayfa değişince başlık/description bir önceki sayfada "takılı" kalmasın
    // diye temizlemiyoruz — bir sonraki sayfa zaten kendi değerini set ediyor;
    // bu component unmount olurken index.html'deki varsayılana dönmenin bir
    // faydası yok, gereksiz bir flaş yaratır.
  }, [title, description, canonicalPath, noindex]);
}
