// Sahnem.Business/DTOs/Admin/PendingVerificationDto.cs — Musician/Organizer/Venue
// profillerinden onay bekleyenlerin tek bir listede birleştirilmiş hali.
export interface PendingVerification {
  kind: 'Musician' | 'Organizer' | 'Venue';
  profileId: number;
  appUserId: number;
  name: string;
  email: string;
  createdDate: string;
}
