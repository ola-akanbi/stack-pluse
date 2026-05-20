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

const ORDER: Record<TxLifecycleState, number> = {
  draft: 0,
  ready: 1,
  'wallet-approval': 2,
  broadcasted: 3,
  pending: 4,
  confirmed: 5,
  failed: -1,
};

interface TransactionStepperProps {
  currentState: TxLifecycleState;
  className?: string;
}

export function TransactionStepper({ currentState, className }: TransactionStepperProps) {
  const failed = currentState === 'failed';
  const currentIdx = failed ? 5 : ORDER[currentState];

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role="progressbar"
      aria-valuenow={currentIdx}
      aria-valuemax={5}
      aria-label={`Transaction status: ${currentState}`}
    ></div>