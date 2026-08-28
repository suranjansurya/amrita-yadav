import React, { useState, useEffect } from 'react';
import {
  fetchUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  saveUserActivity,
} from '../../lib/supabase';
import {
  Bell,
  X,
  CheckCheck,
  Trophy,
  Flame,
  Heart,
  Image as ImageIcon,
  Mail,
  Gift,
  Lock,
  BookOpen,
  Sparkles,
  RefreshCw,
  Clock,
} from 'lucide-react';

export function NotificationCenterModal({ isOpen, onClose, currentUser, onOpenFeature }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const userId = currentUser?.userId || 'amritayadav';

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      saveUserActivity({
        event_type: 'notification_opened',
        title: '🔔 Opened Notification Center',
        description: 'User opened the Notification panel',
        user_id: userId,
      });
    }
  }, [isOpen, userId]);

  // ESC key listener to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadNotifications = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetchUserNotifications({ user_id: userId, includeUnpublished: false });
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (e) {
      console.error('[NotificationCenterModal] Load error:', e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (notif) => {
    if (!notif.is_read) {
      await markNotificationAsRead(userId, notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Optional navigation trigger based on notification type
    if (onOpenFeature) {
      if (notif.type === 'memory') onOpenFeature('memorywall');
      else if (notif.type === 'message') onOpenFeature('justforyou');
      else if (notif.type === 'secret') onOpenFeature('secrets');
      else if (notif.type === 'surprise') onOpenFeature('surprise');
      else if (notif.type === 'streak' || notif.type === 'achievement') onOpenFeature('memories');
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  if (!isOpen) return null;

  // Icon selector per notification type
  const getTypeIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <Trophy size={18} className="text-amber-500" />;
      case 'streak':
        return <Flame size={18} className="text-rose-500" />;
      case 'daily_checkin':
        return <Heart size={18} className="fill-pink-500 text-pink-500" />;
      case 'memory':
        return <ImageIcon size={18} className="text-purple-500" />;
      case 'message':
        return <Mail size={18} className="text-rose-400" />;
      case 'surprise':
        return <Gift size={18} className="text-pink-500" />;
      case 'secret':
        return <Lock size={18} className="text-amber-600" />;
      case 'journal':
        return <BookOpen size={18} className="text-emerald-500" />;
      default:
        return <Sparkles size={18} className="text-pink-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 bg-pink-950/40 backdrop-blur-xs select-none">
      <div className="glass-panel p-5 sm:p-6 rounded-3xl max-w-md w-full bg-white/95 border-2 border-pink-300 shadow-2xl space-y-4 text-left max-h-[88vh] overflow-y-auto relative mt-12 md:mt-4 animate-fadeIn">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-pink-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 text-white flex items-center justify-center shadow-md relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-pink-950">
                🔔 Notifications
              </h3>
              <p className="text-[11px] text-pink-700 font-semibold">
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up! ❤️'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-900 font-bold text-xs hover:bg-pink-200 transition-colors flex items-center space-x-1"
                title="Mark all as read"
              >
                <CheckCheck size={14} className="text-pink-600" />
                <span>Mark all read</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-pink-100 text-pink-900 hover:bg-pink-200 transition-colors"
              title="Close Notifications (ESC)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center space-y-2">
            <RefreshCw size={24} className="animate-spin text-pink-500 mx-auto" />
            <p className="text-xs text-pink-700 font-bold">Loading updates... 🌸</p>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="py-10 text-center space-y-3 bg-rose-50 rounded-2xl border border-rose-200 p-6">
            <p className="text-xs font-bold text-rose-900">Notifications couldn't be loaded.</p>
            <button
              onClick={loadNotifications}
              className="px-4 py-2 rounded-full bg-pink-500 text-white font-bold text-xs uppercase shadow-md flex items-center space-x-1.5 mx-auto"
            >
              <RefreshCw size={12} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !hasError && notifications.length === 0 && (
          <div className="py-14 text-center space-y-3 bg-pink-50/50 rounded-2xl border border-pink-100 p-6">
            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center mx-auto text-xl">
              🔔
            </div>
            <h4 className="font-heading font-extrabold text-sm text-pink-950">No new notifications</h4>
            <p className="text-xs text-pink-700 font-medium">Precious updates will appear here ❤️</p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && !hasError && notifications.length > 0 && (
          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 group ${
                  notif.is_read
                    ? 'bg-white border-pink-100 hover:bg-pink-50/50'
                    : 'bg-gradient-to-r from-pink-50/90 to-rose-50/90 border-pink-300 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white shadow-2xs border border-pink-100 group-hover:scale-105 transition-transform">
                  {getTypeIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-heading text-xs text-pink-950 ${!notif.is_read ? 'font-extrabold' : 'font-bold'}`}>
                      {notif.title}
                    </h4>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-pink-800 font-body leading-snug">
                    {notif.message}
                  </p>

                  <div className="flex items-center space-x-1 text-[10px] font-semibold text-pink-600 pt-0.5">
                    <Clock size={10} />
                    <span>{notif.time || notif.date || new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
