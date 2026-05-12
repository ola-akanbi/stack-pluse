import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TransactionStepper } from '@/components/TransactionStepper';
import { FeeBreakdown } from '@/components/FeeBreakdown';
import { useWallet } from '@/lib/wallet-context';
import { isValidStxAddress, stxToMicro, formatSTX } from '@/lib/stx-utils';
import type { TxLifecycleState } from '@/lib/types';
import { Send, AlertCircle, CheckCircle2, RotateCcw, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/use-page-title';

const EXPLORER_URL = 'https://explorer.hiro.so';

export default function SendPulse() {
  usePageTitle('Send Pulse');
  const { connected, address, connect } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [message, setMessage] = useState('');
  const [txState, setTxState] = useState<TxLifecycleState>('draft');
  const [error, setError] = useState<string | null>(null);

  const amount = parseFloat(amountStr) || 0;
  const amountMicro = stxToMicro(amount);
  const fee = Math.floor(amountMicro * 0.01);

  const recipientValid = recipient === '' || isValidStxAddress(recipient);
  const selfSend = connected && recipient === address;
  const canSubmit =
    connected && isValidStxAddress(recipient) && !selfSend && amount > 0 && message.length <= 280;

  const simulateTx = useCallback(async () => {
    setError(null);
    const states: TxLifecycleState[] = ['ready', 'wallet-approval', 'broadcasted', 'pending', 'confirmed'];
    for (const state of states) {
      setTxState(state);
      await new Promise((r) => setTimeout(r, 1200));
    }
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    try {
      await simulateTx();
    } catch {
      setTxState('failed');
      setError('Transaction failed. Please try again.');
    }
  };

  const handleReset = () => {
    setRecipient('');
    setAmountStr('');
    setMessage('');
    setTxState('draft');
    setError(null);
  };

  const isProcessing = !['draft', 'confirmed', 'failed'].includes(txState);
  const isDone = txState === 'confirmed';
  const isFailed = txState === 'failed';

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-display text-foreground">Send a Pulse</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tip any Stacks address with an on-chain micro-transaction
        </p>
      </div>

      <TransactionStepper currentState={txState} />

      <AnimatePresence mode="wait">
        {isDone ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-card p-8 shadow-sm text-center space-y-4 border border-border/50"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Pulse Sent!</h2>
            <p className="text-sm text-muted-foreground">
              {formatSTX(amountMicro)} sent successfully
            </p>
            <div className="flex items-center justify-center gap-3">
              <a href={`${EXPLORER_URL}/txid/0x...`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" /> View on Explorer
                </Button>
              </a>
              <Button onClick={handleReset} size="sm" className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" /> Send Another
              </Button>
            </div>
          </motion.div>
        ) : isFailed ? (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-card p-8 shadow-sm text-center space-y-4 border border-border/50"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Transaction Failed</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={handleReset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" /> Try Again
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-card p-6 shadow-sm space-y-5 border border-border/50"
          >
            {!connected && (
              <div className="flex items-center gap-3 rounded-md bg-warning/10 px-4 py-3 text-sm text-warning">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Connect your wallet to send a Pulse</span>
                <Button size="sm" variant="outline" onClick={connect} className="ml-auto">
                  Connect
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="SP..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={isProcessing}
                className={cn(
                  'font-mono text-sm',
                  !recipientValid && 'border-destructive focus-visible:ring-destructive'
                )}
              />
              {!recipientValid && (
                <p className="text-xs text-destructive">Invalid Stacks address format</p>
              )}
              {selfSend && (
                <p className="text-xs text-destructive">Cannot send a Pulse to yourself</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (STX)</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                min="0"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                disabled={isProcessing}
                className="tabular-nums"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message (optional)</Label>
                <span
                  className={cn(
                    'text-xs tabular-nums',
                    message.length > 280 ? 'text-destructive' : 'text-muted-foreground'
                  )}
                >
                  {message.length}/280
                </span>
              </div>
              <Textarea
                id="message"
                placeholder="What's this Pulse for?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isProcessing}
                rows={3}
              />
            </div>

            <FeeBreakdown amount={amountMicro} fee={fee} />

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isProcessing}
              className="w-full gap-2"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Pulse
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
