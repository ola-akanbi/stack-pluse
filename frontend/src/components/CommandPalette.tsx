import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { LayoutDashboard, Send, Activity, Search, Settings, Zap } from 'lucide-react';

const PAGES = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, keywords: 'home overview stats' },
  { to: '/send', label: 'Send Pulse', icon: Send, keywords: 'transfer tip payment' },
  { to: '/activity', label: 'Activity', icon: Activity, keywords: 'transactions history log' },
  { to: '/address', label: 'Address Lookup', icon: Search, keywords: 'wallet search profile' },
  { to: '/pulse', label: 'Pulse Lookup', icon: Zap, keywords: 'transaction find id' },
  { to: '/settings', label: 'Settings', icon: Settings, keywords: 'preferences config network theme' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };