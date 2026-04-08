import { formatSTX } from '@/lib/stx-utils';

interface FeeBreakdownProps {
  amount: number; // microSTX
  fee: number;
}

export function FeeBreakdown({ amount, fee }: FeeBreakdownProps) {
  const net = amount - fee;
  const isEmpty = amount === 0;

  return (
    <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm border border-border/30">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Amount</span>
        <span className="font-medium tabular-nums">{isEmpty ? '—' : formatSTX(amount)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Protocol Fee (1%)</span>
        <span className="font-medium tabular-nums text-warning">{isEmpty ? '—' : `−${formatSTX(fee)}`}</span>
      </div>
      <div className="border-t border-border pt-2 flex justify-between">
        <span className="font-medium">Recipient Gets</span>
        <span className="font-bold tabular-nums text-success">{isEmpty ? '—' : formatSTX(net)}</span>
      </div>
    </div>
  );
}
