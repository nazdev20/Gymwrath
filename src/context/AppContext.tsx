import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  UserRole,
  AccountStatus,
  Exercise,
  Program,
  ScheduledWorkout,
  CheckIn,
  StepRecord,
  Food,
  NutritionTarget,
  MealPlan,
  FoodLogItem,
  Conversation,
  Message,
  AppNotification,
  LoggedExercise
} from '../types';
import { SupabaseService } from '../services/supabaseService';

export type AppView = 
  | 'dashboard' 
  | 'clients' 
  | 'client_detail' 
  | 'exercises' 
  | 'programs' 
  | 'calendar' 
  | 'checkins' 
  | 'steps' 
  | 'progress' 
  | 'nutrition' 
  | 'messages' 
  | 'admin'
  | 'database';

interface AppContextType {
  currentUser: Profile;
  allProfiles: Profile[];
  exercises: Exercise[];
  programs: Program[];
  scheduledWorkouts: ScheduledWorkout[];
  checkIns: CheckIn[];
  stepRecords: StepRecord[];
  foods: Food[];
  nutritionTargets: NutritionTarget[];
  mealPlans: MealPlan[];
  foodLogs: FoodLogItem[];
  conversations: Conversation[];
  messages: Message[];
  notifications: AppNotification[];
  
  // Navigation & Modal State
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  activeWorkoutModalId: string | null;
  setActiveWorkoutModalId: (id: string | null) => void;
  activeCheckInReviewId: string | null;
  setActiveCheckInReviewId: (id: string | null) => void;
  isCheckInModalOpen: boolean;
  setIsCheckInModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Supabase sync state & actions
  isLoadingSupabase: boolean;
  isSupabaseConnected: boolean;
  loadFromSupabase: () => Promise<boolean>;
  clearAllLocalData: () => void;

  // Actions
  switchUser: (userId: string) => void;
  updateProfile: (updated: Partial<Profile>) => void;
  registerUser: (name: string, email: string, role: UserRole, goals?: string) => Profile;
  approveUser: (userId: string, assignedCoachId: string) => void;
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  assignCoach: (clientId: string, coachId: string) => void;
  
  // Exercise & Program Actions
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Exercise;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  createProgram: (program: Omit<Program, 'id' | 'createdAt'>) => Program;
  assignProgramToClient: (programId: string, clientId: string, startDateStr: string) => void;
  
  // Workout Actions
  scheduleWorkout: (workout: Omit<ScheduledWorkout, 'id'>) => ScheduledWorkout;
  logWorkoutCompletion: (workoutId: string, loggedData: LoggedExercise[], overallRpe?: number, clientFeedback?: string) => void;
  
  // Check-In Actions
  submitCheckIn: (checkInData: Omit<CheckIn, 'id' | 'status' | 'submittedAt'>) => CheckIn;
  reviewCheckIn: (checkInId: string, coachFeedback: string) => void;
  
  // Step Actions
  logDailySteps: (dateStr: string, stepCount: number, notes?: string) => void;
  
  // Nutrition Actions
  addFood: (food: Omit<Food, 'id' | 'createdAt'>) => Food;
  setNutritionTarget: (target: Omit<NutritionTarget, 'id'>) => void;
  saveMealPlan: (plan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>) => MealPlan;
  logFoodItem: (item: Omit<FoodLogItem, 'id' | 'loggedAt'>) => void;
  deleteFoodLogItem: (id: string) => void;
  
  // Messaging Actions
  sendMessage: (conversationId: string, content: string) => void;
  markConversationRead: (conversationId: string) => void;
  
  // Notification Actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Helpers
  getAssignedClients: () => Profile[];
  getCoachForCurrentClient: () => Profile | undefined;
  unreadNotificationCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'fitness_db_live_v4_';

// Auto-purge any legacy mock storage keys from older sessions
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const legacyPrefixes = ['fitness_platform_', 'apex_coaching_', 'coaching_platform_', 'fitness_v2_'];
    Object.keys(localStorage).forEach(key => {
      if (legacyPrefixes.some(p => key.startsWith(p))) {
        localStorage.removeItem(key);
      }
    });
  }
} catch (e) {
  console.warn('Storage purge error:', e);
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_PREFIX + key);
      if (saved) return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse storage item for ' + key, e);
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Failed to save storage item for ' + key, e);
  }
}

