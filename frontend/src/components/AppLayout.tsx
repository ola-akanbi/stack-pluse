import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppNav } from './AppNav';
import { Footer } from './Footer';
import { PageTransition } from './PageTransition';
import { usePulseNotifications } from '@/hooks/use-pulse-notifications';
import { NotificationProvider } from '@/lib/notification-store';
import { CommandPalette } from './CommandPalette';

export function AppLayout() {
  const location = useLocation();

  return (
    <NotificationProvider>
      <AppLayoutInner location={location} />
    </NotificationProvider>
  );
}
