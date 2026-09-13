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

  return (
    <Card hover className="p-0 overflow-hidden">
      <Link to={`/${employer.kind === 'Venue' ? 'venues' : 'organizers'}/${employer.appUserId}`} className="flex flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <Avatar name={employer.name} src={resolveAssetUrl(employer.avatarUrl)} size={56} />
          <Badge variant="neutral">
            <KindIcon size={11} /> {employer.kind === 'Venue' ? 'Mekan' : 'Organizatör'}
          </Badge>
        </div>
        <h3 className="mt-3.5 font-display text-base font-bold text-text hover:text-gold-soft">{employer.name}</h3>
        <p className="truncate text-sm text-text-dim">{typeLabel}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-text-dim">
            <MapPin size={11} className="shrink-0" /> {CITY_LABELS[employer.city]}{employer.district ? `, ${employer.district}` : ''}
          </span>
        </div>
        <p className="mt-2.5 line-clamp-2 text-xs text-text-faint">{employer.bio}</p>
      </Link>
    </Card>
  );
}
