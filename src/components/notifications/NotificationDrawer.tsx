import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle2,
  Bell,
  ClipboardCheck,
  Dumbbell,
  MessageSquare,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    currentUser,
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveView,
    setActiveCheckInReviewId
  } = useApp();

  if (!isNotificationsOpen) return null;

  const userNotifications = notifications.filter(n => n.recipientId === currentUser.id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'checkin_submitted':
      case 'checkin_reviewed':
        return <ClipboardCheck className="w-4 h-4 text-amber-400" />;
      case 'workout_completed':
      case 'workout_assigned':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'account_pending':
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleNotificationClick = (n: typeof notifications[0]) => {
    markNotificationRead(n.id);
    setIsNotificationsOpen(false);

    if (n.linkTarget) {
      if (n.linkTarget.view === 'checkins' && n.linkTarget.entityId && currentUser.role === 'coach') {
        setActiveView('checkins');
        setActiveCheckInReviewId(n.linkTarget.entityId);
      } else {
        setActiveView(n.linkTarget.view);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-base text-white">Notifications</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {userNotifications.filter(n => !n.isRead).length} new
              </span>
            </div>
            <div className="flex items-center gap-2">
              {userNotifications.length > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-800/40">
            {userNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-500" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs mt-1">Updates on workouts, check-ins, and messages will appear here.</p>
              </div>
            ) : (
              userNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`pt-2.5 first:pt-0 p-3 rounded-xl cursor-pointer transition-all ${
                    n.isRead
                      ? 'bg-slate-900 hover:bg-slate-800/70 border border-transparent'
                      : 'bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-950/80 shrink-0 border border-slate-750">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold truncate ${n.isRead ? 'text-slate-300' : 'text-white'}`}>
                          {n.title}
                        </p>
                        <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                          {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
