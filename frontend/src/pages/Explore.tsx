import { useEffect, useMemo, useState } from 'react';
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
import { MusicianCard } from '@/components/musician/MusicianCard';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as profileService from '@/services/profileService';
import * as favoriteService from '@/services/favoriteService';
import { CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, optionsFrom, type City, type MusicBranch, type MusicianProfile } from '@/types';

const PAGE_SIZE = 8;

export function Explore() {
  const [searchParams] = useSearchParams();
  const { isEmployer } = useAuth();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<MusicBranch | ''>((searchParams.get('branch') as MusicBranch) ?? '');
  const [city, setCity] = useState<City | ''>((searchParams.get('city') as City) ?? '');
  const [travelOnly, setTravelOnly] = useState(false);
  const [musicians, setMusicians] = useState<MusicianProfile[] | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setMusicians(null);
    profileService.listMusicians({ search, branch: branch || undefined, city: city || undefined, travelOnly }).then(setMusicians);
    setPage(1);
  }, [search, branch, city, travelOnly]);

  useEffect(() => {
    if (isEmployer) favoriteService.listFavoriteMusicianIds().then(setFavorites);
  }, [isEmployer]);

  async function handleToggleFavorite(id: number) {
    const nowFavorite = await favoriteService.toggleFavorite(id);
    setFavorites((prev) => (nowFavorite ? [...prev, id] : prev.filter((f) => f !== id)));
    toast(nowFavorite ? 'Favorilere eklendi.' : 'Favorilerden çıkarıldı.', 'success');
  }

  const paged = useMemo(() => {
    if (!musicians) return [];
    return musicians.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [musicians, page]);
  const totalPages = musicians ? Math.max(1, Math.ceil(musicians.length / PAGE_SIZE)) : 1;

  return (
    <Container className="py-10">
      <PageHeader title="Müzisyen Keşfet" description="Etkinliğine uygun müzisyeni branş, şehir ve fiyata göre filtrele." />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit lg:sticky lg:top-24">
          <Card>
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-text">
              <SlidersHorizontal size={15} /> Filtreler
            </h3>
            <div className="space-y-4">
              <Field label="Ara">
                <Input placeholder="İsim, tür..." leftIcon={<Search size={15} />} value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-dim">
                <input type="checkbox" checked={travelOnly} onChange={(e) => setTravelOnly(e.target.checked)} className="h-4 w-4 accent-gold" />
                Sadece seyahat edebilenler
              </label>
              {(search || branch || city || travelOnly) && (
                <Button variant="ghost" size="sm" full onClick={() => { setSearch(''); setBranch(''); setCity(''); setTravelOnly(false); }}>
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </Card>
        </aside>

        <div>
          <p className="mb-4 text-sm text-text-dim">
            {musicians === null ? 'Yükleniyor...' : `${musicians.length} müzisyen bulundu`}
          </p>
          {musicians === null ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : musicians.length === 0 ? (
            <EmptyState
              icon={<Users size={22} />}
              title="Sonuç bulunamadı"
              description="Filtrelerini genişleterek tekrar dene."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {paged.map((m) => (
                  <MusicianCard
                    key={m.id}
                    musician={m}
                    favorite={isEmployer ? favorites.includes(m.id) : undefined}
                    onToggleFavorite={isEmployer ? handleToggleFavorite : undefined}
                  />
                ))}
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
