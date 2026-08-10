import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Users2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AdvertStatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { CITY_LABELS, MUSIC_BRANCH_LABELS, type Advert } from '@/types';
import { formatDate, formatPrice } from '@/lib/format';

export function AdvertCard({ advert }: { advert: Advert }) {
  return (
    <Card hover className="flex flex-col">
      <Link to={`/jobs/${advert.id}`} className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-text-faint">
            <span className="font-medium text-text-dim">{advert.creatorName}</span>
          </div>
          <AdvertStatusBadge status={advert.status} />
        </div>
        <h3 className="mt-2.5 font-display text-base font-bold leading-snug text-text">{advert.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-text-dim">{advert.description}</p>

        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-faint">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {CITY_LABELS[advert.city]}{advert.district ? `, ${advert.district}` : ''}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={12} /> {formatDate(advert.eventTime)}
          </span>
          {advert.minimumExperienceYears !== undefined && advert.minimumExperienceYears > 0 && (
            <span className="inline-flex items-center gap-1">
              <Users2 size={12} /> {advert.minimumExperienceYears}+ yıl deneyim
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
          {advert.branch && <Badge variant="gold">{MUSIC_BRANCH_LABELS[advert.branch]}</Badge>}
          <span className="font-display text-base font-bold text-gold-soft">{formatPrice(advert.budget)}</span>
        </div>
      </Link>
    </Card>
  );
}
