import { api } from '@/lib/apiClient';
import type { Conversation, Message } from '@/types';

interface MessageDto {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  createdDate: string;
}

function fromDto(dto: MessageDto): Message {
  return { id: dto.id, conversationId: dto.conversationId, senderId: dto.senderId, body: dto.body, sentAt: dto.createdDate };
}

export async function listConversations(): Promise<Conversation[]> {
  return api.get<Conversation[]>('/message/conversations');
}

export async function listMessages(conversationId: number): Promise<Message[]> {
  const list = await api.get<MessageDto[]>(`/message/conversation/${conversationId}`);
  return list.map(fromDto);
}

// conversationId varsa mevcut sohbete devam edilir; yoksa recipientUserId ile
// yeni bir sohbet (yoksa) backend'de otomatik oluşturulur.
export async function sendMessage(input: { conversationId?: number; recipientUserId?: number; body: string }): Promise<Message> {
  const dto = await api.post<MessageDto>('/message/send', input);
  return fromDto(dto);
}

export async function markConversationRead(conversationId: number): Promise<void> {
  await api.put(`/message/conversation/${conversationId}/read`);
}
