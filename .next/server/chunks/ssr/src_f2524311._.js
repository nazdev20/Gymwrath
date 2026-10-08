module.exports = [
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SUPABASE_ANON_KEY",
    ()=>SUPABASE_ANON_KEY,
    "SUPABASE_URL",
    ()=>SUPABASE_URL,
    "checkSupabaseConnection",
    ()=>checkSupabaseConnection,
    "getSupabaseConfig",
    ()=>getSupabaseConfig,
    "getSupabaseReachableState",
    ()=>getSupabaseReachableState,
    "setSupabaseReachableState",
    ()=>setSupabaseReachableState,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-ssr] (ecmascript)");
'use client';
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://cbcvhmvdaujhbquryaom.supabase.co") || '';
const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_hBItT31I4RBvcksW7tMRyw_kfEnFZbB") || '';
function getSupabaseConfig() {
    return {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
        isCustom: false,
        isOfflineMode: !supabaseUrl || !supabaseAnonKey
    };
}
const SUPABASE_URL = supabaseUrl;
const SUPABASE_ANON_KEY = supabaseAnonKey;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBrowserClient"])(supabaseUrl || 'http://127.0.0.1:54321', supabaseAnonKey || 'offline-placeholder-key', {
    db: {
        schema: 'fitness'
    },
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});
let endpointIsReachable = null;
function getSupabaseReachableState() {
    return endpointIsReachable;
}
function setSupabaseReachableState(reachable) {
    endpointIsReachable = reachable;
}
async function checkSupabaseConnection(overrideUrl = supabaseUrl, overrideKey = supabaseAnonKey) {
    const targetUrl = overrideUrl.trim().replace(/\/+$/, '');
    const targetKey = overrideKey.trim();
    if (!targetUrl || !targetKey) {
        return {
            connected: false,
            endpoint: targetUrl,
            error: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        };
    }
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), 6000);
        let response;
        try {
            response = await fetch(`${targetUrl}/auth/v1/health`, {
                headers: {
                    apikey: targetKey
                },
                signal: controller.signal
            });
        } finally{
            clearTimeout(timeoutId);
        }
        if (response.ok) {
            endpointIsReachable = true;
            return {
                connected: true,
                endpoint: targetUrl,
                statusText: 'Connected & active'
            };
        }
        endpointIsReachable = false;
        return {
            connected: false,
            endpoint: targetUrl,
            error: `HTTP ${response.status}: ${response.statusText}`
        };
    } catch (error) {
        endpointIsReachable = false;
        const message = error instanceof Error ? error.message : String(error);
        const isDomainError = message.includes('Failed to fetch') || message.includes('ERR_NAME_NOT_RESOLVED') || message.includes('NetworkError') || message.includes('aborted');
        return {
            connected: false,
            endpoint: targetUrl,
            isDomainError,
            error: isDomainError ? `The Supabase endpoint "${targetUrl}" is unreachable. Check the URL and project status.` : message
        };
    }
}
}),
"[project]/src/services/supabaseService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SupabaseService",
    ()=>SupabaseService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
