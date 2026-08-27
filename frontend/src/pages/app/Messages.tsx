import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import * as messageService from '@/services/messageService';
import type { Conversation, Message } from '@/types';
import { cn } from '@/lib/cn';
import { formatDateTime, formatRelativeTime } from '@/lib/format';

export function Messages() {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeId = conversationId ? Number(conversationId) : undefined;
  const active = conversations?.find((c) => c.id === activeId);

  useEffect(() => {
    if (!user) return;
    messageService.listConversations().then((list) => {
      setConversations(list);
      if (!conversationId && list.length > 0) navigate(`/messages/${list[0].id}`, { replace: true });
    });
  }, [user]);

  useEffect(() => {
    if (!activeId || !user) return;
    messageService.listMessages(activeId).then(setMessages);
    messageService.markConversationRead(activeId).then(() => {
      setConversations((prev) => prev?.map((c) => (c.id === activeId ? { ...c, unreadCount: 0 } : c)) ?? prev);
    });
  }, [activeId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    if (!draft.trim() || !activeId || !user) return;
    setSending(true);
    try {
      const msg = await messageService.sendMessage({ conversationId: activeId, body: draft.trim() });
      setMessages((prev) => [...prev, msg]);
      setDraft('');
      setConversations((prev) =>
        prev?.map((c) => (c.id === activeId ? { ...c, lastMessage: msg.body, lastMessageAt: msg.sentAt } : c)) ?? prev,
      );
    } finally {
      setSending(false);
    }
  }

  if (conversations === null) return null;

  if (conversations.length === 0) {
    return <EmptyState icon={<MessageCircle size={22} />} title="Henüz mesajın yok" description="Teklif alışverişi başladığında sohbetlerin burada görünecek." />;
  }

  return (
    <div className="grid h-[calc(100vh-220px)] min-h-[480px] grid-cols-1 overflow-hidden rounded-lg border border-border md:grid-cols-[300px_1fr]">
      <div className={cn('flex-col overflow-y-auto border-border md:flex md:border-r', activeId ? 'hidden md:flex' : 'flex')}>
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/messages/${c.id}`)}
            className={cn(
              'flex items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors hover:bg-card-hover',
              activeId === c.id && 'bg-card-hover',
            )}
          >
            <Avatar name={c.participantName} size={42} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-text">{c.participantName}</p>
                <span className="shrink-0 text-[11px] text-text-faint">{formatRelativeTime(c.lastMessageAt)}</span>
              </div>
              <p className="truncate text-xs text-text-dim">{c.lastMessage}</p>
            </div>
            {c.unreadCount > 0 && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                {c.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className={cn('flex-col bg-deep md:flex', activeId ? 'flex' : 'hidden')}>
        {active && (
          <>
            <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3.5">
              <button onClick={() => navigate('/messages')} className="text-text-dim hover:text-text md:hidden">
                <ArrowLeft size={18} />
              </button>
              <Avatar name={active.participantName} size={36} />
              <p className="text-sm font-semibold text-text">{active.participantName}</p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => {
                const mine = m.senderId === user?.id;
                return (
                  <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[75%] rounded-lg px-3.5 py-2.5 text-sm', mine ? 'bg-gold text-white' : 'border border-border bg-card text-text')}>
                      <p>{m.body}</p>
                      <p className={cn('mt-1 text-[10px]', mine ? 'text-white/70' : 'text-text-faint')}>{formatDateTime(m.sentAt)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-2 border-t border-border bg-card px-4 py-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Mesajını yaz..."
                className="focus-ring h-10 flex-1 rounded-full border border-border bg-deep px-4 text-sm text-text placeholder:text-text-faint"
              />
              <button
                onClick={handleSend}
                disabled={sending || !draft.trim()}
                className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-white disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
