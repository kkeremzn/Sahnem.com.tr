import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import * as adminService from '@/services/adminService';
import type { AdminConversation } from '@/services/adminService';
import { formatDateTime } from '@/lib/format';

const PAGE_SIZE = 20;

export function AdminConversations() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<AdminConversation[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  function load() {
    setConversations(null);
    adminService.listConversations(page, PAGE_SIZE, search || undefined).then((res) => {
      setConversations(res.items);
      setTotalPages(Math.max(1, res.totalPages));
    });
  }

  useEffect(() => { load(); }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text">Sohbetler</h1>

      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2.5">
        <Input placeholder="Taraf ismiyle ara..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="max-w-sm" />
        <Button type="submit" variant="secondary">Ara</Button>
      </form>

      {conversations === null ? (
        <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}</div>
      ) : conversations.length === 0 ? (
        <EmptyState icon={<MessageSquare size={22} />} title="Sohbet bulunamadı" description="" />
      ) : (
        <>
          <div className="space-y-2">
            {conversations.map((c) => (
              <Card key={c.id} hover className="cursor-pointer" onClick={() => navigate(`/backstage/conversations/${c.id}`)}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-text">{c.userAName} <span className="text-text-faint">↔</span> {c.userBName}</p>
                    <p className="mt-0.5 truncate text-xs text-text-faint">{c.lastMessage || '(mesaj yok)'}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="neutral">{c.messageCount} mesaj</Badge>
                    <span className="text-xs text-text-faint">{formatDateTime(c.lastMessageAt)}</span>
                  </div>
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
