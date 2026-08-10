import { Badge } from './Badge';
import {
  ADVERT_STATUS_LABELS, OFFER_STATUS_LABELS, VERIFICATION_LABELS,
  type AdvertStatus, type OfferStatus, type VerificationStatus,
} from '@/types';

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const variant = status === 'Accepted' ? 'success' : status === 'Rejected' ? 'danger' : 'warning';
  return <Badge variant={variant}>{OFFER_STATUS_LABELS[status]}</Badge>;
}

export function AdvertStatusBadge({ status }: { status: AdvertStatus }) {
  const variant = status === 'Open' ? 'success' : status === 'Completed' ? 'accent' : status === 'Cancelled' ? 'danger' : 'neutral';
  return <Badge variant={variant}>{ADVERT_STATUS_LABELS[status]}</Badge>;
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const variant = status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning';
  return <Badge variant={variant}>{VERIFICATION_LABELS[status]}</Badge>;
}
