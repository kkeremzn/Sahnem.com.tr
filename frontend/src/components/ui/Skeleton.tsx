import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-card', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
    </div>
  );
}

// Müzisyen/mekan/organizatör profil sayfaları (banner + avatar/isim başlığı +
// içerik/aside ikilisi) için ortak iskelet — gerçek sayfayla aynı iskelet
// (banner yüksekliği, avatar boyutu, sütun oranları) kullanılınca veri
// gelince düzen sıçraması olmuyor.
export function ProfileDetailSkeleton() {
  return (
    <div>
      <div className="h-40 w-full bg-card sm:h-56" />
      <div className="relative -mt-14 px-4 pb-14 sm:-mt-16 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Skeleton className="h-[110px] w-[110px] shrink-0 rounded-full border-4 border-black" />
            <div className="w-full max-w-xs space-y-2.5 pb-1">
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <div className="rounded-md border border-border bg-card p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-3/4" />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="rounded-md border border-border bg-card p-5">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="mt-3 h-3 w-3/4" />
                    <Skeleton className="mt-2 h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="rounded-md border border-border bg-card p-5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-3 h-3 w-full" />
              </div>
              <div className="rounded-md border border-border bg-card p-5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// İlan/teklif detayı gibi "başlık + meta satırı + ana içerik/aside" düzenine
// sahip sayfalar için ortak iskelet (JobDetail, MyAdvertDetail, OfferDetail,
// AdminAdvertDetail).
export function DetailPageSkeleton({ withAvatarRow = false }: { withAvatarRow?: boolean }) {
  return (
    <div>
      {withAvatarRow && (
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      )}
      <Skeleton className="h-7 w-2/3 sm:h-8 sm:w-1/2" />
      <div className="mt-3 flex flex-wrap gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <div className="rounded-md border border-border bg-card p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="rounded-md border border-border bg-card p-5">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-md border border-border bg-card p-5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-2 h-7 w-24" />
          <Skeleton className="mt-5 h-9 w-full" />
        </div>
      </div>
    </div>
  );
}

// Mesajlar sayfası: sohbet listesi + sağdaki sohbet paneli.
export function MessagesSkeleton() {
  return (
    <div className="grid h-[calc(100vh-220px)] min-h-[480px] grid-cols-1 overflow-hidden rounded-lg border border-border md:grid-cols-[300px_1fr]">
      <div className="hidden flex-col border-r border-border md:flex">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-3.5">
            <Skeleton className="h-[42px] w-[42px] shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-deep">
        <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3.5">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-3.5 w-28" />
        </div>
        <div className="flex-1 space-y-3 px-4 py-4">
          <Skeleton className="h-10 w-2/3 rounded-lg" />
          <Skeleton className="ml-auto h-10 w-1/2 rounded-lg" />
          <Skeleton className="h-14 w-3/5 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Form ağırlıklı sayfalar (ör. ProfileEdit) için etiket + alan çiftlerinden
// oluşan iskelet.
export function FormSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-6 h-10 w-32" />
    </div>
  );
}
