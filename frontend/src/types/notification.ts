// Backend'de henüz modellenmemiş — bkz. backend/BACKEND-TODO.md P2 madde 11. Mock veri ile simüle ediliyor.
export type NotificationType = 'offer' | 'message' | 'system' | 'advert' | 'verification';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdDate: string;
  linkTo?: string;
}

// Backend'de henüz modellenmemiş — bkz. backend/BACKEND-TODO.md P2 madde 12. Mock veri ile simüle ediliyor.
export interface Favorite {
  id: number;
  musicianId: number;
}
