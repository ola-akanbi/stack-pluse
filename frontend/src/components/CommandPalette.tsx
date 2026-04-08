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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a page name to navigate..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {PAGES.map(({ to, label, icon: Icon, keywords }) => (
            <CommandItem
              key={to}
              value={`${label} ${keywords}`}
              onSelect={() => handleSelect(to)}
              className="cursor-pointer"
            >
              <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{label}</span>
              {to === '/' && (
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
