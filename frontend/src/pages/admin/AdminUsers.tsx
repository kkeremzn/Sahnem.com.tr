import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import * as adminService from '@/services/adminService';
import { USER_TYPES, USER_TYPE_LABELS, type AppUser, type UserType } from '@/types';

const PAGE_SIZE = 20;
type StatusFilter = '' | 'active' | 'suspended' | 'unverified';

export function AdminUsers() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<UserType | ''>('');
  const [status, setStatus] = useState<StatusFilter>((params.get('status') as StatusFilter) ?? '');

  function load() {
    setUsers(null);
    adminService.listAllUsers(page, PAGE_SIZE, {
      search: search || undefined,
      role: role || undefined,
      isActive: status === 'active' ? true : status === 'suspended' ? false : undefined,
      isEmailConfirmed: status === 'unverified' ? false : undefined,
    }).then((res) => {
      setUsers(res.items);
      setTotalPages(Math.max(1, res.totalPages));
    });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, role, status]);

  useEffect(() => {
    if (status) setParams({ status }, { replace: true });
    else setParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text">Kullanıcılar</h1>

      <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-wrap gap-2.5">
        <Input placeholder="İsim, e-posta veya telefon ara..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="max-w-xs" />
        <Select value={role} onChange={(e) => { setPage(1); setRole(e.target.value as UserType | ''); }} className="w-auto">
          <option value="">Tüm roller</option>
          {USER_TYPES.map((r) => <option key={r} value={r}>{USER_TYPE_LABELS[r]}</option>)}
        </Select>
        <Select value={status} onChange={(e) => { setPage(1); setStatus(e.target.value as StatusFilter); }} className="w-auto">
          <option value="">Tüm durumlar</option>
          <option value="active">Aktif</option>
          <option value="suspended">Askıya alınmış</option>
          <option value="unverified">E-posta doğrulanmamış</option>
        </Select>
        <Button type="submit" variant="secondary">Ara</Button>
      </form>

      {users === null ? (
        <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
      ) : users.length === 0 ? (
        <EmptyState icon={<Users size={22} />} title="Kullanıcı bulunamadı" description="Filtreleri değiştirip tekrar dene." />
      ) : (
        <>
          <div className="space-y-2">
            {users.map((u) => (
              <Card key={u.id} hover className="flex cursor-pointer flex-wrap items-center justify-between gap-3" onClick={() => navigate(`/backstage/users/${u.id}`)}>
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
          <div className="mt-6"><Pagination page={page} totalPages={totalPages} onChange={setPage} /></div>
        </>
      )}
    </div>
  );
}
