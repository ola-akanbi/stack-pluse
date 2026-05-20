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
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Transaction step: {currentState.replace('-', ' ')}
      </div>
      {STEPS.map((step, i) => {
        const isCompleted = !failed && currentIdx > i;
        const isCurrent = !failed && currentIdx === i;
        const isFailed = failed && i === 4;

        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300',
                  isCompleted && 'bg-success text-success-foreground scale-100',
                  isCurrent && 'bg-primary text-primary-foreground ring-2 ring-primary/30 scale-110',
                  isFailed && 'bg-destructive text-destructive-foreground',
                  !isCompleted && !isCurrent && !isFailed && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : null}
                {isCurrent ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {isFailed ? <X className="h-3.5 w-3.5" /> : null}
                {!isCompleted && !isCurrent && !isFailed ? i + 1 : null}
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-4 mb-4 rounded-full transition-colors duration-300',
                  isCompleted ? 'bg-success' : 'bg-muted'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
