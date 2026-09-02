import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
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
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-gold" size={24} /></div>
      ) : messages.length === 0 ? (
        <EmptyState title="Mesaj yok" description="" />
      ) : (
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
