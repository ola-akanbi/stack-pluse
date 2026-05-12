import { useWallet } from '@/lib/wallet-context';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Download, Moon, Sun, Bell, BellOff, Volume2, VolumeX } from 'lucide-react';
import { usePageTitle } from '@/hooks/use-page-title';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { getNotificationsEnabled, setNotificationsEnabled } from '@/hooks/use-pulse-notifications';
import { getSoundEnabled, setSoundEnabled } from '@/lib/notification-sound';

export default function SettingsPage() {
  usePageTitle('Settings');
  const { network, setNetwork } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(getNotificationsEnabled);
  const [sound, setSound] = useState(getSoundEnabled);

  useEffect(() => {
    setNotificationsEnabled(notifications);
  }, [notifications]);

  useEffect(() => {
    setSoundEnabled(sound);
  }, [sound]);

  const handleExport = () => {
    const diagnostics = {
      version: '1.0.0-beta',
      protocol: 'StackPulse v1',
      network,
      theme,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    };
    const blob = new Blob([JSON.stringify(diagnostics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stackpulse-diagnostics.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Diagnostics exported', description: 'File downloaded successfully.' });
  };

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-display text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure network and app preferences</p>
      </div>

      {/* Appearance */}
      <section className="rounded-lg bg-card p-6 shadow-sm space-y-4 border border-border/50">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
            </div>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-lg bg-card p-6 shadow-sm space-y-4 border border-border/50">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Notifications</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {notifications ? <Bell className="h-4 w-4 text-muted-foreground" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium text-foreground">Transaction Alerts</p>
              <p className="text-xs text-muted-foreground">Get notified when Pulses are confirmed</p>
            </div>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {sound ? <Volume2 className="h-4 w-4 text-muted-foreground" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium text-foreground">Sound Effects</p>
              <p className="text-xs text-muted-foreground">Play a chime for incoming pulses</p>
            </div>
          </div>
          <Switch
            checked={sound}
            onCheckedChange={setSound}
          />
        </div>
      </section>

      {/* Network */}
      <section className="rounded-lg bg-card p-6 shadow-sm space-y-4 border border-border/50">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Network</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Use Mainnet</p>
            <p className="text-xs text-muted-foreground">Switch between testnet and mainnet</p>
          </div>
          <Switch
            checked={network === 'mainnet'}
            onCheckedChange={(v) => setNetwork(v ? 'mainnet' : 'testnet')}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Current:</span>
          <Badge
            className={
              network === 'testnet'
                ? 'bg-warning/15 text-warning border-0'
                : 'bg-success/15 text-success border-0'
            }
          >
            {network === 'testnet' ? 'Testnet' : 'Mainnet'}
          </Badge>
        </div>
      </section>

      {/* Info */}
      <section className="rounded-lg bg-card p-6 shadow-sm space-y-4 border border-border/50">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">About</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-mono text-xs">1.0.0-beta</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Protocol</span>
            <span className="font-mono text-xs">StackPulse v1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee Rate</span>
            <span className="font-mono text-xs">1.00%</span>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="rounded-lg bg-card p-6 shadow-sm space-y-3 border border-border/50">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h2>
        <div className="flex flex-col gap-2">
          <a href="https://docs.stacks.co" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="justify-start gap-2 w-full">
              <ExternalLink className="h-3.5 w-3.5" /> Documentation
            </Button>
          </a>
          <a href="https://explorer.hiro.so" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="justify-start gap-2 w-full">
              <ExternalLink className="h-3.5 w-3.5" /> Stacks Explorer
            </Button>
          </a>
          <Button variant="outline" size="sm" className="justify-start gap-2" onClick={handleExport}>
            <Download className="h-3.5 w-3.5" /> Export Diagnostics
          </Button>
        </div>
      </section>
    </div>
  );
}
