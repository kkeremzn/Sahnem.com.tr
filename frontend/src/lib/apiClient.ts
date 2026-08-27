import { getAccessToken, setAccessToken } from './tokenStore';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5080/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

// Backend'in döndürdüğü yüklenmiş dosya yolları (/uploads/avatars/...) API'nin
// kendi origin'ine göre relative — frontend'in origin'inden farklı olduğu için
// <img> gibi yerlerde kullanılmadan önce API origin'iyle birleştirilmeli.
export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${API_ORIGIN}${path}`;
}

export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  fieldErrors: FieldError[] | null;

  constructor(status: number, message: string, fieldErrors: FieldError[] | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// Backend FluentValidation hatalarını (ör. "District can not be empty") kullanıcıya
// okunabilir tek bir metne çeviriyor — çıplak e.message tek başına genelde
// "Girdi doğrulama hatası" gibi genel bir başlık, hangi alanın sorunlu olduğunu söylemiyor.
export function formatApiError(e: unknown, fallback = 'Bir hata oluştu.'): string {
  if (e instanceof ApiError) {
    if (e.fieldErrors && e.fieldErrors.length > 0) {
      return e.fieldErrors.map((f) => f.message).join(' ');
    }
    return e.message || fallback;
  }
  return e instanceof Error ? e.message : fallback;
}

// Aynı anda birden fazla istek 401 alırsa (ör. sayfa açılışında paralel birkaç
// fetch), tek bir refresh çağrısı yapılır, geri kalanı onu bekler — her biri
// ayrı ayrı /user/refresh'e gitmez.
let refreshInFlight: Promise<boolean> | null = null;

async function silentRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_URL}/user/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!res.ok) {
          setAccessToken(null);
          return false;
        }
        const data = await res.json();
        setAccessToken(data.accessToken as string);
        return true;
      } catch {
        setAccessToken(null);
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

async function parseErrorBody(res: Response): Promise<ApiError> {
  try {
    const body = await res.json();
    const fieldErrors: FieldError[] | null = Array.isArray(body.errors)
      ? body.errors.map((e: { field?: string; message?: string }) => ({
          field: e.field ?? '',
          message: e.message ?? '',
        }))
      : null;
    return new ApiError(res.status, body.message ?? 'Bir hata oluştu.', fieldErrors);
  } catch {
    return new ApiError(res.status, res.statusText || 'Bir hata oluştu.');
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  formData?: FormData;
  query?: Record<string, string | number | boolean | undefined | null>;
  // /user/refresh ve /user/login gibi uçlarda 401 sonrası otomatik refresh
  // denemesi anlamsız/döngüsel olur — bu uçlar bu bayrakla hariç tutuluyor.
  skipAuthRetry?: boolean;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function rawRequest(path: string, options: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // FormData için Content-Type'ı tarayıcı kendi boundary'siyle set etmeli —
  // burada elle koyarsak multipart parse'ı bozulur.
  if (!options.formData && options.body !== undefined) headers['Content-Type'] = 'application/json';

  return fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers,
    // Refresh/logout uçları HttpOnly cookie'yi okuyor — cookie'nin gönderilmesi
    // için her istekte credentials:'include' gerekiyor.
    credentials: 'include',
    body: options.formData ?? (options.body !== undefined ? JSON.stringify(options.body) : undefined),
  });
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let res = await rawRequest(path, options);

  if (res.status === 401 && !options.skipAuthRetry) {
    const refreshed = await silentRefresh();
    if (refreshed) {
      res = await rawRequest(path, options);
    }
  }

  if (!res.ok) {
    throw await parseErrorBody(res);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) => apiRequest<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown, options?: Partial<RequestOptions>) =>
    apiRequest<T>(path, { method: 'POST', body, ...options }),
  put: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<T>(path, { method: 'POST', formData });
  },
};

export { silentRefresh };
