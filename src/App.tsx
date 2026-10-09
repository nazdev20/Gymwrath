'use client';

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
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
  const { currentUser, activeView, setActiveView, selectedClientId } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');

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
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        themeMode={themeMode}
        onThemeModeChange={handleThemeModeChange}
      />

      <div className="flex w-full min-w-0 flex-1 overflow-hidden">
        {/* Responsive Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Scrollable Content Area */}
        <main className="min-w-0 flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-8 lg:pb-12">
          {renderCurrentView()}
        </main>
      </div>

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
