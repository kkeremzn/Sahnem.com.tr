import { useEffect, useState } from 'react';
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

const PAGE_SIZE = 8;

export function Jobs() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState<MusicBranch | ''>((searchParams.get('branch') as MusicBranch) ?? '');
  const [city, setCity] = useState<City | ''>('');
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, branch, city]);

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
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : adverts.length === 0 ? (
            <EmptyState icon={<Briefcase size={22} />} title="İlan bulunamadı" description="Filtrelerini genişleterek tekrar dene." />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {adverts.map((a) => <AdvertCard key={a.id} advert={a} />)}
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
