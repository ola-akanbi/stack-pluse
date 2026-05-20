import { Bell, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationStore, type NotificationItem } from '@/lib/notification-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { truncateAddress } from '@/lib/stx-utils';
import { useState } from 'react';

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationList({ notifications, onClear }: { notifications: NotificationItem[]; onClear: () => void }) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Bell className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm">No notifications yet</p>
        <p className="text-xs">Incoming pulses will appear here</p>
      </div>
    );
  }