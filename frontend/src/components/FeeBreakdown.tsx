import { formatSTX } from '@/lib/stx-utils';

interface FeeBreakdownProps {
  amount: number; // microSTX
  fee: number;
}

export function FeeBreakdown({ amount, fee }: FeeBreakdownProps) {
  const net = amount - fee;
  const isEmpty = amount === 0;