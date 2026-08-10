import { delay } from '@/lib/async';
import { nextId, readStore, writeStore } from '@/lib/storage';
import { SEED_CONVERSATIONS, SEED_MESSAGES } from '@/mocks/seed';
import type { Conversation, ConversationRecord, Message } from '@/types';

function getConversationRecords(): ConversationRecord[] {
  return readStore('conversations', SEED_CONVERSATIONS);
}
function setConversationRecords(list: ConversationRecord[]) {
  writeStore('conversations', list);
}
function getMessages(): Message[] {
  return readStore('messages', SEED_MESSAGES);
}
function setMessages(list: Message[]) {
  writeStore('messages', list);
}

function toView(record: ConversationRecord, viewerId: number): Conversation {
  const isA = record.userAId === viewerId;
  return {
    id: record.id,
    participantId: isA ? record.userBId : record.userAId,
    participantName: isA ? record.userBName : record.userAName,
    participantRole: isA ? record.userBRole : record.userARole,
    lastMessage: record.lastMessage,
    lastMessageAt: record.lastMessageAt,
    unreadCount: isA ? record.unreadCountA : record.unreadCountB,
  };
}

export async function listConversations(viewerId: number): Promise<Conversation[]> {
  await delay();
  return getConversationRecords()
    .filter((c) => c.userAId === viewerId || c.userBId === viewerId)
    .map((c) => toView(c, viewerId))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export async function getConversationById(id: number, viewerId: number): Promise<Conversation | undefined> {
  await delay(150);
  const record = getConversationRecords().find((c) => c.id === id);
  return record ? toView(record, viewerId) : undefined;
}

export async function listMessages(conversationId: number): Promise<Message[]> {
  await delay();
  return getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}

export async function sendMessage(conversationId: number, senderId: number, body: string): Promise<Message> {
  await delay(200);
  const list = getMessages();
  const message: Message = { id: nextId(list), conversationId, senderId, body, sentAt: new Date().toISOString() };
  setMessages([...list, message]);

  const records = getConversationRecords();
  const idx = records.findIndex((c) => c.id === conversationId);
  if (idx !== -1) {
    const record = records[idx];
    const isA = record.userAId === senderId;
    records[idx] = {
      ...record, lastMessage: body, lastMessageAt: message.sentAt,
      unreadCountA: isA ? record.unreadCountA : record.unreadCountA + 1,
      unreadCountB: isA ? record.unreadCountB + 1 : record.unreadCountB,
    };
    setConversationRecords(records);
  }
  return message;
}

export async function markConversationRead(conversationId: number, viewerId: number): Promise<void> {
  await delay(100);
  const records = getConversationRecords();
  const idx = records.findIndex((c) => c.id === conversationId);
  if (idx === -1) return;
  const record = records[idx];
  const isA = record.userAId === viewerId;
  records[idx] = isA ? { ...record, unreadCountA: 0 } : { ...record, unreadCountB: 0 };
  setConversationRecords(records);
}
