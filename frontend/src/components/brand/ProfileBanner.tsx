import { LogoMark } from './LogoMark';

interface ProfileBannerProps {
  className?: string;
}

// Profil sayfalarındaki üst afiş alanı — kullanıcılar kendi kapak fotoğrafını
// yükleyemediği için önceden sadece düz bir gradyan gösteriyordu, boş/eksik
// gibi görünüyordu. Marka logosu/yazısı her profilde birebir aynı şekilde
// gösterilerek bu alanın kasıtlı bir marka öğesi olduğu netleşiyor.
export function ProfileBanner({ className = '' }: ProfileBannerProps) {
  return (
    <div className={`relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-r from-gold-dim/40 via-deep to-accent/20 text-gold sm:h-56 ${className}`}>
      <LogoMark size={40} withWordmark className="opacity-25 sm:scale-125" />
    </div>
  );
}
