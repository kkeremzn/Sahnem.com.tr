import { createBrowserRouter, Outlet } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileSetupLayout } from '@/components/layout/ProfileSetupLayout';
import { VerifyEmailLayout } from '@/components/layout/VerifyEmailLayout';
import { AdminShell } from '@/components/admin/AdminShell';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

import { Home } from '@/pages/Home';
import { Explore } from '@/pages/Explore';
import { Jobs } from '@/pages/Jobs';
import { JobDetail } from '@/pages/JobDetail';
import { MusicianProfile } from '@/pages/MusicianProfile';
import { EmployerProfile } from '@/pages/EmployerProfile';
import { About } from '@/pages/About';
import { Help } from '@/pages/Help';
import { NotFound } from '@/pages/NotFound';

import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { VerifyEmail } from '@/pages/auth/VerifyEmail';
import { ProfileSetup } from '@/pages/ProfileSetup';

import { Dashboard } from '@/pages/app/Dashboard';
import { ProfileEdit } from '@/pages/app/ProfileEdit';
import { Offers } from '@/pages/app/Offers';
import { OfferDetail } from '@/pages/app/OfferDetail';
import { PostAdvert } from '@/pages/app/PostAdvert';
import { MyAdverts } from '@/pages/app/MyAdverts';
import { MyAdvertDetail } from '@/pages/app/MyAdvertDetail';
import { Messages } from '@/pages/app/Messages';
import { Favorites } from '@/pages/app/Favorites';
import { Notifications } from '@/pages/app/Notifications';
import { Settings } from '@/pages/app/Settings';

import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminUserDetail } from '@/pages/admin/AdminUserDetail';
import { AdminAdverts } from '@/pages/admin/AdminAdverts';
import { AdminAdvertDetail } from '@/pages/admin/AdminAdvertDetail';
import { AdminConversations } from '@/pages/admin/AdminConversations';
import { AdminConversationDetail } from '@/pages/admin/AdminConversationDetail';

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/explore', element: <Explore /> },
      { path: '/jobs', element: <Jobs /> },
      { path: '/jobs/:id', element: <JobDetail /> },
      { path: '/musicians/:id', element: <MusicianProfile /> },
      { path: '/employers/:id', element: <EmployerProfile /> },
      { path: '/about', element: <About /> },
      { path: '/help', element: <Help /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
    ],
  },
  {
    element: <VerifyEmailLayout />,
    children: [{ path: '/verify-email', element: <VerifyEmail /> }],
  },
  {
    element: <ProfileSetupLayout />,
    children: [{ path: '/profile-setup', element: <ProfileSetup /> }],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/profile/edit', element: <ProfileEdit /> },
      { path: '/offers', element: <Offers /> },
      { path: '/offers/:id', element: <OfferDetail /> },
      { path: '/post-advert', element: <PostAdvert /> },
      { path: '/my-adverts', element: <MyAdverts /> },
      { path: '/my-adverts/:id', element: <MyAdvertDetail /> },
      { path: '/messages', element: <Messages /> },
      { path: '/messages/:conversationId', element: <Messages /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/notifications', element: <Notifications /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
  // Yönetim paneli — bilinçli olarak tüketici uygulamasının hiçbir layout'unu
  // (Navbar/AppSidebar/AuthProvider) paylaşmıyor, tamamen ayrı bir kimlik
  // doğrulama bağlamı (AdminAuthProvider) içinde yaşıyor.
  {
    element: (
      <AdminAuthProvider>
        <Outlet />
      </AdminAuthProvider>
    ),
    children: [
      { path: '/backstage/login', element: <AdminLogin /> },
      {
        element: <AdminShell />,
        children: [
          { path: '/backstage', element: <AdminDashboard /> },
          { path: '/backstage/users', element: <AdminUsers /> },
          { path: '/backstage/users/:id', element: <AdminUserDetail /> },
          { path: '/backstage/adverts', element: <AdminAdverts /> },
          { path: '/backstage/adverts/:id', element: <AdminAdvertDetail /> },
          { path: '/backstage/conversations', element: <AdminConversations /> },
          { path: '/backstage/conversations/:id', element: <AdminConversationDetail /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
