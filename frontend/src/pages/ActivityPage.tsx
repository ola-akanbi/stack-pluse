import { useState, useMemo } from 'react';
import { getMockPulses } from '@/lib/mock-data';
import { formatSTX, truncateAddress } from '@/lib/stx-utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EmptyState } from '@/components/EmptyState';
import { SkeletonTableRow } from '@/components/SkeletonCard';
import { Search, CheckCircle2, Clock, XCircle, ExternalLink, Copy, ArrowUpDown, ChevronLeft, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Pulse } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { usePageTitle } from '@/hooks/use-page-title';
import { useSimulatedLoading } from '@/hooks/use-simulated-loading';
import { formatDistanceToNow, format } from 'date-fns';

const allPulses = getMockPulses();
const PAGE_SIZE = 10;
const EXPLORER_URL = 'https://explorer.hiro.so';

type SortKey = 'amount' | 'blockHeight' | null;
type SortDir = 'asc' | 'desc';
type StatusFilter = 'all' | 'confirmed' | 'pending' | 'failed';

export default function ActivityPage() {
  usePageTitle('Activity');
  const loading = useSimulatedLoading(500);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Pulse | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    let result = allPulses;

    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.sender.toLowerCase().includes(q) ||
          p.recipient.toLowerCase().includes(q) ||
          p.message.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const diff = a[sortKey] - b[sortKey];
        return sortDir === 'asc' ? diff : -diff;
      });
    }

    return result;
  }, [search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="rounded-lg bg-card shadow-sm overflow-hidden divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonTableRow key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display text-foreground">Activity Feed</h1>
            <p className="text-sm text-muted-foreground">Browse all on-chain Pulse transactions</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search address, message, ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(0); }}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-all',
                statusFilter === f.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {f.label}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="rounded-lg bg-card shadow-sm overflow-hidden border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead className="text-right">
                  <button onClick={() => handleSort('amount')} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                    Amount <ArrowUpDown className={cn('h-3 w-3', sortKey === 'amount' && 'text-primary')} />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell">Time</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  <button onClick={() => handleSort('blockHeight')} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
                    Block <ArrowUpDown className={cn('h-3 w-3', sortKey === 'blockHeight' && 'text-primary')} />
                  </button>
                </TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((pulse) => (
                <TableRow
                  key={pulse.id}
                  className="cursor-pointer hover:bg-muted/40 hover:shadow-sm transition-all group"
                  onClick={() => setSelected(pulse)}
                >
                  <TableCell><StatusBadge status={pulse.status} /></TableCell>
                  <TableCell className="font-mono text-xs">{truncateAddress(pulse.sender)}</TableCell>
                  <TableCell className="font-mono text-xs">{truncateAddress(pulse.recipient)}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-sm">
                    {formatSTX(pulse.amount)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs text-muted-foreground cursor-default">
                          {formatDistanceToNow(new Date(pulse.timestamp), { addSuffix: true })}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {format(new Date(pulse.timestamp), 'PPpp')}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                    {pulse.message}
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell tabular-nums text-xs text-muted-foreground">
                    #{pulse.blockHeight.toLocaleString()}
                  </TableCell>
                  <TableCell className="w-8">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <EmptyState
              icon={Activity}
              title="No pulses found"
              description="Try adjusting your search or filter criteria."
              className="border-0 rounded-none shadow-none"
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Drawer */}
        <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
          <SheetContent className="overflow-y-auto">
            {selected && (
              <>
                <SheetHeader>
                  <SheetTitle className="text-lg">Pulse Details</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <DetailRow label="Pulse ID" value={selected.id} mono copyable />
                  <DetailRow label="Status">
                    <StatusBadge status={selected.status} />
                  </DetailRow>
                  <DetailRow label="Sender" value={selected.sender} mono copyable />
                  <DetailRow label="Recipient" value={selected.recipient} mono copyable />
                  <DetailRow label="Amount" value={formatSTX(selected.amount)} />
                  <DetailRow label="Protocol Fee" value={formatSTX(selected.protocolFee)} />
                  <DetailRow label="Net Amount" value={formatSTX(selected.amount - selected.protocolFee)} />
                  <DetailRow label="Block Height" value={`#${selected.blockHeight.toLocaleString()}`} />
                  <DetailRow label="Timestamp" value={format(new Date(selected.timestamp), 'PPpp')} />
                  <DetailRow label="Time Ago" value={formatDistanceToNow(new Date(selected.timestamp), { addSuffix: true })} />
                  <DetailRow label="Tx Hash" value={truncateAddress(selected.txHash, 10, 8)} mono copyable fullValue={selected.txHash} />
                  {selected.message && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Message</p>
                      <p className="text-sm bg-muted/50 rounded-md p-3">{selected.message}</p>
                    </div>
                  )}
                  <a
                    href={`${EXPLORER_URL}/txid/${selected.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full gap-1.5 mt-4">
                      <ExternalLink className="h-3.5 w-3.5" /> View on Explorer
                    </Button>
                  </a>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
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

function DetailRow({
  label,
  value,
  mono,
  copyable,
  fullValue,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  copyable?: boolean;
  fullValue?: string;
  children?: React.ReactNode;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(fullValue || value || '');
    toast({ title: 'Copied', description: fullValue || value });
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        {children || (
          <span className={cn('text-sm', mono && 'font-mono text-xs')}>{value}</span>
        )}
        {copyable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleCopy}
                  className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Copy to clipboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
