import React, { useEffect, useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Footprints,
  TrendingUp,
  Utensils,
  MessageSquare,
  ShieldCheck,
  Database,
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const [platformTime, setPlatformTime] = useState('--:--');

  useEffect(() => {
    const updatePlatformTime = () => {
      setPlatformTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };

    updatePlatformTime();
    const intervalId = window.setInterval(updatePlatformTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const {
    currentUser,
    activeView,
    setActiveView,
    checkIns,
    conversations,
    allProfiles,
    scheduledWorkouts,
    setSelectedClientId
  } = useApp();

  // Compute badge counts
  const pendingCheckinsCount = checkIns.filter(
    c => c.status === 'submitted' && (currentUser.role === 'admin' || c.coachId === currentUser.id)
  ).length;

  const unreadMessagesCount = conversations.reduce((acc, c) => {
    if (currentUser.role === 'coach' && c.coachId === currentUser.id) return acc + c.unreadCountCoach;
    if (currentUser.role === 'client' && c.clientId === currentUser.id) return acc + c.unreadCountClient;
    return acc;
  }, 0);

  const pendingUsersCount = allProfiles.filter(p => p.status === 'pending').length;

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayWorkoutScheduled = scheduledWorkouts.some(
    w => w.clientId === currentUser.id && w.scheduledDate === todayStr && w.status !== 'completed'
  );

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }

  const getNavItems = (): NavItem[] => {
    if (currentUser.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Admin Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'admin', label: 'User Management', icon: <ShieldCheck className="w-5 h-5" />, badge: pendingUsersCount > 0 ? pendingUsersCount : undefined, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
        { id: 'clients', label: 'All Clients', icon: <Users className="w-5 h-5" /> },
        { id: 'exercises', label: 'Exercise Library', icon: <Dumbbell className="w-5 h-5" /> },
        { id: 'programs', label: 'Programs & Templates', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'nutrition', label: 'Food & Nutrition DB', icon: <Utensils className="w-5 h-5" /> },
        { id: 'database', label: 'Database & Schema', icon: <Database className="w-5 h-5" />, badge: 'Supabase', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' }
      ];
    }

    if (currentUser.role === 'coach') {
      return [
        { id: 'dashboard', label: 'Coach Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'clients', label: 'Client Roster', icon: <Users className="w-5 h-5" /> },
        { id: 'checkins', label: 'Client Check-Ins', icon: <ClipboardCheck className="w-5 h-5" />, badge: pendingCheckinsCount > 0 ? pendingCheckinsCount : undefined, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
        { id: 'exercises', label: 'Exercise Library', icon: <Dumbbell className="w-5 h-5" /> },
        { id: 'programs', label: 'Program Builder', icon: <BookOpen className="w-5 h-5" /> },
        { id: 'calendar', label: 'Workout Schedules', icon: <Calendar className="w-5 h-5" /> },
        { id: 'steps', label: 'Step Tracking Hub', icon: <Footprints className="w-5 h-5" /> },
        { id: 'nutrition', label: 'Nutrition & Meal Plans', icon: <Utensils className="w-5 h-5" /> },
        { id: 'messages', label: 'Direct Messages', icon: <MessageSquare className="w-5 h-5" />, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
        { id: 'database', label: 'Database & Schema', icon: <Database className="w-5 h-5" />, badge: 'Supabase', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' }
      ];
    }

    // Client
    return [
      { id: 'dashboard', label: "Today's Hub", icon: <LayoutDashboard className="w-5 h-5" />, badge: todayWorkoutScheduled ? '1 Workout' : undefined, badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
      { id: 'calendar', label: 'My Workouts', icon: <Calendar className="w-5 h-5" /> },
      { id: 'steps', label: 'Daily Step Log', icon: <Footprints className="w-5 h-5" /> },
      { id: 'checkins', label: 'Weekly Check-In', icon: <ClipboardCheck className="w-5 h-5" /> },
      { id: 'nutrition', label: 'Nutrition & Meals', icon: <Utensils className="w-5 h-5" /> },
      { id: 'progress', label: 'Progress & Analytics', icon: <TrendingUp className="w-5 h-5" /> },
      { id: 'exercises', label: 'Exercise Form Library', icon: <Dumbbell className="w-5 h-5" /> },
      { id: 'messages', label: 'Coach Chat', icon: <MessageSquare className="w-5 h-5" />, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
      { id: 'database', label: 'Database & Schema', icon: <Database className="w-5 h-5" />, badge: 'Supabase', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (viewId: AppView) => {
    if (viewId === 'dashboard' || viewId === 'clients') {
      setSelectedClientId(null);
    }
    setActiveView(viewId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Mobile Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl || undefined}
            alt={currentUser.fullName}
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">{currentUser.fullName}</p>
            <p className="text-xs text-slate-400 capitalize flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${currentUser.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              {currentUser.role} • {currentUser.status}
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${item.badgeColor || 'bg-slate-700 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>Platform Time:</span>
          <span className="font-mono text-slate-300">
            {platformTime}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Timezone:</span>
          <span className="truncate max-w-[120px]" title={currentUser.timezone}>{currentUser.timezone}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />

          {/* Drawer Container */}
          <div className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 shadow-2xl z-50 flex flex-col h-full animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
