import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight, Bell, Briefcase, ListChecks, MessageCircle, PlusCircle, Search,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { OfferStatusBadge, AdvertStatusBadge } from '@/components/ui/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import * as offerService from '@/services/offerService';
import * as advertService from '@/services/advertService';
import * as messageService from '@/services/messageService';
import * as notificationService from '@/services/notificationService';
import type { Advert, Offer } from '@/types';
import { formatPrice, formatRelativeTime } from '@/lib/format';

export function Dashboard() {
  const { user, isMusician, isAdmin } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!user || isAdmin) return;
    messageService.listConversations().then((cs) => setUnreadMessages(cs.reduce((s, c) => s + c.unreadCount, 0)));
    notificationService.listNotifications().then((ns) => setUnreadNotifications(ns.filter((n) => !n.isRead).length));

    if (isMusician) {
      offerService.listMyOffers().then(setOffers);
      advertService.listAdverts({ status: 'Open', pageSize: 4 }).then((res) => setAdverts(res.items));
    } else {
      advertService.listAdvertsByCreator(user.id).then(async (myAdverts) => {
        setAdverts(myAdverts);
        const allOffers = await Promise.all(myAdverts.map((a) => offerService.listOffersByAdvert(a.id)));
        setOffers(allOffers.flat());
      });
    }
  }, [user, isMusician, isAdmin]);

  if (!user) return null;
  if (isAdmin) return <Navigate to="/admin" replace />;

  const pendingOffers = offers.filter((o) => o.offerStatus === 'Pending');

  return (
    <div>
      <PageHeader
        title={`Merhaba, ${user.firstName} 👋`}
        description={isMusician ? 'Bugün sahnene bir adım daha yaklaşalım.' : 'Etkinliğin için doğru ismi bulalım.'}
        action={
          isMusician ? (
            <Link to="/jobs"><Button icon={<Search size={15} />}>İlanları Keşfet</Button></Link>
          ) : (
            <Link to="/post-advert"><Button icon={<PlusCircle size={15} />}>İlan Ver</Button></Link>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="text-center">
          <ListChecks size={18} className="mx-auto text-gold-soft" />
          <p className="mt-2 font-display text-xl font-bold">{pendingOffers.length}</p>
          <p className="text-xs text-text-faint">{isMusician ? 'Bekleyen teklifim' : 'İncelenecek teklif'}</p>
        </Card>
        <Card className="text-center">
          <Briefcase size={18} className="mx-auto text-accent" />
          <p className="mt-2 font-display text-xl font-bold">{isMusician ? offers.length : adverts.length}</p>
          <p className="text-xs text-text-faint">{isMusician ? 'Toplam teklif' : 'Toplam ilan'}</p>
        </Card>
        <Card className="text-center">
          <MessageCircle size={18} className="mx-auto text-gold-soft" />
          <p className="mt-2 font-display text-xl font-bold">{unreadMessages}</p>
          <p className="text-xs text-text-faint">Okunmamış mesaj</p>
        </Card>
        <Card className="text-center">
          <Bell size={18} className="mx-auto text-accent" />
          <p className="mt-2 font-display text-xl font-bold">{unreadNotifications}</p>
          <p className="text-xs text-text-faint">Yeni bildirim</p>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold">{isMusician ? 'Son tekliflerim' : 'Gelen teklifler'}</h3>
            <Link to={isMusician ? '/offers' : '/my-adverts'} className="inline-flex items-center gap-1 text-xs font-semibold text-gold-soft hover:underline">
              Tümü <ArrowRight size={12} />
            </Link>
          </div>
          {offers.length === 0 ? (
            <EmptyState title="Henüz teklif yok" description={isMusician ? 'İlanlara göz atarak teklif göndermeye başla.' : 'İlanlarına henüz teklif gelmedi.'} />
          ) : (
            <div className="space-y-3">
              {offers.slice(0, 4).map((o) => (
                <Card key={o.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-text">{isMusician ? o.advertTitle : o.musicianName}</p>
                    <p className="text-xs text-text-faint">{formatPrice(o.proposedPrice)} · {formatRelativeTime(o.createdDate)}</p>
                  </div>
                  <OfferStatusBadge status={o.offerStatus} />
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold">{isMusician ? 'Senin için ilanlar' : 'İlanlarım'}</h3>
            <Link to={isMusician ? '/jobs' : '/my-adverts'} className="inline-flex items-center gap-1 text-xs font-semibold text-gold-soft hover:underline">
              Tümü <ArrowRight size={12} />
            </Link>
          </div>
          {adverts.length === 0 ? (
            <EmptyState title="İlan bulunamadı" description={isMusician ? 'Şu an açık ilan yok, daha sonra tekrar kontrol et.' : 'Henüz ilan yayınlamadın.'} />
          ) : (
            <div className="space-y-3">
              {adverts.slice(0, 4).map((a) => (
                <Card key={a.id} className="flex items-center justify-between gap-3">
                  <Link to={isMusician ? `/jobs/${a.id}` : `/my-adverts/${a.id}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text hover:text-gold-soft">{a.title}</p>
                    <p className="text-xs text-text-faint">{formatPrice(a.budget)}</p>
                  </Link>
                  <AdvertStatusBadge status={a.status} />
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