const SupabaseService = {
    // Test connection to Supabase instance
    async testConnection (customUrl, customKey) {
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkSupabaseConnection"])(customUrl, customKey);
        return {
            success: res.connected,
            message: res.error || `Successfully connected to Supabase REST API at ${res.endpoint}`,
            isDomainError: res.isDomainError
        };
    },
    // Check which tables are created in the database
    async inspectTables () {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])();
        if (config.isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
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
        const results = await Promise.all(tableNames.map(async (name)=>{
            try {
                const { count, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from(name).select('*', {
                    count: 'exact',
                    head: true
                });
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
            } catch (e) {
                return {
                    tableName: name,
                    exists: false,
                    error: e?.message || 'Query error'
                };
            }
        }));
        return results;
    },
    // Fetch all domain entities directly from Supabase tables
    async loadAllDataFromSupabase () {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])();
        if (config.isOfflineMode) {
            return null;
        }
        // Verify connectivity first to prevent multiple unhandled DNS failures
        const conn = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["checkSupabaseConnection"])();
        if (!conn.connected) {
            console.warn(`[Supabase] Endpoint ${conn.endpoint} is not reachable: ${conn.error}`);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSupabaseReachableState"])(false);
            return null;
        }
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setSupabaseReachableState"])(true);
            // 1. Query Profiles
            const { data: dbProfiles, error: profErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('profiles').select('*');
            if (profErr || !dbProfiles) return null;
            // 2. Query Coach-Client Assignments
            const { data: dbAssignments } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('coach_client_assignments').select('*');
            const assignmentMap = new Map();
            if (dbAssignments) {
                dbAssignments.forEach((a)=>{
                    if (a.status === 'active') assignmentMap.set(a.client_id, a.coach_id);
                });
            }
            const profiles = dbProfiles.map((p)=>({
                    id: p.id,
                    email: p.email,
                    fullName: p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : p.email,
                    role: p.role || 'client',
                    status: p.approval_status === 'pending' ? 'pending' : p.approval_status === 'rejected' || !p.is_active ? 'suspended' : 'active',
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
            const profileMap = new Map();
            profiles.forEach((p)=>profileMap.set(p.id, p));
            // 3. Query Exercises
            const { data: dbExercises } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('exercises').select('*');
            const validMuscleGroups = [
                'Chest',
                'Back',
                'Shoulders',
                'Quads',
                'Hamstrings',
                'Glutes',
                'Calves',
                'Biceps',
                'Triceps',
                'Core',
                'Full Body',
                'Cardio'
            ];
            const validExerciseCategories = [
                'strength',
                'cardio',
                'flexibility',
                'balance',
                'plyometric',
                'other'
            ];
            const exercises = (dbExercises || []).map((e)=>({
                    id: e.id,
                    name: e.name,
                    description: e.description || e.name,
                    category: validExerciseCategories.includes(e.category) ? e.category : 'other',
                    muscleGroup: e.muscle_groups?.find((group)=>validMuscleGroups.includes(group)) || 'Chest',
                    secondaryMuscles: (e.muscle_groups || []).filter((group)=>validMuscleGroups.includes(group)).slice(1),
                    equipment: e.equipment || 'Dumbbell',
                    instructions: typeof e.instructions === 'string' ? e.instructions.split('\n') : e.instructions || [],
                    isGlobal: e.is_global ?? true,
                    createdBy: e.coach_id || 'system',
                    createdAt: e.created_at || new Date().toISOString()
                }));
            // 4. Query Training Programs
            const { data: dbPrograms } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('training_programs').select('*');
            const programs = (dbPrograms || []).map((p)=>({
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
            const { data: dbWorkouts } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('workout_assignments').select(`
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
            const scheduledWorkouts = (dbWorkouts || []).map((w)=>({
                    id: w.id,
                    clientId: w.client_id,
                    coachId: w.coach_id,
                    title: w.workouts?.name || 'Assigned Workout',
                    scheduledDate: w.scheduled_date,
                    status: w.status || 'scheduled',
                    exercises: [],
                    description: w.notes
                }));
            // 6. Query Check-Ins
            const { data: dbCheckIns } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('check_ins').select('*');
            const checkIns = (dbCheckIns || []).map((c)=>{
                const resp = c.responses || {};
                return {
                    id: c.id,
                    scheduleId: c.schedule_id,
                    clientId: c.client_id,
                    coachId: c.coach_id,
                    checkInDate: c.due_date,
                    status: c.status,
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
            const { data: dbProgress } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('progress_records').select('*');
            const stepRecords = (dbProgress || []).filter((p)=>p.step_count !== undefined && p.step_count !== null).map((p)=>({
                    id: p.id,
                    clientId: p.client_id,
                    logDate: p.recorded_at ? p.recorded_at.split('T')[0] : new Date().toISOString().split('T')[0],
                    stepCount: p.step_count || 0,
                    notes: p.notes,
                    loggedAt: p.recorded_at || p.created_at
                }));
            // 8. Query Foods
            const { data: dbMealFoods } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('meal_foods').select('*');
            const foods = (dbMealFoods || []).map((f)=>({
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
            const { data: dbNutrPlans } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('nutrition_plan_assignments').select(`
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
            const nutritionTargets = (dbNutrPlans || []).map((np)=>({
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
            const { data: dbLogs, error: logsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('daily_nutrition_logs').select(`
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
            const foodLogs = (dbLogs || []).flatMap((l)=>{
                const entries = (l.nutrition_log_meals || []).flatMap((meal)=>(meal.nutrition_log_foods || []).map((food)=>({
                            id: food.id,
                            clientId: l.client_id,
                            logDate: l.log_date,
                            mealName: meal.meal_name,
                            foodId: food.id,
                            foodName: food.food_name,
                            quantity: Number(food.quantity),
                            unit: food.unit,
                            calories: Number(food.calories) || 0,
                            proteinG: Number(food.protein_g) || 0,
                            carbsG: Number(food.carbs_g) || 0,
                            fatG: Number(food.fat_g) || 0,
                            loggedAt: food.created_at
                        })));
                if (entries.length > 0) return entries;
                return [
                    {
                        id: l.id,
                        clientId: l.client_id,
                        logDate: l.log_date,
                        mealName: 'Lunch',
                        foodId: 'legacy-daily-log',
                        foodName: 'Daily Nutrition Log Entry',
                        quantity: 1,
                        unit: 'portion',
                        calories: Number(l.total_calories) || 0,
                        proteinG: Number(l.total_protein_g) || 0,
                        carbsG: Number(l.total_carbs_g) || 0,
                        fatG: Number(l.total_fat_g) || 0,
                        loggedAt: l.log_date + 'T12:00:00.000Z'
                    }
                ];
            });
            // 11. Query Conversations & Messages
            const { data: dbConvs } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('conversations').select('*');
            const conversations = (dbConvs || []).map((c)=>{
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
            const { data: dbMessages } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('messages').select('*');
            const messages = (dbMessages || []).map((m)=>{
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
            const { data: dbNotifs } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('notifications').select('*');
            const notifications = (dbNotifs || []).map((n)=>({
                    id: n.id,
                    recipientId: n.user_id,
                    title: n.title,
                    message: n.body,
                    type: n.type || 'workout_assigned',
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
    async saveProfile (profile) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) return false;
        try {
            const approvalStatus = profile.status === 'pending' ? 'pending' : profile.status === 'active' ? profile.role === 'client' ? 'approved' : 'not_applicable' : 'rejected';
            const payload = {
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
                is_active: profile.status === 'active',
                updated_at: new Date().toISOString()
            };
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('profiles').upsert(payload, {
                onConflict: 'id'
            });
            return !error;
        } catch  {
            return false;
        }
    },
    // Insert or Upsert a message
    async saveMessage (msg) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
            return {
                success: false,
                error: 'Supabase is not configured or is unreachable.'
            };
        }
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('messages').insert({
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
                return {
                    success: false,
                    error: error.message
                };
            }
            return {
                success: true
            };
        } catch (error) {
            console.error('Failed to save message to Supabase:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Supabase error.'
            };
        }
    },
    // Insert or Upsert a check-in
    async saveCheckIn (chk) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
            return {
                success: false,
                error: 'Supabase is not configured or is unreachable.'
            };
        }
        try {
            let scheduleId = chk.scheduleId;
            if (!scheduleId) {
                const { data: schedule, error: scheduleError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('check_in_schedules').select('id').eq('client_id', chk.clientId).eq('coach_id', chk.coachId).eq('is_active', true).order('created_at', {
                    ascending: false
                }).limit(1).maybeSingle();
                if (scheduleError) {
                    console.error('Failed to find an active check-in schedule:', scheduleError);
                    return {
                        success: false,
                        error: scheduleError.message
                    };
                }
                scheduleId = schedule?.id;
            }
            if (!scheduleId) {
                return {
                    success: false,
                    error: 'Your coach must create an active check-in schedule before you can submit a check-in.'
                };
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('check_ins').upsert({
                id: chk.id,
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
            }, {
                onConflict: 'id'
            });
            if (error) {
                console.error('Failed to save check-in to Supabase:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
            return {
                success: true,
                scheduleId
            };
        } catch (error) {
            console.error('Failed to save check-in to Supabase:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Supabase error.'
            };
        }
    },
    async createCheckInSchedule (input) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
            return {
                success: false,
                error: 'Supabase is not configured or is unreachable.'
            };
        }
        try {
            const { data: { user }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (authError) return {
                success: false,
                error: `Unable to verify the signed-in user: ${authError.message}`
            };
            if (!user) return {
                success: false,
                error: 'Sign in as the assigned coach to create a check-in schedule.'
            };
            if (input.frequency === 'custom' && (!input.customIntervalDays || input.customIntervalDays < 1)) {
                return {
                    success: false,
                    error: 'Custom check-in intervals must be at least 1 day.'
                };
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('check_in_schedules').insert({
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
                return {
                    success: false,
                    error: error.message
                };
            }
            return {
                success: true
            };
        } catch (error) {
            console.error('Failed to create check-in schedule:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Supabase error.'
            };
        }
    },
    // Insert or Upsert a step record
    async saveStepRecord (step) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
            return {
                success: false,
                error: 'Supabase is not configured or is unreachable.'
            };
        }
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('progress_records').upsert({
                id: step.id,
                client_id: step.clientId,
                recorded_at: step.loggedAt,
                record_type: 'steps',
                step_count: step.stepCount,
                notes: step.notes
            }, {
                onConflict: 'id'
            });
            if (error) {
                console.error('Failed to save step record to Supabase:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
            return {
                success: true
            };
        } catch (error) {
            console.error('Failed to save step record to Supabase:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Supabase error.'
            };
        }
    },
    // Insert or Upsert a food log entry
    async saveFoodLog (log) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
            return {
                success: false,
                error: 'Supabase is not configured or is unreachable.'
            };
        }
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('log_food_item', {
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
                return {
                    success: false,
                    error: error.message
                };
            }
            return {
                success: true
            };
        } catch (error) {
            console.error('Failed to save food log to Supabase:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Supabase error.'
            };
        }
    },
    async deleteFoodLog (id) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
            return {
                success: false,
                error: 'Supabase is not configured or is unreachable.'
            };
        }
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('delete_food_log_item', {
                p_id: id
            });
            if (error) {
                console.error('Failed to delete food log from Supabase:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
            return {
                success: true
            };
        } catch (error) {
            console.error('Failed to delete food log from Supabase:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown Supabase error.'
            };
        }
    },
    // Insert or Upsert an exercise
    async saveExercise (ex) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode) {
            return {
                success: false,
                error: 'Supabase is in offline mode.'
            };
        }
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) {
            return {
                success: false,
                error: 'The Supabase endpoint is unreachable.'
            };
        }
        try {
            const { data: { user }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (authError) return {
                success: false,
                error: `Unable to verify the signed-in user: ${authError.message}`
            };
            if (!user) return {
                success: false,
                error: 'Sign in before saving an exercise.'
            };
            const coachId = user.id;
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('exercises').upsert({
                id: ex.id,
                coach_id: coachId,
                name: ex.name,
                description: ex.description,
                category: ex.category,
                muscle_groups: [
                    ex.muscleGroup,
                    ...ex.secondaryMuscles || []
                ],
                equipment: ex.equipment,
                instructions: ex.instructions.join('\n'),
                difficulty_level: 'intermediate',
                is_global: ex.isGlobal,
                created_at: ex.createdAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            });
            if (error) {
                console.error('Failed to save exercise to Supabase:', error);
                return {
                    success: false,
                    error: error.message
                };
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
}),
"[project]/src/context/AppContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppProvider",
    ()=>AppProvider,
    "useApp",
    ()=>useApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/supabaseService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
;
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const GUEST_PROFILE = {
    id: '',
    email: '',
    fullName: 'Guest',
    role: 'client',
    status: 'pending',
    avatarUrl: '',
    timezone: 'UTC',
    createdAt: ''
};
const AppProvider = ({ children, initialUserId = null, initialProfile = null })=>{
    const [allProfiles, setAllProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialProfile ? [
        initialProfile
    ] : []);
    const [currentUserId, setCurrentUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialUserId || '');
    const [exercises, setExercises] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [programs, setPrograms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [scheduledWorkouts, setScheduledWorkouts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [checkIns, setCheckIns] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stepRecords, setStepRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [foods, setFoods] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nutritionTargets, setNutritionTargets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mealPlans, setMealPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [foodLogs, setFoodLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Supabase Loading & Connectivity State
    const [isLoadingSupabase, setIsLoadingSupabase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSupabaseConnected, setIsSupabaseConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [supabaseAuthUserId, setSupabaseAuthUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Navigation & Modals
    const [activeView, setActiveView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    const [selectedClientId, setSelectedClientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeWorkoutModalId, setActiveWorkoutModalId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeCheckInReviewId, setActiveCheckInReviewId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load application records only after Supabase Auth identifies the current user.
    const loadFromSupabase = async (authenticatedUserId = supabaseAuthUserId)=>{
        if (!authenticatedUserId) return false;
        setIsLoadingSupabase(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].loadAllDataFromSupabase();
            const authenticatedProfile = result?.profiles.find((profile)=>profile.id === authenticatedUserId);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        supabaseAuthUserId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let isMounted = true;
        const applyAuthUser = (userId)=>{
            if (!isMounted) return;
            setSupabaseAuthUserId(userId);
            setCurrentUserId(userId || '');
        };
        void __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession().then(({ data, error })=>{
            if (error) {
                console.error('Failed to restore Supabase session:', error);
                return;
            }
            applyAuthUser(data.session?.user.id || null);
        });
        const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange((_event, session)=>{
            applyAuthUser(session?.user.id || null);
        });
        return ()=>{
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);
    const signInWithSupabase = async (email, password)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
            email,
            password
        });
        if (error) return {
            success: false,
            error: error.message
        };
        if (!data.user) return {
            success: false,
            error: 'Supabase did not return a user for this session.'
        };
        setSupabaseAuthUserId(data.user.id);
        setCurrentUserId(data.user.id);
        const loaded = await loadFromSupabase(data.user.id);
        if (!loaded) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
            setSupabaseAuthUserId(null);
            return {
                success: false,
                error: 'Signed in, but no profile was found. Confirm the fitness schema setup and profile row for this account.'
            };
        }
        return {
            success: true
        };
    };
    const signUpWithSupabase = async (name, email, password, goals)=>{
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    fitness_goals: goals || ''
                }
            }
        });
        if (error) return {
            success: false,
            error: error.message
        };
        if (!data.user) return {
            success: false,
            error: 'Supabase did not create a user.'
        };
        if (!data.session) {
            return {
                success: true,
                requiresEmailConfirmation: true
            };
        }
        setSupabaseAuthUserId(data.user.id);
        setCurrentUserId(data.user.id);
        const loaded = await loadFromSupabase(data.user.id);
        if (!loaded) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
            setSupabaseAuthUserId(null);
            return {
                success: false,
                error: 'The account was created, but its fitness profile could not be loaded. Contact an administrator.'
            };
        }
        return {
            success: true
        };
    };
    const signOutFromSupabase = async ()=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        if (error) return {
            success: false,
            error: error.message
        };
        setSupabaseAuthUserId(null);
        return {
            success: true
        };
    };
    // Sync to storage
    const currentUser = allProfiles.find((p)=>p.id === currentUserId) || GUEST_PROFILE;
    const updateProfile = (updated)=>{
        setAllProfiles((prev)=>prev.map((p)=>p.id === currentUser.id ? {
                    ...p,
                    ...updated
                } : p));
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveProfile({
            ...currentUser,
            ...updated
        });
    };
    const approveUser = (userId, assignedCoachId)=>{
        setAllProfiles((prev)=>prev.map((p)=>{
                if (p.id === userId) {
                    const updated = {
                        ...p,
                        status: 'active',
                        assignedCoachId
                    };
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveProfile(updated);
                    return updated;
                }
                return p;
            }));
        const targetUser = allProfiles.find((p)=>p.id === userId);
        const coachUser = allProfiles.find((p)=>p.id === assignedCoachId);
        if (targetUser && coachUser) {
            const convId = `conv-${coachUser.id}-${targetUser.id}`;
            if (!conversations.some((c)=>c.id === convId)) {
                const newConv = {
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
                setConversations((prev)=>[
                        newConv,
                        ...prev
                    ]);
                // Add welcome message
                const welcomeMsg = {
                    id: `msg-${Date.now()}`,
                    conversationId: convId,
                    senderId: coachUser.id,
                    recipientId: targetUser.id,
                    senderName: coachUser.fullName,
                    senderRole: 'coach',
                    content: `Welcome to the team ${targetUser.fullName}! I've been assigned as your primary coach. Take a look at your dashboard and let me know if you have any questions before we get started.`,
                    isRead: false,
                    createdAt: new Date().toISOString()
                };
                setMessages((prev)=>[
                        ...prev,
                        welcomeMsg
                    ]);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveMessage(welcomeMsg);
            }
            setNotifications((prev)=>[
                    {
                        id: `notif-appr-${Date.now()}`,
                        recipientId: targetUser.id,
                        title: 'Account Approved!',
                        message: `Your account has been approved and Coach ${coachUser.fullName} has been assigned to you.`,
                        type: 'account_approved',
                        linkTarget: {
                            view: 'dashboard'
                        },
                        isRead: false,
                        createdAt: new Date().toISOString()
                    },
                    ...prev
                ]);
        }
    };
    const suspendUser = (userId)=>{
        setAllProfiles((prev)=>prev.map((p)=>p.id === userId ? {
                    ...p,
                    status: 'suspended'
                } : p));
        const target = allProfiles.find((p)=>p.id === userId);
        if (target) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveProfile({
            ...target,
            status: 'suspended'
        });
    };
    const activateUser = (userId)=>{
        setAllProfiles((prev)=>prev.map((p)=>p.id === userId ? {
                    ...p,
                    status: 'active'
                } : p));
        const target = allProfiles.find((p)=>p.id === userId);
        if (target) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveProfile({
            ...target,
            status: 'active'
        });
    };
    const assignCoach = (clientId, coachId)=>{
        setAllProfiles((prev)=>prev.map((p)=>p.id === clientId ? {
                    ...p,
                    assignedCoachId: coachId
                } : p));
        const target = allProfiles.find((p)=>p.id === clientId);
        if (target) __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveProfile({
            ...target,
            assignedCoachId: coachId
        });
    };
    const addExercise = async (exercise)=>{
        if (!supabaseAuthUserId) {
            return {
                success: false,
                error: 'Sign in before saving an exercise.'
            };
        }
        const newEx = {
            ...exercise,
            createdBy: supabaseAuthUserId,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveExercise(newEx);
        if (result.success) setExercises((prev)=>[
                newEx,
                ...prev
            ]);
        return result;
    };
    const updateExercise = (id, updates)=>{
        setExercises((prev)=>prev.map((e)=>e.id === id ? {
                    ...e,
                    ...updates
                } : e));
    };
    const deleteExercise = (id)=>{
        setExercises((prev)=>prev.filter((e)=>e.id !== id));
    };
    const createProgram = (program)=>{
        const newProg = {
            ...program,
            id: `prog-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setPrograms((prev)=>[
                newProg,
                ...prev
            ]);
        return newProg;
    };
    const assignProgramToClient = (programId, clientId, startDateStr)=>{
        const prog = programs.find((p)=>p.id === programId);
        if (!prog) return;
        const newWorkouts = [];
        (prog.workouts || []).forEach((pw)=>{
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
        setScheduledWorkouts((prev)=>[
                ...prev,
                ...newWorkouts
            ]);
        setNotifications((prev)=>[
                {
                    id: `notif-prog-${Date.now()}`,
                    recipientId: clientId,
                    title: 'New Training Program Assigned',
                    message: `Coach ${currentUser.fullName} assigned "${prog.name}" starting ${startDateStr}.`,
                    type: 'workout_assigned',
                    linkTarget: {
                        view: 'calendar'
                    },
                    isRead: false,
                    createdAt: new Date().toISOString()
                },
                ...prev
            ]);
    };
    const scheduleWorkout = (workout)=>{
        const newWorkout = {
            ...workout,
            id: `sch-${Date.now()}`
        };
        setScheduledWorkouts((prev)=>[
                ...prev,
                newWorkout
            ]);
        return newWorkout;
    };
    const logWorkoutCompletion = (workoutId, loggedData, overallRpe, clientFeedback)=>{
        setScheduledWorkouts((prev)=>prev.map((w)=>{
                if (w.id === workoutId) {
                    return {
                        ...w,
                        status: 'completed',
                        completedAt: new Date().toISOString(),
                        overallRpe: overallRpe || 8,
                        clientFeedback,
                        loggedData
                    };
                }
                return w;
            }));
        const workout = scheduledWorkouts.find((w)=>w.id === workoutId);
        if (workout && workout.coachId) {
            setNotifications((prev)=>[
                    {
                        id: `notif-comp-${Date.now()}`,
                        recipientId: workout.coachId,
                        title: 'Workout Completed',
                        message: `${currentUser.fullName} completed "${workout.title}".`,
                        type: 'workout_completed',
                        linkTarget: {
                            view: 'calendar'
                        },
                        isRead: false,
                        createdAt: new Date().toISOString()
                    },
                    ...prev
                ]);
        }
    };
    const submitCheckIn = async (checkInData)=>{
        const newCheckIn = {
            ...checkInData,
            id: crypto.randomUUID(),
            status: 'submitted',
            submittedAt: new Date().toISOString()
        };
        const saveResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveCheckIn(newCheckIn);
        if (!saveResult.success) return saveResult;
        setCheckIns((prev)=>[
                {
                    ...newCheckIn,
                    scheduleId: saveResult.scheduleId
                },
                ...prev
            ]);
        if (checkInData.weightKg) {
            setAllProfiles((prev)=>prev.map((p)=>p.id === currentUser.id ? {
                        ...p,
                        currentWeightKg: checkInData.weightKg
                    } : p));
        }
        if (checkInData.coachId) {
            setNotifications((prev)=>[
                    {
                        id: `notif-chk-${Date.now()}`,
                        recipientId: checkInData.coachId,
                        title: 'New Check-In Submitted',
                        message: `${currentUser.fullName} submitted a check-in for review.`,
                        type: 'checkin_submitted',
                        linkTarget: {
                            view: 'checkins'
                        },
                        isRead: false,
                        createdAt: new Date().toISOString()
                    },
                    ...prev
                ]);
        }
        return {
            success: true
        };
    };
    const reviewCheckIn = async (checkInId, coachFeedback)=>{
        const existingCheckIn = checkIns.find((checkIn)=>checkIn.id === checkInId);
        if (!existingCheckIn) return {
            success: false,
            error: 'Check-in not found.'
        };
        const updatedChk = {
            ...existingCheckIn,
            status: 'reviewed',
            coachFeedback,
            reviewedAt: new Date().toISOString()
        };
        const saveResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveCheckIn(updatedChk);
        if (!saveResult.success) return saveResult;
        setCheckIns((prev)=>prev.map((checkIn)=>checkIn.id === checkInId ? updatedChk : checkIn));
        {
            setNotifications((prev)=>[
                    {
                        id: `notif-rev-${Date.now()}`,
                        recipientId: updatedChk.clientId,
                        title: 'Check-In Reviewed',
                        message: `Coach ${currentUser.fullName} reviewed your check-in and left personalized feedback.`,
                        type: 'checkin_reviewed',
                        linkTarget: {
                            view: 'checkins'
                        },
                        isRead: false,
                        createdAt: new Date().toISOString()
                    },
                    ...prev
                ]);
        }
        return {
            success: true
        };
    };
    const createCheckInSchedule = (input)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].createCheckInSchedule(input);
    const logDailySteps = async (dateStr, stepCount, notes)=>{
        const existing = stepRecords.find((s)=>s.clientId === currentUser.id && s.logDate === dateStr);
        let recordToSave;
        if (existing) {
            recordToSave = {
                ...existing,
                stepCount,
                notes,
                loggedAt: new Date().toISOString()
            };
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
        const saveResult = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveStepRecord(recordToSave);
        if (!saveResult.success) return saveResult;
        setStepRecords((prev)=>existing ? prev.map((record)=>record.id === existing.id ? recordToSave : record) : [
                recordToSave,
                ...prev
            ]);
        return {
            success: true
        };
    };
    const addFood = (food)=>{
        const newFood = {
            ...food,
            id: `food-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setFoods((prev)=>[
                newFood,
                ...prev
            ]);
        return newFood;
    };
    const setNutritionTarget = (target)=>{
        const newTarget = {
            ...target,
            id: `targ-${Date.now()}`
        };
        setNutritionTargets((prev)=>[
                newTarget,
                ...prev.filter((t)=>!(t.clientId === target.clientId && t.effectiveDate === target.effectiveDate))
            ]);
    };
    const saveMealPlan = (plan)=>{
        const newPlan = {
            ...plan,
            id: `mp-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setMealPlans((prev)=>[
                newPlan,
                ...prev
            ]);
        return newPlan;
    };
    const logFoodItem = async (item)=>{
        const newItem = {
            ...item,
            id: crypto.randomUUID(),
            loggedAt: new Date().toISOString()
        };
        const saved = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveFoodLog(newItem);
        if (!saved.success) return saved;
        setFoodLogs((prev)=>[
                newItem,
                ...prev
            ]);
        return {
            success: true
        };
    };
    const deleteFoodLogItem = async (id)=>{
        const deleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].deleteFoodLog(id);
        if (!deleted.success) return deleted;
        setFoodLogs((prev)=>prev.filter((f)=>f.id !== id));
        return {
            success: true
        };
    };
    const sendMessage = async (recipientId, content)=>{
        const thread = conversations.find((conversation)=>conversation.coachId === currentUser.id && conversation.clientId === recipientId || conversation.clientId === currentUser.id && conversation.coachId === recipientId);
        if (!thread) return {
            success: false,
            error: 'There is no active conversation with this user.'
        };
        const newMsg = {
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
        const saved = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveMessage(newMsg);
        if (!saved.success) return {
            success: false,
            error: saved.error || 'Message was not saved to Supabase.'
        };
        setMessages((prev)=>[
                ...prev,
                newMsg
            ]);
        setConversations((prev)=>prev.map((c)=>{
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
        return {
            success: true
        };
    };
    const markConversationRead = (conversationId)=>{
        setMessages((prev)=>prev.map((m)=>m.conversationId === conversationId && m.senderId !== currentUser.id ? {
                    ...m,
                    isRead: true
                } : m));
        setConversations((prev)=>prev.map((c)=>{
                if (c.id === conversationId) {
                    return currentUser.role === 'coach' ? {
                        ...c,
                        unreadCountCoach: 0
                    } : {
                        ...c,
                        unreadCountClient: 0
                    };
                }
                return c;
            }));
    };
    const markNotificationRead = (id)=>{
        setNotifications((prev)=>prev.map((n)=>n.id === id ? {
                    ...n,
                    isRead: true
                } : n));
    };
    const markAllNotificationsRead = ()=>{
        setNotifications((prev)=>prev.map((n)=>({
                    ...n,
                    isRead: true
                })));
    };
    const getAssignedClients = ()=>{
        if (currentUser.role === 'admin') {
            return allProfiles.filter((p)=>p.role === 'client');
        }
        if (currentUser.role === 'coach') {
            return allProfiles.filter((p)=>p.role === 'client' && p.assignedCoachId === currentUser.id);
        }
        return [];
    };
    const getCoachForCurrentClient = ()=>{
        if (currentUser.role === 'client' && currentUser.assignedCoachId) {
            return allProfiles.find((p)=>p.id === currentUser.assignedCoachId);
        }
        return undefined;
    };
    const unreadNotificationCount = notifications.filter((n)=>n.recipientId === currentUser.id && !n.isRead).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppContext.Provider, {
        value: {
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
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AppContext.tsx",
        lineNumber: 784,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useApp = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
}),
"[project]/src/data/fitnessSchemaSql.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Fitness Coaching Platform Database Schema SQL
 * Derived from ER Diagram: Users & Assignments, Workout & Training, Nutrition, Check-Ins, Progress, Messaging, Notifications & Settings
 */ __turbopack_context__.s([
    "FITNESS_SCHEMA_DDL_SQL",
    ()=>FITNESS_SCHEMA_DDL_SQL,
    "SCHEMA_TABLES",
    ()=>SCHEMA_TABLES
]);
const SCHEMA_TABLES = [
    // 1. Users & Assignments
    {
        name: 'profiles',
        module: 'Users & Assignments',
        description: 'Core user profiles for athletes, coaches, and administrators',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true,
                description: 'Primary Key'
            },
            {
                name: 'role',
                type: 'VARCHAR(20)',
                description: 'admin | coach | client'
            },
            {
                name: 'email',
                type: 'VARCHAR(255)',
                description: 'Unique user email'
            },
            {
                name: 'first_name',
                type: 'VARCHAR(100)'
            },
            {
                name: 'last_name',
                type: 'VARCHAR(100)'
            },
            {
                name: 'avatar_url',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'phone',
                type: 'VARCHAR(50)',
                nullable: true
            },
            {
                name: 'date_of_birth',
                type: 'DATE',
                nullable: true
            },
            {
                name: 'gender',
                type: 'TEXT',
                nullable: true,
                description: 'male | female | other | prefer_not_to_say'
            },
            {
                name: 'approval_status',
                type: 'TEXT',
                description: 'not_applicable | pending | approved | rejected'
            },
            {
                name: 'specializations',
                type: 'TEXT[]',
                nullable: true
            },
            {
                name: 'bio',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'certifications',
                type: 'TEXT[]',
                nullable: true
            },
            {
                name: 'years_of_experience',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'onboarding_completed',
                type: 'BOOLEAN'
            },
            {
                name: 'fitness_goals',
                type: 'TEXT[]',
                nullable: true
            },
            {
                name: 'medical_conditions',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'height_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'current_weight_kg',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'is_active',
                type: 'BOOLEAN'
            },
            {
                name: 'last_login_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'coach_client_assignments',
        module: 'Users & Assignments',
        description: 'Active and historical coach-to-client relationships',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'status',
                type: 'TEXT',
                description: 'pending | active | rejected | inactive | suspended | archived'
            },
            {
                name: 'requested_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'responded_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'deactivated_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    // 2. Workout & Training
    {
        name: 'exercises',
        module: 'Workout & Training',
        description: 'Master exercise movement database with form cues',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id',
                nullable: true
            },
            {
                name: 'name',
                type: 'VARCHAR(255)'
            },
            {
                name: 'description',
                type: 'TEXT'
            },
            {
                name: 'category',
                type: 'TEXT',
                nullable: true,
                description: 'strength | cardio | flexibility | balance | plyometric | other'
            },
            {
                name: 'muscle_groups',
                type: 'TEXT[]'
            },
            {
                name: 'equipment',
                type: 'VARCHAR(100)'
            },
            {
                name: 'instructions',
                type: 'TEXT'
            },
            {
                name: 'difficulty_level',
                type: 'TEXT',
                nullable: true,
                description: 'beginner | intermediate | advanced'
            },
            {
                name: 'is_global',
                type: 'BOOLEAN'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'workouts',
        module: 'Workout & Training',
        description: 'Prescribed training session templates',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'name',
                type: 'VARCHAR(255)'
            },
            {
                name: 'description',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'type',
                type: 'TEXT',
                nullable: true,
                description: 'strength | cardio | flexibility | hiit | mixed | other'
            },
            {
                name: 'estimated_duration_min',
                type: 'INTEGER'
            },
            {
                name: 'difficulty_level',
                type: 'TEXT',
                nullable: true,
                description: 'beginner | intermediate | advanced'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'workout_exercises',
        module: 'Workout & Training',
        description: 'Ordered exercises nested inside a workout',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'workout_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'workouts.id'
            },
            {
                name: 'exercise_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'exercises.id'
            },
            {
                name: 'order_index',
                type: 'INTEGER'
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'exercise_set_templates',
        module: 'Workout & Training',
        description: 'Prescribed set targets (reps, weight, RPE, rest) for each exercise',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'workout_exercise_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'workout_exercises.id'
            },
            {
                name: 'set_number',
                type: 'INTEGER'
            },
            {
                name: 'target_reps',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'target_weight',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'weight_unit',
                type: 'TEXT',
                nullable: true,
                description: 'kg | lbs'
            },
            {
                name: 'target_duration_sec',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'rest_period_sec',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'instructions',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'training_programs',
        module: 'Workout & Training',
        description: 'Multi-week macrocycle and mesocycle training programs',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'name',
                type: 'VARCHAR(255)'
            },
            {
                name: 'description',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'duration_weeks',
                type: 'INTEGER'
            },
            {
                name: 'difficulty_level',
                type: 'TEXT',
                nullable: true,
                description: 'beginner | intermediate | advanced'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'program_workouts',
        module: 'Workout & Training',
        description: 'Mapping of workouts to program weeks and training days',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'program_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'training_programs.id'
            },
            {
                name: 'workout_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'workouts.id'
            },
            {
                name: 'week_number',
                type: 'INTEGER'
            },
            {
                name: 'day_of_week',
                type: 'INTEGER',
                description: '0 = Sunday through 6 = Saturday'
            },
            {
                name: 'order_index',
                type: 'INTEGER'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'program_assignments',
        module: 'Workout & Training',
        description: 'Assigned periodized training blocks to athletes',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'program_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'training_programs.id'
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'start_date',
                type: 'DATE'
            },
            {
                name: 'end_date',
                type: 'DATE',
                nullable: true
            },
            {
                name: 'status',
                type: 'TEXT',
                description: 'active | paused | completed | cancelled'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'workout_assignments',
        module: 'Workout & Training',
        description: 'Calendar date workout schedule for athletes',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'workout_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'workouts.id'
            },
            {
                name: 'program_assignment_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'program_assignments.id',
                nullable: true
            },
            {
                name: 'scheduled_date',
                type: 'DATE'
            },
            {
                name: 'status',
                type: 'TEXT',
                description: 'scheduled | due | completed | missed | skipped'
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'workout_completions',
        module: 'Workout & Training',
        description: 'Actual logged workout performance sessions',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'assignment_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'workout_assignments.id'
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'completed_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'duration_min',
                type: 'INTEGER'
            },
            {
                name: 'perceived_difficulty',
                type: 'INTEGER',
                nullable: true,
                description: '1 through 10'
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'coach_feedback',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'coach_feedback_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'completed_exercise_sets',
        module: 'Workout & Training',
        description: 'Actual sets, weights lifted, reps, and RPE executed',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'completion_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'workout_completions.id'
            },
            {
                name: 'exercise_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'exercises.id'
            },
            {
                name: 'set_number',
                type: 'INTEGER'
            },
            {
                name: 'actual_reps',
                type: 'INTEGER'
            },
            {
                name: 'actual_weight',
                type: 'NUMERIC'
            },
            {
                name: 'weight_unit',
                type: 'TEXT',
                nullable: true,
                description: 'kg | lbs'
            },
            {
                name: 'actual_duration_sec',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'completed',
                type: 'BOOLEAN'
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    // 3. Nutrition
    {
        name: 'nutrition_plans',
        module: 'Nutrition',
        description: 'Prescribed dietary macro targets and meal templates',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'name',
                type: 'VARCHAR(255)'
            },
            {
                name: 'description',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'target_calories',
                type: 'NUMERIC'
            },
            {
                name: 'target_protein_g',
                type: 'NUMERIC'
            },
            {
                name: 'target_carbs_g',
                type: 'NUMERIC'
            },
            {
                name: 'target_fat_g',
                type: 'NUMERIC'
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'nutrition_plan_meals',
        module: 'Nutrition',
        description: 'Meals defined within a nutrition plan',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'plan_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'nutrition_plans.id'
            },
            {
                name: 'meal_name',
                type: 'VARCHAR(100)'
            },
            {
                name: 'meal_order',
                type: 'INTEGER'
            },
            {
                name: 'description',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'target_calories',
                type: 'NUMERIC'
            },
            {
                name: 'target_protein_g',
                type: 'NUMERIC'
            },
            {
                name: 'target_carbs_g',
                type: 'NUMERIC'
            },
            {
                name: 'target_fat_g',
                type: 'NUMERIC'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'meal_foods',
        module: 'Nutrition',
        description: 'Individual food items and portions within a planned meal',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'plan_meal_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'nutrition_plan_meals.id'
            },
            {
                name: 'food_name',
                type: 'VARCHAR(255)'
            },
            {
                name: 'quantity',
                type: 'NUMERIC'
            },
            {
                name: 'unit',
                type: 'VARCHAR(50)'
            },
            {
                name: 'calories',
                type: 'NUMERIC'
            },
            {
                name: 'protein_g',
                type: 'NUMERIC'
            },
            {
                name: 'carbs_g',
                type: 'NUMERIC'
            },
            {
                name: 'fat_g',
                type: 'NUMERIC'
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'nutrition_plan_assignments',
        module: 'Nutrition',
        description: 'Client nutrition plan assignments with individual adjustments',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'plan_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'nutrition_plans.id'
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'start_date',
                type: 'DATE'
            },
            {
                name: 'end_date',
                type: 'DATE',
                nullable: true
            },
            {
                name: 'status',
                type: 'VARCHAR(30)'
            },
            {
                name: 'custom_target_calories',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'custom_target_protein_g',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'custom_target_carbs_g',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'custom_target_fat_g',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'daily_nutrition_logs',
        module: 'Nutrition',
        description: 'Daily food tracking aggregations and adherence rating',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'log_date',
                type: 'DATE'
            },
            {
                name: 'total_calories',
                type: 'NUMERIC'
            },
            {
                name: 'total_protein_g',
                type: 'NUMERIC'
            },
            {
                name: 'total_carbs_g',
                type: 'NUMERIC'
            },
            {
                name: 'total_fat_g',
                type: 'NUMERIC'
            },
            {
                name: 'adherence_rating',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'adherence_notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'nutrition_log_meals',
        module: 'Nutrition',
        description: 'Meals logged by an athlete on a specific day',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'daily_log_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'daily_nutrition_logs.id'
            },
            {
                name: 'meal_name',
                type: 'VARCHAR(100)'
            },
            {
                name: 'meal_order',
                type: 'INTEGER'
            },
            {
                name: 'consumed_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'nutrition_log_foods',
        module: 'Nutrition',
        description: 'Foods consumed inside a logged meal',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'log_meal_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'nutrition_log_meals.id'
            },
            {
                name: 'food_name',
                type: 'VARCHAR(255)'
            },
            {
                name: 'quantity',
                type: 'NUMERIC'
            },
            {
                name: 'unit',
                type: 'VARCHAR(50)'
            },
            {
                name: 'calories',
                type: 'NUMERIC'
            },
            {
                name: 'protein_g',
                type: 'NUMERIC'
            },
            {
                name: 'carbs_g',
                type: 'NUMERIC'
            },
            {
                name: 'fat_g',
                type: 'NUMERIC'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    // 4. Check-Ins
    {
        name: 'check_in_schedules',
        module: 'Check-Ins',
        description: 'Automated recurring check-in configuration for clients',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'frequency',
                type: 'TEXT',
                description: 'daily | weekly | biweekly | monthly | custom'
            },
            {
                name: 'custom_interval_days',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'day_of_week',
                type: 'INTEGER',
                nullable: true,
                description: '0 = Sunday through 6 = Saturday'
            },
            {
                name: 'time_of_day',
                type: 'TIME',
                nullable: true
            },
            {
                name: 'is_active',
                type: 'BOOLEAN'
            },
            {
                name: 'questions',
                type: 'JSONB',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'check_ins',
        module: 'Check-Ins',
        description: 'Submitted athlete check-in entries with coach review & feedback',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'schedule_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'check_in_schedules.id'
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'due_date',
                type: 'DATE'
            },
            {
                name: 'status',
                type: 'TEXT',
                description: 'pending | submitted | missed | reviewed'
            },
            {
                name: 'submitted_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'responses',
                type: 'JSONB',
                nullable: true
            },
            {
                name: 'weight_kg',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'coach_feedback',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'coach_reviewed_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    // 5. Progress
    {
        name: 'progress_records',
        module: 'Progress',
        description: 'Anthropometric measurements, daily steps, and body composition',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'recorded_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'record_type',
                type: 'TEXT',
                description: 'weight | measurement | steps | photo | general'
            },
            {
                name: 'weight_kg',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'chest_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'waist_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'hips_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'bicep_left_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'bicep_right_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'thigh_left_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'thigh_right_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'calf_left_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'calf_right_cm',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'step_count',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'body_fat_percentage',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'notes',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'progress_photos',
        module: 'Progress',
        description: 'Physique check-in photos with pose tagging',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'progress_record_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'progress_records.id',
                nullable: true
            },
            {
                name: 'storage_path',
                type: 'TEXT'
            },
            {
                name: 'photo_type',
                type: 'TEXT',
                nullable: true,
                description: 'front | side | back | other'
            },
            {
                name: 'caption',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'uploaded_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    // 6. Messaging
    {
        name: 'conversations',
        module: 'Messaging',
        description: 'Thread between coach and client',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'coach_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'client_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'last_message_at',
                type: 'TIMESTAMPTZ'
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'messages',
        module: 'Messaging',
        description: 'Chat messages with timestamps and read status',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'conversation_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'conversations.id'
            },
            {
                name: 'sender_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'recipient_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'content',
                type: 'TEXT'
            },
            {
                name: 'is_read',
                type: 'BOOLEAN'
            },
            {
                name: 'read_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    // 7. Notifications & Settings
    {
        name: 'notifications',
        module: 'Notifications & Settings',
        description: 'Real-time alert notifications for athletes and coaches',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'user_id',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id'
            },
            {
                name: 'type',
                type: 'VARCHAR(100)'
            },
            {
                name: 'title',
                type: 'VARCHAR(255)'
            },
            {
                name: 'body',
                type: 'TEXT'
            },
            {
                name: 'data',
                type: 'JSONB',
                nullable: true
            },
            {
                name: 'is_read',
                type: 'BOOLEAN'
            },
            {
                name: 'read_at',
                type: 'TIMESTAMPTZ',
                nullable: true
            },
            {
                name: 'created_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    },
    {
        name: 'system_settings',
        module: 'Notifications & Settings',
        description: 'Global and tenant configuration parameters',
        columns: [
            {
                name: 'id',
                type: 'UUID',
                isPk: true
            },
            {
                name: 'key',
                type: 'VARCHAR(100)',
                description: 'Unique setting key'
            },
            {
                name: 'value',
                type: 'JSONB'
            },
            {
                name: 'description',
                type: 'TEXT',
                nullable: true
            },
            {
                name: 'updated_by',
                type: 'UUID',
                isFk: true,
                fkTarget: 'profiles.id',
                nullable: true
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMPTZ'
            }
        ]
    }
];
const FITNESS_SCHEMA_DDL_SQL = `-- ====================================================================
-- FITNESS COACHING PLATFORM - SUPABASE POSTGRESQL SCHEMA DDL
-- Generated directly from the ER Diagram
-- After running, add "fitness" to Supabase's exposed API schemas in the
-- Supabase dashboard. This script configures schema grants and role-aware RLS.
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE SCHEMA IF NOT EXISTS fitness;

-- --------------------------------------------------------------------
-- 1. USERS & ASSIGNMENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.profiles (
  id UUID PRIMARY KEY,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'coach', 'client')),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(50),
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  approval_status TEXT NOT NULL DEFAULT 'not_applicable' CHECK (approval_status IN ('not_applicable', 'pending', 'approved', 'rejected')),
  specializations TEXT[],
  bio TEXT,
  certifications TEXT[],
  years_of_experience NUMERIC,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  fitness_goals TEXT[],
  medical_conditions TEXT,
  height_cm NUMERIC,
  current_weight_kg NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_auth_user_id_fkey'
      AND conrelid = 'fitness.profiles'::regclass
  ) THEN
    ALTER TABLE fitness.profiles
      ADD CONSTRAINT profiles_auth_user_id_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS fitness.coach_client_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'rejected', 'inactive', 'suspended', 'archived')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  deactivated_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 2. WORKOUT & TRAINING
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES fitness.profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('strength', 'cardio', 'flexibility', 'balance', 'plyometric', 'other')),
  muscle_groups TEXT[],
  equipment TEXT,
  instructions TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_global BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('strength', 'cardio', 'flexibility', 'hiit', 'mixed', 'other')),
  estimated_duration_min INTEGER,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES fitness.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES fitness.exercises(id) ON DELETE RESTRICT,
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.exercise_set_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES fitness.workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  target_reps INTEGER,
  target_weight NUMERIC,
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  target_duration_sec INTEGER,
  rest_period_sec INTEGER,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL DEFAULT 1,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.program_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES fitness.training_programs(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES fitness.workouts(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL DEFAULT 1,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.program_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES fitness.training_programs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.workout_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES fitness.workouts(id) ON DELETE CASCADE,
  program_assignment_id UUID REFERENCES fitness.program_assignments(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'due', 'completed', 'missed', 'skipped')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.workout_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES fitness.workout_assignments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_min INTEGER,
  perceived_difficulty INTEGER CHECK (perceived_difficulty >= 1 AND perceived_difficulty <= 10),
  notes TEXT,
  coach_feedback TEXT,
  coach_feedback_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.completed_exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completion_id UUID NOT NULL REFERENCES fitness.workout_completions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES fitness.exercises(id) ON DELETE RESTRICT,
  set_number INTEGER NOT NULL,
  actual_reps INTEGER,
  actual_weight NUMERIC,
  weight_unit TEXT DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  actual_duration_sec INTEGER,
  completed BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 3. NUTRITION
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  target_calories NUMERIC NOT NULL,
  target_protein_g NUMERIC NOT NULL,
  target_carbs_g NUMERIC NOT NULL,
  target_fat_g NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.nutrition_plan_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES fitness.nutrition_plans(id) ON DELETE CASCADE,
  meal_name VARCHAR(100) NOT NULL,
  meal_order INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  target_calories NUMERIC NOT NULL,
  target_protein_g NUMERIC NOT NULL,
  target_carbs_g NUMERIC NOT NULL,
  target_fat_g NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_meal_id UUID NOT NULL REFERENCES fitness.nutrition_plan_meals(id) ON DELETE CASCADE,
  food_name VARCHAR(255) NOT NULL,
  quantity NUMERIC NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'g',
  calories NUMERIC NOT NULL,
  protein_g NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  fat_g NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.nutrition_plan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES fitness.nutrition_plans(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  custom_target_calories NUMERIC,
  custom_target_protein_g NUMERIC,
  custom_target_carbs_g NUMERIC,
  custom_target_fat_g NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.daily_nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  total_calories NUMERIC NOT NULL DEFAULT 0,
  total_protein_g NUMERIC NOT NULL DEFAULT 0,
  total_carbs_g NUMERIC NOT NULL DEFAULT 0,
  total_fat_g NUMERIC NOT NULL DEFAULT 0,
  adherence_rating INTEGER CHECK (adherence_rating >= 1 AND adherence_rating <= 10),
  adherence_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, log_date)
);

CREATE TABLE IF NOT EXISTS fitness.nutrition_log_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID NOT NULL REFERENCES fitness.daily_nutrition_logs(id) ON DELETE CASCADE,
  meal_name TEXT NOT NULL,
  meal_order INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.nutrition_log_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_meal_id UUID NOT NULL REFERENCES fitness.nutrition_log_meals(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  quantity NUMERIC,
  unit TEXT,
  calories INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 4. CHECK-INS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.check_in_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'custom')),
  custom_interval_days INTEGER,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  time_of_day TIME,
  is_active BOOLEAN NOT NULL DEFAULT true,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES fitness.check_in_schedules(id),
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'missed', 'reviewed')),
  submitted_at TIMESTAMPTZ,
  responses JSONB DEFAULT '{}'::jsonb,
  weight_kg NUMERIC,
  notes TEXT,
  coach_feedback TEXT,
  coach_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 5. PROGRESS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.progress_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  record_type TEXT NOT NULL CHECK (record_type IN ('weight', 'measurement', 'steps', 'photo', 'general')),
  weight_kg NUMERIC,
  chest_cm NUMERIC,
  waist_cm NUMERIC,
  hips_cm NUMERIC,
  bicep_left_cm NUMERIC,
  bicep_right_cm NUMERIC,
  thigh_left_cm NUMERIC,
  thigh_right_cm NUMERIC,
  calf_left_cm NUMERIC,
  calf_right_cm NUMERIC,
  step_count INTEGER,
  body_fat_percentage NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  progress_record_id UUID REFERENCES fitness.progress_records(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('front', 'side', 'back', 'other')),
  caption TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 6. MESSAGING
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(coach_id, client_id)
);

CREATE TABLE IF NOT EXISTS fitness.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES fitness.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 7. NOTIFICATIONS & SETTINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES fitness.profiles(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fitness.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES fitness.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION fitness.log_food_item(
  p_id UUID,
  p_client_id UUID,
  p_log_date DATE,
  p_meal_name TEXT,
  p_food_name TEXT,
  p_quantity NUMERIC,
  p_unit TEXT,
  p_calories NUMERIC,
  p_protein_g NUMERIC,
  p_carbs_g NUMERIC,
  p_fat_g NUMERIC
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_daily_log_id UUID;
  v_meal_id UUID;
  caller_role TEXT;
BEGIN
  caller_role := fitness.current_user_role();
  IF auth.uid() IS NULL OR caller_role IS NULL OR NOT (
    caller_role = 'admin'
    OR (caller_role = 'client' AND p_client_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'You are not authorized to log food for this client';
  END IF;
  IF p_quantity <= 0 OR p_calories < 0 OR p_protein_g < 0 OR p_carbs_g < 0 OR p_fat_g < 0
     OR nullif(trim(p_food_name), '') IS NULL OR nullif(trim(p_meal_name), '') IS NULL THEN
    RAISE EXCEPTION 'Food log values are invalid';
  END IF;

  INSERT INTO fitness.daily_nutrition_logs (
    client_id, log_date, total_calories, total_protein_g, total_carbs_g, total_fat_g
  )
  VALUES (p_client_id, p_log_date, p_calories, p_protein_g, p_carbs_g, p_fat_g)
  ON CONFLICT (client_id, log_date) DO UPDATE SET
    total_calories = fitness.daily_nutrition_logs.total_calories + EXCLUDED.total_calories,
    total_protein_g = fitness.daily_nutrition_logs.total_protein_g + EXCLUDED.total_protein_g,
    total_carbs_g = fitness.daily_nutrition_logs.total_carbs_g + EXCLUDED.total_carbs_g,
    total_fat_g = fitness.daily_nutrition_logs.total_fat_g + EXCLUDED.total_fat_g,
    updated_at = now()
  RETURNING id INTO v_daily_log_id;

  INSERT INTO fitness.nutrition_log_meals (daily_log_id, meal_name)
  VALUES (v_daily_log_id, p_meal_name)
  RETURNING id INTO v_meal_id;

  INSERT INTO fitness.nutrition_log_foods (
    id, log_meal_id, food_name, quantity, unit, calories, protein_g, carbs_g, fat_g
  )
  VALUES (
    p_id, v_meal_id, trim(p_food_name), p_quantity, p_unit,
    p_calories, p_protein_g, p_carbs_g, p_fat_g
  );
END;
$$;

CREATE OR REPLACE FUNCTION fitness.delete_food_log_item(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  owner_id UUID;
  v_daily_log_id UUID;
  caller_role TEXT;
BEGIN
  SELECT dl.client_id, dl.id
  INTO owner_id, v_daily_log_id
  FROM fitness.nutrition_log_foods AS f
  JOIN fitness.nutrition_log_meals AS m ON m.id = f.log_meal_id
  JOIN fitness.daily_nutrition_logs AS dl ON dl.id = m.daily_log_id
  WHERE f.id = p_id
  FOR UPDATE OF dl;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Food log entry was not found';
  END IF;

  caller_role := fitness.current_user_role();
  IF auth.uid() IS NULL OR caller_role IS NULL OR NOT (
    caller_role = 'admin'
    OR (caller_role = 'client' AND owner_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'You are not authorized to delete this food log entry';
  END IF;

  DELETE FROM fitness.nutrition_log_foods WHERE id = p_id;
  DELETE FROM fitness.nutrition_log_meals AS m
  WHERE m.daily_log_id = v_daily_log_id
    AND NOT EXISTS (
      SELECT 1 FROM fitness.nutrition_log_foods AS f WHERE f.log_meal_id = m.id
    );
  UPDATE fitness.daily_nutrition_logs AS dl SET
    total_calories = COALESCE((
      SELECT sum(f.calories)
      FROM fitness.nutrition_log_meals AS m
      JOIN fitness.nutrition_log_foods AS f ON f.log_meal_id = m.id
      WHERE m.daily_log_id = v_daily_log_id
    ), 0),
    total_protein_g = COALESCE((
      SELECT sum(f.protein_g)
      FROM fitness.nutrition_log_meals AS m
      JOIN fitness.nutrition_log_foods AS f ON f.log_meal_id = m.id
      WHERE m.daily_log_id = v_daily_log_id
    ), 0),
    total_carbs_g = COALESCE((
      SELECT sum(f.carbs_g)
      FROM fitness.nutrition_log_meals AS m
      JOIN fitness.nutrition_log_foods AS f ON f.log_meal_id = m.id
      WHERE m.daily_log_id = v_daily_log_id
    ), 0),
    total_fat_g = COALESCE((
      SELECT sum(f.fat_g)
      FROM fitness.nutrition_log_meals AS m
      JOIN fitness.nutrition_log_foods AS f ON f.log_meal_id = m.id
      WHERE m.daily_log_id = v_daily_log_id
    ), 0),
    updated_at = now()
  WHERE dl.id = v_daily_log_id;
END;
$$;

-- --------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON fitness.profiles(role);
CREATE INDEX IF NOT EXISTS idx_workout_assignments_client_date ON fitness.workout_assignments(client_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_daily_nutrition_client_date ON fitness.daily_nutrition_logs(client_id, log_date);
CREATE INDEX IF NOT EXISTS idx_progress_records_client_date ON fitness.progress_records(client_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON fitness.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON fitness.notifications(user_id, is_read);

-- --------------------------------------------------------------------
-- AUTH IDENTITY, ROLE HELPERS & ROW-LEVEL SECURITY
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fitness.current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT p.role::text
  FROM fitness.profiles AS p
  WHERE p.id = auth.uid()
    AND p.is_active
    AND p.approval_status IN ('active', 'approved', 'not_applicable')
$$;

CREATE OR REPLACE FUNCTION fitness.current_user_approval_status()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT p.approval_status::text
  FROM fitness.profiles AS p
  WHERE p.id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION fitness.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce(fitness.current_user_role() = 'admin', false)
$$;

CREATE OR REPLACE FUNCTION fitness.is_coach_for_client(target_client_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce(fitness.current_user_role() = 'coach', false)
    AND EXISTS (
      SELECT 1
      FROM fitness.coach_client_assignments AS a
      WHERE a.coach_id = auth.uid()
        AND a.client_id = target_client_id
        AND a.status = 'active'
    )
$$;

CREATE OR REPLACE FUNCTION fitness.can_access_workout(target_workout_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT fitness.is_admin()
    OR EXISTS (
      SELECT 1 FROM fitness.workouts AS w
      WHERE w.id = target_workout_id
        AND w.coach_id = auth.uid()
        AND fitness.current_user_role() = 'coach'
    )
    OR EXISTS (
      SELECT 1 FROM fitness.workout_assignments AS wa
      WHERE wa.workout_id = target_workout_id
        AND wa.client_id = auth.uid()
        AND wa.status <> 'missed'
        AND fitness.current_user_role() = 'client'
    )
$$;

CREATE OR REPLACE FUNCTION fitness.create_profile_for_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  requested_role TEXT;
  full_name TEXT;
  first_name_value TEXT;
  last_name_value TEXT;
  goals_value TEXT[];
BEGIN
  requested_role := CASE
    WHEN NEW.raw_app_meta_data ->> 'role' IN ('admin', 'coach')
      THEN NEW.raw_app_meta_data ->> 'role'
    ELSE 'client'
  END;

  IF requested_role = 'admin' THEN
    PERFORM pg_advisory_xact_lock(8162025, 1);
    IF EXISTS (
       SELECT 1
       FROM fitness.system_settings
       WHERE key = 'gymwrath_initial_admin_initialized'
    ) OR EXISTS (
       SELECT 1
       FROM fitness.profiles AS p
       JOIN auth.users AS u ON u.id = p.id
       WHERE p.role = 'admin'
    ) THEN
      RAISE EXCEPTION 'An administrator already exists; initial administrator setup is closed';
    END IF;
  END IF;

  full_name := nullif(trim(coalesce(
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'name',
    ''
  )), '');
  IF full_name IS NULL THEN
    full_name := split_part(coalesce(NEW.email, ''), '@', 1);
  END IF;
  first_name_value := coalesce(nullif(split_part(full_name, ' ', 1), ''), 'User');
  last_name_value := nullif(trim(substr(full_name, length(first_name_value) + 1)), '');

  goals_value := CASE jsonb_typeof(NEW.raw_user_meta_data -> 'fitness_goals')
    WHEN 'array' THEN ARRAY(
      SELECT jsonb_array_elements_text(NEW.raw_user_meta_data -> 'fitness_goals')
    )
    WHEN 'string' THEN CASE
      WHEN nullif(trim(NEW.raw_user_meta_data ->> 'fitness_goals'), '') IS NULL THEN '{}'::TEXT[]
      ELSE ARRAY[NEW.raw_user_meta_data ->> 'fitness_goals']
    END
    ELSE '{}'::TEXT[]
  END;

  INSERT INTO fitness.profiles (
    id, role, email, first_name, last_name, approval_status, fitness_goals
  )
  VALUES (
    NEW.id,
    requested_role,
    coalesce(NEW.email, ''),
    first_name_value,
    coalesce(last_name_value, ''),
    CASE WHEN requested_role = 'client' THEN 'pending' ELSE 'not_applicable' END,
    goals_value
  );

  IF requested_role = 'admin' THEN
    INSERT INTO fitness.system_settings (key, value, description, updated_by)
    VALUES (
      'gymwrath_initial_admin_initialized',
      jsonb_build_object('user_id', NEW.id),
      'One-time initial administrator setup marker',
      NEW.id
    )
    ON CONFLICT (key) DO NOTHING;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Initial administrator setup has already been completed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS gymwrath_create_profile ON auth.users;
CREATE TRIGGER gymwrath_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION fitness.create_profile_for_auth_user();

REVOKE ALL ON FUNCTION fitness.create_profile_for_auth_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION fitness.create_profile_for_auth_user() TO supabase_auth_admin;
REVOKE ALL ON FUNCTION fitness.current_user_role() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION fitness.current_user_approval_status() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION fitness.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION fitness.is_coach_for_client(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION fitness.can_access_workout(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION fitness.current_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION fitness.current_user_approval_status() TO authenticated;
GRANT EXECUTE ON FUNCTION fitness.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION fitness.is_coach_for_client(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION fitness.can_access_workout(UUID) TO authenticated;
REVOKE ALL ON FUNCTION fitness.log_food_item(UUID, UUID, DATE, TEXT, TEXT, NUMERIC, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION fitness.delete_food_log_item(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION fitness.log_food_item(UUID, UUID, DATE, TEXT, TEXT, NUMERIC, TEXT, NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION fitness.delete_food_log_item(UUID) TO authenticated;

REVOKE ALL ON SCHEMA fitness FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA fitness TO authenticated;
GRANT USAGE ON SCHEMA fitness TO service_role;
REVOKE ALL ON ALL TABLES IN SCHEMA fitness FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA fitness TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA fitness TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA fitness REVOKE ALL ON TABLES FROM PUBLIC, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA fitness GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA fitness GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'profiles', 'coach_client_assignments', 'exercises', 'workouts',
    'workout_exercises', 'exercise_set_templates', 'training_programs',
    'program_workouts', 'program_assignments', 'workout_assignments',
    'workout_completions', 'completed_exercise_sets', 'nutrition_plans',
    'nutrition_plan_meals', 'meal_foods', 'nutrition_plan_assignments',
    'daily_nutrition_logs', 'nutrition_log_meals', 'nutrition_log_foods',
    'check_in_schedules', 'check_ins', 'progress_records', 'progress_photos',
    'conversations', 'messages', 'notifications', 'system_settings'
  ]
  LOOP
    EXECUTE format('ALTER TABLE fitness.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('DROP POLICY IF EXISTS admins_manage_%I ON fitness.%I', table_name, table_name);
    EXECUTE format(
      'CREATE POLICY admins_manage_%I ON fitness.%I FOR ALL TO authenticated USING (fitness.is_admin()) WITH CHECK (fitness.is_admin())',
      table_name, table_name
    );
  END LOOP;
END;
$$;

DO $$
DECLARE
  policy_spec TEXT;
BEGIN
  FOREACH policy_spec IN ARRAY ARRAY[
    'profiles:profiles_read_authorized', 'profiles:profiles_update_self',
    'coach_client_assignments:assignments_read_participants',
    'coach_client_assignments:assignments_coach_insert',
    'coach_client_assignments:assignments_coach_update',
    'exercises:exercises_read_authenticated', 'exercises:exercises_coach_insert',
    'exercises:exercises_coach_update', 'exercises:exercises_coach_delete',
    'workouts:workouts_read_assigned', 'workouts:workouts_coach_write',
    'workouts:workouts_coach_update', 'workouts:workouts_coach_delete',
    'training_programs:programs_read_owner', 'training_programs:programs_coach_insert',
    'training_programs:programs_coach_update', 'training_programs:programs_coach_delete',
    'workout_exercises:workout_exercises_read_authorized',
    'workout_exercises:workout_exercises_coach_insert',
    'workout_exercises:workout_exercises_coach_update',
    'workout_exercises:workout_exercises_coach_delete',
    'exercise_set_templates:set_templates_read_authorized',
    'exercise_set_templates:set_templates_coach_insert',
    'exercise_set_templates:set_templates_coach_update',
    'exercise_set_templates:set_templates_coach_delete',
    'program_workouts:program_workouts_read_authorized',
    'program_workouts:program_workouts_coach_write',
    'program_assignments:program_assignments_read_participants',
    'program_assignments:program_assignments_coach_write',
    'workout_assignments:workout_assignments_read_participants',
    'workout_assignments:workout_assignments_coach_insert',
    'workout_assignments:workout_assignments_coach_update',
    'workout_completions:completions_read_participants',
    'workout_completions:completions_client_insert',
    'workout_completions:completions_coach_update',
    'completed_exercise_sets:completed_sets_read_participants',
    'completed_exercise_sets:completed_sets_client_write',
    'nutrition_plans:nutrition_plans_read_authorized',
    'nutrition_plans:nutrition_plans_coach_write',
    'nutrition_plan_meals:nutrition_meals_read_authorized',
    'nutrition_plan_meals:nutrition_meals_coach_write',
    'meal_foods:meal_foods_read_authorized',
    'meal_foods:meal_foods_coach_write',
    'nutrition_plan_assignments:nutrition_assignments_read_participants',
    'nutrition_plan_assignments:nutrition_assignments_coach_write',
    'nutrition_log_meals:nutrition_log_meals_read_authorized',
    'nutrition_log_meals:nutrition_log_meals_client_write',
    'nutrition_log_foods:nutrition_log_foods_read_authorized',
    'nutrition_log_foods:nutrition_log_foods_client_write',
    'check_in_schedules:check_schedules_read_participants',
    'check_in_schedules:check_schedules_coach_write',
    'check_ins:check_ins_read_participants', 'check_ins:check_ins_client_insert',
    'check_ins:check_ins_coach_update', 'progress_records:progress_records_read_participants',
    'progress_records:progress_records_client_insert', 'progress_records:progress_records_client_update',
    'progress_photos:progress_photos_read_participants',
    'progress_photos:progress_photos_client_insert',
    'progress_photos:progress_photos_client_delete',
    'daily_nutrition_logs:nutrition_logs_read_participants',
    'daily_nutrition_logs:nutrition_logs_client_write',
    'conversations:conversations_read_participants', 'conversations:conversations_coach_create',
    'messages:messages_read_participants', 'messages:messages_send_participant',
    'messages:messages_update_recipient', 'notifications:notifications_read_self',
    'notifications:notifications_update_self'
  ]
  LOOP
    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON fitness.%I',
      split_part(policy_spec, ':', 2),
      split_part(policy_spec, ':', 1)
    );
  END LOOP;
END;
$$;

CREATE POLICY profiles_read_authorized ON fitness.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR fitness.is_admin()
    OR fitness.is_coach_for_client(id)
    OR EXISTS (
      SELECT 1 FROM fitness.coach_client_assignments AS a
      WHERE a.client_id = auth.uid() AND a.coach_id = fitness.profiles.id AND a.status = 'active'
    )
  );
CREATE POLICY profiles_update_self ON fitness.profiles
  FOR UPDATE TO authenticated
  USING (
    id = auth.uid()
    AND role = fitness.current_user_role()
    AND approval_status = fitness.current_user_approval_status()
    AND NOT fitness.is_admin()
  )
  WITH CHECK (
    id = auth.uid()
    AND role = fitness.current_user_role()
    AND approval_status = fitness.current_user_approval_status()
    AND NOT fitness.is_admin()
  );

CREATE POLICY assignments_read_participants ON fitness.coach_client_assignments
  FOR SELECT TO authenticated
  USING (
    fitness.is_admin()
    OR (fitness.current_user_role() IN ('coach', 'client') AND (coach_id = auth.uid() OR client_id = auth.uid()))
  );
CREATE POLICY assignments_coach_insert ON fitness.coach_client_assignments
  FOR INSERT TO authenticated
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND coach_id = auth.uid()
    AND EXISTS (SELECT 1 FROM fitness.profiles p WHERE p.id = client_id AND p.role = 'client')
  );
CREATE POLICY assignments_coach_update ON fitness.coach_client_assignments
  FOR UPDATE TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());

CREATE POLICY exercises_read_authenticated ON fitness.exercises
  FOR SELECT TO authenticated
  USING (
    fitness.is_admin()
    OR (fitness.current_user_role() IN ('coach', 'client') AND (is_global OR coach_id = auth.uid()))
  );
CREATE POLICY exercises_coach_insert ON fitness.exercises
  FOR INSERT TO authenticated
  WITH CHECK (
    fitness.is_admin()
    OR (fitness.current_user_role() = 'coach' AND coach_id = auth.uid() AND NOT is_global)
  );
CREATE POLICY exercises_coach_update ON fitness.exercises
  FOR UPDATE TO authenticated
  USING (fitness.is_admin() OR (fitness.current_user_role() = 'coach' AND coach_id = auth.uid() AND NOT is_global))
  WITH CHECK (fitness.is_admin() OR (fitness.current_user_role() = 'coach' AND coach_id = auth.uid() AND NOT is_global));
CREATE POLICY exercises_coach_delete ON fitness.exercises
  FOR DELETE TO authenticated
  USING (fitness.is_admin() OR (fitness.current_user_role() = 'coach' AND coach_id = auth.uid() AND NOT is_global));

CREATE POLICY workouts_read_assigned ON fitness.workouts
  FOR SELECT TO authenticated
  USING (
    fitness.is_admin()
    OR (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM fitness.workout_assignments wa
      WHERE wa.workout_id = fitness.workouts.id AND wa.client_id = auth.uid()
        AND fitness.current_user_role() = 'client'
    )
  );
CREATE POLICY workouts_coach_write ON fitness.workouts
  FOR INSERT TO authenticated
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());
CREATE POLICY workouts_coach_update ON fitness.workouts
  FOR UPDATE TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());
CREATE POLICY workouts_coach_delete ON fitness.workouts
  FOR DELETE TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());

CREATE POLICY programs_read_owner ON fitness.training_programs
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM fitness.program_assignments pa
      WHERE pa.program_id = fitness.training_programs.id
        AND pa.client_id = auth.uid()
        AND pa.status = 'active'
        AND fitness.current_user_role() = 'client'
    )
  );
CREATE POLICY programs_coach_insert ON fitness.training_programs
  FOR INSERT TO authenticated
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());
CREATE POLICY programs_coach_update ON fitness.training_programs
  FOR UPDATE TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());
CREATE POLICY programs_coach_delete ON fitness.training_programs
  FOR DELETE TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());

CREATE POLICY workout_assignments_read_participants ON fitness.workout_assignments
  FOR SELECT TO authenticated
  USING (
    fitness.is_admin()
    OR (fitness.current_user_role() IN ('coach', 'client') AND (client_id = auth.uid() OR coach_id = auth.uid()))
  );
CREATE POLICY workout_assignments_coach_insert ON fitness.workout_assignments
  FOR INSERT TO authenticated
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid() AND fitness.is_coach_for_client(client_id));
CREATE POLICY workout_assignments_coach_update ON fitness.workout_assignments
  FOR UPDATE TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());

CREATE POLICY workout_exercises_read_authorized ON fitness.workout_exercises
  FOR SELECT TO authenticated
  USING (fitness.can_access_workout(workout_id));
CREATE POLICY workout_exercises_coach_insert ON fitness.workout_exercises
  FOR INSERT TO authenticated
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.workouts w WHERE w.id = workout_id AND w.coach_id = auth.uid())
  );
CREATE POLICY workout_exercises_coach_update ON fitness.workout_exercises
  FOR UPDATE TO authenticated
  USING (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.workouts w WHERE w.id = workout_id AND w.coach_id = auth.uid())
  )
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.workouts w WHERE w.id = workout_id AND w.coach_id = auth.uid())
  );
CREATE POLICY workout_exercises_coach_delete ON fitness.workout_exercises
  FOR DELETE TO authenticated
  USING (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.workouts w WHERE w.id = workout_id AND w.coach_id = auth.uid())
  );

CREATE POLICY set_templates_read_authorized ON fitness.exercise_set_templates
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fitness.workout_exercises we
      WHERE we.id = workout_exercise_id AND fitness.can_access_workout(we.workout_id)
    )
  );
