import type { STXUnit } from './types';

const MICRO_MULTIPLIER = 1_000_000;

export function microToSTX(micro: number): number {
  return micro / MICRO_MULTIPLIER;
}

export function stxToMicro(stx: number): number {
  return Math.round(stx * MICRO_MULTIPLIER);
}

export function formatSTX(micro: number, unit: STXUnit = 'STX'): string {
  if (unit === 'microSTX') return `${micro.toLocaleString()} μSTX`;
  const stx = microToSTX(micro);
  if (stx >= 1_000_000) return `${(stx / 1_000_000).toFixed(2)}M STX`;
  if (stx >= 1_000) return `${(stx / 1_000).toFixed(2)}K STX`;
  return `${stx.toFixed(stx < 1 ? 6 : 2)} STX`;
}

export function truncateAddress(address: string, startLen = 5, endLen = 4): string {
  if (address.length <= startLen + endLen + 3) return address;
  return `${address.slice(0, startLen)}...${address.slice(-endLen)}`;
}

export function isValidStxAddress(address: string): boolean {
  return /^SP[0-9A-Z]{33,}$/i.test(address);
}
