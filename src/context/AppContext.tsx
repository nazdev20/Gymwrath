import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Profile,
  AccountStatus,
  Exercise,
  Program,
  ScheduledWorkout,
  CheckIn,
  CheckInFrequency,
  ProgramDayOfWeek,
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
import { SupabaseService, type SupabaseWriteResult } from '../services/supabaseService';
import { supabase } from '../lib/supabase';

interface SupabaseAuthResult {
  success: boolean;
  error?: string;
  requiresEmailConfirmation?: boolean;
}

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
  supabaseAuthUserId: string | null;
  loadFromSupabase: (userId?: string) => Promise<boolean>;
  signInWithSupabase: (email: string, password: string) => Promise<SupabaseAuthResult>;
  signUpWithSupabase: (name: string, email: string, password: string, goals?: string) => Promise<SupabaseAuthResult>;
  signOutFromSupabase: () => Promise<SupabaseAuthResult>;

  // Actions
  updateProfile: (updated: Partial<Profile>) => Promise<boolean>;
  approveUser: (userId: string, assignedCoachId: string) => Promise<SupabaseWriteResult>;
  suspendUser: (userId: string) => void;
  activateUser: (userId: string) => void;
  assignCoach: (clientId: string, coachId: string) => Promise<SupabaseWriteResult>;
  
  // Exercise & Program Actions
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string; warning?: string }>;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  createProgram: (program: Omit<Program, 'id' | 'createdAt'>) => Program;
  assignProgramToClient: (programId: string, clientId: string, startDateStr: string) => void;
  
  // Workout Actions
  scheduleWorkout: (workout: Omit<ScheduledWorkout, 'id'>) => ScheduledWorkout;
  logWorkoutCompletion: (workoutId: string, loggedData: LoggedExercise[], overallRpe?: number, clientFeedback?: string) => Promise<SupabaseWriteResult>;
  
  // Check-In Actions
  submitCheckIn: (checkInData: Omit<CheckIn, 'id' | 'status' | 'submittedAt'>) => Promise<SupabaseWriteResult>;
  reviewCheckIn: (checkInId: string, coachFeedback: string) => Promise<SupabaseWriteResult>;
  createCheckInSchedule: (input: {
    clientId: string;
    frequency: CheckInFrequency;
    customIntervalDays?: number;
    dayOfWeek?: ProgramDayOfWeek;
  }) => Promise<SupabaseWriteResult>;
  
  // Step Actions
  logDailySteps: (dateStr: string, stepCount: number, notes?: string) => Promise<SupabaseWriteResult>;
  
  // Nutrition Actions
  addFood: (food: Omit<Food, 'id' | 'createdAt'>) => Promise<{ success: boolean; food?: Food; error?: string }>;
  setNutritionTarget: (target: Omit<NutritionTarget, 'id'>) => void;
  saveMealPlan: (plan: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>) => MealPlan;
  logFoodItem: (item: Omit<FoodLogItem, 'id' | 'loggedAt'>) => Promise<SupabaseWriteResult>;
  deleteFoodLogItem: (id: string) => Promise<SupabaseWriteResult>;
  
  // Messaging Actions
  sendMessage: (recipientId: string, content: string) => Promise<{ success: boolean; error?: string }>;
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

const GUEST_PROFILE: Profile = {
  id: '',
  email: '',
  fullName: 'Guest',
  role: 'client',
  status: 'pending',
  avatarUrl: '',
  timezone: 'UTC',
  createdAt: ''
};