CREATE POLICY set_templates_coach_insert ON fitness.exercise_set_templates
  FOR INSERT TO authenticated
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND EXISTS (
      SELECT 1 FROM fitness.workout_exercises we
      JOIN fitness.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.coach_id = auth.uid()
    )
  );
CREATE POLICY set_templates_coach_update ON fitness.exercise_set_templates
  FOR UPDATE TO authenticated
  USING (
    fitness.current_user_role() = 'coach'
    AND EXISTS (
      SELECT 1 FROM fitness.workout_exercises we
      JOIN fitness.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.coach_id = auth.uid()
    )
  )
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND EXISTS (
      SELECT 1 FROM fitness.workout_exercises we
      JOIN fitness.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.coach_id = auth.uid()
    )
  );
CREATE POLICY set_templates_coach_delete ON fitness.exercise_set_templates
  FOR DELETE TO authenticated
  USING (
    fitness.current_user_role() = 'coach'
    AND EXISTS (
      SELECT 1 FROM fitness.workout_exercises we
      JOIN fitness.workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.coach_id = auth.uid()
    )
  );

CREATE POLICY program_assignments_read_participants ON fitness.program_assignments
  FOR SELECT TO authenticated
  USING (
    fitness.is_admin()
    OR (fitness.current_user_role() IN ('coach', 'client') AND (client_id = auth.uid() OR coach_id = auth.uid()))
  );
