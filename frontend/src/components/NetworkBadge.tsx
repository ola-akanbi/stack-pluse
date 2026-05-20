import { cn } from '@/lib/utils';
import { useWallet } from '@/lib/wallet-context';

export function NetworkBadge({ className }: { className?: string }) {
  const { network } = useWallet();
  const isTestnet = network === 'testnet';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        isTestnet
          ? 'bg-warning/15 text-warning'
          : 'bg-success/15 text-success',
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', isTestnet ? 'bg-warning' : 'bg-success')} />
      {isTestnet ? 'Testnet' : 'Mainnet'}
    </span>
  );
}
