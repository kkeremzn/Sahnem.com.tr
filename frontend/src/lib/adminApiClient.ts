import { getAdminAccessToken, setAdminAccessToken } from './adminTokenStore';
import { ApiError, type FieldError } from './apiClient';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5080/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
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
  const token = getAdminAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';

  return fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers,
    // Admin refresh cookie'si (sahnem_admin_refresh_token) HttpOnly, sadece
    // /api/admin-auth path'ine scope'lu — credentials:'include' bunun her
    // istekte gönderilmesi için gerekli.
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

let refreshInFlight: Promise<boolean> | null = null;

async function silentRefresh(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_URL}/admin-auth/refresh`, { method: 'POST', credentials: 'include' });
        if (!res.ok) {
          setAdminAccessToken(null);
          return false;
        }
        const data = await res.json();
        setAdminAccessToken(data.accessToken as string);
        return true;
      } catch {
        setAdminAccessToken(null);
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
      ? body.errors.map((e: { field?: string; message?: string }) => ({ field: e.field ?? '', message: e.message ?? '' }))
      : null;
    return new ApiError(res.status, body.message ?? 'Bir hata oluştu.', fieldErrors);
  } catch {
    return new ApiError(res.status, res.statusText || 'Bir hata oluştu.');
  }
}

export async function adminApiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
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

export const adminApi = {
  get: <T>(path: string, query?: RequestOptions['query']) => adminApiRequest<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown, options?: Partial<RequestOptions>) =>
    adminApiRequest<T>(path, { method: 'POST', body, ...options }),
  put: <T>(path: string, body?: unknown) => adminApiRequest<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => adminApiRequest<T>(path, { method: 'DELETE' }),
};

export { silentRefresh as silentAdminRefresh };
