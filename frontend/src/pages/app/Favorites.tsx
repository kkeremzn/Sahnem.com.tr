import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { MusicianCard } from '@/components/musician/MusicianCard';
import { useToast } from '@/context/ToastContext';
import * as favoriteService from '@/services/favoriteService';
import type { MusicianProfile } from '@/types';

export function Favorites() {
  const { toast } = useToast();
  const [musicians, setMusicians] = useState<MusicianProfile[] | null>(null);

  async function load() {
    setMusicians(await favoriteService.listFavoriteMusicians());
  }

  useEffect(() => { load(); }, []);

  async function handleToggleFavorite(appUserId: number) {
    await favoriteService.toggleFavorite(appUserId);
    toast('Favorilerden çıkarıldı.', 'success');
    load();
  }

  return (
    <div>
      <PageHeader title="Favori Müzisyenler" description="Beğendiğin ve daha sonra ulaşmak istediğin profiller." />

      {musicians === null ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : musicians.length === 0 ? (
        <EmptyState
          icon={<Heart size={22} />}
          title="Henüz favori eklemedin"
          description="Keşfet sayfasından beğendiğin müzisyenleri favorilere ekleyebilirsin."
          action={<Link to="/explore" className="text-sm font-semibold text-gold-soft hover:underline">Müzisyen Keşfet</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {musicians.map((m) => (
            <MusicianCard key={m.id} musician={m} favorite onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
