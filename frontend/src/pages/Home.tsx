import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Guitar, Mic2, Music4, Piano, Search, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { MusicianCard } from '@/components/musician/MusicianCard';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { getHomeRoute } from '@/lib/homeRoute';
import * as profileService from '@/services/profileService';
import { CITIES, CITY_LABELS, MUSIC_BRANCHES, MUSIC_BRANCH_LABELS, optionsFrom, type City, type MusicBranch, type MusicianProfile } from '@/types';

const STEPS_MUSICIAN = [
  { title: 'Profilini oluştur', desc: 'Enstrümanını, deneyimini ve fiyat aralığını belirt, portfolyonu ekle.' },
  { title: 'İlanları keşfet', desc: 'Sana uygun ilanları filtrele, detaylarını incele.' },
  { title: 'Teklif gönder, sahneye çık', desc: 'Teklifini ilet, kabul edilince organizasyonu netleştir.' },
];
const STEPS_EMPLOYER = [
  { title: 'İlanını yayınla', desc: 'Etkinliğinin detaylarını, bütçeni ve tarihini paylaş.' },
  { title: 'Teklifleri karşılaştır', desc: 'Gelen teklifleri, müzisyen profillerini ve puanlarını incele.' },
  { title: 'Doğru ismi seç', desc: 'Teklifi kabul et, mesajlaş ve etkinliğini planla.' },
];

const BRANCH_ICONS = [Mic2, Guitar, Piano, Music4];

export function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [musicians, setMusicians] = useState<MusicianProfile[] | null>(null);
  const [searchBranch, setSearchBranch] = useState<MusicBranch | ''>('');
  const [searchCity, setSearchCity] = useState<City | ''>('');

  useEffect(() => {
    profileService.listMusicians({ pageSize: 4 }).then((res) => {
      setMusicians(res.items);
    });
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchBranch) params.set('branch', searchBranch);
    if (searchCity) params.set('city', searchCity);
    navigate(`/explore?${params.toString()}`);
  }

  // Giriş yapmış bir kullanıcının pazarlama anasayfasını görmesinin anlamı yok —
  // zaten üye, doğrudan kendi işlevsel sayfasına gitsin.
  if (!loading && user) return <Navigate to={getHomeRoute(user)} replace />;

  return (
    <div>
      <section className="bg-noise relative overflow-hidden border-b border-border">
        <div className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <Container className="relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold-soft">
              <Sparkles size={13} /> Türkiye'nin müzik profesyonelleri ağı
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] text-text sm:text-5xl lg:text-6xl">
              Sahnede olması <span className="text-gradient">gereken</span> herkes burada.
            </h1>
            <p className="mt-5 max-w-lg text-base text-text-dim sm:text-lg">
              Müzisyenleri organizatör ve mekanlarla buluşturuyoruz. İlan aç, teklif ver, doğru ismi bul — hepsi tek platformda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/register')} icon={<ArrowRight size={18} />}>
                Hemen Başla
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/explore')}>
                Müzisyenleri Keşfet
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6">
              <div>
                <p className="font-display text-2xl font-bold text-text">1.200+</p>
                <p className="text-xs text-text-dim">Kayıtlı müzisyen</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-text">340+</p>
                <p className="text-xs text-text-dim">Aktif ilan</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-text">81 il</p>
                <p className="text-xs text-text-dim">Kapsama alanı</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
            <Card className="border-gold/20 shadow-glow">
              <h3 className="font-display text-lg font-bold">Hızlı müzisyen ara</h3>
              <p className="mt-1 text-sm text-text-dim">Branş ve şehir seçerek anında sonuçlara ulaş.</p>
              <div className="mt-5 flex flex-col gap-3">
                <Select value={searchBranch} onChange={(e) => setSearchBranch(e.target.value as MusicBranch)}>
                  <option value="">Tüm branşlar</option>
                  {optionsFrom(MUSIC_BRANCHES, MUSIC_BRANCH_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
                <Select value={searchCity} onChange={(e) => setSearchCity(e.target.value as City)}>
                  <option value="">Tüm şehirler</option>
                  {optionsFrom(CITIES, CITY_LABELS).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
                <Button onClick={handleSearch} icon={<Search size={16} />} full>
                  Ara
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {MUSIC_BRANCH_LABELS.Vocal && ['Vocal', 'Guitar', 'DJ', 'Piano'].map((b, i) => {
                  const Icon = BRANCH_ICONS[i];
                  return (
                    <Link
                      key={b}
                      to={`/explore?branch=${b}`}
                      className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-dim hover:border-gold/40 hover:text-gold-soft"
                    >
                      <Icon size={13} /> {MUSIC_BRANCH_LABELS[b as MusicBranch]}
                    </Link>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </Container>
      </section>

      <section className="border-b border-border py-20">
        <Container>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Öne çıkan müzisyenler</h2>
              <p className="mt-1.5 text-sm text-text-dim">En yüksek puanlı profillerden bir seçki.</p>
            </div>
            <Link to="/explore" className="hidden text-sm font-semibold text-gold-soft hover:underline sm:inline-flex items-center gap-1">
              Tümünü gör <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {musicians === null
              ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
              : musicians.map((m) => <MusicianCard key={m.id} musician={m} />)}
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-deep py-20">
        <Container>
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Nasıl çalışır?</h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gold-soft">Müzisyenler için</h3>
              <div className="space-y-5">
                {STEPS_MUSICIAN.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-sm font-bold text-gold-soft">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-text">{step.title}</h4>
                      <p className="mt-0.5 text-sm text-text-dim">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-accent">Organizatör & Mekanlar için</h3>
              <div className="space-y-5">
                {STEPS_EMPLOYER.map((step, i) => (
                  <div key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 font-display text-sm font-bold text-accent">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-text">{step.title}</h4>
                      <p className="mt-0.5 text-sm text-text-dim">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <Card className="bg-noise relative overflow-hidden border-gold/25 px-8 py-14 text-center">
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Sahnendeki bir sonraki adım burada başlıyor.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-text-dim">
                İster sahneye çıkacak bir müzisyen ol, ister etkinliğine doğru ismi arayan bir organizatör — Sahnem seninle.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button size="lg" onClick={() => navigate('/register')}>Ücretsiz Kayıt Ol</Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/jobs')}>İlanlara Göz At</Button>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}
