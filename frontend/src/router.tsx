import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProfileSetupLayout } from '@/components/layout/ProfileSetupLayout';

import { Home } from '@/pages/Home';
import { Explore } from '@/pages/Explore';
import { Jobs } from '@/pages/Jobs';
import { JobDetail } from '@/pages/JobDetail';
import { MusicianProfile } from '@/pages/MusicianProfile';
import { EmployerProfile } from '@/pages/EmployerProfile';
import { About } from '@/pages/About';
import { Help } from '@/pages/Help';
import { Sitemap } from '@/pages/Sitemap';
import { NotFound } from '@/pages/NotFound';

import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
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
      { path: '/sitemap', element: <Sitemap /> },
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
  { path: '*', element: <NotFound /> },
]);
