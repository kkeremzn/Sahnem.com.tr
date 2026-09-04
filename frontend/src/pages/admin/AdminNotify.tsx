import { useState } from 'react';
import { Bell, Mail, Search, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import * as adminService from '@/services/adminService';
import type { AppUser } from '@/types';

type Mode = 'notification' | 'email';
type Audience = 'all' | 'custom';

export function AdminNotify() {
  const [mode, setMode] = useState<Mode>('notification');
  const [audience, setAudience] = useState<Audience>('all');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<AppUser[]>([]);
  const [selected, setSelected] = useState<AppUser[]>([]);
  const [searching, setSearching] = useState(false);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkTo, setLinkTo] = useState('');

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(q: string) {
    setSearch(q);
    if (!q.trim()) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await adminService.listAllUsers(1, 8, { search: q });
      setResults(res.items.filter((u) => !selected.some((s) => s.id === u.id)));
    } finally {
      setSearching(false);
    }
  }

  function addUser(u: AppUser) {
    setSelected((prev) => [...prev, u]);
    setResults((prev) => prev.filter((r) => r.id !== u.id));
  }

  function removeUser(id: number) {
    setSelected((prev) => prev.filter((u) => u.id !== id));
  }

  async function handleSend() {
    setSending(true);
    setError(null);
    setResult(null);
    const userIds = audience === 'custom' ? selected.map((u) => u.id) : undefined;
    try {
      if (mode === 'notification') {
        const res = await adminService.broadcastNotification({ title, body, linkTo: linkTo || undefined, userIds });
        setResult(`${res.recipientCount} kullanıcıya bildirim gönderildi.`);
      } else {
        const res = await adminService.sendBulkEmail({ subject: title, body, userIds });
        setResult(`${res.recipientCount} kullanıcıya e-posta gönderildi.`);
      }
      setTitle(''); setBody(''); setLinkTo('');
    } catch {
      setError('Gönderim başarısız oldu.');
    } finally {
      setSending(false);
    }
  }

  const canSend = title.trim() && body.trim() && (audience === 'all' || selected.length > 0);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Bildirim & Mail Gönder</h1>

      <Tabs
        items={[
          { key: 'notification', label: 'Uygulama İçi Bildirim' },
          { key: 'email', label: 'E-posta' },
        ]}
        active={mode}
        onChange={(k) => setMode(k as Mode)}
      />

      <Card className="space-y-4">
        <div>
          <p className="mb-2 text-sm font-semibold text-text">Kime</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAudience('all')}
              className={`flex-1 cursor-pointer rounded-md border px-3.5 py-2.5 text-sm font-medium transition-colors ${audience === 'all' ? 'border-gold bg-gold/10 text-gold-soft' : 'border-border text-text-dim hover:border-border-hover'}`}
            >
              Tüm kullanıcılar
            </button>
            <button
              type="button"
              onClick={() => setAudience('custom')}
              className={`flex-1 cursor-pointer rounded-md border px-3.5 py-2.5 text-sm font-medium transition-colors ${audience === 'custom' ? 'border-gold bg-gold/10 text-gold-soft' : 'border-border text-text-dim hover:border-border-hover'}`}
            >
              Seçili kullanıcılar
            </button>
          </div>
        </div>

        {audience === 'custom' && (
          <div>
            {selected.length > 0 && (
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {selected.map((u) => (
                  <span key={u.id} className="inline-flex items-center gap-1 rounded-full border border-gold bg-gold/10 py-1 pl-3 pr-1.5 text-xs font-medium text-gold-soft">
                    {u.firstName} {u.lastName}
                    <button type="button" onClick={() => removeUser(u.id)} className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-gold/20">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="İsim veya e-posta ile ara..."
                className="focus-ring h-10 w-full rounded-md border border-border bg-deep pl-9 pr-3 text-sm text-text placeholder:text-text-faint"
              />
            </div>
            {searching && <p className="mt-1.5 text-xs text-text-faint">Aranıyor...</p>}
            {results.length > 0 && (
              <div className="mt-1.5 max-h-48 overflow-y-auto rounded-md border border-border bg-card">
                {results.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => addUser(u)}
                    className="flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-sm text-text-dim hover:bg-card-hover hover:text-text"
                  >
                    <span>{u.firstName} {u.lastName}</span>
                    <span className="text-xs text-text-faint">{u.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Field label={mode === 'notification' ? 'Başlık' : 'Konu'}>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={mode === 'notification' ? 'ör. Yeni bir özellik geldi' : 'ör. Sahnem\'den güncelleme'} />
        </Field>
        <Field label="İçerik">
          <Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder={mode === 'email' ? 'HTML de yazabilirsin, ör. <p>Merhaba</p>' : 'Bildirim metni...'} />
        </Field>
        {mode === 'notification' && (
          <Field label="Tıklanınca açılacak sayfa" hint="Opsiyonel, ör. /jobs">
            <Input value={linkTo} onChange={(e) => setLinkTo(e.target.value)} placeholder="/jobs" />
          </Field>
        )}

        {result && <p className="text-sm text-success">{result}</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        <Button
          icon={mode === 'notification' ? <Bell size={15} /> : <Mail size={15} />}
          disabled={!canSend}
          loading={sending}
          onClick={handleSend}
        >
          Gönder
        </Button>
      </Card>
    </div>
  );
}
