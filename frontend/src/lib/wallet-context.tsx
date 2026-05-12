import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { truncateAddress } from '@/lib/stx-utils';

interface WalletContextType {
  connected: boolean;
  address: string | null;
  network: 'testnet' | 'mainnet';
  connect: () => void;
  disconnect: () => void;
  setNetwork: (n: 'testnet' | 'mainnet') => void;
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  address: null,
  network: 'testnet',
  connect: () => {},
  disconnect: () => {},
  setNetwork: () => {},
});

const MOCK_ADDRESS = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');

  const connect = useCallback(() => {
    setConnected(true);
    toast({ title: 'Wallet connected', description: truncateAddress(MOCK_ADDRESS) });
  }, []);
  const disconnect = useCallback(() => {
    setConnected(false);
    toast({ title: 'Wallet disconnected' });
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected,
        address: connected ? MOCK_ADDRESS : null,
        network,
        connect,
        disconnect,
        setNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
