import type { Pulse, UserStats, PlatformStats } from './types';

const ADDRESSES = [
  'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  'SP2C2YFP12AJZB1KD5P2N8P1Y7WQAGNTJMWE8E9V2',
  'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
  'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS',
  'SP31DA6FTSJX2WGTZ69SFY11BH51NZMB0ZW97AAX2Q',
];

const MESSAGES = [
  'Great thread on STX stacking rewards 🔥',
  'Thanks for the clarity protocol walkthrough',
  'Solid analysis on BNS pricing dynamics',
  'Appreciate the dev tooling contribution',
  'Your Clarity smart contract tutorial was 🙌',
  'Thanks for debugging help in Discord',
  'Excellent write-up on post-conditions',
  'Really useful stacking calculator tool',
  'Love the open-source block explorer work',
  'Great governance proposal analysis',
];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function generatePulseId(): string {
  return `pulse_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateMockPulses(count: number = 25): Pulse[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const senderIdx = randomBetween(0, ADDRESSES.length - 1);
    let recipientIdx = randomBetween(0, ADDRESSES.length - 1);
    while (recipientIdx === senderIdx) {
      recipientIdx = randomBetween(0, ADDRESSES.length - 1);
    }
    const amount = randomBetween(50000, 50000000);
    const protocolFee = Math.floor(amount * 0.01);
    const statuses: Pulse['status'][] = ['confirmed', 'confirmed', 'confirmed', 'confirmed', 'pending', 'failed'];
    return {
      id: generatePulseId(),
      sender: ADDRESSES[senderIdx],
      recipient: ADDRESSES[recipientIdx],
      amount,
      message: MESSAGES[randomBetween(0, MESSAGES.length - 1)],
      timestamp: new Date(now - i * randomBetween(300000, 3600000)).toISOString(),
      blockHeight: 150000 - i * randomBetween(1, 5),
      txHash: generateTxHash(),
      status: statuses[randomBetween(0, statuses.length - 1)],
      protocolFee,
    };
  });
}

export function generatePlatformStats(): PlatformStats {
  return {
    totalPulses: 12847,
    totalVolume: 2456000000000,
    totalFees: 24560000000,
    uniqueSenders: 1893,
    uniqueRecipients: 3241,
    avgPulseSize: 191000000,
  };
}

export function generateUserStats(address: string): UserStats {
  return {
    address,
    pulsesSent: randomBetween(10, 200),
    pulsesReceived: randomBetween(5, 150),
    totalSent: randomBetween(1000000000, 50000000000),
    totalReceived: randomBetween(500000000, 30000000000),
    firstPulse: new Date(Date.now() - 90 * 24 * 3600000).toISOString(),
    lastPulse: new Date(Date.now() - randomBetween(0, 7) * 24 * 3600000).toISOString(),
  };
}

// Singleton caches
let _pulses: Pulse[] | null = null;
let _stats: PlatformStats | null = null;

export function getMockPulses(): Pulse[] {
  if (!_pulses) _pulses = generateMockPulses(40);
  return _pulses;
}

export function getMockPlatformStats(): PlatformStats {
  if (!_stats) _stats = generatePlatformStats();
  return _stats;
}

// Volume chart data generators
export function generateVolumeData(range: '24h' | '7d' | '30d'): { label: string; volume: number }[] {
  if (range === '24h') {
    return Array.from({ length: 24 }, (_, i) => ({
      label: `${i}:00`,
      volume: randomBetween(200, 3500),
    }));
  }
  if (range === '7d') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((d) => ({ label: d, volume: randomBetween(5000, 25000) }));
  }
  return Array.from({ length: 30 }, (_, i) => ({
    label: `D${i + 1}`,
    volume: randomBetween(3000, 18000),
  }));
}

// Sparkline data for metric cards
export function generateSparkline(points: number = 12): number[] {
  const data: number[] = [];
  let val = randomBetween(40, 60);
  for (let i = 0; i < points; i++) {
    val += randomBetween(-10, 12);
    val = Math.max(10, Math.min(100, val));
    data.push(val);
  }
  return data;
}
