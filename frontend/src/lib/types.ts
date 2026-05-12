export interface Pulse {
  id: string;
  sender: string;
  recipient: string;
  amount: number; // in microSTX
  message: string;
  timestamp: string;
  blockHeight: number;
  txHash: string;
  status: 'confirmed' | 'pending' | 'failed';
  protocolFee: number; // in microSTX
}

export interface UserStats {
  address: string;
  pulsesSent: number;
  pulsesReceived: number;
  totalSent: number; // microSTX
  totalReceived: number; // microSTX
  firstPulse: string;
  lastPulse: string;
}

export interface PlatformStats {
  totalPulses: number;
  totalVolume: number; // microSTX
  totalFees: number; // microSTX
  uniqueSenders: number;
  uniqueRecipients: number;
  avgPulseSize: number; // microSTX
}

export type TxLifecycleState =
  | 'draft'
  | 'ready'
  | 'wallet-approval'
  | 'broadcasted'
  | 'pending'
  | 'confirmed'
  | 'failed';

export interface NetworkConfig {
  name: 'testnet' | 'mainnet';
  label: string;
  explorerUrl: string;
}

export type STXUnit = 'STX' | 'microSTX';
