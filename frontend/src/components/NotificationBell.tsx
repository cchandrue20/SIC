'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { getSocket } from '@/lib/socket';
import Link from 'next/link';

interface Notification {
  _id: string;
  type: string;
  referenceId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications?limit=10');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!user || !token) return;

    const socket = getSocket(token);

    socket.on('newNotification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev].slice(0, 10));
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('newNotification');
    };
  }, [user, token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  };

  const markOneRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // silent
    }
  };

  const getNotificationLink = (n: Notification) => {
    switch (n.type) {
      case 'connection_request':
      case 'connection_accepted':
      case 'connection_rejected':
        return '/connections';
      case 'new_message':
        return `/connections/${n.referenceId}`;
      case 'review_received':
        return '/connections';
      default:
        return '/';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 rounded-lg text-surface-300 hover:text-white hover:bg-white/5 transition-all"
        id="notification-bell"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-in">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 glass rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-slide-down">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-surface-400 text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-2xl mb-2">🔔</div>
                <p className="text-surface-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <Link
                  key={n._id}
                  href={getNotificationLink(n)}
                  onClick={() => {
                    if (!n.read) markOneRead(n._id);
                    setIsOpen(false);
                  }}
                  className={`block px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0 ${
                    !n.read ? 'bg-primary-500/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                    )}
                    <div className={!n.read ? '' : 'ml-5'}>
                      <p className="text-sm text-surface-200 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-surface-500 mt-1">{formatTime(n.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
