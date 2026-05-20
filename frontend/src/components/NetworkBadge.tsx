import { cn } from '@/lib/utils';
import { useWallet } from '@/lib/wallet-context';

export function NetworkBadge({ className }: { className?: string }) {
  const { network } = useWallet();
  const isTestnet = network === 'testnet';