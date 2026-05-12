import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/MetricCard';
import { EmptyState } from '@/components/EmptyState';
import { generateUserStats, getMockPulses } from '@/lib/mock-data';
import { formatSTX, truncateAddress, isValidStxAddress } from '@/lib/stx-utils';
import { Search, Send, ArrowRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserStats } from '@/lib/types';
import { usePageTitle } from '@/hooks/use-page-title';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export default function AddressPage() {
  usePageTitle('Address Insights');
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleLookup = () => {
    setSearched(true);
    if (!isValidStxAddress(input)) {
      setError('Please enter a valid Stacks address');
      setStats(null);
      return;
    }
    setError('');
    setStats(generateUserStats(input));
  };

  const pulses = stats
    ? getMockPulses().filter((p) => p.sender === stats.address || p.recipient === stats.address).slice(0, 5)
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Breadcrumbs items={stats ? [{ label: 'Address Insights', href: '/address' }, { label: truncateAddress(stats.address) }] : [{ label: 'Address Insights' }]} />
      <div>
        <h1 className="text-2xl font-display text-foreground">Address Insights</h1>
        <p className="text-sm text-muted-foreground">Look up any Stacks address to see their Pulse activity</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
            className="pl-9 font-mono text-sm"
          />
        </div>
        <Button onClick={handleLookup}>Lookup</Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <AnimatePresence>
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard label="Pulses Sent" value={stats.pulsesSent.toLocaleString()} />
              <MetricCard label="Pulses Received" value={stats.pulsesReceived.toLocaleString()} />
              <MetricCard label="Total Sent" value={formatSTX(stats.totalSent)} />
              <MetricCard label="Total Received" value={formatSTX(stats.totalReceived)} />
            </div>

            {pulses.length > 0 && (
              <div className="rounded-lg bg-card shadow-sm overflow-hidden divide-y divide-border">
                {pulses.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/40 transition-colors">
                    <Send className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="font-mono text-xs text-muted-foreground">{truncateAddress(p.sender)}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">{truncateAddress(p.recipient)}</span>
                    <span className="ml-auto font-semibold tabular-nums">{formatSTX(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            {pulses.length === 0 && (
              <EmptyState
                icon={MapPin}
                title="No activity found"
                description="This address has no Pulse transactions on the current network."
              />
            )}
          </motion.div>
        )}

        {searched && !stats && !error && (
          <EmptyState
            icon={Search}
            title="No results"
            description="Enter a valid Stacks address to view their Pulse activity and stats."
          />
        )}
      </AnimatePresence>
    </div>
  );
}