export const AppProvider: React.FC<{
  children: React.ReactNode;
  initialUserId?: string | null;
  initialProfile?: Profile | null;
}> = ({ children, initialUserId = null, initialProfile = null }) => {
  const [allProfiles, setAllProfiles] = useState<Profile[]>(initialProfile ? [initialProfile] : []);
  const [currentUserId, setCurrentUserId] = useState<string>(initialUserId || '');
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState<ScheduledWorkout[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [stepRecords, setStepRecords] = useState<StepRecord[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [nutritionTargets, setNutritionTargets] = useState<NutritionTarget[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Supabase Loading & Connectivity State
  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(Boolean(initialUserId));
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseAuthUserId, setSupabaseAuthUserId] = useState<string | null>(initialUserId || null);

  // Navigation & Modals
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeWorkoutModalId, setActiveWorkoutModalId] = useState<string | null>(null);
  const [activeCheckInReviewId, setActiveCheckInReviewId] = useState<string | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Load application records only after Supabase Auth identifies the current user.
  const loadFromSupabase = async (authenticatedUserId = supabaseAuthUserId): Promise<boolean> => {
    if (!authenticatedUserId) return false;
    setIsLoadingSupabase(true);
    try {
      const result = await SupabaseService.loadAllDataFromSupabase();
      const authenticatedProfile = result?.profiles.find(profile => profile.id === authenticatedUserId);
      if (result && authenticatedProfile) {
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

        setCurrentUserId(authenticatedUserId);
        setIsSupabaseConnected(true);
        setIsLoadingSupabase(false);
        return true;
      } else {
        setAllProfiles([]);
        setCurrentUserId('');
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
        setIsSupabaseConnected(Boolean(result));
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
    if (supabaseAuthUserId) {
      void loadFromSupabase();
      return;
    }
    setAllProfiles([]);
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
    setIsSupabaseConnected(false);
  }, [supabaseAuthUserId]);

  // Keep the in-app DM history synchronized with messages inserted by the other participant.
  // Notifications can arrive independently of the currently loaded message list.
  useEffect(() => {
    if (!supabaseAuthUserId) return;

    const channel = supabase
      .channel(`dm-messages-${supabaseAuthUserId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'fitness', table: 'messages' },
        payload => {
          const row = payload.new as {
            id: string;
            conversation_id: string;
            sender_id: string;
            recipient_id: string;
            content: string;
            is_read: boolean;
            created_at: string;
          };

          if (!row?.id || (row.sender_id !== supabaseAuthUserId && row.recipient_id !== supabaseAuthUserId)) return;

          const sender = allProfiles.find(profile => profile.id === row.sender_id);
          const incomingMessage: Message = {
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            recipientId: row.recipient_id,
            senderName: sender?.fullName || 'User',
            senderRole: sender?.role || 'coach',
            content: row.content,
            isRead: row.is_read,
            createdAt: row.created_at
          };

          setMessages(prev => prev.some(message => message.id === incomingMessage.id)
            ? prev
            : [...prev, incomingMessage]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabaseAuthUserId, allProfiles]);

  useEffect(() => {
    let isMounted = true;
    const applyAuthUser = (userId: string | null) => {
      if (!isMounted) return;
      setSupabaseAuthUserId(userId);
      setCurrentUserId(userId || '');
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('Failed to restore Supabase session:', error);
        return;
      }
      applyAuthUser(data.session?.user.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applyAuthUser(session?.user.id || null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithSupabase = async (email: string, password: string): Promise<SupabaseAuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Supabase did not return a user for this session.' };

    setSupabaseAuthUserId(data.user.id);
    setCurrentUserId(data.user.id);
    const loaded = await loadFromSupabase(data.user.id);
    if (!loaded) {
      await supabase.auth.signOut();
      setSupabaseAuthUserId(null);
      return {
        success: false,
        error: 'Signed in, but no profile was found. Confirm the fitness schema setup and profile row for this account.'
      };
    }
    return { success: true };
  };

  const signUpWithSupabase = async (
    name: string,
    email: string,
    password: string,
    goals?: string
  ): Promise<SupabaseAuthResult> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          fitness_goals: goals || ''
        }
      }
    });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Supabase did not create a user.' };

    if (!data.session) {
      return { success: true, requiresEmailConfirmation: true };
    }

    setSupabaseAuthUserId(data.user.id);
    setCurrentUserId(data.user.id);
    const loaded = await loadFromSupabase(data.user.id);
    if (!loaded) {
      await supabase.auth.signOut();
      setSupabaseAuthUserId(null);
      return {
        success: false,
        error: 'The account was created, but its fitness profile could not be loaded. Contact an administrator.'
      };
    }
    return { success: true };
  };

  const signOutFromSupabase = async (): Promise<SupabaseAuthResult> => {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    setSupabaseAuthUserId(null);
    return { success: true };
  };

  // Sync to storage

  const currentUser = allProfiles.find(p => p.id === currentUserId) || GUEST_PROFILE;

  const updateProfile = async (updated: Partial<Profile>): Promise<boolean> => {
    const nextProfile = { ...currentUser, ...updated };
    const saved = await SupabaseService.saveProfile(nextProfile);
    if (!saved) return false;
    setAllProfiles(prev => prev.map(p => (p.id === currentUser.id ? nextProfile : p)));
    return true;
  };

  const approveUser = async (userId: string, assignedCoachId: string): Promise<SupabaseWriteResult> => {
    const saved = await SupabaseService.assignClientToCoach(userId, assignedCoachId, true);
    if (!saved.success) return saved;
    if (!saved.conversationId) {
      return { success: false, error: 'The coach assignment was saved, but the conversation ID is missing. Refresh and try again.' };
    }

    setAllProfiles(prev => prev.map(p => p.id === userId
      ? { ...p, status: 'active' as AccountStatus, assignedCoachId }
      : p
    ));

    const targetUser = allProfiles.find(p => p.id === userId);
    const coachUser = allProfiles.find(p => p.id === assignedCoachId);
    if (targetUser && coachUser) {
      const convId = saved.conversationId;
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

        const welcomeMsg: Message = {
          id: crypto.randomUUID(),
          conversationId: convId,
          senderId: coachUser.id,
          recipientId: targetUser.id,
          senderName: coachUser.fullName,
          senderRole: 'coach',
          content: `Welcome to the team ${targetUser.fullName}! I've been assigned as your primary coach. Take a look at your dashboard and let me know if you have any questions before we get started.`,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        const welcomeSave = await SupabaseService.saveMessage(welcomeMsg);
        if (welcomeSave.success) {
          setMessages(prev => [...prev, welcomeMsg]);
        } else {
          console.warn('Coach assignment was saved, but the welcome message could not be saved:', welcomeSave.error);
        }
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

    return { success: true };
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

  const assignCoach = async (clientId: string, coachId: string): Promise<SupabaseWriteResult> => {
    const saved = await SupabaseService.assignClientToCoach(clientId, coachId);
    if (!saved.success) return saved;
    if (!saved.conversationId) {
      return { success: false, error: 'The coach assignment was saved, but the conversation ID is missing. Refresh and try again.' };
    }

    setAllProfiles(prev => prev.map(p => p.id === clientId ? { ...p, assignedCoachId: coachId } : p));
    const client = allProfiles.find(p => p.id === clientId);
    const coach = allProfiles.find(p => p.id === coachId);
    if (client && coach && !conversations.some(c => c.id === saved.conversationId)) {
      const latestMessage = messages
        .filter(m => (m.senderId === clientId && m.recipientId === coachId) || (m.senderId === coachId && m.recipientId === clientId))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      const conversation: Conversation = {
        id: saved.conversationId,
        clientId,
        clientName: client.fullName,
        clientAvatar: client.avatarUrl,
        coachId,
        coachName: coach.fullName,
        coachAvatar: coach.avatarUrl,
        lastMessageText: latestMessage?.content || '',
        lastMessageTime: latestMessage?.createdAt || new Date().toISOString(),
        unreadCountCoach: 0,
        unreadCountClient: 0
      };
      setConversations(prev => [conversation, ...prev]);
    }
    return { success: true };
  };

  const addExercise = async (exercise: Omit<Exercise, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string; warning?: string }> => {
    if (!supabaseAuthUserId) {
      return { success: false, error: 'Sign in before saving an exercise.' };
    }
    const newEx: Exercise = {
      ...exercise,
      createdBy: supabaseAuthUserId,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    const result = await SupabaseService.saveExercise(newEx);
    if (result.success) setExercises(prev => [newEx, ...prev]);
    return result;
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

    const newWorkouts: ScheduledWorkout[] = [];

    (prog.workouts || []).forEach(pw => {
      const [year, month, day] = startDateStr.split('-').map(Number);
      const weekStart = new Date(Date.UTC(year, month - 1, day + (pw.weekNumber - 1) * 7));
      const dayOffset = (pw.dayOfWeek - weekStart.getUTCDay() + 7) % 7;
      weekStart.setUTCDate(weekStart.getUTCDate() + dayOffset);
      const scheduledDateStr = weekStart.toISOString().slice(0, 10);

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
        linkTarget: { view: 'calendar' },
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

  const logWorkoutCompletion = async (
    workoutId: string,
    loggedData: LoggedExercise[],
    overallRpe?: number,
    clientFeedback?: string
  ): Promise<SupabaseWriteResult> => {
    const workout = scheduledWorkouts.find(w => w.id === workoutId);
    if (!workout) return { success: false, error: 'Workout session not found. Refresh and try again.' };

    const saved = await SupabaseService.saveWorkoutCompletion(workout, loggedData, overallRpe, clientFeedback);
    if (!saved.success) return saved;

    const completedAt = new Date().toISOString();
    setScheduledWorkouts(prev => prev.map(w => w.id === workoutId ? {
      ...w,
      status: 'completed',
      completedAt,
      overallRpe: overallRpe ?? 8,
      clientFeedback,
      loggedData
    } : w));

    if (workout.coachId) {
      setNotifications(prev => [
        {
          id: `notif-comp-${Date.now()}`,
          recipientId: workout.coachId,
          title: 'Workout Completed',
          message: `${currentUser.fullName} completed "${workout.title}".`,
          type: 'workout_completed',
          linkTarget: { view: 'calendar' },
          isRead: false,
          createdAt: completedAt
        },
        ...prev
      ]);
    }

    return saved;
  };

  const submitCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'status' | 'submittedAt'>): Promise<SupabaseWriteResult> => {
    const newCheckIn: CheckIn = {
      ...checkInData,
      id: crypto.randomUUID(),
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    const saveResult = await SupabaseService.saveCheckIn(newCheckIn);
    if (!saveResult.success) return saveResult;
    setCheckIns(prev => [{ ...newCheckIn, scheduleId: saveResult.scheduleId }, ...prev]);

    if (checkInData.weightKg) {
      setAllProfiles(prev => prev.map(p => (p.id === currentUser.id ? { ...p, currentWeightKg: checkInData.weightKg } : p)));
    }

    if (checkInData.coachId) {
      setNotifications(prev => [
        {
          id: `notif-chk-${Date.now()}`,
          recipientId: checkInData.coachId,
          title: 'New Check-In Submitted',
          message: `${currentUser.fullName} submitted a check-in for review.`,
          type: 'checkin_submitted',
          linkTarget: { view: 'checkins' },
          isRead: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);
    }

    return { success: true };
  };

  const reviewCheckIn = async (checkInId: string, coachFeedback: string): Promise<SupabaseWriteResult> => {
    const existingCheckIn = checkIns.find(checkIn => checkIn.id === checkInId);
    if (!existingCheckIn) return { success: false, error: 'Check-in not found.' };
    const updatedChk: CheckIn = {
      ...existingCheckIn,
      status: 'reviewed',
      coachFeedback,
      reviewedAt: new Date().toISOString()
    };

    const saveResult = await SupabaseService.saveCheckIn(updatedChk);
    if (!saveResult.success) return saveResult;
    setCheckIns(prev => prev.map(checkIn => checkIn.id === checkInId ? updatedChk : checkIn));
    {
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
    return { success: true };
  };

  const createCheckInSchedule = (input: {
    clientId: string;
    frequency: CheckInFrequency;
    customIntervalDays?: number;
    dayOfWeek?: ProgramDayOfWeek;
  }): Promise<SupabaseWriteResult> => SupabaseService.createCheckInSchedule(input);

  const logDailySteps = async (dateStr: string, stepCount: number, notes?: string): Promise<SupabaseWriteResult> => {
    const existing = stepRecords.find(s => s.clientId === currentUser.id && s.logDate === dateStr);
    let recordToSave: StepRecord;
    if (existing) {
      recordToSave = { ...existing, stepCount, notes, loggedAt: new Date().toISOString() };
    } else {
      recordToSave = {
        id: crypto.randomUUID(),
        clientId: currentUser.id,
        logDate: dateStr,
        stepCount,
        notes,
        loggedAt: new Date().toISOString()
      };
    }
    const saveResult = await SupabaseService.saveStepRecord(recordToSave);
    if (!saveResult.success) return saveResult;
    setStepRecords(prev => existing
      ? prev.map(record => record.id === existing.id ? recordToSave : record)
      : [recordToSave, ...prev]);
    return { success: true };
  };

  const addFood = async (food: Omit<Food, 'id' | 'createdAt'>): Promise<{ success: boolean; food?: Food; error?: string }> => {
    const newFood: Food = {
      ...food,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    const saved = await SupabaseService.saveFood(newFood);
    if (!saved.success || !saved.food) {
      return { success: false, error: saved.error || 'Food item was not saved.' };
    }
    setFoods(prev => [saved.food!, ...prev.filter(existing => existing.id !== saved.food!.id)]);
    return { success: true, food: saved.food };
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

  const logFoodItem = async (item: Omit<FoodLogItem, 'id' | 'loggedAt'>): Promise<SupabaseWriteResult> => {
    const newItem: FoodLogItem = {
      ...item,
      id: crypto.randomUUID(),
      loggedAt: new Date().toISOString()
    };
    const saved = await SupabaseService.saveFoodLog(newItem);
    if (!saved.success) return saved;
    setFoodLogs(prev => [newItem, ...prev]);
    return { success: true };
  };

  const deleteFoodLogItem = async (id: string): Promise<SupabaseWriteResult> => {
    const deleted = await SupabaseService.deleteFoodLog(id);
    if (!deleted.success) return deleted;
    setFoodLogs(prev => prev.filter(f => f.id !== id));
    return { success: true };
  };

  const sendMessage = async (recipientId: string, content: string): Promise<{ success: boolean; error?: string }> => {
    let thread = conversations.find(conversation =>
      (conversation.coachId === currentUser.id && conversation.clientId === recipientId)
      || (conversation.clientId === currentUser.id && conversation.coachId === recipientId)
    );

    // The local conversation list can be stale when a client opens DM after receiving a notification.
    // Resolve the existing participant conversation from Supabase before failing the send.
    if (!thread) {
      const clientId = currentUser.role === 'client' ? currentUser.id : recipientId;
      const coachId = currentUser.role === 'client' ? recipientId : currentUser.id;
      const { data: dbConversation, error: conversationError } = await supabase
        .from('conversations')
        .select('*')
        .eq('client_id', clientId)
        .eq('coach_id', coachId)
        .maybeSingle();

      if (conversationError) {
        return { success: false, error: `Unable to load the conversation: ${conversationError.message}` };
      }
      if (!dbConversation) {
        return { success: false, error: 'There is no active conversation with this user.' };
      }

      const client = allProfiles.find(profile => profile.id === dbConversation.client_id);
      const coach = allProfiles.find(profile => profile.id === dbConversation.coach_id);
      thread = {
        id: dbConversation.id,
        clientId: dbConversation.client_id,
        clientName: client?.fullName || 'Client',
        clientAvatar: client?.avatarUrl || '',
        coachId: dbConversation.coach_id,
        coachName: coach?.fullName || 'Coach',
        coachAvatar: coach?.avatarUrl || '',
        lastMessageText: '',
        lastMessageTime: dbConversation.last_message_at || dbConversation.created_at,
        unreadCountCoach: 0,
        unreadCountClient: 0
      };
      const resolvedThread = thread;
      setConversations(prev => prev.some(conversation => conversation.id === resolvedThread.id)
        ? prev
        : [resolvedThread, ...prev]);
    }

    const newMsg: Message = {
      id: crypto.randomUUID(),
      conversationId: thread.id,
      senderId: currentUser.id,
      recipientId,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      content,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const saved = await SupabaseService.saveMessage(newMsg);
    if (!saved.success) return { success: false, error: saved.error || 'Message was not saved to Supabase.' };
    setMessages(prev => [...prev, newMsg]);

    setConversations(prev => prev.map(c => {
      if (c.id === thread.id) {
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
    return { success: true };
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
        supabaseAuthUserId,
        loadFromSupabase,
        signInWithSupabase,
        signUpWithSupabase,
        signOutFromSupabase,

        updateProfile,
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
        createCheckInSchedule,

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
