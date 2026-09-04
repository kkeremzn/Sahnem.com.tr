// Kullanıcı telefonu boşluklu/tireli ya da başında 0 ile de yazabilir
// ("532 111 22 33", "0532 111 22 33" gibi) — backend'e göndermeden önce sade
// bir "5xxxxxxxxx" biçimine indirgiyoruz, backend de aynı biçimi bekliyor.
export function normalizePhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.startsWith('0') ? digits.slice(1) : digits;
}

export function isValidTurkishPhone(raw: string): boolean {
  return /^5\d{9}$/.test(normalizePhoneNumber(raw));
}
