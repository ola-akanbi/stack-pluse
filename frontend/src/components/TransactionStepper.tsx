import { cn } from '@/lib/utils';
import type { TxLifecycleState } from '@/lib/types';
import { Check, X, Loader2 } from 'lucide-react';

const STEPS: { key: TxLifecycleState; label: string }[] = [
  { key: 'draft', label: 'Draft' },
  { key: 'ready', label: 'Ready' },
  { key: 'wallet-approval', label: 'Wallet' },
  { key: 'broadcasted', label: 'Broadcast' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
];