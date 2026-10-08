import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Dumbbell,
  Menu,
  X,
  Database
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isMobileMenuOpen?: boolean;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isMobileMenuOpen,
  onOpenAuth
}) => {
  const {
    currentUser,
    supabaseAuthUserId,
    signOutFromSupabase,
    unreadNotificationCount,
    setIsNotificationsOpen,
    isNotificationsOpen,
    setActiveView,
    setSelectedClientId,
    isSupabaseConnected
  } = useApp();

  const [signOutError, setSignOutError] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-between gap-1 h-16">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger Drawer Button */}
            {onToggleSidebar && (
              <button
                id="mobile-sidebar-toggle"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Logo & App Brand */}
            <button
              onClick={() => {
                setSelectedClientId(null);
                setActiveView('dashboard');
              }}
              className="flex min-w-0 items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-bold" />
              </div>
              <div className="hidden min-w-0 min-[480px]:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white truncate">
                    ApexCoaching
                  </span>
                  <span className="hidden min-[480px]:inline text-[10px] text-emerald-400 px-1 py-0.2 rounded bg-emerald-950/80 border border-emerald-800/60 font-mono font-bold">
                    PRO
                  </span>
                </div>
                <span className="hidden sm:block text-[11px] text-slate-400 -mt-0.5 font-medium truncate">
                  Performance & Nutrition Engine
                </span>
              </div>
            </button>
          </div>

          {/* Right Controls: Auth, Notifications, Profile Avatar */}
          <div className="flex min-w-0 items-center gap-0.5 min-[360px]:gap-1.5 sm:gap-3">
            {supabaseAuthUserId ? (
              <>
                <span className="hidden text-xs text-slate-300 sm:inline">{currentUser.fullName}</span>
                <button
                  type="button"
                  onClick={async () => {
                    setSignOutError(null);
                    const result = await signOutFromSupabase();
                    if (!result.success) setSignOutError(result.error || 'Unable to sign out.');
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
              >
                Sign in / register
              </button>
            )}
            {signOutError && <span role="alert" className="max-w-32 text-xs text-rose-300">{signOutError}</span>}

            {/* Database / Supabase Status Pill */}
            <button
              onClick={() => setActiveView('database')}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
              title={isSupabaseConnected ? 'Supabase Database Connected' : 'Supabase Host Unreachable - Click to configure'}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConnected ? 'DB Active' : 'DB Config'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notifications-button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-1.5 min-[360px]:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors min-w-[34px] min-[360px]:min-w-[38px] min-h-[38px] flex items-center justify-center"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Avatar */}
            <div className="hidden min-[480px]:flex items-center">
              <img
                src={currentUser.avatarUrl || undefined}
                alt={currentUser.fullName}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