CREATE POLICY program_assignments_coach_write ON fitness.program_assignments
  FOR ALL TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND coach_id = auth.uid()
    AND fitness.is_coach_for_client(client_id)
  );
CREATE POLICY program_workouts_read_authorized ON fitness.program_workouts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fitness.training_programs p
      WHERE p.id = program_id
        AND (
          p.coach_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM fitness.program_assignments pa
            WHERE pa.program_id = p.id AND pa.client_id = auth.uid() AND pa.status = 'active'
          )
        )
    )
  );
CREATE POLICY program_workouts_coach_write ON fitness.program_workouts
  FOR ALL TO authenticated
  USING (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.training_programs p WHERE p.id = program_id AND p.coach_id = auth.uid())
  )
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.training_programs p WHERE p.id = program_id AND p.coach_id = auth.uid())
  );

CREATE POLICY completions_read_participants ON fitness.workout_completions
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'client' AND client_id = auth.uid())
    OR fitness.is_coach_for_client(client_id)
  );
CREATE POLICY completions_client_insert ON fitness.workout_completions
  FOR INSERT TO authenticated
  WITH CHECK (
    client_id = auth.uid()
    AND fitness.current_user_role() = 'client'
    AND EXISTS (
      SELECT 1 FROM fitness.workout_assignments wa
      WHERE wa.id = assignment_id AND wa.client_id = auth.uid()
    )
  );
