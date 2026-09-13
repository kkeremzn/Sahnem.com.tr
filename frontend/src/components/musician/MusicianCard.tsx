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
    <Card hover className="relative flex h-full flex-col overflow-hidden p-0">
      {onToggleFavorite && (
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(musician.appUserId); }}
          className={cn(
            'focus-ring absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur transition-colors',
            favorite ? 'text-gold' : 'text-white hover:text-gold',
          )}
          aria-label="Favorilere ekle"
        >
          <Heart size={16} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      )}
      <Link to={`/musicians/${musician.appUserId}`} className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3 pr-14">
          <Avatar name={`${musician.firstName} ${musician.lastName}`} src={resolveAssetUrl(musician.avatarUrl)} size={52} className="shrink-0" />
          <h3 className="truncate font-display text-lg font-bold text-text hover:text-gold-soft">
            {musician.firstName} {musician.lastName}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-text-dim">
            <MapPin size={12} className="shrink-0" /> {CITY_LABELS[musician.city]}
          </span>
          {musician.isAvailableToTravel === 'Yes' && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-0.5 text-xs text-text-dim">
              <Plane size={11} className="shrink-0" /> Seyahat edebilir
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-text-faint">
          {musician.branch.map((b) => MUSIC_BRANCH_LABELS[b]).join(', ')}
          {musician.genres.length > 0 && ` · ${musician.genres.map((g) => MUSIC_GENRE_LABELS[g]).join(', ')}`}
        </p>

        {(musician.ratingAvg !== undefined || musician.priceFrom) && (
          <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
            {musician.ratingAvg !== undefined ? (
              <StarRating rating={musician.ratingAvg} count={musician.ratingCount} size={13} />
            ) : <span />}
            {musician.priceFrom && (
              <span className="text-sm font-semibold text-gold-soft">{formatPrice(musician.priceFrom)}&apos;dan</span>
            )}
          </div>
        )}
      </Link>
    </Card>
  );
}
