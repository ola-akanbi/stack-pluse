import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/EmptyState';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getMockPulses } from '@/lib/mock-data';
import { formatSTX, truncateAddress } from '@/lib/stx-utils';
import { Search, Copy, ExternalLink, CheckCircle2, Clock, XCircle, FileSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import type { Pulse } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/use-page-title';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { formatDistanceToNow, format } from 'date-fns';

const allPulses = getMockPulses();
const EXPLORER_URL = 'https://explorer.hiro.so';

export default function PulseLookup() {
  usePageTitle('Pulse Lookup');
  const { id: paramId } = useParams();
  const [input, setInput] = useState(paramId || '');
  const [pulse, setPulse] = useState<Pulse | null>(
    paramId ? allPulses.find((p) => p.id === paramId) || null : null
  );
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const found = allPulses.find((p) => p.id === input.trim());
    setPulse(found || null);
    setNotFound(!found);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied' });
  };

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-2xl space-y-6">
        <Breadcrumbs items={pulse ? [{ label: 'Pulse Lookup', href: '/pulse' }, { label: pulse.id }] : [{ label: 'Pulse Lookup' }]} />
        <div>
          <h1 className="text-2xl font-display text-foreground">Pulse Lookup</h1>
          <p className="text-sm text-muted-foreground">Search by Pulse ID to view transaction details</p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="pulse_..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-9 font-mono text-sm"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Try: <button onClick={() => { setInput(allPulses[0].id); }} className="text-primary hover:underline font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">{allPulses[0].id}</button>
        </p>

        <AnimatePresence>
          {pulse && (
            <motion.div
              key={pulse.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg bg-card p-6 shadow-sm space-y-4 border border-border/50"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Pulse Detail</h2>
                <StatusBadge status={pulse.status} />
              </div>
              <div className="space-y-3">
                <Row label="Pulse ID" value={pulse.id} mono onCopy={() => copy(pulse.id)} />
                <Row label="Sender" value={pulse.sender} mono onCopy={() => copy(pulse.sender)} />
                <Row label="Recipient" value={pulse.recipient} mono onCopy={() => copy(pulse.recipient)} />
                <Row label="Amount" value={formatSTX(pulse.amount)} />
                <Row label="Protocol Fee" value={formatSTX(pulse.protocolFee)} />
                <Row label="Net to Recipient" value={formatSTX(pulse.amount - pulse.protocolFee)} bold />
                <Row label="Block Height" value={`#${pulse.blockHeight.toLocaleString()}`} />
                <Row label="Timestamp" value={format(new Date(pulse.timestamp), 'PPpp')} />
                <Row label="Time Ago" value={formatDistanceToNow(new Date(pulse.timestamp), { addSuffix: true })} />
                <Row label="Tx Hash" value={truncateAddress(pulse.txHash, 12, 8)} mono onCopy={() => copy(pulse.txHash)} />
                {pulse.message && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <p className="text-sm bg-muted/50 rounded-md p-3">{pulse.message}</p>
                  </div>
                )}
              </div>
              <a
                href={`${EXPLORER_URL}/txid/${pulse.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" /> View on Explorer
                </Button>
              </a>
            </motion.div>
          )}
          {notFound && !pulse && (
            <EmptyState
              icon={FileSearch}
              title="Pulse not found"
              description="No Pulse transaction found with that ID. Check the ID and try again."
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'confirmed')
    return <Badge className="bg-success/15 text-success border-0 gap-1"><CheckCircle2 className="h-3 w-3" />Confirmed</Badge>;
  if (status === 'pending')
    return <Badge className="bg-warning/15 text-warning border-0 gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
  return <Badge className="bg-destructive/15 text-destructive border-0 gap-1"><XCircle className="h-3 w-3" />Failed</Badge>;
}

function Row({ label, value, mono, bold, onCopy }: { label: string; value: string; mono?: boolean; bold?: boolean; onCopy?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={cn('text-sm', mono && 'font-mono text-xs', bold && 'font-bold')}>{value}</span>
        {onCopy && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onCopy}
                className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                <Copy className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Copy to clipboard</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
