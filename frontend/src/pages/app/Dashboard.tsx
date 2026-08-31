import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getHomeRoute } from '@/lib/homeRoute';

// Eskiden ayrı bir "Panel" ekranıydı — girişten sonra kullanıcıyı buraya
// uğratıp tekrar tıklatmak gereksiz bir aradurak oluşturuyordu. Artık
// giriş doğrudan rolüne uygun işlevsel sayfaya gidiyor (bkz. getHomeRoute);
// bu route sadece eski bağlantılar/yer imleri için bir yönlendirme olarak duruyor.
export function Dashboard() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;
  return <Navigate to={getHomeRoute(user)} replace />;
}
