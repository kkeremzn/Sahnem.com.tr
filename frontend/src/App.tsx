import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Toaster } from '@/components/ui/Toaster';
import { router } from './router';

function App() {
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
