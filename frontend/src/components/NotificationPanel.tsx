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

  return (
    <div className="flex flex-col">
      <ScrollArea className="max-h-80">
        <div className="divide-y divide-border">
          {notifications.map(n => (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {truncateAddress(n.sender)} sent {n.amount} STX
                </p>
                <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{timeAgo(n.timestamp)}</p>
              </div>
              {!n.read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-border p-2">
        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={onClear}>
          <Trash2 className="h-3 w-3 mr-1" /> Clear all
        </Button>
      </div>
    </div>
  );
}

export function NotificationPanel() {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotificationStore();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) markAllRead();
  };

  const triggerButton = (
    <Button variant="ghost" size="icon" className="relative h-8 w-8">
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpen}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <SheetHeader className="border-b border-border px-4 py-4">
            <SheetTitle className="text-base">Notifications</SheetTitle>
          </SheetHeader>
          <NotificationList notifications={notifications} onClear={() => { clearAll(); setOpen(false); }} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        </div>
        <NotificationList notifications={notifications} onClear={() => { clearAll(); setOpen(false); }} />
      </PopoverContent>
    </Popover>
  );
}
