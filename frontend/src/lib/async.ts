// Gerçek API'ye geçildiğinde bu dosya kaldırılıp servisler fetch() kullanacak.
export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