CREATE POLICY completions_coach_update ON fitness.workout_completions
  FOR UPDATE TO authenticated
  USING (fitness.is_coach_for_client(client_id))
  WITH CHECK (fitness.is_coach_for_client(client_id));
CREATE POLICY completed_sets_read_participants ON fitness.completed_exercise_sets
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fitness.workout_completions wc
      WHERE wc.id = completion_id
        AND (wc.client_id = auth.uid() OR fitness.is_coach_for_client(wc.client_id))
    )
  );
CREATE POLICY completed_sets_client_write ON fitness.completed_exercise_sets
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM fitness.workout_completions wc
      WHERE wc.id = completion_id AND wc.client_id = auth.uid()
    )
  );

CREATE POLICY nutrition_plans_read_authorized ON fitness.nutrition_plans
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM fitness.nutrition_plan_assignments na
      WHERE na.plan_id = fitness.nutrition_plans.id AND na.client_id = auth.uid()
        AND na.status = 'active' AND fitness.current_user_role() = 'client'
    )
  );
CREATE POLICY nutrition_plans_coach_write ON fitness.nutrition_plans
  FOR ALL TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (fitness.current_user_role() = 'coach' AND coach_id = auth.uid());
CREATE POLICY nutrition_meals_read_authorized ON fitness.nutrition_plan_meals
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fitness.nutrition_plans p
      WHERE p.id = plan_id AND (p.coach_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM fitness.nutrition_plan_assignments na
          WHERE na.plan_id = p.id AND na.client_id = auth.uid() AND na.status = 'active'
        ))
    )
  );
