import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from '@/components/ui/Toaster';
import { Maintenance } from '@/pages/Maintenance';
import { MAINTENANCE_MODE } from '@/config/maintenance';
import { router } from './router';

function App() {
  // API/veritabanı kapalıyken AuthProvider'ın oturum geri yükleme isteği
  // atmasının (ve her sayfanın kendi kırık yükleme durumunu göstermesinin)
  // bir anlamı yok — tüm uygulamayı tek bir statik bakım ekranına düşürüyoruz.
  if (MAINTENANCE_MODE) {
    return <Maintenance />;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ToastProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
