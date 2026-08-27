// Sahnem.Business/DTOs/Message/ConversationResponseDto.cs — oturum açan kullanıcının
// bakış açısına göre türetilmiş görünüm, "karşı taraf" backend'de hesaplanıyor.
export interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  participantRole: 'Musician' | 'Organizer' | 'Venue';
  lastMessage: string | null;
  lastMessageAt: string;
  unreadCount: number;
}

// Sahnem.Business/DTOs/Message/MessageResponseDto.cs
export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  sentAt: string;
}