CREATE POLICY nutrition_meals_coach_write ON fitness.nutrition_plan_meals
  FOR ALL TO authenticated
  USING (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.nutrition_plans p WHERE p.id = plan_id AND p.coach_id = auth.uid())
  )
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND EXISTS (SELECT 1 FROM fitness.nutrition_plans p WHERE p.id = plan_id AND p.coach_id = auth.uid())
  );
CREATE POLICY meal_foods_read_authorized ON fitness.meal_foods
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fitness.nutrition_plan_meals pm
      JOIN fitness.nutrition_plans p ON p.id = pm.plan_id
      WHERE pm.id = plan_meal_id AND (p.coach_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM fitness.nutrition_plan_assignments na
          WHERE na.plan_id = p.id AND na.client_id = auth.uid() AND na.status = 'active'
        ))
    )
  );
CREATE POLICY meal_foods_coach_write ON fitness.meal_foods
  FOR ALL TO authenticated
  USING (
    fitness.current_user_role() = 'coach'
    AND EXISTS (
      SELECT 1 FROM fitness.nutrition_plan_meals pm
      JOIN fitness.nutrition_plans p ON p.id = pm.plan_id
      WHERE pm.id = plan_meal_id AND p.coach_id = auth.uid()
    )
  )
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND EXISTS (
      SELECT 1 FROM fitness.nutrition_plan_meals pm
      JOIN fitness.nutrition_plans p ON p.id = pm.plan_id
      WHERE pm.id = plan_meal_id AND p.coach_id = auth.uid()
    )
  );
