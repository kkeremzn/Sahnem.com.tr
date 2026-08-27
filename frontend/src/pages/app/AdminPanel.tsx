import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Check, Loader2, ShieldCheck, Users, X } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as adminService from '@/services/adminService';
import { USER_TYPE_LABELS, type AppUser, type PendingVerification } from '@/types';
import { formatDateTime } from '@/lib/format';
import { formatApiError } from '@/lib/apiClient';

const KIND_LABELS: Record<PendingVerification['kind'], string> = {
  Musician: 'Müzisyen', Organizer: 'Organizatör', Venue: 'Mekan',
};

const USERS_PAGE_SIZE = 20;

export function AdminPanel() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<'verifications' | 'users'>('verifications');

  const [pending, setPending] = useState<PendingVerification[] | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);

  async function loadPending() {
    setPending(await adminService.listPendingVerifications());
  }

  useEffect(() => {
    if (tab === 'verifications') loadPending();
  }, [tab]);

  useEffect(() => {
    if (tab !== 'users') return;
    setUsers(null);
    adminService.listAllUsers(usersPage, USERS_PAGE_SIZE).then((res) => {
      setUsers(res.items);
      setUsersTotalPages(Math.max(1, res.totalPages));
    });
  }, [tab, usersPage]);

  async function handleDecision(item: PendingVerification, status: 'Approved' | 'Rejected') {
    const key = `${item.kind}-${item.profileId}`;
    setBusyKey(key);
    try {
      await adminService.setVerificationStatus(item.kind, item.profileId, status);
      toast(status === 'Approved' ? 'Profil onaylandı.' : 'Profil reddedildi.', 'success');
      setPending((prev) => prev?.filter((p) => !(p.kind === item.kind && p.profileId === item.profileId)) ?? prev);
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setBusyKey(null);
    }
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <PageHeader title="Yönetim Paneli" description="Profil doğrulama taleplerini incele, kullanıcıları yönet." />

      <Tabs
        items={[
          { key: 'verifications', label: 'Doğrulama Bekleyenler', count: pending?.length },
          { key: 'users', label: 'Kullanıcılar' },
        ]}
        active={tab}
        onChange={(k) => setTab(k as typeof tab)}
        className="mb-6"
      />

      {tab === 'verifications' && (
        pending === null ? (
          <div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <CardSkeleton key={i} />)}</div>
        ) : pending.length === 0 ? (
          <EmptyState icon={<ShieldCheck size={22} />} title="Bekleyen doğrulama yok" description="Yeni profil doğrulama talepleri burada görünecek." />
        ) : (
          <div className="space-y-3">
            {pending.map((item) => {
              const key = `${item.kind}-${item.profileId}`;
              const busy = busyKey === key;
              return (
                <Card key={key} className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-text">{item.name || '(isim yok)'}</p>
                      <Badge variant="neutral">{KIND_LABELS[item.kind]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-text-faint">{item.email} · {formatDateTime(item.createdDate)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" icon={<Check size={14} />} loading={busy} onClick={() => handleDecision(item, 'Approved')}>
                      Onayla
                    </Button>
                    <Button size="sm" variant="secondary" icon={<X size={14} />} loading={busy} onClick={() => handleDecision(item, 'Rejected')}>
                      Reddet
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {tab === 'users' && (
        users === null ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-gold" size={26} /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={<Users size={22} />} title="Kullanıcı bulunamadı" description="" />
        ) : (
          <>
            <div className="space-y-2">
              {users.map((u) => (
                <Card key={u.id} className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-text">{u.firstName} {u.lastName}</p>
                    <p className="mt-0.5 text-xs text-text-faint">{u.email} · {u.phoneNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!u.isEmailConfirmed && <Badge variant="danger">E-posta doğrulanmadı</Badge>}
                    {!u.isProfileCompleted && <Badge variant="neutral">Profil eksik</Badge>}
                    <Badge variant="accent">{USER_TYPE_LABELS[u.role]}</Badge>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6">
              <Pagination page={usersPage} totalPages={usersTotalPages} onChange={setUsersPage} />
            </div>
          </>
        )
      )}
    </div>
  );
}
