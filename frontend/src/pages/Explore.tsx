import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { MultiSelectChips } from '@/components/ui/MultiSelectChips';
import { Field } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Tabs } from '@/components/ui/Tabs';
import { MusicianCard } from '@/components/musician/MusicianCard';
import { EmployerCard } from '@/components/musician/EmployerCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as profileService from '@/services/profileService';
import * as favoriteService from '@/services/favoriteService';
import { CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, optionsFrom, type City, type EmployerSummary, type MusicBranch, type MusicianProfile } from '@/types';
import { usePageSeo } from '@/lib/seo';

const PAGE_SIZE = 8;

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isEmployer } = useAuth();
  const { toast } = useToast();

  // Hangi sekmenin açılacağı önce URL'deki açık niyete (?tab=...) bakar —
  // "Müzisyenleri Keşfet" ve "Mekan & Organizatör Keşfet" gibi farklı
  // bağlantılar aynı sayfaya farklı sekmeler için yönlendiriyor, bunu
  // belirtmezlerse hangi sekmenin açılacağı belirsizleşiyordu. Hiç belirtilmemişse
  // role göre en anlamlı varsayılana düşer (kendi rolünü listelemenin anlamı yok).
  const tabParam = searchParams.get('tab');
  const tab: 'musicians' | 'employers' =
    tabParam === 'musicians' || tabParam === 'employers' ? tabParam : isEmployer ? 'musicians' : 'employers';

  // Sekme değişince URL'e de yazılıyor — önceden sadece yerel bileşen state'i
  // güncelleniyordu, bu yüzden sekmeyi değiştirdikten sonra sayfayı yenilemek
  // ya da linki paylaşmak her zaman ilk (URL'deki) sekmeye dönüyordu.
  function setTab(next: 'musicians' | 'employers') {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', next);
      return params;
    }, { replace: true });
  }

  const [search, setSearch] = useState('');
  // Ana sayfadaki hızlı arama gibi dış bağlantılar birden fazla branş/şehri
  // virgülle ayrılmış tek bir query param olarak taşıyabiliyor.
  const initialBranches = (searchParams.get('branch') ?? '').split(',').filter(Boolean) as MusicBranch[];
  const initialCities = (searchParams.get('city') ?? '').split(',').filter(Boolean) as City[];
  const [branches, setBranches] = useState<MusicBranch[]>(initialBranches);
  const [cities, setCities] = useState<City[]>(initialCities);
  const [travelOnly, setTravelOnly] = useState(false);
  const [musicians, setMusicians] = useState<MusicianProfile[] | null>(null);
  const [employers, setEmployers] = useState<EmployerSummary[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  // null = favori listesi henüz gelmedi — "[]" ile aynı değeri kullanmak,
  // aslında favorilenmiş bir müzisyenin kalbinin bir an boş görünüp sonra
  // dolmasına (yanlış durumun bir an gösterilmesine) yol açıyordu.
  const [favorites, setFavorites] = useState<number[] | null>(null);
  // page (branş/şehir'in aksine) URL'de tutuluyor — Google'ın kendi rehberi
  // sayfalanmış sayfaları 1. sayfaya canonical yapmayı "en yıkıcı sayfalama
  // hatası" sayıyor (bkz. Jobs.tsx'teki aynı desen ve gerekçe).
  const [page, setPageState] = useState(Number(searchParams.get('page')) || 1);

  function setPage(next: number) {
    setPageState(next);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next > 1) params.set('page', String(next));
      else params.delete('page');
      return params;
    }, { replace: true });
  }

  // Sekme belirtilmeden (?tab= yok) girildiğinde hangi sekmenin gösterildiği
  // ziyaretçinin rolüne göre değişiyor (yukarıdaki `tab` hesaplaması) — bu
  // yüzden canonical her zaman ekranda GERÇEKTEN gösterilen sekmeyi açıkça
  // belirtiyor; aksi halde aynı bare /explore adresi farklı ziyaretçilere
  // farklı içerik gösterirken tek, belirsiz bir canonical'a sahip olurdu.
  usePageSeo({
    title: `${tab === 'musicians' ? 'Müzisyen' : 'Mekan ve Organizatör'} Keşfet | Sahnem`,
    description: 'Branşa ve şehre göre müzisyenleri, mekanları ve organizatörleri keşfet, doğrudan iletişime geç.',
    canonicalPath: `/explore?tab=${tab}${page > 1 ? `&page=${page}` : ''}`,
  });

  // Bkz. Jobs.tsx — basit "ilk çalışmayı atla" bayrağı yerine gerçek başlangıç
  // değerleriyle karşılaştırma; React 18 StrictMode'un geliştirmede efektleri
  // iki kez çalıştırmasında da doğru sonuç veriyor.
  const initialFilters = useRef(JSON.stringify({ tab, search, branches, cities, travelOnly }));
  useEffect(() => {
    if (JSON.stringify({ tab, search, branches, cities, travelOnly }) === initialFilters.current) return;
    setPage(1);
  }, [tab, search, branches, cities, travelOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === 'musicians') {
      setMusicians(null);
      profileService
        .listMusicians({ search, branches, cities, travelOnly, page, pageSize: PAGE_SIZE })
        .then((res) => {
          setMusicians(res.items);
          setTotalCount(res.totalCount);
          setTotalPages(Math.max(1, res.totalPages));
        });
    } else {
      setEmployers(null);
      profileService
        .listEmployers({ search, cities, page, pageSize: PAGE_SIZE })
        .then((res) => {
          setEmployers(res.items);
          setTotalCount(res.totalCount);
          setTotalPages(Math.max(1, res.totalPages));
        });
    }
  }, [tab, search, branches, cities, travelOnly, page]);

  useEffect(() => {
    if (isEmployer) favoriteService.listFavoriteMusicianIds().then(setFavorites);
  }, [isEmployer]);

  async function handleToggleFavorite(appUserId: number) {
    const nowFavorite = await favoriteService.toggleFavorite(appUserId);
    setFavorites((prev) => (nowFavorite ? [...(prev ?? []), appUserId] : (prev ?? []).filter((f) => f !== appUserId)));
    toast(nowFavorite ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.', 'success');
  }

  const loading = tab === 'musicians' ? musicians === null : employers === null;
  const hasFilters = tab === 'musicians'
    ? !!(search || branches.length || cities.length || travelOnly)
    : !!(search || cities.length);

  function clearFilters() {
    setSearch(''); setBranches([]); setCities([]); setTravelOnly(false);
  }

  return (
    <Container className="py-10">
      <PageHeader title="Keşfet" description="Müzisyen, mekan ve organizatörleri branşa, şehre göre filtrele." />
      <Tabs
        className="mb-8"
        items={[
          { key: 'musicians', label: 'Müzisyenler' },
          { key: 'employers', label: 'Mekanlar & Organizatörler' },
        ]}
        active={tab}
        onChange={(k) => setTab(k as typeof tab)}
      />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit lg:sticky lg:top-24">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
              <SlidersHorizontal size={15} /> Filtreler
            </h3>
            <div className="space-y-4">
              <Field label="Ara">
                <Input placeholder={tab === 'musicians' ? 'İsim, tür...' : 'İsim, açıklama...'} leftIcon={<Search size={15} />} value={search} onChange={(e) => setSearch(e.target.value)} />
              </Field>
              {tab === 'musicians' && (
                <Field label="Branş">
                  <MultiSelectChips
                    options={optionsFrom(MUSIC_BRANCHES, MUSIC_BRANCH_LABELS)}
                    selected={branches}
                    onChange={setBranches}
                    placeholder="Branş ara ve ekle..."
                  />
                </Field>
              )}
              <Field label="Şehir">
                <MultiSelectChips
                  options={optionsFrom(CITIES, CITY_LABELS)}
                  selected={cities}
                  onChange={setCities}
                  placeholder="Şehir ara ve ekle..."
                />
              </Field>
              {tab === 'musicians' && (
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-dim">
                  <input type="checkbox" checked={travelOnly} onChange={(e) => setTravelOnly(e.target.checked)} className="h-4 w-4 accent-gold" />
                  Sadece seyahat edebilenler
                </label>
              )}
              {hasFilters && (
                <Button variant="ghost" size="sm" full onClick={clearFilters}>
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </Card>
        </aside>

        <div>
          <p className="mb-4 text-sm text-text-dim">
            {loading ? 'Yükleniyor...' : `${totalCount} ${tab === 'musicians' ? 'müzisyen' : 'sonuç'} bulundu`}
          </p>
          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),440px))] gap-5">
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : tab === 'musicians' ? (
            musicians!.length === 0 ? (
              <EmptyState icon={<Users size={22} />} title="Sonuç bulunamadı" description="Filtrelerini genişleterek tekrar dene." />
            ) : (
              <>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),440px))] gap-5">
                  {musicians!.map((m) => (
                    <MusicianCard
                      key={m.id}
                      musician={m}
                      favorite={isEmployer && favorites ? favorites.includes(m.appUserId) : undefined}
                      onToggleFavorite={isEmployer && favorites ? handleToggleFavorite : undefined}
                    />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination page={page} totalPages={totalPages} onChange={setPage} hrefFor={(p) => `/explore?tab=${tab}${p > 1 ? `&page=${p}` : ''}`} />
                </div>
              </>
            )
          ) : employers!.length === 0 ? (
            <EmptyState icon={<Users size={22} />} title="Sonuç bulunamadı" description="Filtrelerini genişleterek tekrar dene." />
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(360px,100%),440px))] gap-5">
                {employers!.map((e) => <EmployerCard key={`${e.kind}-${e.appUserId}`} employer={e} />)}
              </div>
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} hrefFor={(p) => `/explore?tab=${tab}${p > 1 ? `&page=${p}` : ''}`} />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
