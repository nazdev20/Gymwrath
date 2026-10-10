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
  ExerciseCategory,
  MuscleGroup,
  Program,
  ScheduledWorkout,
  WorkoutExercise,
  PrescribedSet,
  LoggedExercise,
  CheckIn,
  CheckInFrequency,
  ProgramDayOfWeek,
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

export interface SupabaseWriteResult {
  success: boolean;
  error?: string;
  warning?: string;
  persisted?: boolean;
  scheduleId?: string;
  conversationId?: string;
}

const mapFoodCatalogRow = (f: any): Food => ({
  id: f.id,
  name: f.name,
  category: (['Protein', 'Carbohydrates', 'Fats', 'Dairy', 'Fruits', 'Vegetables', 'Snacks', 'Beverages', 'Other'].includes(f.category) ? f.category : 'Other') as Food['category'],
  foodType: (['packaged', 'home_cooked', 'restaurant', 'fast_food', 'generic'].includes(f.food_type) ? f.food_type : 'generic') as NonNullable<Food['foodType']>,
  brand: f.brand || undefined,
  barcode: f.barcode || undefined,
  notes: f.notes || undefined,
  servingSize: Number(f.serving_size) || 100,
  servingUnit: f.serving_unit || 'g',
  calories: Number(f.calories) || 0,
  proteinG: Number(f.protein_g) || 0,
  carbsG: Number(f.carbs_g) || 0,
  fatG: Number(f.fat_g) || 0,
  fiberG: Number(f.fiber_g) || 0,
  isGlobal: true,
  createdBy: f.created_by || 'system',
  createdAt: f.created_at || new Date().toISOString()
});

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
        status: p.approval_status === 'pending'
          ? 'pending'
          : p.approval_status === 'rejected' || !p.is_active
            ? 'suspended'
            : 'active',
        assignedCoachId: assignmentMap.get(p.id),
        avatarUrl: p.avatar_url || `https://images.unsplash.com/photo-${p.role === 'coach' ? '1534528741775-53994a69daeb' : '1535713875002-d1d0cf377fde'}?auto=format&fit=crop&q=80&w=256`,
        bio: p.bio,
        phone: p.phone,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        createdAt: p.created_at || new Date().toISOString(),
        goals: Array.isArray(p.fitness_goals) ? p.fitness_goals.join(', ') : '',
        heightCm: p.height_cm,
        currentWeightKg: p.current_weight_kg,
        targetWeightKg: p.target_weight_kg == null ? undefined : Number(p.target_weight_kg)
      }));

      const profileMap = new Map<string, Profile>();
      profiles.forEach(p => profileMap.set(p.id, p));

      // 3. Query Exercises
      const { data: dbExercises } = await supabase.from('exercises').select('*');
      const validMuscleGroups: MuscleGroup[] = [
        'Chest', 'Back', 'Shoulders', 'Quads', 'Hamstrings', 'Glutes',
        'Calves', 'Biceps', 'Triceps', 'Core', 'Full Body', 'Cardio'
      ];
      const validExerciseCategories: ExerciseCategory[] = [
        'strength', 'cardio', 'flexibility', 'balance', 'plyometric', 'other'
      ];
      const exercises: Exercise[] = (dbExercises || []).map(e => ({
        id: e.id,
        name: e.name,
        description: e.description || e.name,
        category: validExerciseCategories.includes(e.category) ? e.category : 'other',
        muscleGroup: e.muscle_groups?.find((group: string) => validMuscleGroups.includes(group as MuscleGroup)) || 'Chest',
        secondaryMuscles: (e.muscle_groups || [])
          .filter((group: string) => validMuscleGroups.includes(group as MuscleGroup))
          .slice(1) as MuscleGroup[],
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

      const [
        { data: dbWorkoutExercises },
        { data: dbSetTemplates },
        { data: dbCompletions },
        { data: dbCompletedSets }
      ] = await Promise.all([
        supabase.from('workout_exercises').select('*'),
        supabase.from('exercise_set_templates').select('*'),
        supabase.from('workout_completions').select('*').order('completed_at', { ascending: false }),
        supabase.from('completed_exercise_sets').select('*')
      ]);

      const exerciseNameById = new Map<string, string>(
        (dbExercises || []).map((exercise: any): [string, string] => [String(exercise.id), String(exercise.name)])
      );
      const templatesByWorkoutExercise = new Map<string, any[]>();
      (dbSetTemplates || []).forEach((set: any) => {
        const existing = templatesByWorkoutExercise.get(set.workout_exercise_id) || [];
        existing.push(set);
        templatesByWorkoutExercise.set(set.workout_exercise_id, existing);
      });

      const workoutExercisesByWorkout = new Map<string, WorkoutExercise[]>();
      (dbWorkoutExercises || []).forEach((exercise: any) => {
        const prescribedSets: PrescribedSet[] = (templatesByWorkoutExercise.get(exercise.id) || [])
          .sort((a: any, b: any) => a.set_number - b.set_number)
          .map((set: any) => ({
            setNumber: set.set_number,
            reps: set.target_reps == null ? '8-10' : String(set.target_reps),
            targetWeightKg: set.target_weight == null ? undefined : Number(set.target_weight),
            restSeconds: set.rest_period_sec || 90
          }));
        const mappedExercise: WorkoutExercise = {
          id: exercise.id,
          exerciseId: exercise.exercise_id,
          exerciseName: exerciseNameById.get(exercise.exercise_id) || 'Exercise',
          orderIndex: exercise.order_index || 0,
          sets: prescribedSets,
          notes: exercise.notes || undefined
        };
        const existing = workoutExercisesByWorkout.get(exercise.workout_id) || [];
        existing.push(mappedExercise);
        workoutExercisesByWorkout.set(exercise.workout_id, existing);
      });
      workoutExercisesByWorkout.forEach(items => items.sort((a, b) => a.orderIndex - b.orderIndex));

      const completionByAssignment = new Map<string, any>();
      (dbCompletions || []).forEach((completion: any) => {
        if (!completionByAssignment.has(completion.assignment_id)) {
          completionByAssignment.set(completion.assignment_id, completion);
        }
      });
      const setsByCompletion = new Map<string, any[]>();
      (dbCompletedSets || []).forEach((set: any) => {
        const existing = setsByCompletion.get(set.completion_id) || [];
        existing.push(set);
        setsByCompletion.set(set.completion_id, existing);
      });

      const mapLoggedExercises = (completionId?: string): LoggedExercise[] => {
        if (!completionId) return [];
        const grouped = new Map<string, LoggedExercise>();
        (setsByCompletion.get(completionId) || [])
          .sort((a: any, b: any) => a.set_number - b.set_number)
          .forEach((set: any) => {
            if (!grouped.has(set.exercise_id)) {
              grouped.set(set.exercise_id, {
                exerciseId: set.exercise_id,
                exerciseName: exerciseNameById.get(set.exercise_id) || 'Exercise',
                clientNotes: set.notes || '',
                sets: []
              });
            }
            grouped.get(set.exercise_id)!.sets.push({
              setNumber: set.set_number,
              actualReps: Number(set.actual_reps) || 0,
              actualWeightKg: Number(set.actual_weight) || 0,
              completed: Boolean(set.completed)
            });
          });
        return Array.from(grouped.values());
      };

      const scheduledWorkouts: ScheduledWorkout[] = (dbWorkouts || []).map((w: any) => {
        const completion = completionByAssignment.get(w.id);
        return {
          id: w.id,
          clientId: w.client_id,
          coachId: w.coach_id,
          title: w.workouts?.name || 'Assigned Workout',
          scheduledDate: w.scheduled_date,
          status: completion ? 'completed' : (w.status as any) || 'scheduled',
          exercises: workoutExercisesByWorkout.get(w.workout_id) || [],
          description: w.notes || w.workouts?.description || undefined,
          completedAt: completion?.completed_at,
          loggedData: completion ? mapLoggedExercises(completion.id) : undefined,
          overallRpe: completion?.perceived_difficulty == null ? undefined : Number(completion.perceived_difficulty),
          clientFeedback: completion?.notes || undefined,
          actualDurationMin: completion?.duration_min == null ? undefined : Number(completion.duration_min)
        };
      });

      // 6. Query Check-Ins
      const { data: dbCheckIns } = await supabase.from('check_ins').select('*');
      const checkIns: CheckIn[] = (dbCheckIns || []).map(c => {
        const resp = c.responses || {};
        return {
          id: c.id,
          scheduleId: c.schedule_id,
          clientId: c.client_id,
          coachId: c.coach_id,
          checkInDate: c.due_date,
          status: c.status,
          submittedAt: c.submitted_at || c.created_at,
          weightKg: Number(c.weight_kg ?? resp.weightKg ?? 0),
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
          logDate: p.log_date || (p.recorded_at ? new Date(p.recorded_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }) : new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })),
          stepCount: p.step_count || 0,
          notes: p.notes,
          loggedAt: p.recorded_at || p.created_at
        }));

      // 8. Query the shared food catalog. Meal-plan ingredients are stored separately.
      const { data: dbFoods, error: foodsError } = await supabase.from('food_catalog').select('*').order('name');
      if (foodsError) throw foodsError;
      const foods: Food[] = (dbFoods || []).map(mapFoodCatalogRow);

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
      const { data: dbLogs, error: logsError } = await supabase.from('daily_nutrition_logs').select(`
        id,
        client_id,
        log_date,
        total_calories,
        total_protein_g,
        total_carbs_g,
        total_fat_g,
        nutrition_log_meals (
          id,
          meal_name,
          nutrition_log_foods (
            id,
            food_name,
            quantity,
            unit,
            calories,
            protein_g,
            carbs_g,
            fat_g,
            created_at
          )
        )
      `);

      if (logsError) throw logsError;
      const foodLogs: FoodLogItem[] = (dbLogs || []).flatMap((l: any) => {
        const entries = (l.nutrition_log_meals || []).flatMap((meal: any) =>
          (meal.nutrition_log_foods || []).map((food: any) => ({
            id: food.id,
            clientId: l.client_id,
            logDate: l.log_date,
            mealName: meal.meal_name as FoodLogItem['mealName'],
            foodId: food.id,
            foodName: food.food_name,
            quantity: Number(food.quantity),
            unit: food.unit,
            calories: Number(food.calories) || 0,
            proteinG: Number(food.protein_g) || 0,
            carbsG: Number(food.carbs_g) || 0,
            fatG: Number(food.fat_g) || 0,
            loggedAt: food.created_at
          }))
        );
        if (entries.length > 0) return entries;
        return [{
          id: l.id,
          clientId: l.client_id,
          logDate: l.log_date,
          mealName: 'Lunch' as const,
          foodId: 'legacy-daily-log',
          foodName: 'Daily Nutrition Log Entry',
          quantity: 1,
          unit: 'portion',
          calories: Number(l.total_calories) || 0,
          proteinG: Number(l.total_protein_g) || 0,
          carbsG: Number(l.total_carbs_g) || 0,
          fatG: Number(l.total_fat_g) || 0,
          loggedAt: l.log_date + 'T12:00:00.000Z'
        }];
      });

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
          recipientId: m.recipient_id,
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

  // Persist the coach-client relationship in its own table, not inside check-in records.
  async assignClientToCoach(
    clientId: string,
    coachId: string,
    activateClient = false
  ): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) return { success: false, error: `Unable to verify the signed-in user: ${authError.message}` };
      if (!user) return { success: false, error: 'Sign in as an administrator to assign a coach.' };

      const { error } = await supabase.rpc('assign_client_to_coach', {
        p_client_id: clientId,
        p_coach_id: coachId,
        p_activate_client: activateClient
      });
      if (error) {
        console.error('Failed to save coach-client assignment:', error);
        return { success: false, error: error.message };
      }

      // The database generates the UUID for conversations. Never build IDs such as "conv-...".
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .select('id')
        .eq('coach_id', coachId)
        .eq('client_id', clientId)
        .single();
      if (conversationError || !conversation) {
        console.error('Coach assignment saved, but conversation lookup failed:', conversationError);
        return {
          success: false,
          error: conversationError?.message || 'Coach assignment saved, but its conversation could not be loaded.'
        };
      }
      return { success: true, conversationId: conversation.id };
    } catch (error) {
      console.error('Failed to save coach-client assignment:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  // Persist an assigned workout and its actual set performance.
  async saveWorkoutCompletion(
    workout: ScheduledWorkout,
    loggedData: LoggedExercise[],
    overallRpe?: number,
    clientFeedback?: string
  ): Promise<SupabaseWriteResult> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(workout.id);

    // Locally created one-off sessions use temporary IDs and cannot reference database assignments.
    if (!isUuid || getSupabaseConfig().isOfflineMode) {
      return {
        success: true,
        warning: 'This session is not linked to a saved Supabase assignment, so its log is available only in the current session.',
        persisted: false
      };
    }
    if (getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is unreachable. Reconnect before logging this assigned workout.' };
    }

    try {
      const { error } = await supabase.rpc('log_workout_completion', {
        p_assignment_id: workout.id,
        p_perceived_difficulty: overallRpe == null ? null : Math.round(overallRpe),
        p_notes: clientFeedback?.trim() || null,
        p_sets: loggedData.map(exercise => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          clientNotes: exercise.clientNotes || null,
          sets: exercise.sets.map(set => ({
            setNumber: set.setNumber,
            actualReps: set.actualReps,
            actualWeightKg: set.actualWeightKg,
            completed: set.completed
          }))
        }))
      });
      if (error) {
        console.error('Failed to save workout completion:', error);
        return { success: false, error: error.message };
      }
      return { success: true, persisted: true };
    } catch (error) {
      console.error('Failed to save workout completion:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  // Update only fields a signed-in user may edit on their own profile.
  // Account role, approval status, activation state, and email are deliberately excluded.
  async updateOwnProfile(profile: Partial<Profile>): Promise<boolean> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) return false;
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user || (profile.id && profile.id !== user.id)) return false;

      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (profile.fullName !== undefined) {
        const nameParts = profile.fullName.trim().split(/\s+/);
        payload.first_name = nameParts.shift() || '';
        payload.last_name = nameParts.join(' ');
      }
      if (profile.avatarUrl !== undefined) payload.avatar_url = profile.avatarUrl;
      if (profile.phone !== undefined) payload.phone = profile.phone;
      if (profile.bio !== undefined) payload.bio = profile.bio;
      if (profile.heightCm !== undefined) payload.height_cm = profile.heightCm;
      if (profile.currentWeightKg !== undefined) payload.current_weight_kg = profile.currentWeightKg;
      if (profile.targetWeightKg !== undefined) payload.target_weight_kg = profile.targetWeightKg;
      if (profile.goals !== undefined) {
        payload.fitness_goals = profile.goals.split(',').map(goal => goal.trim()).filter(Boolean);
      }

      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', user.id)
        .select('id')
        .maybeSingle();
      if (error || !updatedProfile) {
        if (error) console.error('Failed to update own profile:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to update own profile:', error);
      return false;
    }
  },

  // Insert or Upsert a single profile to Supabase
  async saveProfile(profile: Partial<Profile>): Promise<boolean> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) return false;
    try {
      const approvalStatus = profile.status === 'pending'
        ? 'pending'
        : profile.status === 'active'
          ? profile.role === 'client' ? 'approved' : 'not_applicable'
          : 'rejected';
      const payload: any = {
        id: profile.id,
        role: profile.role,
        email: profile.email,
        first_name: profile.fullName?.split(' ')[0] || profile.fullName,
        last_name: profile.fullName?.split(' ').slice(1).join(' ') || '',
        avatar_url: profile.avatarUrl,
        phone: profile.phone,
        approval_status: approvalStatus,
        bio: profile.bio,
        onboarding_completed: true,
        height_cm: profile.heightCm,
        current_weight_kg: profile.currentWeightKg,
        target_weight_kg: profile.targetWeightKg ?? null,
        fitness_goals: profile.goals
          ? profile.goals.split(',').map((goal: string) => goal.trim()).filter(Boolean)
          : [],
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
  async saveMessage(msg: Message): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { error } = await supabase.from('messages').insert({
        id: msg.id,
        conversation_id: msg.conversationId,
        sender_id: msg.senderId,
        recipient_id: msg.recipientId,
        content: msg.content,
        is_read: msg.isRead,
        created_at: msg.createdAt
      });
      if (error) {
        console.error('Failed to save message to Supabase:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to save message to Supabase:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  // Insert or Upsert a check-in
  async saveCheckIn(chk: CheckIn): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      let scheduleId = chk.scheduleId;
      if (!scheduleId) {
        const { data: schedule, error: scheduleError } = await supabase
          .from('check_in_schedules')
          .select('id')
          .eq('client_id', chk.clientId)
          .eq('coach_id', chk.coachId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (scheduleError) {
          console.error('Failed to find an active check-in schedule:', scheduleError);
          return { success: false, error: scheduleError.message };
        }
        scheduleId = schedule?.id;
      }
      if (!scheduleId) {
        return {
          success: false,
          error: 'Your coach must create an active check-in schedule before you can submit a check-in.'
        };
      }
      const checkInPayload = {
        schedule_id: scheduleId,
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
      };

      const query = chk.status === 'submitted'
        ? supabase.from('check_ins').insert({ id: chk.id, ...checkInPayload })
        : supabase.from('check_ins').update(checkInPayload).eq('id', chk.id);
      const { error } = await query;
      if (error) {
        console.error('Failed to save check-in to Supabase:', error);
        if (error.code === '23505') {
          return { success: false, error: 'A check-in for this client, coach, and day already exists.' };
        }
        return { success: false, error: error.message };
      }
      return { success: true, scheduleId };
    } catch (error) {
      console.error('Failed to save check-in to Supabase:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  async createCheckInSchedule(input: {
    clientId: string;
    frequency: CheckInFrequency;
    customIntervalDays?: number;
    dayOfWeek?: ProgramDayOfWeek;
  }): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) return { success: false, error: `Unable to verify the signed-in user: ${authError.message}` };
      if (!user) return { success: false, error: 'Sign in as the assigned coach to create a check-in schedule.' };
      if (input.frequency === 'custom' && (!input.customIntervalDays || input.customIntervalDays < 1)) {
        return { success: false, error: 'Custom check-in intervals must be at least 1 day.' };
      }
      const { error } = await supabase.from('check_in_schedules').insert({
        coach_id: user.id,
        client_id: input.clientId,
        frequency: input.frequency,
        custom_interval_days: input.frequency === 'custom' ? input.customIntervalDays : null,
        day_of_week: input.dayOfWeek ?? null,
        is_active: true,
        questions: []
      });
      if (error) {
        console.error('Failed to create check-in schedule:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to create check-in schedule:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  // Insert or Upsert a step record
  async markNotificationRead(notificationId: string): Promise<SupabaseWriteResult> {
    // Temporary client-generated notifications are not rows in the database.
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(notificationId)) {
      return { success: true, persisted: false };
    }
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) return { success: false, error: authError.message };
      if (!user) return { success: false, error: 'Sign in before updating notifications.' };
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id)
        .select('id')
        .maybeSingle();
      if (error) return { success: false, error: error.message };
      return { success: true, persisted: Boolean(data) };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown notification update error.' };
    }
  },

  async markAllNotificationsRead(): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) return { success: false, error: authError.message };
      if (!user) return { success: false, error: 'Sign in before updating notifications.' };
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('is_read', false);
      if (error) return { success: false, error: error.message };
      return { success: true, persisted: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown notification update error.' };
    }
  },

  async saveStepRecord(step: StepRecord): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { error } = await supabase.from('progress_records').upsert({
        id: step.id,
        client_id: step.clientId,
        log_date: step.logDate,
        recorded_at: step.loggedAt,
        record_type: 'steps',
        step_count: step.stepCount,
        notes: step.notes
      }, { onConflict: 'client_id,log_date' });
      if (error) {
        console.error('Failed to save step record to Supabase:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to save step record to Supabase:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  // Add an authenticated user's contribution to the shared food catalog.
  async saveFood(food: Food): Promise<{ success: boolean; food?: Food; error?: string }> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) return { success: false, error: `Unable to verify the signed-in user: ${authError.message}` };
      if (!user) return { success: false, error: 'Sign in before adding a food item.' };

      const { data, error } = await supabase.from('food_catalog').insert({
        id: food.id,
        name: food.name.trim(),
        brand: food.brand?.trim() || null,
        category: food.category,
        food_type: food.foodType || 'generic',
        barcode: food.barcode?.trim() || null,
        serving_size: food.servingSize,
        serving_unit: food.servingUnit.trim(),
        calories: food.calories,
        protein_g: food.proteinG,
        carbs_g: food.carbsG,
        fat_g: food.fatG,
        fiber_g: food.fiberG,
        notes: food.notes?.trim() || null,
        created_by: user.id
      }).select('*').single();

      if (error) {
        console.error('Failed to add food to shared catalog:', error);
        if (error.code === '23505') {
          return { success: false, error: 'That barcode is already registered. Search the food list for the existing item or leave the barcode blank for an unlabelled meal.' };
        }
        return { success: false, error: error.message };
      }
      return { success: true, food: mapFoodCatalogRow(data) };
    } catch (error) {
      console.error('Failed to add food to shared catalog:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  // Insert or Upsert a food log entry
  async saveFoodLog(log: FoodLogItem): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { error } = await supabase.rpc('log_food_item', {
        p_id: log.id,
        p_client_id: log.clientId,
        p_log_date: log.logDate,
        p_meal_name: log.mealName,
        p_food_name: log.foodName,
        p_quantity: log.quantity,
        p_unit: log.unit,
        p_calories: log.calories,
        p_protein_g: log.proteinG,
        p_carbs_g: log.carbsG,
        p_fat_g: log.fatG
      });
      if (error) {
        console.error('Failed to save food log to Supabase:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to save food log to Supabase:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
    }
  },

  async deleteFoodLog(id: string): Promise<SupabaseWriteResult> {
    if (getSupabaseConfig().isOfflineMode || getSupabaseReachableState() === false) {
      return { success: false, error: 'Supabase is not configured or is unreachable.' };
    }
    try {
      const { error } = await supabase.rpc('delete_food_log_item', { p_id: id });
      if (error) {
        console.error('Failed to delete food log from Supabase:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to delete food log from Supabase:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown Supabase error.' };
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
        category: ex.category,
        muscle_groups: [ex.muscleGroup, ...(ex.secondaryMuscles || [])],
        equipment: ex.equipment,
        instructions: ex.instructions.join('\n'),
        difficulty_level: 'intermediate',
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
