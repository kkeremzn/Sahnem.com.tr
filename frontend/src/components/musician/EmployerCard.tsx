import { Link } from 'react-router-dom';
import { MapPin, Store, Users2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { CITY_LABELS, ORGANIZER_TYPE_LABELS, VENUE_TYPE_LABELS, type EmployerSummary } from '@/types';
import { resolveAssetUrl } from '@/lib/apiClient';

export function EmployerCard({ employer }: { employer: EmployerSummary }) {
  const typeLabel = employer.kind === 'Organizer'
    ? (employer.organizerType ? ORGANIZER_TYPE_LABELS[employer.organizerType] : 'Organizatör')
    : (employer.venueType ? VENUE_TYPE_LABELS[employer.venueType] : 'Mekan');
  const KindIcon = employer.kind === 'Venue' ? Store : Users2;
  // Mekan ve organizatör kartları görsel olarak türüne göre ayrışsın diye
  // farklı renklendiriliyor — uygulamada zaten kullanılan iki vurgu rengi
  // (accent = cam göbeği, gold = mor) dışında yeni bir renk eklemiyoruz.
  const badgeVariant = employer.kind === 'Venue' ? 'accent' : 'gold';

  return (
    <Card hover className="relative overflow-hidden p-0">
      <Badge variant={badgeVariant} className="absolute right-4 top-4 z-10 max-w-[55%]">
        <KindIcon size={11} className="shrink-0" /> <span className="truncate">{typeLabel}</span>
      </Badge>
      <Link to={`/${employer.kind === 'Venue' ? 'venues' : 'organizers'}/${employer.appUserId}`} className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3 pr-20">
          <Avatar name={employer.name} src={resolveAssetUrl(employer.avatarUrl)} size={52} className="shrink-0" />
          <h3 className="truncate font-display text-lg font-bold text-text hover:text-gold-soft">{employer.name}</h3>
        </div>

        <span className="inline-flex w-fit items-center gap-1 text-xs text-text-dim">
          <MapPin size={12} className="shrink-0" /> {CITY_LABELS[employer.city]}{employer.district ? `, ${employer.district}` : ''}
        </span>

        <p className="line-clamp-2 text-sm text-text-faint">{employer.bio}</p>
      </Link>
    </Card>
  );
}
