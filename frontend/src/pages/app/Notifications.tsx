import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, MessageCircle, ScrollText, ShieldCheck, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import * as notificationService from '@/services/notificationService';
import { useNotifications } from '@/context/NotificationContext';
import type { AppNotification, NotificationType } from '@/types';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/cn';

const ICONS: Partial<Record<NotificationType, typeof Bell>> = {
  offer: ScrollText, message: MessageCircle, advert: Bell, verification: ShieldCheck, system: Sparkles,
};

export function Notifications() {
  const [notifications, setNotifications] = useState<AppNotification[] | null>(null);
  const { refresh } = useNotifications();

  useEffect(() => { notificationService.listNotifications().then(setNotifications); }, []);

  async function handleRead(id: number) {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev?.map((n) => (n.id === id ? { ...n, isRead: true } : n)) ?? prev);
    refresh();
  }

  async function handleReadAll() {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev?.map((n) => ({ ...n, isRead: true })) ?? prev);
    refresh();
  }

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Bildirimler"
        description="Teklif, mesaj ve profil güncellemelerinden haberdar ol."
        action={unreadCount > 0 && <Button variant="secondary" size="sm" icon={<CheckCheck size={15} />} onClick={handleReadAll}>Tümünü okundu işaretle</Button>}
      />

      {notifications === null ? null : notifications.length === 0 ? (
        <EmptyState icon={<Bell size={22} />} title="Bildirim yok" description="Yeni gelişmeler burada görünecek." />
      ) : (
        <div className="space-y-2.5">
          {notifications.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            const content = (
              <Card
                hover
                onClick={() => !n.isRead && handleRead(n.id)}
                className={cn('flex items-start gap-3.5 cursor-pointer', !n.isRead && 'border-gold/30 bg-gold/5')}
              >
                <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', n.isRead ? 'bg-deep text-text-faint' : 'bg-gold/15 text-gold-soft')}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-text">{n.title}</p>
                    {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />}
                  </div>
                  <p className="mt-0.5 text-sm text-text-dim">{n.body}</p>
                  <p className="mt-1 text-xs text-text-faint">{formatRelativeTime(n.createdDate)}</p>
                </div>
              </Card>
            );
            return n.linkTo ? <Link key={n.id} to={n.linkTo}>{content}</Link> : <div key={n.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
}
