import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Ban, Check, Loader2, MessageCircle, ShieldCheck, ShieldOff, Trash2, TrendingUp, Users, X,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { AdvertStatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as adminService from '@/services/adminService';
import {
  USER_TYPE_LABELS, USER_TYPES,
  type AdminStats, type AdminUserDetail, type Advert, type AppUser, type PendingVerification, type UserType,
} from '@/types';
import { formatDateTime, formatPrice } from '@/lib/format';
import { formatApiError } from '@/lib/apiClient';

const KIND_LABELS: Record<PendingVerification['kind'], string> = {
  Musician: 'Müzisyen', Organizer: 'Organizatör', Venue: 'Mekan',
};
const PAGE_SIZE = 20;
type Tab = 'dashboard' | 'users' | 'verifications' | 'adverts';
type UserStatusFilter = '' | 'active' | 'suspended' | 'unverified';

export function AdminPanel() {
  const { isAdmin, user: currentAdmin } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('dashboard');

  // ---------------------------------------------------------------- Dashboard
  const [stats, setStats] = useState<AdminStats | null>(null);
  useEffect(() => {
    if (tab === 'dashboard') adminService.getStats().then(setStats);
  }, [tab]);

  // ------------------------------------------------------------- Verifications
  const [pending, setPending] = useState<PendingVerification[] | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  async function loadPending() {
    setPending(await adminService.listPendingVerifications());
  }
  useEffect(() => { if (tab === 'verifications') loadPending(); }, [tab]);

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

  // ------------------------------------------------------------------- Users
  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [userSearchInput, setUserSearchInput] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<UserType | ''>('');
  const [userStatusFilter, setUserStatusFilter] = useState<UserStatusFilter>('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<AdminUserDetail | null>(null);
  const [userActionBusy, setUserActionBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);

  function loadUsers() {
    setUsers(null);
    adminService.listAllUsers(usersPage, PAGE_SIZE, {
      search: userSearch || undefined,
      role: userRoleFilter || undefined,
      isActive: userStatusFilter === 'active' ? true : userStatusFilter === 'suspended' ? false : undefined,
      isEmailConfirmed: userStatusFilter === 'unverified' ? false : undefined,
    }).then((res) => {
      setUsers(res.items);
      setUsersTotalPages(Math.max(1, res.totalPages));
    });
  }
  useEffect(() => {
    if (tab === 'users') loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, usersPage, userSearch, userRoleFilter, userStatusFilter]);

  function handleUserSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setUsersPage(1);
    setUserSearch(userSearchInput.trim());
  }

  async function openUserDetail(id: number) {
    setSelectedUserId(id);
    setUserDetail(null);
    try {
      setUserDetail(await adminService.getUserDetail(id));
    } catch (e) {
      toast(formatApiError(e), 'error');
      setSelectedUserId(null);
    }
  }

  async function handleSuspendToggle(u: AppUser) {
    setUserActionBusy(true);
    try {
      if (u.isActive) {
        await adminService.suspendUser(u.id);
        toast('Kullanıcı askıya alındı.', 'success');
      } else {
        await adminService.reactivateUser(u.id);
        toast('Kullanıcı yeniden aktifleştirildi.', 'success');
      }
      loadUsers();
      if (selectedUserId === u.id) openUserDetail(u.id);
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setUserActionBusy(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteTarget) return;
    setUserActionBusy(true);
    try {
      await adminService.deleteUser(deleteTarget.id);
      toast('Kullanıcı silindi.', 'success');
      setDeleteTarget(null);
      setSelectedUserId(null);
      loadUsers();
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setUserActionBusy(false);
    }
  }

  // ----------------------------------------------------------------- Adverts
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [advertsPage, setAdvertsPage] = useState(1);
  const [advertsTotalPages, setAdvertsTotalPages] = useState(1);
  const [advertSearchInput, setAdvertSearchInput] = useState('');
  const [advertSearch, setAdvertSearch] = useState('');
  const [cancelAdvertTarget, setCancelAdvertTarget] = useState<Advert | null>(null);
  const [advertActionBusy, setAdvertActionBusy] = useState(false);

  function loadAdverts() {
    setAdverts(null);
    adminService.listAllAdverts(advertsPage, PAGE_SIZE, advertSearch || undefined).then((res) => {
      setAdverts(res.items);
      setAdvertsTotalPages(Math.max(1, res.totalPages));
    });
  }
  useEffect(() => {
    if (tab === 'adverts') loadAdverts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, advertsPage, advertSearch]);

  function handleAdvertSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setAdvertsPage(1);
    setAdvertSearch(advertSearchInput.trim());
  }

  async function handleCancelAdvert() {
    if (!cancelAdvertTarget) return;
    setAdvertActionBusy(true);
    try {
      await adminService.cancelAdvertAsAdmin(cancelAdvertTarget.id);
      toast('İlan iptal edildi.', 'success');
      setCancelAdvertTarget(null);
      loadAdverts();
    } catch (e) {
      toast(formatApiError(e), 'error');
    } finally {
      setAdvertActionBusy(false);
    }
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <PageHeader title="Yönetim Paneli" description="Platformu izle, kullanıcıları ve ilanları yönet, profil doğrulama taleplerini incele." />

      <Tabs
        items={[
          { key: 'dashboard', label: 'Genel Bakış' },
          { key: 'users', label: 'Kullanıcılar' },
          { key: 'verifications', label: 'Doğrulama Bekleyenler', count: pending?.length },
          { key: 'adverts', label: 'İlanlar' },
        ]}
        active={tab}
        onChange={(k) => setTab(k as Tab)}
        className="mb-6"
      />

      {/* ---------------------------------------------------------- Dashboard */}
      {tab === 'dashboard' && (
        stats === null ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)}</div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Toplam Kullanıcı" value={stats.totalUsers} hint={`${stats.totalMusicians} müzisyen · ${stats.totalOrganizers + stats.totalVenues} işveren`} />
              <StatCard label="Son 7 Günde Kayıt" value={stats.newUsersLast7Days} hint={`Son 30 günde ${stats.newUsersLast30Days}`} icon={<TrendingUp size={16} />} />
              <StatCard label="Doğrulama Bekleyen" value={stats.pendingVerifications} hint="Profil doğrulama kuyruğu" accent={stats.pendingVerifications > 0} />
              <StatCard label="Askıya Alınmış" value={stats.suspendedUsers} hint={`${stats.unverifiedEmailUsers} e-posta doğrulanmamış`} accent={stats.suspendedUsers > 0} danger />
              <StatCard label="Toplam İlan" value={stats.totalAdverts} hint={`${stats.openAdverts} açık · ${stats.closedAdverts} kapalı · ${stats.cancelledAdverts} iptal`} />
              <StatCard label="Toplam Teklif" value={stats.totalOffers} hint={`${stats.pendingOffers} bekliyor · ${stats.acceptedOffers} kabul · ${stats.rejectedOffers} red`} />
              <StatCard label="Sohbetler" value={stats.totalConversations} hint={`${stats.totalMessages} mesaj`} icon={<MessageCircle size={16} />} />
              <StatCard label="Müzisyen / İşveren" value={`${stats.totalMusicians} / ${stats.totalOrganizers + stats.totalVenues}`} hint={`${stats.totalOrganizers} organizatör · ${stats.totalVenues} mekan`} icon={<Users size={16} />} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <h3 className="mb-3 font-display text-base font-bold">Son kayıtlar</h3>
                {stats.recentSignups.length === 0 ? (
                  <p className="text-sm text-text-faint">Henüz kayıt yok.</p>
                ) : (
                  <div className="space-y-2.5">
                    {stats.recentSignups.map((u) => (
                      <div key={u.id} className="flex items-center justify-between gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text">{u.firstName} {u.lastName}</p>
                          <p className="truncate text-xs text-text-faint">{u.email}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge variant="neutral">{u.role}</Badge>
                          <span className="text-xs text-text-faint">{formatDateTime(u.createdDate)}</span>
                        </div>
                      </div>
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
                      <div key={a.id} className="flex items-center justify-between gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
                        <p className="min-w-0 truncate text-sm font-medium text-text">{a.title}</p>
                        <div className="flex shrink-0 items-center gap-2">
                          <Badge variant="neutral">{a.status}</Badge>
                          <span className="text-xs text-text-faint">{formatDateTime(a.createdDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )
      )}

      {/* --------------------------------------------------------------- Users */}
      {tab === 'users' && (
        <div>
          <form onSubmit={handleUserSearchSubmit} className="mb-4 flex flex-wrap gap-2.5">
            <Input
              placeholder="İsim, e-posta veya telefon ara..."
              value={userSearchInput}
              onChange={(e) => setUserSearchInput(e.target.value)}
              className="max-w-xs"
            />
            <Select value={userRoleFilter} onChange={(e) => { setUsersPage(1); setUserRoleFilter(e.target.value as UserType | ''); }} className="w-auto">
              <option value="">Tüm roller</option>
              {USER_TYPES.map((r) => <option key={r} value={r}>{USER_TYPE_LABELS[r]}</option>)}
              <option value="Admin">Admin</option>
            </Select>
            <Select value={userStatusFilter} onChange={(e) => { setUsersPage(1); setUserStatusFilter(e.target.value as UserStatusFilter); }} className="w-auto">
              <option value="">Tüm durumlar</option>
              <option value="active">Aktif</option>
              <option value="suspended">Askıya alınmış</option>
              <option value="unverified">E-posta doğrulanmamış</option>
            </Select>
            <Button type="submit" variant="secondary" size="md">Ara</Button>
          </form>

          {users === null ? (
            <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
          ) : users.length === 0 ? (
            <EmptyState icon={<Users size={22} />} title="Kullanıcı bulunamadı" description="Filtreleri değiştirip tekrar dene." />
          ) : (
            <>
              <div className="space-y-2">
                {users.map((u) => (
                  <Card
                    key={u.id}
                    hover
                    className="flex cursor-pointer flex-wrap items-center justify-between gap-3"
                    onClick={() => openUserDetail(u.id)}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-text">{u.firstName} {u.lastName}</p>
                        {!u.isActive && <Badge variant="danger">Askıda</Badge>}
                      </div>
                      <p className="mt-0.5 text-xs text-text-faint">{u.email} · {u.phoneNumber}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!u.isEmailConfirmed && <Badge variant="warning">E-posta doğrulanmadı</Badge>}
                      {!u.isProfileCompleted && <Badge variant="neutral">Profil eksik</Badge>}
                      <Badge variant="accent">{u.role === 'Admin' ? 'Admin' : USER_TYPE_LABELS[u.role]}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-6">
                <Pagination page={usersPage} totalPages={usersTotalPages} onChange={setUsersPage} />
              </div>
            </>
          )}
        </div>
      )}

      {/* --------------------------------------------------------- Verifications */}
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

      {/* --------------------------------------------------------------- Adverts */}
      {tab === 'adverts' && (
        <div>
          <form onSubmit={handleAdvertSearchSubmit} className="mb-4 flex gap-2.5">
            <Input
              placeholder="İlan başlığı veya açıklamasında ara..."
              value={advertSearchInput}
              onChange={(e) => setAdvertSearchInput(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit" variant="secondary" size="md">Ara</Button>
          </form>

          {adverts === null ? (
            <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
          ) : adverts.length === 0 ? (
            <EmptyState title="İlan bulunamadı" description="Filtreleri değiştirip tekrar dene." />
          ) : (
            <>
              <div className="space-y-2">
                {adverts.map((a) => (
                  <Card key={a.id} className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link to={`/jobs/${a.id}`} className="font-semibold text-text hover:text-gold-soft">{a.title}</Link>
                        <AdvertStatusBadge status={a.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-text-faint">
                        {a.creatorName} · {formatPrice(a.budget)} · {a.offerCount} teklif · {formatDateTime(a.createdDate)}
                      </p>
                    </div>
                    {a.status === 'Open' && (
                      <Button size="sm" variant="danger" icon={<Ban size={14} />} onClick={() => setCancelAdvertTarget(a)}>
                        İptal Et
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
              <div className="mt-6">
                <Pagination page={advertsPage} totalPages={advertsTotalPages} onChange={setAdvertsPage} />
              </div>
            </>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- Modals */}
      <Modal open={selectedUserId !== null} onClose={() => setSelectedUserId(null)} title="Kullanıcı Detayı" maxWidth="max-w-lg">
        {userDetail === null ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gold" size={24} /></div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-text">{userDetail.user.firstName} {userDetail.user.lastName}</h4>
                {!userDetail.user.isActive && <Badge variant="danger">Askıda</Badge>}
                <Badge variant="accent">{userDetail.user.role === 'Admin' ? 'Admin' : USER_TYPE_LABELS[userDetail.user.role]}</Badge>
              </div>
              <p className="mt-1 text-sm text-text-dim">{userDetail.user.email} · {userDetail.user.phoneNumber}</p>
              {userDetail.profileSummary && <p className="mt-1 text-sm text-text-faint">{userDetail.profileSummary}</p>}
              <p className="mt-2 text-xs text-text-faint">
                Kayıt: {formatDateTime(userDetail.user.createdDate)} ·{' '}
                {userDetail.user.isEmailConfirmed ? 'E-posta doğrulandı' : 'E-posta doğrulanmadı'} ·{' '}
                {userDetail.user.isProfileCompleted ? 'Profil tamam' : 'Profil eksik'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-md border border-border p-3 text-center">
              <div><p className="font-display text-lg font-bold text-text">{userDetail.advertCount}</p><p className="text-xs text-text-faint">İlan</p></div>
              <div><p className="font-display text-lg font-bold text-text">{userDetail.offerCount}</p><p className="text-xs text-text-faint">Teklif</p></div>
              <div><p className="font-display text-lg font-bold text-text">{userDetail.conversationCount}</p><p className="text-xs text-text-faint">Sohbet</p></div>
              <div><p className="font-display text-lg font-bold text-text">{userDetail.messageCount}</p><p className="text-xs text-text-faint">Mesaj</p></div>
              <div><p className="font-display text-lg font-bold text-text">{userDetail.favoriteCount}</p><p className="text-xs text-text-faint">Favori</p></div>
              {userDetail.verificationStatus && (
                <div><p className="font-display text-sm font-bold text-text">{userDetail.verificationStatus}</p><p className="text-xs text-text-faint">Doğrulama</p></div>
              )}
            </div>

            {userDetail.user.id === currentAdmin?.id ? (
              <p className="text-xs text-text-faint">Kendi hesabın üzerinde askıya alma/silme işlemi yapamazsın.</p>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={userDetail.user.isActive ? 'secondary' : 'primary'}
                  icon={userDetail.user.isActive ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
                  loading={userActionBusy}
                  onClick={() => handleSuspendToggle(userDetail.user)}
                >
                  {userDetail.user.isActive ? 'Askıya Al' : 'Aktifleştir'}
                </Button>
                <Button
                  variant="danger"
                  icon={<Trash2 size={15} />}
                  onClick={() => setDeleteTarget(userDetail.user)}
                >
                  Hesabı Sil
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Kullanıcıyı sil"
        description={deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName} adlı kullanıcıyı ve tüm ilişkili verilerini (ilan, teklif, mesaj, favori) kalıcı olarak silmek istediğine emin misin? Bu işlem geri alınamaz.` : undefined}
        confirmLabel="Kalıcı Olarak Sil"
        danger
        loading={userActionBusy}
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={!!cancelAdvertTarget}
        title="İlanı iptal et"
        description={cancelAdvertTarget ? `"${cancelAdvertTarget.title}" ilanını admin olarak iptal etmek istediğine emin misin?` : undefined}
        confirmLabel="İptal Et"
        danger
        loading={advertActionBusy}
        onConfirm={handleCancelAdvert}
        onClose={() => setCancelAdvertTarget(null)}
      />
    </div>
  );
}

function StatCard({
  label, value, hint, icon, accent, danger,
}: { label: string; value: number | string; hint?: string; icon?: ReactNode; accent?: boolean; danger?: boolean }) {
  return (
    <Card className={danger ? 'border-danger/30' : accent ? 'border-gold/30' : undefined}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-faint">{label}</p>
        {icon && <span className="text-text-faint">{icon}</span>}
      </div>
      <p className={`mt-1.5 font-display text-2xl font-bold ${danger ? 'text-danger' : accent ? 'text-gold-soft' : 'text-text'}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}
    </Card>
  );
}
