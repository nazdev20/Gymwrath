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
    "resetSupabaseConfig",
    ()=>resetSupabaseConfig,
    "setCustomSupabaseConfig",
    ()=>setCustomSupabaseConfig,
    "setSupabaseReachableState",
    ()=>setSupabaseReachableState,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
function getEnvironmentConfig() {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
    const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
    return {
        url,
        anonKey
    };
}
const OFFLINE_SUPABASE_URL = 'http://127.0.0.1:54321';
const OFFLINE_SUPABASE_KEY = 'offline-placeholder-key';
function createSupabaseClient(url, anonKey) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url || OFFLINE_SUPABASE_URL, anonKey || OFFLINE_SUPABASE_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true
        }
    });
}
function getSupabaseConfig() {
    let customUrl = '';
    let customKey = '';
    let offline = false;
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } catch  {
    // Ignore storage issues
    }
    const env = getEnvironmentConfig();
    const url = (customUrl.trim() || env.url).replace(/\/+$/, '');
    const anonKey = customKey.trim() || env.anonKey;
    return {
        url,
        anonKey,
        isCustom: !!(customUrl.trim() || customKey.trim()),
        isOfflineMode: offline || !url || !anonKey
    };
}
const initialConfig = getSupabaseConfig();
let SUPABASE_URL = initialConfig.url;
let SUPABASE_ANON_KEY = initialConfig.anonKey;
let activeClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let endpointIsReachable = null;
function getSupabaseReachableState() {
    return endpointIsReachable;
}
function setSupabaseReachableState(reachable) {
    endpointIsReachable = reachable;
}
function setCustomSupabaseConfig(url, key, offline = false) {
    let cleanUrl = url.trim().replace(/\/+$/, '');
    let cleanKey = key.trim();
    if (!cleanUrl || !cleanKey) {
        if (!offline) {
            resetSupabaseConfig();
            return;
        }
        cleanUrl = '';
        cleanKey = '';
    }
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } catch  {}
    SUPABASE_URL = cleanUrl;
    SUPABASE_ANON_KEY = cleanKey;
    activeClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    endpointIsReachable = null;
}
function resetSupabaseConfig() {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } catch  {}
    const env = getEnvironmentConfig();
    SUPABASE_URL = env.url;
    SUPABASE_ANON_KEY = env.anonKey;
    activeClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    endpointIsReachable = null;
}
const supabase = new Proxy({}, {
    get (_target, prop) {
        return activeClient[prop];
    }
});
async function checkSupabaseConnection(overrideUrl, overrideKey) {
    const config = getSupabaseConfig();
    const targetUrl = (overrideUrl || config.url).trim().replace(/\/+$/, '');
    const targetKey = (overrideKey || config.anonKey).trim();
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(()=>controller.abort(), 6000);
        const res = await fetch(`${targetUrl}/rest/v1/`, {
            method: 'GET',
            headers: {
                apikey: targetKey,
                Authorization: `Bearer ${targetKey}`
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok || res.status === 200 || res.status === 404) {
            endpointIsReachable = true;
            return {
                connected: true,
                endpoint: targetUrl,
                tablesFound: [
                    'profiles'
                ],
                statusText: 'Connected & active'
            };
        }
        endpointIsReachable = false;
        return {
            connected: false,
            endpoint: targetUrl,
            error: `HTTP ${res.status}: ${res.statusText}`
        };
    } catch (err) {
        endpointIsReachable = false;
        const errMsg = err?.message || String(err);
        const isDomain = errMsg.includes('Failed to fetch') || errMsg.includes('ERR_NAME_NOT_RESOLVED') || errMsg.includes('NetworkError') || errMsg.includes('aborted');
        return {
            connected: false,
            endpoint: targetUrl,
            isDomainError: isDomain,
            error: isDomain ? `DNS Error (ERR_NAME_NOT_RESOLVED): Host "${targetUrl}" cannot be resolved. The Supabase project subdomain does not exist or is paused.` : errMsg
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
            const profileMap = new Map();
            profiles.forEach((p)=>profileMap.set(p.id, p));
            // 3. Query Exercises
            const { data: dbExercises } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('exercises').select('*');
            const exercises = (dbExercises || []).map((e)=>({
                    id: e.id,
                    name: e.name,
                    description: e.description || e.name,
                    muscleGroup: e.category || 'Chest',
                    secondaryMuscles: e.muscle_groups || [],
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
            const { data: dbLogs } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('daily_nutrition_logs').select(`
        id,
        client_id,
        log_date,
        total_calories,
        total_protein_g,
        total_carbs_g,
        total_fat_g
      `);
            const foodLogs = (dbLogs || []).map((l)=>({
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
            const payload = {
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
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) return false;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('messages').insert({
                id: msg.id,
                conversation_id: msg.conversationId,
                sender_id: msg.senderId,
                recipient_id: msg.senderId,
                content: msg.content,
                is_read: msg.isRead,
                created_at: msg.createdAt
            });
            return !error;
        } catch  {
            return false;
        }
    },
    // Insert or Upsert a check-in
    async saveCheckIn (chk) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) return false;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('check_ins').upsert({
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
            }, {
                onConflict: 'id'
            });
            return !error;
        } catch  {
            return false;
        }
    },
    // Insert or Upsert a step record
    async saveStepRecord (step) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) return false;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('progress_records').upsert({
                id: step.id,
                client_id: step.clientId,
                recorded_at: step.loggedAt,
                record_type: 'step_entry',
                step_count: step.stepCount,
                notes: step.notes
            }, {
                onConflict: 'id'
            });
            return !error;
        } catch  {
            return false;
        }
    },
    // Insert or Upsert a food log entry
    async saveFoodLog (log) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) return false;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('daily_nutrition_logs').upsert({
                id: log.id,
                client_id: log.clientId,
                log_date: log.logDate,
                total_calories: log.calories,
                total_protein_g: log.proteinG,
                total_carbs_g: log.carbsG,
                total_fat_g: log.fatG,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            });
            return !error;
        } catch  {
            return false;
        }
    },
    // Insert or Upsert an exercise
    async saveExercise (ex) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseConfig"])().isOfflineMode || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getSupabaseReachableState"])() === false) return false;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('exercises').upsert({
                id: ex.id,
                coach_id: ex.createdBy,
                name: ex.name,
                description: ex.instructions.join('\n'),
                category: ex.muscleGroup,
                muscle_groups: [
                    ex.muscleGroup,
                    ...ex.secondaryMuscles || []
                ],
                equipment: ex.equipment,
                instructions: ex.instructions.join('\n'),
                difficulty_level: 'Intermediate',
                is_global: ex.isGlobal,
                created_at: ex.createdAt,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id'
            });
            return !error;
        } catch  {
            return false;
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
;
;
;
const AppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const STORAGE_PREFIX = 'fitness_db_live_v4_';
// Auto-purge any legacy mock storage keys from older sessions
try {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
} catch (e) {
    console.warn('Storage purge error:', e);
}
function loadFromStorage(key, fallback) {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } catch (e) {
        console.error('Failed to parse storage item for ' + key, e);
    }
    return fallback;
}
function saveToStorage(key, data) {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } catch (e) {
        console.error('Failed to save storage item for ' + key, e);
    }
}
// Clean bootstrap profiles: Coach and Admin (0 clients initially)
const DEFAULT_COACH_PROFILE = {
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
const DEFAULT_ADMIN_PROFILE = {
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
const INITIAL_BASE_PROFILES = [
    DEFAULT_COACH_PROFILE,
    DEFAULT_ADMIN_PROFILE
];
const AppProvider = ({ children })=>{
    const [allProfiles, setAllProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(INITIAL_BASE_PROFILES);
    const [currentUserId, setCurrentUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('coach-primary');
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
    const [isStorageHydrated, setIsStorageHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Supabase Loading & Connectivity State
    const [isLoadingSupabase, setIsLoadingSupabase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSupabaseConnected, setIsSupabaseConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Navigation & Modals
    const [activeView, setActiveView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    const [selectedClientId, setSelectedClientId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeWorkoutModalId, setActiveWorkoutModalId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeCheckInReviewId, setActiveCheckInReviewId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCheckInModalOpen, setIsCheckInModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setAllProfiles(loadFromStorage('profiles', INITIAL_BASE_PROFILES));
        setCurrentUserId(loadFromStorage('current_user_id', 'coach-primary'));
        setExercises(loadFromStorage('exercises', []));
        setPrograms(loadFromStorage('programs', []));
        setScheduledWorkouts(loadFromStorage('workouts', []));
        setCheckIns(loadFromStorage('checkins', []));
        setStepRecords(loadFromStorage('steps', []));
        setFoods(loadFromStorage('foods', []));
        setNutritionTargets(loadFromStorage('targets', []));
        setMealPlans(loadFromStorage('mealplans', []));
        setFoodLogs(loadFromStorage('foodlogs', []));
        setConversations(loadFromStorage('conversations', []));
        setMessages(loadFromStorage('messages', []));
        setNotifications(loadFromStorage('notifications', []));
        setIsStorageHydrated(true);
    }, []);
    // Auto-fetch data from Supabase after local state has been restored
    const loadFromSupabase = async ()=>{
        setIsLoadingSupabase(true);
        try {
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].loadAllDataFromSupabase();
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
                if (!result.profiles.some((p)=>p.id === currentUserId)) {
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) loadFromSupabase();
    }, [
        isStorageHydrated
    ]);
    // Clear all local storage data
    const clearAllLocalData = ()=>{
        Object.keys(localStorage).forEach((key)=>{
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('profiles', allProfiles);
    }, [
        allProfiles,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('current_user_id', currentUserId);
    }, [
        currentUserId,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('exercises', exercises);
    }, [
        exercises,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('programs', programs);
    }, [
        programs,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('workouts', scheduledWorkouts);
    }, [
        scheduledWorkouts,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('checkins', checkIns);
    }, [
        checkIns,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('steps', stepRecords);
    }, [
        stepRecords,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('foods', foods);
    }, [
        foods,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('targets', nutritionTargets);
    }, [
        nutritionTargets,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('mealplans', mealPlans);
    }, [
        mealPlans,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('foodlogs', foodLogs);
    }, [
        foodLogs,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('conversations', conversations);
    }, [
        conversations,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('messages', messages);
    }, [
        messages,
        isStorageHydrated
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (isStorageHydrated) saveToStorage('notifications', notifications);
    }, [
        notifications,
        isStorageHydrated
    ]);
    const currentUser = allProfiles.find((p)=>p.id === currentUserId) || allProfiles[0] || DEFAULT_COACH_PROFILE;
    const switchUser = (userId)=>{
        const target = allProfiles.find((p)=>p.id === userId);
        if (target) {
            setCurrentUserId(userId);
            setActiveView('dashboard');
            setSelectedClientId(null);
        }
    };
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
    const registerUser = (name, email, role, goals)=>{
        const newId = `user-${role}-${Date.now()}`;
        const newProfile = {
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
        setAllProfiles((prev)=>[
                ...prev,
                newProfile
            ]);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveProfile(newProfile);
        // If client, notify admin
        if (role === 'client') {
            const adminUsers = allProfiles.filter((p)=>p.role === 'admin');
            adminUsers.forEach((admin)=>{
                setNotifications((prev)=>[
                        {
                            id: `notif-${Date.now()}-${admin.id}`,
                            recipientId: admin.id,
                            title: 'New Client Registration',
                            message: `${name} has registered and requires account approval and coach assignment.`,
                            type: 'account_pending',
                            linkTarget: {
                                view: 'admin'
                            },
                            isRead: false,
                            createdAt: new Date().toISOString()
                        },
                        ...prev
                    ]);
            });
        }
        return newProfile;
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
    const addExercise = (exercise)=>{
        const newEx = {
            ...exercise,
            id: `ex-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setExercises((prev)=>[
                newEx,
                ...prev
            ]);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveExercise(newEx);
        return newEx;
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
        const startDate = new Date(startDateStr);
        const newWorkouts = [];
        (prog.workouts || []).forEach((pw)=>{
            const workoutDate = new Date(startDate);
            workoutDate.setDate(workoutDate.getDate() + (pw.weekNumber - 1) * 7 + (pw.dayOfWeek - 1));
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
                        view: 'workouts'
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
                        exercises: loggedData
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
                            view: 'workouts'
                        },
                        isRead: false,
                        createdAt: new Date().toISOString()
                    },
                    ...prev
                ]);
        }
    };
    const submitCheckIn = (checkInData)=>{
        const newCheckIn = {
            ...checkInData,
            id: `chk-${Date.now()}`,
            status: 'submitted',
            submittedAt: new Date().toISOString()
        };
        setCheckIns((prev)=>[
                newCheckIn,
                ...prev
            ]);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveCheckIn(newCheckIn);
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
                        message: `${currentUser.fullName} submitted their weekly check-in for review.`,
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
        return newCheckIn;
    };
    const reviewCheckIn = (checkInId, coachFeedback)=>{
        let updatedChk;
        setCheckIns((prev)=>prev.map((c)=>{
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
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveCheckIn(updatedChk);
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
    };
    const logDailySteps = (dateStr, stepCount, notes)=>{
        const existing = stepRecords.find((s)=>s.clientId === currentUser.id && s.logDate === dateStr);
        let recordToSave;
        if (existing) {
            recordToSave = {
                ...existing,
                stepCount,
                notes,
                loggedAt: new Date().toISOString()
            };
            setStepRecords((prev)=>prev.map((s)=>s.id === existing.id ? recordToSave : s));
        } else {
            recordToSave = {
                id: `step-${Date.now()}`,
                clientId: currentUser.id,
                logDate: dateStr,
                stepCount,
                notes,
                loggedAt: new Date().toISOString()
            };
            setStepRecords((prev)=>[
                    recordToSave,
                    ...prev
                ]);
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveStepRecord(recordToSave);
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
    const logFoodItem = (item)=>{
        const newItem = {
            ...item,
            id: `flog-${Date.now()}`,
            loggedAt: new Date().toISOString()
        };
        setFoodLogs((prev)=>[
                newItem,
                ...prev
            ]);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveFoodLog(newItem);
    };
    const deleteFoodLogItem = (id)=>{
        setFoodLogs((prev)=>prev.filter((f)=>f.id !== id));
    };
    const sendMessage = (conversationId, content)=>{
        const newMsg = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderId: currentUser.id,
            senderName: currentUser.fullName,
            senderRole: currentUser.role,
            content,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        setMessages((prev)=>[
                ...prev,
                newMsg
            ]);
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$supabaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SupabaseService"].saveMessage(newMsg);
        setConversations((prev)=>prev.map((c)=>{
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
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AppContext.tsx",
        lineNumber: 776,
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
                type: 'VARCHAR(50)',
                nullable: true
            },
            {
                name: 'approval_status',
                type: 'VARCHAR(30)',
                description: 'pending | active | suspended'
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
                type: 'VARCHAR(30)',
                description: 'active | inactive | requested | declined'
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
                type: 'VARCHAR(100)'
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
                type: 'VARCHAR(50)'
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
                type: 'VARCHAR(50)'
            },
            {
                name: 'estimated_duration_min',
                type: 'INTEGER'
            },
            {
                name: 'difficulty_level',
                type: 'VARCHAR(50)'
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
                type: 'VARCHAR(50)'
            },
            {
                name: 'target_weight',
                type: 'NUMERIC',
                nullable: true
            },
            {
                name: 'weight_unit',
                type: 'VARCHAR(10)'
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
                type: 'VARCHAR(50)'
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
                type: 'INTEGER'
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
                type: 'DATE'
            },
            {
                name: 'status',
                type: 'VARCHAR(30)'
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
                type: 'VARCHAR(30)'
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
                type: 'NUMERIC'
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
                type: 'VARCHAR(10)'
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
                type: 'VARCHAR(50)'
            },
            {
                name: 'custom_interval_days',
                type: 'INTEGER',
                nullable: true
            },
            {
                name: 'day_of_week',
                type: 'VARCHAR(50)',
                nullable: true
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
                fkTarget: 'check_in_schedules.id',
                nullable: true
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
                type: 'VARCHAR(30)',
                description: 'pending | submitted | reviewed'
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
                type: 'VARCHAR(50)'
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
                type: 'VARCHAR(50)'
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
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. USERS & ASSIGNMENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'coach', 'client')),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(50),
  date_of_birth DATE,
  gender VARCHAR(50),
  approval_status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (approval_status IN ('pending', 'active', 'suspended', 'archived')),
  specializations TEXT[],
  bio TEXT,
  certifications TEXT[],
  years_of_experience NUMERIC,
  onboarding_completed BOOLEAN NOT NULL DEFAULT true,
  fitness_goals TEXT[],
  medical_conditions TEXT,
  height_cm NUMERIC,
  current_weight_kg NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.coach_client_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'requested', 'declined')),
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
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  muscle_groups TEXT[] NOT NULL DEFAULT '{}',
  equipment VARCHAR(100) NOT NULL,
  instructions TEXT NOT NULL,
  difficulty_level VARCHAR(50) NOT NULL DEFAULT 'Intermediate',
  is_global BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'hypertrophy',
  estimated_duration_min INTEGER NOT NULL DEFAULT 60,
  difficulty_level VARCHAR(50) NOT NULL DEFAULT 'intermediate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  order_index INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.exercise_set_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  target_reps VARCHAR(50) NOT NULL DEFAULT '10',
  target_weight NUMERIC DEFAULT 0,
  weight_unit VARCHAR(10) NOT NULL DEFAULT 'kg',
  target_duration_sec INTEGER,
  rest_period_sec INTEGER NOT NULL DEFAULT 90,
  instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL DEFAULT 8,
  difficulty_level VARCHAR(50) NOT NULL DEFAULT 'intermediate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL DEFAULT 1,
  day_of_week INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.program_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workout_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  program_assignment_id UUID REFERENCES public.program_assignments(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'missed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.workout_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.workout_assignments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_min INTEGER NOT NULL DEFAULT 45,
  perceived_difficulty NUMERIC NOT NULL DEFAULT 8,
  notes TEXT,
  coach_feedback TEXT,
  coach_feedback_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.completed_exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completion_id UUID NOT NULL REFERENCES public.workout_completions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  set_number INTEGER NOT NULL,
  actual_reps INTEGER NOT NULL,
  actual_weight NUMERIC NOT NULL DEFAULT 0,
  weight_unit VARCHAR(10) NOT NULL DEFAULT 'kg',
  actual_duration_sec INTEGER,
  completed BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 3. NUTRITION
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.nutrition_plan_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.nutrition_plans(id) ON DELETE CASCADE,
  meal_name VARCHAR(100) NOT NULL,
  meal_order INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  target_calories NUMERIC NOT NULL,
  target_protein_g NUMERIC NOT NULL,
  target_carbs_g NUMERIC NOT NULL,
  target_fat_g NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_meal_id UUID NOT NULL REFERENCES public.nutrition_plan_meals(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS public.nutrition_plan_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.nutrition_plans(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  custom_target_calories NUMERIC,
  custom_target_protein_g NUMERIC,
  custom_target_carbs_g NUMERIC,
  custom_target_fat_g NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.daily_nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  total_calories NUMERIC NOT NULL DEFAULT 0,
  total_protein_g NUMERIC NOT NULL DEFAULT 0,
  total_carbs_g NUMERIC NOT NULL DEFAULT 0,
  total_fat_g NUMERIC NOT NULL DEFAULT 0,
  adherence_rating INTEGER,
  adherence_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, log_date)
);

CREATE TABLE IF NOT EXISTS public.nutrition_log_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID NOT NULL REFERENCES public.daily_nutrition_logs(id) ON DELETE CASCADE,
  meal_name VARCHAR(100) NOT NULL,
  meal_order INTEGER NOT NULL DEFAULT 1,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.nutrition_log_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_meal_id UUID NOT NULL REFERENCES public.nutrition_log_meals(id) ON DELETE CASCADE,
  food_name VARCHAR(255) NOT NULL,
  quantity NUMERIC NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'g',
  calories NUMERIC NOT NULL,
  protein_g NUMERIC NOT NULL,
  carbs_g NUMERIC NOT NULL,
  fat_g NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 4. CHECK-INS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.check_in_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  frequency VARCHAR(50) NOT NULL DEFAULT 'weekly',
  custom_interval_days INTEGER,
  day_of_week VARCHAR(50) DEFAULT 'Sunday',
  time_of_day TIME DEFAULT '09:00:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  questions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.check_in_schedules(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'reviewed')),
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
CREATE TABLE IF NOT EXISTS public.progress_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  record_type VARCHAR(50) NOT NULL DEFAULT 'daily_metrics',
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

CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  progress_record_id UUID REFERENCES public.progress_records(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  photo_type VARCHAR(50) NOT NULL DEFAULT 'front',
  caption TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 6. MESSAGING
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(coach_id, client_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- 7. NOTIFICATIONS & SETTINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_workout_assignments_client_date ON public.workout_assignments(client_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_daily_nutrition_client_date ON public.daily_nutrition_logs(client_id, log_date);
CREATE INDEX IF NOT EXISTS idx_progress_records_client_date ON public.progress_records(client_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
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
                lineNumber: 34,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0));
        }
        switch(activeView){
            case 'dashboard':
                if (currentUser.role === 'client') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$ClientDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClientDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 39,
                    columnNumber: 51
                }, ("TURBOPACK compile-time value", void 0));
                if (currentUser.role === 'admin') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$AdminDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdminDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 40,
                    columnNumber: 50
                }, ("TURBOPACK compile-time value", void 0));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$CoachDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoachDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 41,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'clients':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$CoachDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoachDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 44,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'exercises':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ExerciseLibrary$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExerciseLibrary"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 47,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'programs':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ProgramBuilder$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProgramBuilder"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 50,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'calendar':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$WorkoutCalendarView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WorkoutCalendarView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 53,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'checkins':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInsView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckInsView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 56,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'nutrition':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$nutrition$2f$NutritionView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NutritionView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 59,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'steps':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$activity$2f$StepsTrackerView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["StepsTrackerView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 62,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'messages':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$messages$2f$MessagesView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MessagesView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 65,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'database':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$database$2f$DatabaseSchemaView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DatabaseSchemaView"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 68,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'admin':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$AdminDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdminDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 71,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$dashboard$2f$CoachDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CoachDashboard"], {}, void 0, false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 74,
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
                lineNumber: 81,
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
                        lineNumber: 89,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "min-w-0 flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12",
                        children: renderCurrentView()
                    }, void 0, false, {
                        fileName: "[project]/src/App.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layout$2f$MobileBottomNav$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["MobileBottomNav"], {
                onOpenMobileMenu: ()=>setIsMobileMenuOpen(true)
            }, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workouts$2f$ActiveWorkoutModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ActiveWorkoutModal"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInSubmitModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckInSubmitModal"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$checkins$2f$CheckInReviewModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CheckInReviewModal"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$notifications$2f$NotificationDrawer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NotificationDrawer"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$auth$2f$AuthModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthModal"], {
                isOpen: isAuthModalOpen,
                onClose: ()=>setIsAuthModalOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 108,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MainLayout, {}, void 0, false, {
            fileName: "[project]/src/App.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/App.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_f2524311._.js.map