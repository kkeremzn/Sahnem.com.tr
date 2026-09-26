import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Search, SlidersHorizontal } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { AdvertCard } from '@/components/advert/AdvertCard';
import * as advertService from '@/services/advertService';
import { CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, optionsFrom, type Advert, type City, type MusicBranch } from '@/types';
import { usePageSeo } from '@/lib/seo';

const PAGE_SIZE = 8;

export function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<MusicBranch | ''>((searchParams.get('branch') as MusicBranch) ?? '');
  const [city, setCity] = useState<City | ''>('');
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // page (branş/şehir'in aksine) URL'de tutuluyor — 2. ve sonraki sayfalar
  // önceki sayfalardan tamamen farklı ilanlar gösteriyor, bunların gerçek,
  // paylaşılabilir bir adresi olmalı. Google'ın kendi rehberi, sayfalanmış
  // sayfaları 1. sayfaya canonical yapmayı "en yıkıcı sayfalama hatası"
  // olarak tanımlıyor (2+ sayfadaki içeriği index'ten düşürüyor) — bu yüzden
  // aşağıda sadece 1. sayfa /jobs'a, 2+ kendine referans veriyor. Branş/şehir
  // filtreleri ise bilinçli olarak URL'e yazılmıyor (bkz. usePageSeo) —
  // bunlar aynı ilanların alt kümesi, ayrı ayrı indekslenmeye değecek kadar
  // içerik hacmi yok, her ilan zaten kendi /jobs/:id adresinden indeksleniyor.
  const initialPage = Number(searchParams.get('page')) || 1;
  const [page, setPageState] = useState(initialPage);

  function setPage(next: number) {
    setPageState(next);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next > 1) params.set('page', String(next));
      else params.delete('page');
      return params;
    }, { replace: true });
  }

  usePageSeo({
    title: 'Müzisyen Arayan İlanlar | Sahnem',
    description: 'Organizatör ve mekanların yayınladığı açık ilanları incele, müzisyen olarak teklifini gönder.',
    canonicalPath: page > 1 ? `/jobs?page=${page}` : '/jobs',
  });

  // İlk mount'ta bu efekt çalışırsa (search/branch/city bağımlılıkları her
  // zaman ilk render'da da "değişmiş" sayılır) URL'deki ?page=3 gibi paylaşılmış
  // bir bağlantı, veri daha yüklenmeden sayfa 1'e sıfırlanırdı. Basit bir
  // "ilk çalışmayı atla" bayrağı React 18 StrictMode'un geliştirmede
  // efektleri iki kez çalıştırmasıyla kırılıyor (bayrak ilk çalışmada false
  // olup kalıyor, ikinci çalışma "değişmiş" sanıyor) — bunun yerine gerçek
  // başlangıç değerleriyle karşılaştırıyoruz, kaç kez çalışırsa çalışsın
  // filtreler gerçekten değişmediyse sıfırlamıyor.
  const initialFilters = useRef({ search, branch, city });
  useEffect(() => {
    const initial = initialFilters.current;
    if (search === initial.search && branch === initial.branch && city === initial.city) return;
    setPage(1);
  }, [search, branch, city]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setAdverts(null);
    advertService
      .listAdverts({ search, branch: branch || undefined, city: city || undefined, page, pageSize: PAGE_SIZE })
      .then((res) => {
        setAdverts(res.items);
        setTotalCount(res.totalCount);
        setTotalPages(Math.max(1, res.totalPages));
      });
  }, [search, branch, city, page]);

  return (
    <Container className="py-10">
      <PageHeader title="İlanlar" description="Organizatör ve mekanların yayınladığı açık ilanları incele, teklifini gönder." />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit lg:sticky lg:top-24">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
              <SlidersHorizontal size={15} /> Filtreler
            </h3>
            <div className="space-y-4">
              <Field label="Ara">
                <Input placeholder="İlan başlığı..." leftIcon={<Search size={15} />} value={search} onChange={(e) => setSearch(e.target.value)} />
              </Field>
              <Field label="Branş">
                <Select value={branch} onChange={(e) => setBranch(e.target.value as MusicBranch)}>
                  <option value="">Tümü</option>
                  {optionsFrom(MUSIC_BRANCHES, MUSIC_BRANCH_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Şehir">
                <Select value={city} onChange={(e) => setCity(e.target.value as City)}>
                  <option value="">Tümü</option>
                  {optionsFrom(CITIES, CITY_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              {(search || branch || city) && (
                <Button variant="ghost" size="sm" full onClick={() => { setSearch(''); setBranch(''); setCity(''); }}>
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </Card>
        </aside>

        <div>
          <p className="mb-4 text-sm text-text-dim">
            {adverts === null ? 'Yükleniyor...' : `${totalCount} açık ilan bulundu`}
          </p>
          {adverts === null ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),440px))] gap-5">
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : adverts.length === 0 ? (
            <EmptyState icon={<Briefcase size={22} />} title="İlan bulunamadı" description="Filtrelerini genişleterek tekrar dene." />
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),440px))] gap-5">
                {adverts.map((a) => <AdvertCard key={a.id} advert={a} />)}
              </div>
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} hrefFor={(p) => (p > 1 ? `/jobs?page=${p}` : '/jobs')} />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
