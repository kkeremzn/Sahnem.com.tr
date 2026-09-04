import { Link } from 'react-router-dom';
import { Heart, MapPin, Plane } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StarRating } from '@/components/ui/StarRating';
import { CITY_LABELS, MUSIC_BRANCH_LABELS, MUSIC_GENRE_LABELS, type MusicianProfile } from '@/types';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/cn';
import { resolveAssetUrl } from '@/lib/apiClient';

interface MusicianCardProps {
  musician: MusicianProfile;
  favorite?: boolean;
  // Favoriler backend'de AppUserId (appUserId) ile anahtarlanıyor, MusicianProfile.Id ile DEĞİL.
  onToggleFavorite?: (appUserId: number) => void;
}

export function MusicianCard({ musician, favorite, onToggleFavorite }: MusicianCardProps) {
  return (
    <Card hover className="group relative flex flex-col p-0 overflow-hidden">
      <Link to={`/musicians/${musician.appUserId}`} className="flex flex-1 flex-col p-5">
        <Avatar name={`${musician.firstName} ${musician.lastName}`} src={resolveAssetUrl(musician.avatarUrl)} size={56} />
        <h3 className="mt-3.5 font-display text-base font-bold text-text group-hover:text-gold-soft">
          {musician.firstName} {musician.lastName}
        </h3>
        <p className="truncate text-sm text-text-dim">
          {musician.branch.map((b) => MUSIC_BRANCH_LABELS[b]).join(', ')} · {musician.genres.map((g) => MUSIC_GENRE_LABELS[g]).join(', ')}
        </p>

        <div className="mt-2.5 flex items-center gap-3 text-xs text-text-faint">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {CITY_LABELS[musician.city]}
          </span>
          {musician.isAvailableToTravel === 'Yes' && (
            <span className="inline-flex items-center gap-1">
              <Plane size={12} /> Seyahat edebilir
            </span>
          )}
        </div>

        {(musician.ratingAvg !== undefined || musician.priceFrom) && (
          <div className="mt-3 flex items-center justify-between">
            {musician.ratingAvg !== undefined && (
              <StarRating rating={musician.ratingAvg} count={musician.ratingCount} size={13} />
            )}
            {musician.priceFrom && (
              <span className="text-sm font-semibold text-gold-soft">{formatPrice(musician.priceFrom)}&apos;dan</span>
            )}
          </div>
        )}
      </Link>
      {onToggleFavorite && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(musician.appUserId); }}
          className={cn(
            'focus-ring absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur transition-colors',
            favorite ? 'text-gold' : 'text-white hover:text-gold',
          )}
          aria-label="Favorilere ekle"
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      )}
    </Card>
  );
}
