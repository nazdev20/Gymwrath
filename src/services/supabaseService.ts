import {
  supabase,
  SUPABASE_URL,
  getSupabaseConfig,
  getSupabaseReachableState,
  setSupabaseReachableState,
  checkSupabaseConnection,
} from '../lib/supabase';
import {
  Profile,
  Exercise,
  Program,
  ScheduledWorkout,
  CheckIn,
  StepRecord,
  Food,
  NutritionTarget,
  MealPlan,
  FoodLogItem,
  Message,
  Conversation,
  AppNotification
} from '../types';

export interface DatabaseLoadResult {
  profiles: Profile[];
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
  fromDatabase: boolean;
}

export const SupabaseService = {
  // Test connection to Supabase instance
  async testConnection(customUrl?: string, customKey?: string): Promise<{ success: boolean; message: string; isDomainError?: boolean }> {
    const res = await checkSupabaseConnection(customUrl, customKey);
    return {
      success: res.connected,
      message: res.error || `Successfully connected to Supabase REST API at ${res.endpoint}`,
      isDomainError: res.isDomainError,
    };
  },

  // Check which tables are created in the database
  async inspectTables(): Promise<{ tableName: string; exists: boolean; count?: number; error?: string }[]> {
    const config = getSupabaseConfig();
    if (config.isOfflineMode || getSupabaseReachableState() === false) {
      return [];
    }

    const tableNames = [
      'profiles',
      'coach_client_assignments',
      'exercises',
      'workouts',
      'workout_exercises',
      'exercise_set_templates',
      'training_programs',
      'program_workouts',
      'program_assignments',
      'workout_assignments',
      'workout_completions',
      'completed_exercise_sets',
      'nutrition_plans',
      'nutrition_plan_meals',
      'meal_foods',
      'nutrition_plan_assignments',
      'daily_nutrition_logs',
      'nutrition_log_meals',
      'nutrition_log_foods',
      'check_in_schedules',
      'check_ins',
      'progress_records',
      'progress_photos',
      'conversations',
      'messages',
      'notifications',
      'system_settings'
    ];

    const results = await Promise.all(
      tableNames.map(async name => {
        try {
          const { count, error } = await supabase.from(name).select('*', { count: 'exact', head: true });
          if (error) {
            return {
              tableName: name,
              exists: false,
              error: error.message
            };
          }
          return {
            tableName: name,
            exists: true,
            count: count ?? 0
          };
        } catch (e: any) {
          return {
            tableName: name,
            exists: false,
            error: e?.message || 'Query error'
          };
        }
      })
    );

    return results;
  },

  // Fetch all domain entities directly from Supabase tables
  async loadAllDataFromSupabase(): Promise<DatabaseLoadResult | null> {
    const config = getSupabaseConfig();
    if (config.isOfflineMode) {
      return null;
    }

    // Verify connectivity first to prevent multiple unhandled DNS failures
    const conn = await checkSupabaseConnection();
    if (!conn.connected) {
      console.warn(`[Supabase] Endpoint ${conn.endpoint} is not reachable: ${conn.error}`);
      setSupabaseReachableState(false);
      return null;
    }

    try {
      setSupabaseReachableState(true);
      // 1. Query Profiles
      const { data: dbProfiles, error: profErr } = await supabase.from('profiles').select('*');
      if (profErr || !dbProfiles) return null;


      // 2. Query Coach-Client Assignments
      const { data: dbAssignments } = await supabase.from('coach_client_assignments').select('*');
      const assignmentMap = new Map<string, string>();
      if (dbAssignments) {
        dbAssignments.forEach(a => {
          if (a.status === 'active') assignmentMap.set(a.client_id, a.coach_id);
        });
      }

      const profiles: Profile[] = dbProfiles.map(p => ({
        id: p.id,
        email: p.email,
        fullName: p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : p.email,
        role: p.role || 'client',
        status: p.approval_status || 'active',
        assignedCoachId: assignmentMap.get(p.id),
        avatarUrl: p.avatar_url || `https://images.unsplash.com/photo-${p.role === 'coach' ? '1534528741775-53994a69daeb' : '1535713875002-d1d0cf377fde'}?auto=format&fit=crop&q=80&w=256`,
        bio: p.bio,
        phone: p.phone,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        createdAt: p.created_at || new Date().toISOString(),
        goals: p.fitness_goals ? p.fitness_goals.join(', ') : 'Improve overall strength and fitness',
        heightCm: p.height_cm,
        currentWeightKg: p.current_weight_kg
      }));

      const profileMap = new Map<string, Profile>();
      profiles.forEach(p => profileMap.set(p.id, p));

      // 3. Query Exercises
      const { data: dbExercises } = await supabase.from('exercises').select('*');
      const exercises: Exercise[] = (dbExercises || []).map(e => ({
        id: e.id,
        name: e.name,
        description: e.description || e.name,
        muscleGroup: (e.category as any) || 'Chest',
        secondaryMuscles: e.muscle_groups || [],
        equipment: (e.equipment as any) || 'Dumbbell',
        instructions: typeof e.instructions === 'string' ? e.instructions.split('\n') : (e.instructions || []),
        isGlobal: e.is_global ?? true,
        createdBy: e.coach_id || 'system',
        createdAt: e.created_at || new Date().toISOString()
      }));

      // 4. Query Training Programs
      const { data: dbPrograms } = await supabase.from('training_programs').select('*');
      const programs: Program[] = (dbPrograms || []).map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        durationWeeks: p.duration_weeks || 4,
        createdBy: p.coach_id || 'coach-1',
        isTemplate: true,
        createdAt: p.created_at || new Date().toISOString(),
        workouts: []
      }));

      // 5. Query Workout Assignments (Scheduled Workouts)
      const { data: dbWorkouts } = await supabase.from('workout_assignments').select(`
        id,
        client_id,
        coach_id,
        workout_id,
        scheduled_date,
        status,
        notes,
        created_at,
        workouts (
          name,
          description,
          estimated_duration_min
        )
      `);

      const scheduledWorkouts: ScheduledWorkout[] = (dbWorkouts || []).map((w: any) => ({
        id: w.id,
        clientId: w.client_id,
        coachId: w.coach_id,
        title: w.workouts?.name || 'Assigned Workout',
        scheduledDate: w.scheduled_date,
        status: (w.status as any) || 'scheduled',
        exercises: [],
        description: w.notes
      }));

      // 6. Query Check-Ins
      const { data: dbCheckIns } = await supabase.from('check_ins').select('*');
      const checkIns: CheckIn[] = (dbCheckIns || []).map(c => {
        const resp = c.responses || {};
        return {
          id: c.id,
          clientId: c.client_id,
          coachId: c.coach_id,
          checkInDate: c.due_date,
          status: c.status === 'reviewed' ? 'reviewed' : 'submitted',
          submittedAt: c.submitted_at || c.created_at,
          weightKg: c.weight_kg || resp.weightKg || 70,
          sleepRating: resp.sleepRating || 8,
          stressRating: resp.stressRating || 5,
          energyRating: resp.energyRating || 7,
          hungerRating: resp.hungerRating || 6,
          workoutAdherenceRating: resp.workoutAdherenceRating || 9,
          nutritionAdherenceRating: resp.nutritionAdherenceRating || 8,
          clientNotes: c.notes || resp.clientNotes || '',
          coachFeedback: c.coach_feedback,
          reviewedAt: c.coach_reviewed_at,
          questions: resp.questions || '',
          photos: []
        };
      });

      // 7. Query Progress Records (Steps & Anthropometrics)
      const { data: dbProgress } = await supabase.from('progress_records').select('*');
      const stepRecords: StepRecord[] = (dbProgress || [])
        .filter(p => p.step_count !== undefined && p.step_count !== null)
        .map(p => ({
          id: p.id,
          clientId: p.client_id,
          logDate: p.recorded_at ? p.recorded_at.split('T')[0] : new Date().toISOString().split('T')[0],
          stepCount: p.step_count || 0,
          notes: p.notes,
          loggedAt: p.recorded_at || p.created_at
        }));

      // 8. Query Foods
      const { data: dbMealFoods } = await supabase.from('meal_foods').select('*');
      const foods: Food[] = (dbMealFoods || []).map(f => ({
        id: f.id,
        name: f.food_name,
        category: 'Protein',
        servingSize: f.quantity || 100,
        servingUnit: f.unit || 'g',
        calories: Number(f.calories) || 0,
        proteinG: Number(f.protein_g) || 0,
        carbsG: Number(f.carbs_g) || 0,
        fatG: Number(f.fat_g) || 0,
        fiberG: 0,
        isGlobal: true,
        createdBy: 'coach',
        createdAt: f.created_at || new Date().toISOString()
      }));

      // 9. Query Nutrition Targets
      const { data: dbNutrPlans } = await supabase.from('nutrition_plan_assignments').select(`
        id,
        client_id,
        coach_id,
        start_date,
        custom_target_calories,
        custom_target_protein_g,
        custom_target_carbs_g,
        custom_target_fat_g,
        nutrition_plans (
          target_calories,
          target_protein_g,
          target_carbs_g,
          target_fat_g
        )
      `);

      const nutritionTargets: NutritionTarget[] = (dbNutrPlans || []).map((np: any) => ({
        id: np.id,
        clientId: np.client_id,
        coachId: np.coach_id,
        targetType: 'daily',
        effectiveDate: np.start_date,
        caloriesKcal: Number(np.custom_target_calories || np.nutrition_plans?.target_calories || 2200),
        proteinG: Number(np.custom_target_protein_g || np.nutrition_plans?.target_protein_g || 160),
        carbsG: Number(np.custom_target_carbs_g || np.nutrition_plans?.target_carbs_g || 220),
        fatG: Number(np.custom_target_fat_g || np.nutrition_plans?.target_fat_g || 65)
      }));

      // 10. Query Food Logs
      const { data: dbLogs } = await supabase.from('daily_nutrition_logs').select(`
        id,
        client_id,
        log_date,
        total_calories,
        total_protein_g,
        total_carbs_g,
        total_fat_g
      `);

      const foodLogs: FoodLogItem[] = (dbLogs || []).map((l: any) => ({
        id: l.id,
        clientId: l.client_id,
        logDate: l.log_date,
        mealName: 'Lunch',
        foodId: 'f-1',
        foodName: 'Daily Nutrition Log Entry',
        quantity: 1,
        unit: 'portion',
        calories: Number(l.total_calories) || 0,
        proteinG: Number(l.total_protein_g) || 0,
        carbsG: Number(l.total_carbs_g) || 0,
        fatG: Number(l.total_fat_g) || 0,
        loggedAt: l.log_date + 'T12:00:00.000Z'
      }));

      // 11. Query Conversations & Messages
      const { data: dbConvs } = await supabase.from('conversations').select('*');
      const conversations: Conversation[] = (dbConvs || []).map(c => {
        const client = profileMap.get(c.client_id);
        const coach = profileMap.get(c.coach_id);
        return {
          id: c.id,
          clientId: c.client_id,
          clientName: client?.fullName || 'Client',
          clientAvatar: client?.avatarUrl || '',
          coachId: c.coach_id,
          coachName: coach?.fullName || 'Coach',
          coachAvatar: coach?.avatarUrl || '',
          lastMessageText: '',
          lastMessageTime: c.last_message_at || c.created_at,
          unreadCountCoach: 0,
          unreadCountClient: 0
        };
      });

      const { data: dbMessages } = await supabase.from('messages').select('*');
      const messages: Message[] = (dbMessages || []).map(m => {
        const sender = profileMap.get(m.sender_id);
        return {
          id: m.id,
          conversationId: m.conversation_id,
          senderId: m.sender_id,
          senderName: sender?.fullName || 'User',
          senderRole: sender?.role || 'coach',
          content: m.content,
          createdAt: m.created_at,
          isRead: m.is_read
        };
      });

      // 12. Query Notifications
      const { data: dbNotifs } = await supabase.from('notifications').select('*');
      const notifications: AppNotification[] = (dbNotifs || []).map(n => ({
        id: n.id,
        recipientId: n.user_id,
        title: n.title,
        message: n.body,
        type: (n.type as any) || 'workout_assigned',
        linkTarget: n.data?.linkTarget,
        isRead: n.is_read,
        createdAt: n.created_at
      }));

      return {
        profiles,
        exercises,
        programs,
        scheduledWorkouts,
        checkIns,
        stepRecords,
        foods,
        nutritionTargets,
        mealPlans: [],
        foodLogs,
        conversations,
        messages,
        notifications,
        fromDatabase: true
      };
    } catch (err) {
      console.error('Error fetching live data from Supabase:', err);
      return null;
    }
  },

  // Insert or Upsert a single profile to Supabase
  async saveProfile(profile: Partial<Profile>): Promise<boolean> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) return false;
    try {
      const payload: any = {
        id: profile.id,
        role: profile.role,
        email: profile.email,
        first_name: profile.fullName?.split(' ')[0] || profile.fullName,
        last_name: profile.fullName?.split(' ').slice(1).join(' ') || '',
        avatar_url: profile.avatarUrl,
        phone: profile.phone,
        approval_status: profile.status,
        bio: profile.bio,
        onboarding_completed: true,
        height_cm: profile.heightCm,
        current_weight_kg: profile.currentWeightKg,
        is_active: profile.status === 'active',
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // Insert or Upsert a message
  async saveMessage(msg: Message): Promise<boolean> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) return false;
    try {
      const { error } = await supabase.from('messages').insert({
        id: msg.id,
        conversation_id: msg.conversationId,
        sender_id: msg.senderId,
        recipient_id: msg.senderId,
        content: msg.content,
        is_read: msg.isRead,
        created_at: msg.createdAt
      });
      return !error;
    } catch {
      return false;
    }
  },

  // Insert or Upsert a check-in
  async saveCheckIn(chk: CheckIn): Promise<boolean> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) return false;
    try {
      const { error } = await supabase.from('check_ins').upsert({
        id: chk.id,
        client_id: chk.clientId,
        coach_id: chk.coachId,
        due_date: chk.checkInDate,
        status: chk.status,
        submitted_at: chk.submittedAt,
        responses: {
          sleepRating: chk.sleepRating,
          stressRating: chk.stressRating,
          energyRating: chk.energyRating,
          hungerRating: chk.hungerRating,
          workoutAdherenceRating: chk.workoutAdherenceRating,
          nutritionAdherenceRating: chk.nutritionAdherenceRating,
          clientNotes: chk.clientNotes,
          questions: chk.questions
        },
        weight_kg: chk.weightKg,
        notes: chk.clientNotes,
        coach_feedback: chk.coachFeedback,
        coach_reviewed_at: chk.reviewedAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // Insert or Upsert a step record
  async saveStepRecord(step: StepRecord): Promise<boolean> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) return false;
    try {
      const { error } = await supabase.from('progress_records').upsert({
        id: step.id,
        client_id: step.clientId,
        recorded_at: step.loggedAt,
        record_type: 'step_entry',
        step_count: step.stepCount,
        notes: step.notes
      }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // Insert or Upsert a food log entry
  async saveFoodLog(log: FoodLogItem): Promise<boolean> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) return false;
    try {
      const { error } = await supabase.from('daily_nutrition_logs').upsert({
        id: log.id,
        client_id: log.clientId,
        log_date: log.logDate,
        total_calories: log.calories,
        total_protein_g: log.proteinG,
        total_carbs_g: log.carbsG,
        total_fat_g: log.fatG,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      return !error;
    } catch {
      return false;
    }
  },

  // Insert or Upsert an exercise
  async saveExercise(ex: Exercise): Promise<{ success: boolean; error?: string; warning?: string }> {
    if (getSupabaseConfig().isOfflineMode) {
      return { success: false, error: 'Supabase is in offline mode.' };
    }
    if (getSupabaseReachableState() === false) {
      return { success: false, error: 'The Supabase endpoint is unreachable.' };
    }
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) return { success: false, error: `Unable to verify the signed-in user: ${authError.message}` };
      if (!user) return { success: false, error: 'Sign in before saving an exercise.' };
      const coachId = user.id;
      const { error } = await supabase.from('exercises').upsert({
        id: ex.id,
        coach_id: coachId,
        name: ex.name,
        description: ex.description,
        category: ex.muscleGroup,
        muscle_groups: [ex.muscleGroup, ...(ex.secondaryMuscles || [])],
        equipment: ex.equipment,
        instructions: ex.instructions.join('\n'),
        difficulty_level: 'Intermediate',
        is_global: ex.isGlobal,
        created_at: ex.createdAt,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) {
        console.error('Failed to save exercise to Supabase:', error);
        return { success: false, error: error.message };
      }
      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to save exercise to Supabase:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Supabase error.'
      };
    }
  }
};
