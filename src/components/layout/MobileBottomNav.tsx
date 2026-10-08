import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardCheck,
  Footprints,
  Utensils,
  MessageSquare,
  Menu,
  ShieldCheck,
  Dumbbell
} from 'lucide-react';

interface MobileBottomNavProps {
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMobileMenu }) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    checkIns,
    conversations,
    allProfiles,
    setSelectedClientId
  } = useApp();

  const pendingCheckinsCount = checkIns.filter(
    c => c.status === 'submitted' && (currentUser.role === 'admin' || c.coachId === currentUser.id)
  ).length;

  const unreadMessagesCount = conversations.reduce((acc, c) => {
    if (currentUser.role === 'coach' && c.coachId === currentUser.id) return acc + c.unreadCountCoach;
    if (currentUser.role === 'client' && c.clientId === currentUser.id) return acc + c.unreadCountClient;
    return acc;
  }, 0);

  const pendingUsersCount = allProfiles.filter(p => p.status === 'pending').length;

  interface TabItem {
    id: AppView | 'more';
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
    onClick?: () => void;
  }

  const getTabs = (): TabItem[] => {
    if (currentUser.role === 'client') {
      return [
        {
          id: 'dashboard',
          label: 'Today',
          icon: <LayoutDashboard className="w-5 h-5" />
        },
        {
          id: 'calendar',
          label: 'Workouts',
          icon: <Calendar className="w-5 h-5" />
        },
        {
          id: 'steps',
          label: 'Steps',
          icon: <Footprints className="w-5 h-5" />
        },
        {
          id: 'nutrition',
          label: 'Macros',
          icon: <Utensils className="w-5 h-5" />
        },
        {
          id: 'checkins',
          label: 'Check-In',
          icon: <ClipboardCheck className="w-5 h-5" />
        },
        {
          id: 'messages',
          label: 'Chat',
          icon: <MessageSquare className="w-5 h-5" />,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
          badgeColor: 'bg-emerald-500 text-slate-950'
        }
      ];
    }

    if (currentUser.role === 'coach') {
      return [
        {
          id: 'dashboard',
          label: 'Overview',
          icon: <LayoutDashboard className="w-5 h-5" />,
          onClick: () => {
            setSelectedClientId(null);
            setActiveView('dashboard');
          }
        },
        {
          id: 'clients',
          label: 'Roster',
          icon: <Users className="w-5 h-5" />,
          onClick: () => {
            setSelectedClientId(null);
            setActiveView('clients');
          }
        },
        {
          id: 'checkins',
          label: 'Reviews',
          icon: <ClipboardCheck className="w-5 h-5" />,
          badge: pendingCheckinsCount > 0 ? pendingCheckinsCount : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold'
        },
        {
          id: 'calendar',
          label: 'Workouts',
          icon: <Calendar className="w-5 h-5" />
        },
        {
          id: 'messages',
          label: 'Chat',
          icon: <MessageSquare className="w-5 h-5" />,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
          badgeColor: 'bg-emerald-500 text-slate-950 font-bold'
        },
        {
          id: 'more',
          label: 'Menu',
          icon: <Menu className="w-5 h-5" />,
          onClick: onOpenMobileMenu
        }
      ];
    }

    // Admin
    return [
      {
        id: 'dashboard',
        label: 'Overview',
        icon: <LayoutDashboard className="w-5 h-5" />
      },
      {
        id: 'admin',
        label: 'Users',
        icon: <ShieldCheck className="w-5 h-5" />,
        badge: pendingUsersCount > 0 ? pendingUsersCount : undefined,
        badgeColor: 'bg-amber-500 text-slate-950 font-bold'
      },
      {
        id: 'clients',
        label: 'Clients',
        icon: <Users className="w-5 h-5" />
      },
      {
        id: 'exercises',
        label: 'Exercises',
        icon: <Dumbbell className="w-5 h-5" />
      },
      {
        id: 'more',
        label: 'Menu',
        icon: <Menu className="w-5 h-5" />,
        onClick: onOpenMobileMenu
      }
    ];
  };

  const tabs = getTabs();

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-1 py-1 shadow-2xl safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = tab.id !== 'more' && activeView === tab.id;

          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => {
                if (tab.onClick) {
                  tab.onClick();
                } else if (tab.id !== 'more') {
                  setActiveView(tab.id as AppView);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-w-[50px] min-h-[46px] ${
                isActive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center ${
                      tab.badgeColor || 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium mt-0.5 tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
