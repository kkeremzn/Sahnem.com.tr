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
      <Link to={`/${employer.kind === 'Venue' ? 'venues' : 'organizers'}/${employer.appUserId}`} className="flex gap-4 p-5">
        <Avatar name={employer.name} src={resolveAssetUrl(employer.avatarUrl)} size={56} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-bold text-text hover:text-gold-soft">{employer.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <p className="truncate text-sm text-text-dim">{typeLabel}</p>
            <Badge variant="neutral" className="shrink-0">
              <KindIcon size={11} /> {employer.kind === 'Venue' ? 'Mekan' : 'Organizatör'}
            </Badge>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-text-dim">
              <MapPin size={11} className="shrink-0" /> {CITY_LABELS[employer.city]}{employer.district ? `, ${employer.district}` : ''}
            </span>
          </div>
          <p className="mt-2.5 line-clamp-2 text-sm text-text-faint">{employer.bio}</p>
        </div>
      </Link>
    </Card>
  );
}
