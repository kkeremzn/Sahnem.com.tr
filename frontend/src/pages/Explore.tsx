import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Users } from 'lucide-react';
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
import { Tabs } from '@/components/ui/Tabs';
import { MusicianCard } from '@/components/musician/MusicianCard';
import { EmployerCard } from '@/components/musician/EmployerCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as profileService from '@/services/profileService';
import * as favoriteService from '@/services/favoriteService';
import { CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, optionsFrom, type City, type EmployerSummary, type MusicBranch, type MusicianProfile } from '@/types';

const PAGE_SIZE = 8;

export function Explore() {
  const [searchParams] = useSearchParams();
  const { isEmployer } = useAuth();
  const { toast } = useToast();

  // Müzisyenler için varsayılan sekme "mekanlar/organizatörler" (kendini
  // listelemenin bir anlamı yok), işverenler için "müzisyenler".
  const [tab, setTab] = useState<'musicians' | 'employers'>(isEmployer ? 'musicians' : 'employers');

  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<MusicBranch | ''>((searchParams.get('branch') as MusicBranch) ?? '');
  const [city, setCity] = useState<City | ''>((searchParams.get('city') as City) ?? '');
  const [travelOnly, setTravelOnly] = useState(false);
  const [musicians, setMusicians] = useState<MusicianProfile[] | null>(null);
  const [employers, setEmployers] = useState<EmployerSummary[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [tab, search, branch, city, travelOnly]);

  useEffect(() => {
    if (tab === 'musicians') {
      setMusicians(null);
      profileService
        .listMusicians({ search, branch: branch || undefined, city: city || undefined, travelOnly, page, pageSize: PAGE_SIZE })
        .then((res) => {
          setMusicians(res.items);
          setTotalCount(res.totalCount);
          setTotalPages(Math.max(1, res.totalPages));
        });
    } else {
      setEmployers(null);
      profileService
        .listEmployers({ search, city: city || undefined, page, pageSize: PAGE_SIZE })
        .then((res) => {
          setEmployers(res.items);
          setTotalCount(res.totalCount);
          setTotalPages(Math.max(1, res.totalPages));
        });
    }
  }, [tab, search, branch, city, travelOnly, page]);

  useEffect(() => {
    if (isEmployer) favoriteService.listFavoriteMusicianIds().then(setFavorites);
  }, [isEmployer]);

  async function handleToggleFavorite(appUserId: number) {
    const nowFavorite = await favoriteService.toggleFavorite(appUserId);
    setFavorites((prev) => (nowFavorite ? [...prev, appUserId] : prev.filter((f) => f !== appUserId)));
    toast(nowFavorite ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.', 'success');
  }

  const loading = tab === 'musicians' ? musicians === null : employers === null;
  const hasFilters = tab === 'musicians' ? !!(search || branch || city || travelOnly) : !!(search || city);

  function clearFilters() {
    setSearch(''); setBranch(''); setCity(''); setTravelOnly(false);
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
                  <Select value={branch} onChange={(e) => setBranch(e.target.value as MusicBranch)}>
                    <option value="">Tümü</option>
                    {optionsFrom(MUSIC_BRANCHES, MUSIC_BRANCH_LABELS).map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                </Field>
              )}
              <Field label="Şehir">
                <Select value={city} onChange={(e) => setCity(e.target.value as City)}>
                  <option value="">Tümü</option>
                  {optionsFrom(CITIES, CITY_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : tab === 'musicians' ? (
            musicians!.length === 0 ? (
              <EmptyState icon={<Users size={22} />} title="Sonuç bulunamadı" description="Filtrelerini genişleterek tekrar dene." />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {musicians!.map((m) => (
                    <MusicianCard
                      key={m.id}
                      musician={m}
                      favorite={isEmployer ? favorites.includes(m.appUserId) : undefined}
                      onToggleFavorite={isEmployer ? handleToggleFavorite : undefined}
                    />
                  ))}
                </div>
                <div className="mt-8">
                  <Pagination page={page} totalPages={totalPages} onChange={setPage} />
                </div>
              </>
            )
          ) : employers!.length === 0 ? (
            <EmptyState icon={<Users size={22} />} title="Sonuç bulunamadı" description="Filtrelerini genişleterek tekrar dene." />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {employers!.map((e) => <EmployerCard key={`${e.kind}-${e.appUserId}`} employer={e} />)}
              </div>
              <div className="mt-8">
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
