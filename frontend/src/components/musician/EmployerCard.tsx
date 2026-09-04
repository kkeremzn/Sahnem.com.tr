import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { CITY_LABELS, ORGANIZER_TYPE_LABELS, VENUE_TYPE_LABELS, type EmployerSummary } from '@/types';
import { resolveAssetUrl } from '@/lib/apiClient';

export function EmployerCard({ employer }: { employer: EmployerSummary }) {
  const typeLabel = employer.kind === 'Organizer'
    ? (employer.organizerType ? ORGANIZER_TYPE_LABELS[employer.organizerType] : 'Organizatör')
    : (employer.venueType ? VENUE_TYPE_LABELS[employer.venueType] : 'Mekan');

  return (
    <Card hover className="p-0 overflow-hidden">
      <Link to={`/employers/${employer.appUserId}`} className="flex flex-col p-5">
        <Avatar name={employer.name} src={resolveAssetUrl(employer.avatarUrl)} size={56} />
        <h3 className="mt-3.5 font-display text-base font-bold text-text hover:text-gold-soft">{employer.name}</h3>
        <p className="truncate text-sm text-text-dim">{typeLabel}</p>
        <div className="mt-2.5 flex items-center gap-3 text-xs text-text-faint">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} /> {CITY_LABELS[employer.city]}{employer.district ? `, ${employer.district}` : ''}
          </span>
        </div>
        <p className="mt-2.5 line-clamp-2 text-xs text-text-faint">{employer.bio}</p>
      </Link>
    </Card>
  );
}
