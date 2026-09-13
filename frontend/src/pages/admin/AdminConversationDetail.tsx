import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { FadeIn } from '@/components/ui/FadeIn';
import { useToast } from '@/context/ToastContext';
import * as adminService from '@/services/adminService';
import type { AdminMessage } from '@/services/adminService';
import { formatDateTime } from '@/lib/format';
import { formatApiError } from '@/lib/apiClient';

export function AdminConversationDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<AdminMessage[] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  function load() {
    setMessages(null);
    adminService.getConversationMessages(Number(id)).then(setMessages);
  }

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminService.deleteMessage(deleteTarget.id);
      toast('Mesaj silindi.', 'success');
      setDeleteTarget(null);
      load();
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link to="/backstage/conversations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text">
        <ArrowLeft size={14} /> Sohbetlere dön
      </Link>

      <h1 className="mb-6 font-display text-xl font-bold text-text">Sohbet Detayı</h1>

      {messages === null ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState title="Mesaj yok" description="" />
      ) : (
        <FadeIn>
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3 rounded-md border border-border bg-card p-4">
              <Avatar name={m.senderName} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text">{m.senderName}</p>
                  <span className="shrink-0 text-xs text-text-faint">{formatDateTime(m.createdDate)}</span>
                </div>
                <p className="mt-1 text-sm text-text-dim">{m.body}</p>
              </div>
              <button
                onClick={() => setDeleteTarget(m)}
                className="shrink-0 rounded-full p-1.5 text-text-faint hover:bg-danger/10 hover:text-danger"
                title="Mesajı sil"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        </FadeIn>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Mesajı sil"
        description="Bu mesajı kalıcı olarak silmek istediğine emin misin?"
        confirmLabel="Sil"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
