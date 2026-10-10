'use client';

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { CoachDashboard } from './components/dashboard/CoachDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ClientProfileView } from './components/clients/ClientProfileView';
import { ProgressAnalyticsView } from './components/progress/ProgressAnalyticsView';
import { ExerciseLibrary } from './components/workouts/ExerciseLibrary';
import { ProgramBuilder } from './components/workouts/ProgramBuilder';
import { WorkoutCalendarView } from './components/workouts/WorkoutCalendarView';
import { ActiveWorkoutModal } from './components/workouts/ActiveWorkoutModal';
import { CheckInsView } from './components/checkins/CheckInsView';
import { CheckInSubmitModal } from './components/checkins/CheckInSubmitModal';
import { CheckInReviewModal } from './components/checkins/CheckInReviewModal';
import { NutritionView } from './components/nutrition/NutritionView';
import { StepsTrackerView } from './components/activity/StepsTrackerView';
import { MessagesView } from './components/messages/MessagesView';
import { DatabaseSchemaView } from './components/database/DatabaseSchemaView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { Profile } from './types';

const MainLayout: React.FC = () => {
  const { currentUser, activeView, setActiveView, selectedClientId, supabaseAuthUserId, isLoadingSupabase } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');

  // Keep the server-rendered boot screen in place until React has hydrated and
  // the initial Supabase load has completed, avoiding a dashboard flash on refresh.
  useEffect(() => {
    if (isLoadingSupabase) return;
    document.getElementById('gymwrath-boot-loader')?.remove();
  }, [isLoadingSupabase]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('gymwrath-theme');
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') {
      setThemeMode(savedTheme);
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const applyTheme = () => {
      const useLightTheme = themeMode === 'light' || (themeMode === 'system' && mediaQuery.matches);
      document.documentElement.classList.toggle('theme-light', useLightTheme);
      document.documentElement.style.colorScheme = useLightTheme ? 'light' : 'dark';
    };

    applyTheme();
    if (themeMode === 'system') mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [themeMode]);

  const handleThemeModeChange = (mode: 'dark' | 'light' | 'system') => {
    window.localStorage.setItem('gymwrath-theme', mode);
    setThemeMode(mode);
  };

  // Keep the database/schema tools confined to the admin role.
  useEffect(() => {
    if (currentUser.role !== 'admin' && activeView === 'database') {
      setActiveView('dashboard');
    }
  }, [currentUser.role, activeView, setActiveView]);

  const renderCurrentView = () => {
    if (!supabaseAuthUserId) {
      return <LandingPage onGetStarted={() => setIsAuthModalOpen(true)} />;
    }

    // If a client is selected for deep drill-down
    if (selectedClientId && (currentUser.role === 'coach' || currentUser.role === 'admin') && (activeView === 'clients' || activeView === 'dashboard')) {
      return <ClientProfileView />;
    }

    switch (activeView) {
      case 'dashboard':
        if (currentUser.role === 'client') return <ClientDashboard />;
        if (currentUser.role === 'admin') return <AdminDashboard />;
        return <CoachDashboard />;

      case 'clients':
        return <CoachDashboard />;

      case 'exercises':
        return <ExerciseLibrary />;

      case 'programs':
        return <ProgramBuilder />;

      case 'calendar':
        return <WorkoutCalendarView />;

      case 'checkins':
        return <CheckInsView />;

      case 'nutrition':
        return <NutritionView />;

      case 'steps':
        return <StepsTrackerView />;

      case 'progress':
        if (currentUser.role !== 'client') {
          return currentUser.role === 'admin' ? <AdminDashboard /> : <CoachDashboard />;
        }
        return <ProgressAnalyticsView />;

      case 'messages':
        return <MessagesView />;

      case 'database':
        if (currentUser.role !== 'admin') {
          return currentUser.role === 'client' ? <ClientDashboard /> : <CoachDashboard />;
        }
        return <DatabaseSchemaView />;

      case 'admin':
        return <AdminDashboard />;

      default:
        return <CoachDashboard />;
    }
  };

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Sticky Navigation */}
      <Navbar
        onToggleSidebar={supabaseAuthUserId ? () => setIsMobileMenuOpen(!isMobileMenuOpen) : undefined}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        themeMode={themeMode}
        onThemeModeChange={handleThemeModeChange}
      />

      <div className="flex w-full min-w-0 flex-1 overflow-hidden">
        {/* Authenticated users get role-specific navigation. Guests see the public landing page. */}
        {supabaseAuthUserId && (
          <Sidebar
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Scrollable Content Area */}
        <main className="min-w-0 flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-8 lg:pb-12">
          {renderCurrentView()}
        </main>
      </div>

      {isLoadingSupabase && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Loading your Gymwrath data"
        >
          <div className="flex flex-col items-center gap-5 px-6 text-center">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-400 border-r-emerald-400" />
              <span className="text-xl font-black tracking-tight text-emerald-400">G</span>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-wide text-white">Gymwrath</p>
              <p className="mt-1 text-sm text-slate-400">Loading your data…</p>
            </div>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      )}

      {/* Global Interactive Modals & Drawers */}
      <ActiveWorkoutModal />
      <CheckInSubmitModal />
      <CheckInReviewModal />
      <NotificationDrawer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App({ initialUserId, initialProfile }: { initialUserId: string | null; initialProfile: Profile | null }) {
  return (
    <AppProvider initialUserId={initialUserId} initialProfile={initialProfile}>
      <MainLayout />
    </AppProvider>
  );
}
