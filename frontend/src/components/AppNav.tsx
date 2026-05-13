import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NetworkBadge } from './NetworkBadge';
import { WalletButton } from './WalletButton';
import { ThemeToggle } from './ThemeToggle';
import { NotificationPanel } from './NotificationPanel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Zap, LayoutDashboard, Send, Activity, Search, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/send', label: 'Send', icon: Send },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/address', label: 'Address', icon: Search },
  { to: '/pulse', label: 'Lookup', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
];