// Clean bootstrap profiles: Coach and Admin (0 clients initially)
const DEFAULT_COACH_PROFILE: Profile = {
  id: 'coach-primary',
  email: 'coach@apexcoaching.com',
  fullName: 'Coach',
  role: 'coach',
  status: 'active',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  timezone: 'UTC',
  createdAt: new Date().toISOString(),
  bio: 'Head Performance Coach'
};

const DEFAULT_ADMIN_PROFILE: Profile = {
  id: 'user-admin-1',
  email: 'admin@fitnessplatform.com',
  fullName: 'System Administrator',
  role: 'admin',
  status: 'active',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  timezone: 'UTC',
  createdAt: new Date().toISOString(),
  bio: 'Platform Root Administrator'
};

const INITIAL_BASE_PROFILES: Profile[] = [DEFAULT_COACH_PROFILE, DEFAULT_ADMIN_PROFILE];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProfiles, setAllProfiles] = useState<Profile[]>(() => loadFromStorage('profiles', INITIAL_BASE_PROFILES));
  const [currentUserId, setCurrentUserId] = useState<string>(() => loadFromStorage('current_user_id', 'coach-primary'));
  
  const [exercises, setExercises] = useState<Exercise[]>(() => loadFromStorage('exercises', []));
  const [programs, setPrograms] = useState<Program[]>(() => loadFromStorage('programs', []));
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>(() => loadFromStorage('workouts', []));
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => loadFromStorage('checkins', []));
  const [stepRecords, setStepRecords] = useState<StepRecord[]>(() => loadFromStorage('steps', []));
  const [foods, setFoods] = useState<Food[]>(() => loadFromStorage('foods', []));
  const [nutritionTargets, setNutritionTargets] = useState<NutritionTarget[]>(() => loadFromStorage('targets', []));
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(() => loadFromStorage('mealplans', []));
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>(() => loadFromStorage('foodlogs', []));
  const [conversations, setConversations] = useState<Conversation[]>(() => loadFromStorage('conversations', []));
  const [messages, setMessages] = useState<Message[]>(() => loadFromStorage('messages', []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('notifications', []));

  // Supabase Loading & Connectivity State
  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Navigation & Modals
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeWorkoutModalId, setActiveWorkoutModalId] = useState<string | null>(null);
  const [activeCheckInReviewId, setActiveCheckInReviewId] = useState<string | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Auto-fetch data from Supabase on mount
  const loadFromSupabase = async (): Promise<boolean> => {
    setIsLoadingSupabase(true);
    try {
      const result = await SupabaseService.loadAllDataFromSupabase();
      if (result && result.profiles && result.profiles.length > 0) {
        setAllProfiles(result.profiles);
        if (result.exercises) setExercises(result.exercises);
        if (result.programs) setPrograms(result.programs);
        if (result.scheduledWorkouts) setScheduledWorkouts(result.scheduledWorkouts);
        if (result.checkIns) setCheckIns(result.checkIns);
        if (result.stepRecords) setStepRecords(result.stepRecords);
        if (result.foods) setFoods(result.foods);
        if (result.nutritionTargets) setNutritionTargets(result.nutritionTargets);
        if (result.foodLogs) setFoodLogs(result.foodLogs);
        if (result.conversations) setConversations(result.conversations);
        if (result.messages) setMessages(result.messages);
        if (result.notifications) setNotifications(result.notifications);

        // Select the first profile if current is invalid
        if (!result.profiles.some(p => p.id === currentUserId)) {
          setCurrentUserId(result.profiles[0].id);
        }
        setIsSupabaseConnected(true);
        setIsLoadingSupabase(false);
        return true;
      } else {
        // Table exists or empty
        setIsSupabaseConnected(true);
        setIsLoadingSupabase(false);
        return false;
      }
    } catch (err) {
      console.error('Failed to load from Supabase:', err);
      setIsSupabaseConnected(false);
      setIsLoadingSupabase(false);
      return false;
    }
  };

  useEffect(() => {
    loadFromSupabase();
  }, []);

  // Clear all local storage data
  const clearAllLocalData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX) || key.startsWith('fitness_') || key.startsWith('apex_')) {
        localStorage.removeItem(key);
      }
    });
    setAllProfiles(INITIAL_BASE_PROFILES);
    setCurrentUserId(DEFAULT_COACH_PROFILE.id);
    setExercises([]);
    setPrograms([]);
    setScheduledWorkouts([]);
    setCheckIns([]);
    setStepRecords([]);
    setFoods([]);
    setNutritionTargets([]);
    setMealPlans([]);
    setFoodLogs([]);
    setConversations([]);
    setMessages([]);
    setNotifications([]);
  };

  // Sync to storage
  useEffect(() => saveToStorage('profiles', allProfiles), [allProfiles]);
  useEffect(() => saveToStorage('current_user_id', currentUserId), [currentUserId]);
  useEffect(() => saveToStorage('exercises', exercises), [exercises]);
  useEffect(() => saveToStorage('programs', programs), [programs]);
  useEffect(() => saveToStorage('workouts', scheduledWorkouts), [scheduledWorkouts]);
  useEffect(() => saveToStorage('checkins', checkIns), [checkIns]);
  useEffect(() => saveToStorage('steps', stepRecords), [stepRecords]);
  useEffect(() => saveToStorage('foods', foods), [foods]);
  useEffect(() => saveToStorage('targets', nutritionTargets), [nutritionTargets]);
  useEffect(() => saveToStorage('mealplans', mealPlans), [mealPlans]);
  useEffect(() => saveToStorage('foodlogs', foodLogs), [foodLogs]);
  useEffect(() => saveToStorage('conversations', conversations), [conversations]);
  useEffect(() => saveToStorage('messages', messages), [messages]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);

  const currentUser = allProfiles.find(p => p.id === currentUserId) || allProfiles[0] || DEFAULT_COACH_PROFILE;

  const switchUser = (userId: string) => {
    const target = allProfiles.find(p => p.id === userId);
    if (target) {
      setCurrentUserId(userId);
      setActiveView('dashboard');
      setSelectedClientId(null);
    }
  };

  const updateProfile = (updated: Partial<Profile>) => {
    setAllProfiles(prev => prev.map(p => (p.id === currentUser.id ? { ...p, ...updated } : p)));
    SupabaseService.saveProfile({ ...currentUser, ...updated });
  };

  const registerUser = (name: string, email: string, role: UserRole, goals?: string): Profile => {
    const newId = `user-${role}-${Date.now()}`;
    const newProfile: Profile = {
      id: newId,
      email,
      fullName: name,
      role,
      status: role === 'client' ? 'pending' : 'active',
      avatarUrl: `https://images.unsplash.com/photo-${role === 'coach' ? '1534528741775-53994a69daeb' : '1535713875002-d1d0cf377fde'}?auto=format&fit=crop&q=80&w=256`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      createdAt: new Date().toISOString(),
      goals: goals || 'Improve overall strength and fitness'
    };
    
    setAllProfiles(prev => [...prev, newProfile]);
    SupabaseService.saveProfile(newProfile);

    // If client, notify admin
    if (role === 'client') {
      const adminUsers = allProfiles.filter(p => p.role === 'admin');
      adminUsers.forEach(admin => {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}-${admin.id}`,
            recipientId: admin.id,
            title: 'New Client Registration',
            message: `${name} has registered and requires account approval and coach assignment.`,
            type: 'account_pending',
            linkTarget: { view: 'admin' },
            isRead: false,
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
      });
    }

    return newProfile;
  };

  const approveUser = (userId: string, assignedCoachId: string) => {
    setAllProfiles(prev => prev.map(p => {
      if (p.id === userId) {
        const updated = {
          ...p,
          status: 'active' as AccountStatus,
          assignedCoachId
        };
        SupabaseService.saveProfile(updated);
        return updated;
      }
      return p;
    }));

    const targetUser = allProfiles.find(p => p.id === userId);
    const coachUser = allProfiles.find(p => p.id === assignedCoachId);
    if (targetUser && coachUser) {
      const convId = `conv-${coachUser.id}-${targetUser.id}`;
      if (!conversations.some(c => c.id === convId)) {
        const newConv: Conversation = {
          id: convId,
          clientId: targetUser.id,
          clientName: targetUser.fullName,
          clientAvatar: targetUser.avatarUrl,
          coachId: coachUser.id,
          coachName: coachUser.fullName,
          coachAvatar: coachUser.avatarUrl,
          lastMessageText: `Welcome to the team ${targetUser.fullName}! I'm Coach ${coachUser.fullName}.`,
          lastMessageTime: new Date().toISOString(),
          unreadCountCoach: 0,
          unreadCountClient: 1
        };
        setConversations(prev => [newConv, ...prev]);

        // Add welcome message
        const welcomeMsg: Message = {
          id: `msg-${Date.now()}`,
          conversationId: convId,
          senderId: coachUser.id,
          senderName: coachUser.fullName,
          senderRole: 'coach',
          content: `Welcome to the team ${targetUser.fullName}! I've been assigned as your primary coach. Take a look at your dashboard and let me know if you have any questions before we get started.`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, welcomeMsg]);
        SupabaseService.saveMessage(welcomeMsg);
      }

      setNotifications(prev => [
        {
          id: `notif-appr-${Date.now()}`,
          recipientId: targetUser.id,
          title: 'Account Approved!',
          message: `Your account has been approved and Coach ${coachUser.fullName} has been assigned to you.`,
          type: 'account_approved',
          linkTarget: { view: 'dashboard' },
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const suspendUser = (userId: string) => {
    setAllProfiles(prev => prev.map(p => (p.id === userId ? { ...p, status: 'suspended' as AccountStatus } : p)));
    const target = allProfiles.find(p => p.id === userId);
    if (target) SupabaseService.saveProfile({ ...target, status: 'suspended' });
  };

  const activateUser = (userId: string) => {
    setAllProfiles(prev => prev.map(p => (p.id === userId ? { ...p, status: 'active' as AccountStatus } : p)));
    const target = allProfiles.find(p => p.id === userId);
    if (target) SupabaseService.saveProfile({ ...target, status: 'active' });
  };

  const assignCoach = (clientId: string, coachId: string) => {
    setAllProfiles(prev => prev.map(p => (p.id === clientId ? { ...p, assignedCoachId: coachId } : p)));
    const target = allProfiles.find(p => p.id === clientId);
    if (target) SupabaseService.saveProfile({ ...target, assignedCoachId: coachId });
  };

  const addExercise = (exercise: Omit<Exercise, 'id' | 'createdAt'>): Exercise => {
    const newEx: Exercise = {
      ...exercise,
      id: `ex-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setExercises(prev => [newEx, ...prev]);
    SupabaseService.saveExercise(newEx);
    return newEx;
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const createProgram = (program: Omit<Program, 'id' | 'createdAt'>): Program => {
    const newProg: Program = {
      ...program,
      id: `prog-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPrograms(prev => [newProg, ...prev]);
    return newProg;
  };

  const assignProgramToClient = (programId: string, clientId: string, startDateStr: string) => {
    const prog = programs.find(p => p.id === programId);
    if (!prog) return;

    const startDate = new Date(startDateStr);
    const newWorkouts: ScheduledWorkout[] = [];

    (prog.workouts || []).forEach(pw => {
      const workoutDate = new Date(startDate);
      workoutDate.setDate(workoutDate.getDate() + ((pw.weekNumber - 1) * 7) + (pw.dayOfWeek - 1));
      const scheduledDateStr = workoutDate.toISOString().split('T')[0];

      newWorkouts.push({
        id: `sch-${Date.now()}-${pw.id}`,
        clientId,
        coachId: currentUser.id,
        programId: prog.id,
        title: `${prog.name}: ${pw.title}`,
        scheduledDate: scheduledDateStr,
        status: 'scheduled',
        exercises: pw.exercises,
        description: pw.description
      });
    });

    setScheduledWorkouts(prev => [...prev, ...newWorkouts]);

    setNotifications(prev => [
      {
        id: `notif-prog-${Date.now()}`,
        recipientId: clientId,
        title: 'New Training Program Assigned',
        message: `Coach ${currentUser.fullName} assigned "${prog.name}" starting ${startDateStr}.`,
        type: 'workout_assigned',
        linkTarget: { view: 'workouts' },
        isRead: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const scheduleWorkout = (workout: Omit<ScheduledWorkout, 'id'>): ScheduledWorkout => {
    const newWorkout: ScheduledWorkout = {
      ...workout,
      id: `sch-${Date.now()}`
    };
    setScheduledWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  const logWorkoutCompletion = (
    workoutId: string,
    loggedData: LoggedExercise[],
    overallRpe?: number,
    clientFeedback?: string
  ) => {
    setScheduledWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        return {
          ...w,
          status: 'completed',
          completedAt: new Date().toISOString(),
          overallRpe: overallRpe || 8,
          clientFeedback,
          exercises: loggedData
        };
      }
      return w;
    }));

    const workout = scheduledWorkouts.find(w => w.id === workoutId);
    if (workout && workout.coachId) {
      setNotifications(prev => [
        {
          id: `notif-comp-${Date.now()}`,
          recipientId: workout.coachId,
          title: 'Workout Completed',
          message: `${currentUser.fullName} completed "${workout.title}".`,
          type: 'workout_completed',
          linkTarget: { view: 'workouts' },
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const submitCheckIn = (checkInData: Omit<CheckIn, 'id' | 'status' | 'submittedAt'>): CheckIn => {
    const newCheckIn: CheckIn = {
      ...checkInData,
      id: `chk-${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    setCheckIns(prev => [newCheckIn, ...prev]);
    SupabaseService.saveCheckIn(newCheckIn);

    if (checkInData.weightKg) {
      setAllProfiles(prev => prev.map(p => (p.id === currentUser.id ? { ...p, currentWeightKg: checkInData.weightKg } : p)));
    }

    if (checkInData.coachId) {
      setNotifications(prev => [
        {
          id: `notif-chk-${Date.now()}`,
          recipientId: checkInData.coachId,
          title: 'New Check-In Submitted',
          message: `${currentUser.fullName} submitted their weekly check-in for review.`,
          type: 'checkin_submitted',
          linkTarget: { view: 'checkins' },
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }

    return newCheckIn;
  };

  const reviewCheckIn = (checkInId: string, coachFeedback: string) => {
    let updatedChk: CheckIn | undefined;
    setCheckIns(prev => prev.map(c => {
      if (c.id === checkInId) {
        updatedChk = {
          ...c,
          status: 'reviewed',
          coachFeedback,
          reviewedAt: new Date().toISOString()
        };
        return updatedChk;
      }
      return c;
    }));

    if (updatedChk) {
      SupabaseService.saveCheckIn(updatedChk);
      setNotifications(prev => [
        {
          id: `notif-rev-${Date.now()}`,
          recipientId: updatedChk!.clientId,
          title: 'Check-In Reviewed',
          message: `Coach ${currentUser.fullName} reviewed your check-in and left personalized feedback.`,
          type: 'checkin_reviewed',
          linkTarget: { view: 'checkins' },
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }
  };

  const logDailySteps = (dateStr: string, stepCount: number, notes?: string) => {
    const existing = stepRecords.find(s => s.clientId === currentUser.id && s.logDate === dateStr);
    let recordToSave: StepRecord;
    if (existing) {
      recordToSave = { ...existing, stepCount, notes, loggedAt: new Date().toISOString() };
      setStepRecords(prev => prev.map(s => (s.id === existing.id ? recordToSave : s)));
    } else {
      recordToSave = {
        id: `step-${Date.now()}`,
        clientId: currentUser.id,
        logDate: dateStr,
        stepCount,
        notes,
        loggedAt: new Date().toISOString()
      };
      setStepRecords(prev => [recordToSave, ...prev]);
    }
    SupabaseService.saveStepRecord(recordToSave);
  };

  const addFood = (food: Omit<Food, 'id' | 'createdAt'>): Food => {
    const newFood: Food = {
      ...food,
      id: `food-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setFoods(prev => [newFood, ...prev]);
    return newFood;
  };

  const setNutritionTarget = (target: Omit<NutritionTarget, 'id'>) => {
    const newTarget: NutritionTarget = {
      ...target,
      id: `targ-${Date.now()}`
    };
    setNutritionTargets(prev => [newTarget, ...prev.filter(t => !(t.clientId === target.clientId && t.effectiveDate === target.effectiveDate))]);
  };

  const saveMealPlan = (plan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): MealPlan => {
    const newPlan: MealPlan = {
      ...plan,
      id: `mp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setMealPlans(prev => [newPlan, ...prev]);
    return newPlan;
  };

  const logFoodItem = (item: Omit<FoodLogItem, 'id' | 'loggedAt'>) => {
    const newItem: FoodLogItem = {
      ...item,
      id: `flog-${Date.now()}`,
      loggedAt: new Date().toISOString()
    };
    setFoodLogs(prev => [newItem, ...prev]);
    SupabaseService.saveFoodLog(newItem);
  };

  const deleteFoodLogItem = (id: string) => {
    setFoodLogs(prev => prev.filter(f => f.id !== id));
  };

  const sendMessage = (conversationId: string, content: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      content,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    SupabaseService.saveMessage(newMsg);

    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const isCoach = currentUser.role === 'coach';
        return {
          ...c,
          lastMessageText: content,
          lastMessageTime: new Date().toISOString(),
          unreadCountCoach: isCoach ? c.unreadCountCoach : c.unreadCountCoach + 1,
          unreadCountClient: isCoach ? c.unreadCountClient + 1 : c.unreadCountClient
        };
      }
      return c;
    }));
  };

  const markConversationRead = (conversationId: string) => {
    setMessages(prev => prev.map(m => (m.conversationId === conversationId && m.senderId !== currentUser.id ? { ...m, isRead: true } : m)));
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        return currentUser.role === 'coach'
          ? { ...c, unreadCountCoach: 0 }
          : { ...c, unreadCountClient: 0 };
      }
      return c;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getAssignedClients = (): Profile[] => {
    if (currentUser.role === 'admin') {
      return allProfiles.filter(p => p.role === 'client');
    }
    if (currentUser.role === 'coach') {
      return allProfiles.filter(p => p.role === 'client' && p.assignedCoachId === currentUser.id);
    }
    return [];
  };

  const getCoachForCurrentClient = (): Profile | undefined => {
    if (currentUser.role === 'client' && currentUser.assignedCoachId) {
      return allProfiles.find(p => p.id === currentUser.assignedCoachId);
    }
    return undefined;
  };

  const unreadNotificationCount = notifications.filter(n => n.recipientId === currentUser.id && !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allProfiles,
        exercises,
        programs,
        scheduledWorkouts,
        checkIns,
        stepRecords,
        foods,
        nutritionTargets,
        mealPlans,
        foodLogs,
        conversations,
        messages,
        notifications,
        
        activeView,
        setActiveView,
        selectedClientId,
        setSelectedClientId,
        activeWorkoutModalId,
        setActiveWorkoutModalId,
        activeCheckInReviewId,
        setActiveCheckInReviewId,
        isCheckInModalOpen,
        setIsCheckInModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,

        isLoadingSupabase,
        isSupabaseConnected,
        loadFromSupabase,
        clearAllLocalData,

        switchUser,
        updateProfile,
        registerUser,
        approveUser,
        suspendUser,
        activateUser,
        assignCoach,

        addExercise,
        updateExercise,
        deleteExercise,
        createProgram,
        assignProgramToClient,

        scheduleWorkout,
        logWorkoutCompletion,

        submitCheckIn,
        reviewCheckIn,

        logDailySteps,

        addFood,
        setNutritionTarget,
        saveMealPlan,
        logFoodItem,
        deleteFoodLogItem,

        sendMessage,
        markConversationRead,

        markNotificationRead,
        markAllNotificationsRead,

        getAssignedClients,
        getCoachForCurrentClient,
        unreadNotificationCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
