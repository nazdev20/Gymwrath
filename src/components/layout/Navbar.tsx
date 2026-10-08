import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Dumbbell,
  Shield,
  User,
  ChevronDown,
  UserPlus,
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
    allProfiles,
    switchUser,
    unreadNotificationCount,
    setIsNotificationsOpen,
    isNotificationsOpen,
    setActiveView,
    setSelectedClientId,
    isSupabaseConnected
  } = useApp();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case 'coach':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Dumbbell className="w-3 h-3" /> Coach
          </span>
        );
      case 'client':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <User className="w-3 h-3" /> Client
          </span>
        );
      default:
        return null;
    }
  };

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

          {/* Right Controls: Persona Switcher, Notifications, Profile Avatar */}
          <div className="flex min-w-0 items-center gap-0.5 min-[360px]:gap-1.5 sm:gap-3">
            {/* Quick Switch Persona Selector */}
            <div className="relative">
              <button
                id="persona-switcher-button"
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex min-w-0 items-center gap-1 sm:gap-2 px-1.5 min-[360px]:px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs sm:text-sm text-slate-200 transition-colors min-h-[38px]"
                title="Switch Persona / Role for Testing"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
                <span className="hidden md:inline text-xs text-slate-400">Persona:</span>
                <span className="min-w-0 font-semibold text-xs sm:text-sm truncate max-w-[48px] min-[360px]:max-w-[85px] sm:max-w-[130px]">
                  {currentUser.fullName.split(' ')[0]}
                </span>
                <div className="hidden min-[480px]:block shrink-0">{getRoleBadge(currentUser.role)}</div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {/* Persona Popover Dropdown */}
              {isPersonaOpen && (
                <>
                  {/* Backdrop on mobile for easy dismissal */}
                  <div
                    className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-2xs sm:hidden"
                    onClick={() => setIsPersonaOpen(false)}
                  />

                  <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-80 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] flex flex-col">
                    <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Switch User Persona
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Test permissions, views & coach/client workflows
                        </p>
                      </div>
                      <button
                        onClick={() => setIsPersonaOpen(false)}
                        className="sm:hidden p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-1">
                      {allProfiles.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchUser(p.id);
                            setIsPersonaOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors ${
                            p.id === currentUser.id
                              ? 'bg-emerald-500/10 border border-emerald-500/30'
                              : 'hover:bg-slate-800 border border-transparent'
                          }`}
                        >
                          <img
                            src={p.avatarUrl}
                            alt={p.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                                {p.fullName}
                              </p>
                              {getRoleBadge(p.role)}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {p.status !== 'active' ? `Status: ${p.status.toUpperCase()} • ` : ''}
                              {p.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="p-2.5 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setIsPersonaOpen(false);
                          if (onOpenAuth) onOpenAuth();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-2 rounded-xl bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/20 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" /> Register New Account
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

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
                src={currentUser.avatarUrl}
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
