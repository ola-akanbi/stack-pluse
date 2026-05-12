import React, { createContext, useContext, useState, useCallback } from 'react';

export interface NotificationItem {
  id: string;
  sender: string;
  amount: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface NotificationStore {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationStore | null>(null);

const MAX_NOTIFICATIONS = 20;

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newItem, ...prev].slice(0, MAX_NOTIFICATIONS));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationStore() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationStore must be used within NotificationProvider');
  return ctx;
}
