// Backend'de henüz modellenmemiş — bkz. backend/BACKEND-TODO.md P2 madde 10. Mock veri ile simüle ediliyor.
// Her iki taraf da saklanır ki oturum açan kullanıcı kim olursa olsun "karşı taraf" doğru hesaplanabilsin.
export interface ConversationRecord {
  id: number;
  userAId: number;
  userAName: string;
  userARole: 'Musician' | 'Organizer' | 'Venue';
  userBId: number;
  userBName: string;
  userBRole: 'Musician' | 'Organizer' | 'Venue';
  lastMessage: string;
  lastMessageAt: string;
  unreadCountA: number;
  unreadCountB: number;
}

// Oturum açan kullanıcının bakış açısına göre türetilmiş görünüm
export interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  participantRole: 'Musician' | 'Organizer' | 'Venue';
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  sentAt: string;
}
