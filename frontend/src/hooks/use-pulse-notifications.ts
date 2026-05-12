import { useEffect, useCallback } from 'react';
import { useWallet } from '@/lib/wallet-context';
import { toast } from '@/hooks/use-toast';
import { truncateAddress } from '@/lib/stx-utils';
import { useNotificationStore } from '@/lib/notification-store';
import { playNotificationSound } from '@/lib/notification-sound';

const ADDRESSES = [
  'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
  'SP1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE',
  'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
  'SP2C2YFP12AJZB1KD5P2N8P1Y7WQAGNTJMWE8E9V2',
  'SP1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RPR9GZS',
  'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
];

const MESSAGES = [
  'Great thread on STX stacking rewards 🔥',
  'Thanks for the clarity protocol walkthrough',
  'Solid analysis on BNS pricing dynamics',
  'Appreciate the dev tooling contribution',
  'Your Clarity smart contract tutorial was 🙌',
  'Thanks for debugging help in Discord',
];

const LS_KEY = 'stackpulse-notifications-enabled';

export function getNotificationsEnabled(): boolean {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v === null ? true : v === 'true';
  } catch {
    return true;
  }
}

export function setNotificationsEnabled(enabled: boolean) {
  localStorage.setItem(LS_KEY, String(enabled));
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function usePulseNotifications() {
  const { connected } = useWallet();
  const { addNotification } = useNotificationStore();

  const fireNotification = useCallback(() => {
    if (!getNotificationsEnabled()) return;

    const sender = ADDRESSES[randomBetween(0, ADDRESSES.length - 1)];
    const amount = (randomBetween(50, 5000) / 100).toFixed(2);
    const message = MESSAGES[randomBetween(0, MESSAGES.length - 1)];

    toast({
      title: '⚡ Incoming Pulse',
      description: `${truncateAddress(sender)} sent ${amount} STX — "${message.slice(0, 40)}…"`,
      className: 'border-l-4 border-l-primary',
    });

    addNotification({ sender, amount, message });
    playNotificationSound();
  }, [addNotification]);

  useEffect(() => {
    if (!connected) return;

    let timeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = randomBetween(8000, 15000);
      timeout = setTimeout(() => {
        fireNotification();
        schedule();
      }, delay);
    };

    schedule();
    return () => clearTimeout(timeout);
  }, [connected, fireNotification]);
}
