import { ApiError } from './apiClient';

export type EntityFetchResult<T> =
  | { kind: 'found'; data: T }
  | { kind: 'not-found' }
  | { kind: 'error' };

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Backend, "kayıt yok" durumunu her zaman düz 400 ile bildiriyor (bkz.
// ExceptionHandlingMiddleware.cs — servis katmanının kasıtlı attığı iş kuralı
// hataları hep 400, gerçekten beklenmeyen hatalar 500). Bu yüzden 400'ü
// "not-found" sayıyoruz, başka her şeyi (500, ağ hatası, zaman aşımı — ör.
// Render'ın soğuk başlangıcı) "error" sayıyoruz ve authService.tryRestoreSession
// ile aynı desende bir kez daha deniyoruz.
//
// Neden önemli: bir kaydı sadece gerçekten yok olduğu için değil, backend bir
// an yanıt veremediği için "bulunamadı" göstermek hem ziyaretçiyi hem Google'ı
// yanıltır — gerçek, canlı bir ilan/profil geçici bir aksaklık yüzünden
// "noindex" işaretlenip Google'a "bunu tarama" denmiş olur.
export async function fetchEntity<T>(loader: () => Promise<T>): Promise<EntityFetchResult<T>> {
  const attempt = async (): Promise<EntityFetchResult<T> | 'retry'> => {
    try {
      return { kind: 'found', data: await loader() };
    } catch (e) {
      if (e instanceof ApiError && e.status === 400) return { kind: 'not-found' };
      return 'retry';
    }
  };

  const first = await attempt();
  if (first !== 'retry') return first;

  await wait(1200);
  const second = await attempt();
  return second === 'retry' ? { kind: 'error' } : second;
}
