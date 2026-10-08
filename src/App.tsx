'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CoachDashboard } from './components/dashboard/CoachDashboard';
import { ClientDashboard } from './components/dashboard/ClientDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ClientProfileView } from './components/clients/ClientProfileView';
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

const MainLayout: React.FC = () => {
  const { currentUser, activeView, selectedClientId } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

      case 'messages':
        return <MessagesView />;

      case 'database':
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
      />

      <div className="flex w-full min-w-0 flex-1 overflow-hidden">
        {/* Responsive Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Scrollable Content Area with Mobile Safe Bottom Spacing */}
        <main className="min-w-0 flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar (Hidden on lg+ screens) */}
      <MobileBottomNav onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Global Interactive Modals & Drawers */}
      <ActiveWorkoutModal />
      <CheckInSubmitModal />
      <CheckInReviewModal />
      <NotificationDrawer />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
