import { Bell, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificationStore, type NotificationItem } from '@/lib/notification-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { truncateAddress } from '@/lib/stx-utils';
import { useState } from 'react';