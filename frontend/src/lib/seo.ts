import { useEffect } from 'react';

const SITE_ORIGIN = 'https://sahnem.com.tr';
const DEFAULT_TITLE = 'Sahnem — Müzik Profesyonelleri Ağı';
const DEFAULT_DESCRIPTION = 'Sahnem — müzisyenleri organizatör ve mekanlarla buluşturan müzik profesyonelleri ağı.';
// Şu an 1200x630 ölçüsünde özel bir paylaşım görseli yok — kare logo,
// hiç görsel olmamasından iyi. İleride gerçek bir OG görseli eklenirse
// burası tek nokta.
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/favicon-512x512.png`;

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
    const resolvedTitle = title ? title : DEFAULT_TITLE;
    const resolvedDescription = description ?? DEFAULT_DESCRIPTION;

    document.title = resolvedTitle;
    upsertMeta('name', 'description', resolvedDescription);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    if (!noindex) {
      const path = canonicalPath ?? window.location.pathname;
      const url = `${SITE_ORIGIN}${path}`;
      upsertCanonical(url);

      // Open Graph/Twitter Card — arama sıralamasını etkilemez, sadece
      // WhatsApp/Twitter/LinkedIn gibi yerlerde link paylaşılınca düzgün bir
      // önizleme (başlık/açıklama/görsel) çıkmasını sağlar.
      upsertMeta('property', 'og:type', 'website');
      upsertMeta('property', 'og:site_name', 'Sahnem');
      upsertMeta('property', 'og:title', resolvedTitle);
      upsertMeta('property', 'og:description', resolvedDescription);
      upsertMeta('property', 'og:url', url);
      upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
      upsertMeta('name', 'twitter:card', 'summary_large_image');
      upsertMeta('name', 'twitter:title', resolvedTitle);
      upsertMeta('name', 'twitter:description', resolvedDescription);
      upsertMeta('name', 'twitter:image', DEFAULT_OG_IMAGE);
    } else {
      // noindex sayfalarda canonical ve OG/Twitter etiketleri bırakmıyoruz —
      // hem çelişkili sinyal olmasın hem de kullanıcıya özel sayfalar için
      // paylaşım önizlemesi üretilmesin.
      document.querySelector('link[rel="canonical"]')?.remove();
      ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image'].forEach((key) =>
        document.querySelector(`meta[property="${key}"]`)?.remove());
      ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach((key) =>
        document.querySelector(`meta[name="${key}"]`)?.remove());
    }

    // Sayfa değişince başlık/description bir önceki sayfada "takılı" kalmasın
    // diye temizlemiyoruz — bir sonraki sayfa zaten kendi değerini set ediyor;
    // bu component unmount olurken index.html'deki varsayılana dönmenin bir
    // faydası yok, gereksiz bir flaş yaratır.
  }, [title, description, canonicalPath, noindex]);
}
