import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, TrendingUp, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import * as adminService from '@/services/adminService';
import type { AdminStats } from '@/types';
import { formatDateTime } from '@/lib/format';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [signupWindow, setSignupWindow] = useState<7 | 30>(7);

  useEffect(() => {
    adminService.getStats().then(setStats);
  }, []);

  if (stats === null) {
    return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)}</div>;
  }

  const signupCount = signupWindow === 7 ? stats.newUsersLast7Days : stats.newUsersLast30Days;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Genel Bakış</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam Kullanıcı" value={stats.totalUsers} hint="Tüm kullanıcıları gör" onClick={() => navigate('/backstage/users')} />

        <Card
          className="cursor-pointer transition-colors hover:border-border-hover"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-faint">Yeni Kayıt</p>
            <button
              onClick={(e) => { e.stopPropagation(); setSignupWindow(signupWindow === 7 ? 30 : 7); }}
              className="flex items-center gap-1 rounded-full bg-card-hover px-2 py-0.5 text-[10px] font-medium text-text-dim hover:text-text"
            >
              <TrendingUp size={10} /> {signupWindow}g
            </button>
          </div>
          <p className="mt-1.5 font-display text-2xl font-bold text-text">{signupCount}</p>
          <p className="mt-1 text-xs text-text-faint">Son {signupWindow} günde</p>
        </Card>

        <StatCard
          label="Askıya Alınmış"
          value={stats.suspendedUsers}
          hint="Askıdaki kullanıcıları gör"
          danger={stats.suspendedUsers > 0}
          onClick={() => navigate('/backstage/users?status=suspended')}
        />
        <StatCard
          label="Yarım Kalan Kayıt"
          value={stats.abandonedSignups}
          hint="48 saat sonra otomatik silinir"
          onClick={() => {}}
        />

        <StatCard
          label="Toplam İlan"
          value={stats.totalAdverts}
          hint={`${stats.openAdverts} açık · ${stats.closedAdverts} kapalı · ${stats.cancelledAdverts} iptal`}
          onClick={() => navigate('/backstage/adverts')}
        />
        <StatCard
          label="Toplam Teklif"
          value={stats.totalOffers}
          hint={`${stats.pendingOffers} bekliyor · ${stats.acceptedOffers} kabul · ${stats.rejectedOffers} red`}
          onClick={() => navigate('/backstage/adverts')}
        />
        <StatCard
          label="Sohbetler"
          value={stats.totalConversations}
          hint={`${stats.totalMessages} mesaj`}
          icon={<MessageCircle size={16} />}
          onClick={() => navigate('/backstage/conversations')}
        />
        <StatCard
          label="Müzisyen / İşveren"
          value={`${stats.totalMusicians} / ${stats.totalOrganizers + stats.totalVenues}`}
          hint={`${stats.totalOrganizers} organizatör · ${stats.totalVenues} mekan`}
          icon={<Users size={16} />}
          onClick={() => navigate('/backstage/users')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-display text-base font-bold">Son kayıtlar</h3>
          {stats.recentSignups.length === 0 ? (
            <p className="text-sm text-text-faint">Henüz kayıt yok.</p>
          ) : (
            <div className="space-y-2.5">
              {stats.recentSignups.map((u) => (
                <button
                  key={u.id}
                  onClick={() => navigate(`/backstage/users/${u.id}`)}
                  className="flex w-full items-center justify-between gap-3 border-b border-border pb-2.5 text-left last:border-0 last:pb-0 hover:opacity-80"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{u.firstName} {u.lastName}</p>
                    <p className="truncate text-xs text-text-faint">{u.email}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="neutral">{u.role}</Badge>
                    <span className="text-xs text-text-faint">{formatDateTime(u.createdDate)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="mb-3 font-display text-base font-bold">Son ilanlar</h3>
          {stats.recentAdverts.length === 0 ? (
            <p className="text-sm text-text-faint">Henüz ilan yok.</p>
          ) : (
            <div className="space-y-2.5">
              {stats.recentAdverts.map((a) => (
                <button
                  key={a.id}
                  onClick={() => navigate(`/backstage/adverts/${a.id}`)}
                  className="flex w-full items-center justify-between gap-3 border-b border-border pb-2.5 text-left last:border-0 last:pb-0 hover:opacity-80"
                >
                  <p className="min-w-0 truncate text-sm font-medium text-text">{a.title}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="neutral">{a.status}</Badge>
                    <span className="text-xs text-text-faint">{formatDateTime(a.createdDate)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label, value, hint, icon, danger, onClick,
}: { label: string; value: number | string; hint?: string; icon?: ReactNode; danger?: boolean; onClick: () => void }) {
  return (
    <Card
      hover
      onClick={onClick}
      className={`cursor-pointer ${danger ? 'border-danger/30' : ''}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-faint">{label}</p>
        {icon && <span className="text-text-faint">{icon}</span>}
      </div>
      <p className={`mt-1.5 font-display text-2xl font-bold ${danger ? 'text-danger' : 'text-text'}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}
    </Card>
  );
}
