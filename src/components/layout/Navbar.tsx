import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Menu,
  X,
  Database,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isMobileMenuOpen?: boolean;
  onOpenAuth?: () => void;
  themeMode: 'dark' | 'light' | 'system';
  onThemeModeChange: (mode: 'dark' | 'light' | 'system') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isMobileMenuOpen,
  onOpenAuth,
  themeMode,
  onThemeModeChange
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
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const ThemeIcon = themeMode === 'dark' ? Moon : themeMode === 'light' ? Sun : Monitor;

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
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/15">
                <span aria-hidden="true" className="select-none font-black italic leading-none tracking-[-0.1em] text-sm sm:text-base text-emerald-400 pr-0.5">GW</span>
              </div>
              <div className="hidden min-w-0 min-[480px]:block">
                <span className="block truncate font-bold text-base sm:text-lg tracking-[-0.035em] text-white">
                  GymWrath
                </span>
                <span className="hidden sm:block -mt-0.5 truncate text-[11px] font-medium tracking-wide text-slate-400">
                  Training · Nutrition · Progress
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

            {/* Appearance selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeMenuOpen(open => !open)}
                className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200 transition-colors hover:bg-slate-700"
                aria-label="Appearance settings"
                aria-haspopup="menu"
                aria-expanded={isThemeMenuOpen}
                title={`Appearance: ${themeMode}`}
              >
                <ThemeIcon className="h-4 w-4" />
              </button>
              {isThemeMenuOpen && (
                <div
                  role="menu"
                  aria-label="Choose appearance"
                  className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-slate-700 bg-slate-900 p-1.5 text-white shadow-2xl"
                >
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={themeMode === 'light'}
                    onClick={() => { onThemeModeChange('light'); setIsThemeMenuOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${themeMode === 'light' ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <Sun className="h-4 w-4" /> Light
                  </button>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={themeMode === 'dark'}
                    onClick={() => { onThemeModeChange('dark'); setIsThemeMenuOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${themeMode === 'dark' ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <Moon className="h-4 w-4" /> Dark
                  </button>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={themeMode === 'system'}
                    onClick={() => { onThemeModeChange('system'); setIsThemeMenuOpen(false); }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${themeMode === 'system' ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <Monitor className="h-4 w-4" /> System
                  </button>
                </div>
              )}
            </div>

            {/* Database controls are restricted to administrators. */}
            {currentUser.role === 'admin' && (
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
            )}

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
