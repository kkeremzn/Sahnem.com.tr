// Sahnem.Business/DTOs/Notification/NotificationResponseDto.cs — Type backend'de
// serbest bir string (bkz. NotificationService.CreateNotification çağrıları),
// şu an üretilen değerler: "offer", "message", "verification".
export type NotificationType = 'offer' | 'message' | 'system' | 'advert' | 'verification';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  linkTo?: string;
  createdDate: string;
}
