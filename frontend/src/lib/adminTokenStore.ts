// Normal kullanıcı tokenStore'undan bilerek ayrı bir modül — admin oturumu ile
// normal kullanıcı oturumu aynı sekmede asla karışmasın diye (biri çıkış
// yapınca diğeri etkilenmemeli, aynı anda ikisi de açık olabilmeli).
let adminAccessToken: string | null = null;

export function getAdminAccessToken(): string | null {
  return adminAccessToken;
}

export function setAdminAccessToken(token: string | null): void {
  adminAccessToken = token;
}
