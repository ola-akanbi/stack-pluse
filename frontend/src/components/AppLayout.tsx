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

function AppLayoutInner({ location }: { location: ReturnType<typeof useLocation> }) {
  usePulseNotifications();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppNav />
      <CommandPalette />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