CREATE POLICY nutrition_assignments_read_participants ON fitness.nutrition_plan_assignments
  FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR coach_id = auth.uid() OR fitness.is_admin());
CREATE POLICY nutrition_assignments_coach_write ON fitness.nutrition_plan_assignments
  FOR ALL TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND coach_id = auth.uid()
    AND fitness.is_coach_for_client(client_id)
  );

CREATE POLICY check_ins_read_participants ON fitness.check_ins
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'client' AND client_id = auth.uid())
    OR fitness.is_coach_for_client(client_id)
  );
CREATE POLICY check_ins_client_insert ON fitness.check_ins
  FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid() AND fitness.current_user_role() = 'client');
CREATE POLICY check_ins_coach_update ON fitness.check_ins
  FOR UPDATE TO authenticated
  USING (fitness.is_coach_for_client(client_id))
  WITH CHECK (fitness.is_coach_for_client(client_id));

CREATE POLICY progress_records_read_participants ON fitness.progress_records
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'client' AND client_id = auth.uid())
    OR fitness.is_coach_for_client(client_id)
  );
CREATE POLICY progress_records_client_insert ON fitness.progress_records
  FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid() AND fitness.current_user_role() = 'client');
CREATE POLICY progress_records_client_update ON fitness.progress_records
  FOR UPDATE TO authenticated
  USING (client_id = auth.uid() OR fitness.is_coach_for_client(client_id))
  WITH CHECK (client_id = auth.uid() OR fitness.is_coach_for_client(client_id));

