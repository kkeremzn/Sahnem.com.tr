import { api } from '@/lib/apiClient';

// Backend'de dosyalar kullanıcıya/profile'a değil doğrudan AppUser'a (AvatarUrl)
// bağlanıyor — bu yüzden yükleme sonrası dönen relative URL, çağıran tarafından
// authService.updateUser({ avatarUrl }) ile kalıcı hale getirilmeli.
export async function uploadAvatar(file: File): Promise<string> {
  const res = await api.upload<{ url: string }>('/upload/avatar', file);
  return res.url;
}