CREATE POLICY nutrition_logs_read_participants ON fitness.daily_nutrition_logs
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'client' AND client_id = auth.uid())
    OR fitness.is_coach_for_client(client_id)
  );
CREATE POLICY nutrition_logs_client_write ON fitness.daily_nutrition_logs
  FOR ALL TO authenticated
  USING (client_id = auth.uid() AND fitness.current_user_role() = 'client')
  WITH CHECK (client_id = auth.uid() AND fitness.current_user_role() = 'client');
CREATE POLICY nutrition_log_meals_read_authorized ON fitness.nutrition_log_meals
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fitness.daily_nutrition_logs dl
      WHERE dl.id = daily_log_id
        AND (dl.client_id = auth.uid() OR fitness.is_coach_for_client(dl.client_id))
    )
  );
CREATE POLICY nutrition_log_meals_client_write ON fitness.nutrition_log_meals
  FOR ALL TO authenticated
  USING (
    fitness.current_user_role() = 'client'
    AND EXISTS (SELECT 1 FROM fitness.daily_nutrition_logs dl WHERE dl.id = daily_log_id AND dl.client_id = auth.uid())
  )
  WITH CHECK (
    fitness.current_user_role() = 'client'
    AND EXISTS (SELECT 1 FROM fitness.daily_nutrition_logs dl WHERE dl.id = daily_log_id AND dl.client_id = auth.uid())
  );
CREATE POLICY nutrition_log_foods_read_authorized ON fitness.nutrition_log_foods
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM fitness.nutrition_log_meals lm
      JOIN fitness.daily_nutrition_logs dl ON dl.id = lm.daily_log_id
      WHERE lm.id = log_meal_id
        AND (dl.client_id = auth.uid() OR fitness.is_coach_for_client(dl.client_id))
    )
  );
CREATE POLICY nutrition_log_foods_client_write ON fitness.nutrition_log_foods
  FOR ALL TO authenticated
  USING (
    fitness.current_user_role() = 'client'
    AND EXISTS (
      SELECT 1 FROM fitness.nutrition_log_meals lm
      JOIN fitness.daily_nutrition_logs dl ON dl.id = lm.daily_log_id
      WHERE lm.id = log_meal_id AND dl.client_id = auth.uid()
    )
  )
  WITH CHECK (
    fitness.current_user_role() = 'client'
    AND EXISTS (
      SELECT 1 FROM fitness.nutrition_log_meals lm
      JOIN fitness.daily_nutrition_logs dl ON dl.id = lm.daily_log_id
      WHERE lm.id = log_meal_id AND dl.client_id = auth.uid()
    )
  );

CREATE POLICY check_schedules_read_participants ON fitness.check_in_schedules
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
    OR (fitness.current_user_role() = 'client' AND client_id = auth.uid())
    OR fitness.is_coach_for_client(client_id)
  );
CREATE POLICY check_schedules_coach_write ON fitness.check_in_schedules
  FOR ALL TO authenticated
  USING (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
  WITH CHECK (
    fitness.current_user_role() = 'coach'
    AND coach_id = auth.uid()
    AND fitness.is_coach_for_client(client_id)
  );

CREATE POLICY conversations_read_participants ON fitness.conversations
  FOR SELECT TO authenticated
  USING (
    fitness.is_admin()
    OR (fitness.current_user_role() = 'coach' AND coach_id = auth.uid())
    OR (fitness.current_user_role() = 'client' AND client_id = auth.uid())
  );
CREATE POLICY conversations_coach_create ON fitness.conversations
  FOR INSERT TO authenticated
  WITH CHECK (coach_id = auth.uid() AND fitness.is_coach_for_client(client_id));
CREATE POLICY messages_read_participants ON fitness.messages
  FOR SELECT TO authenticated
  USING (
    fitness.current_user_role() IN ('admin', 'coach', 'client')
    AND (sender_id = auth.uid() OR recipient_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM fitness.conversations c
      WHERE c.id = conversation_id AND (c.coach_id = auth.uid() OR c.client_id = auth.uid())
    )
    )
  );
CREATE POLICY messages_send_participant ON fitness.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM fitness.conversations c
      WHERE c.id = conversation_id
        AND (c.coach_id = auth.uid() OR c.client_id = auth.uid())
        AND recipient_id IN (c.coach_id, c.client_id)
    )
  );
CREATE POLICY messages_update_recipient ON fitness.messages
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY notifications_read_self ON fitness.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND fitness.current_user_role() IN ('admin', 'coach', 'client'));
CREATE POLICY notifications_update_self ON fitness.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
CREATE POLICY progress_photos_read_participants ON fitness.progress_photos
  FOR SELECT TO authenticated
  USING (
    (fitness.current_user_role() = 'client' AND client_id = auth.uid())
    OR fitness.is_coach_for_client(client_id)
  );
CREATE POLICY progress_photos_client_insert ON fitness.progress_photos
  FOR INSERT TO authenticated
  WITH CHECK (client_id = auth.uid() AND fitness.current_user_role() = 'client');
CREATE POLICY progress_photos_client_delete ON fitness.progress_photos
  FOR DELETE TO authenticated
  USING (client_id = auth.uid() AND fitness.current_user_role() = 'client');
`;
}),
"[project]/src/App.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Navbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/Sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$MobileBottomNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layout/MobileBottomNav.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$CoachDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/CoachDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$ClientDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/ClientDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$AdminDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/dashboard/AdminDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$clients$2f$ClientProfileView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/clients/ClientProfileView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ExerciseLibrary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/workouts/ExerciseLibrary.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ProgramBuilder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/workouts/ProgramBuilder.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$WorkoutCalendarView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/workouts/WorkoutCalendarView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ActiveWorkoutModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/workouts/ActiveWorkoutModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInsView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/checkins/CheckInsView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInSubmitModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/checkins/CheckInSubmitModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInReviewModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/checkins/CheckInReviewModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$nutrition$2f$NutritionView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/nutrition/NutritionView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$activity$2f$StepsTrackerView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/activity/StepsTrackerView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$messages$2f$MessagesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/messages/MessagesView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$database$2f$DatabaseSchemaView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/database/DatabaseSchemaView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notifications$2f$NotificationDrawer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/notifications/NotificationDrawer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$AuthModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/auth/AuthModal.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const MainLayout = ()=>{
    const { currentUser, activeView, selectedClientId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useApp"])();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const renderCurrentView = ()=>{
        // If a client is selected for deep drill-down
        if (selectedClientId && (currentUser.role === 'coach' || currentUser.role === 'admin') && (activeView === 'clients' || activeView === 'dashboard')) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$clients$2f$ClientProfileView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClientProfileView"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 35,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
        switch(activeView){
            case 'dashboard':
                if (currentUser.role === 'client') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$ClientDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClientDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 40,
                    columnNumber: 51
                }, ("TURBOPACK compile-time value", void 0));
                if (currentUser.role === 'admin') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$AdminDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdminDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 41,
                    columnNumber: 50
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$CoachDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoachDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 42,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'clients':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$CoachDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoachDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 45,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'exercises':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ExerciseLibrary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExerciseLibrary"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 48,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'programs':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ProgramBuilder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProgramBuilder"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 51,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'calendar':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$WorkoutCalendarView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorkoutCalendarView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 54,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'checkins':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInsView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckInsView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 57,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'nutrition':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$nutrition$2f$NutritionView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NutritionView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 60,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'steps':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$activity$2f$StepsTrackerView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StepsTrackerView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 63,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'messages':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$messages$2f$MessagesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagesView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 66,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'database':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$database$2f$DatabaseSchemaView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseSchemaView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 69,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'admin':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$AdminDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdminDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 72,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$CoachDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoachDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 75,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen w-full min-w-0 max-w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Navbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Navbar"], {
                onToggleSidebar: ()=>setIsMobileMenuOpen(!isMobileMenuOpen),
                isMobileMenuOpen: isMobileMenuOpen,
                onOpenAuth: ()=>setIsAuthModalOpen(true)
            }, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full min-w-0 flex-1 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$Sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {
                        isMobileOpen: isMobileMenuOpen,
                        onCloseMobile: ()=>setIsMobileMenuOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/src/App.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "min-w-0 flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12",
                        children: renderCurrentView()
                    }, void 0, false, {
                        fileName: "[project]/src/App.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 88,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$MobileBottomNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileBottomNav"], {
                onOpenMobileMenu: ()=>setIsMobileMenuOpen(true)
            }, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ActiveWorkoutModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActiveWorkoutModal"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInSubmitModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckInSubmitModal"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInReviewModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckInReviewModal"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notifications$2f$NotificationDrawer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NotificationDrawer"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$AuthModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthModal"], {
                isOpen: isAuthModalOpen,
                onClose: ()=>setIsAuthModalOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function App({ initialUserId, initialProfile }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppProvider"], {
        initialUserId: initialUserId,
        initialProfile: initialProfile,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MainLayout, {}, void 0, false, {
            fileName: "[project]/src/App.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/App.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_f2524311._.js.map