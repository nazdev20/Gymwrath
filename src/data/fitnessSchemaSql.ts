/**
 * Fitness Coaching Platform Database Schema SQL
 * Derived from ER Diagram: Users & Assignments, Workout & Training, Nutrition, Check-Ins, Progress, Messaging, Notifications & Settings
 */

export interface SchemaTableDefinition {
  name: string;
  module: 'Users & Assignments' | 'Workout & Training' | 'Nutrition' | 'Check-Ins' | 'Progress' | 'Messaging' | 'Notifications & Settings';
  description: string;
  columns: {
    name: string;
    type: string;
    isPk?: boolean;
    isFk?: boolean;
    fkTarget?: string;
    nullable?: boolean;
    description?: string;
  }[];
}

export const SCHEMA_TABLES: SchemaTableDefinition[] = [
  // 1. Users & Assignments
  {
    name: 'profiles',
    module: 'Users & Assignments',
    description: 'Core user profiles for athletes, coaches, and administrators',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary Key' },
      { name: 'role', type: 'VARCHAR(20)', description: 'admin | coach | client' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Unique user email' },
      { name: 'first_name', type: 'VARCHAR(100)' },
      { name: 'last_name', type: 'VARCHAR(100)' },
      { name: 'avatar_url', type: 'TEXT', nullable: true },
      { name: 'phone', type: 'VARCHAR(50)', nullable: true },
      { name: 'date_of_birth', type: 'DATE', nullable: true },
      { name: 'gender', type: 'TEXT', nullable: true, description: 'male | female | other | prefer_not_to_say' },
      { name: 'approval_status', type: 'TEXT', description: 'not_applicable | pending | approved | rejected' },
      { name: 'specializations', type: 'TEXT[]', nullable: true },
      { name: 'bio', type: 'TEXT', nullable: true },
      { name: 'certifications', type: 'TEXT[]', nullable: true },
      { name: 'years_of_experience', type: 'NUMERIC', nullable: true },
      { name: 'onboarding_completed', type: 'BOOLEAN' },
      { name: 'fitness_goals', type: 'TEXT[]', nullable: true },
      { name: 'medical_conditions', type: 'TEXT', nullable: true },
      { name: 'height_cm', type: 'NUMERIC', nullable: true },
      { name: 'current_weight_kg', type: 'NUMERIC', nullable: true },
      { name: 'target_weight_kg', type: 'NUMERIC', nullable: true, description: 'Client goal weight in kilograms' },
      { name: 'is_active', type: 'BOOLEAN' },
      { name: 'last_login_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'coach_client_assignments',
    module: 'Users & Assignments',
    description: 'Active and historical coach-to-client relationships',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'status', type: 'TEXT', description: 'pending | active | rejected | inactive | suspended | archived' },
      { name: 'requested_at', type: 'TIMESTAMPTZ' },
      { name: 'responded_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'deactivated_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },

  // 2. Workout & Training
  {
    name: 'exercises',
    module: 'Workout & Training',
    description: 'Master exercise movement database with form cues',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id', nullable: true },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'description', type: 'TEXT' },
      { name: 'category', type: 'TEXT', nullable: true, description: 'strength | cardio | flexibility | balance | plyometric | other' },
      { name: 'muscle_groups', type: 'TEXT[]' },
      { name: 'equipment', type: 'VARCHAR(100)' },
      { name: 'instructions', type: 'TEXT' },
      { name: 'difficulty_level', type: 'TEXT', nullable: true, description: 'beginner | intermediate | advanced' },
      { name: 'is_global', type: 'BOOLEAN' },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'workouts',
    module: 'Workout & Training',
    description: 'Prescribed training session templates',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'type', type: 'TEXT', nullable: true, description: 'strength | cardio | flexibility | hiit | mixed | other' },
      { name: 'estimated_duration_min', type: 'INTEGER' },
      { name: 'difficulty_level', type: 'TEXT', nullable: true, description: 'beginner | intermediate | advanced' },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'workout_exercises',
    module: 'Workout & Training',
    description: 'Ordered exercises nested inside a workout',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'workout_id', type: 'UUID', isFk: true, fkTarget: 'workouts.id' },
      { name: 'exercise_id', type: 'UUID', isFk: true, fkTarget: 'exercises.id' },
      { name: 'order_index', type: 'INTEGER' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'exercise_set_templates',
    module: 'Workout & Training',
    description: 'Prescribed set targets (reps, weight, RPE, rest) for each exercise',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'workout_exercise_id', type: 'UUID', isFk: true, fkTarget: 'workout_exercises.id' },
      { name: 'set_number', type: 'INTEGER' },
      { name: 'target_reps', type: 'INTEGER', nullable: true },
      { name: 'target_weight', type: 'NUMERIC', nullable: true },
      { name: 'weight_unit', type: 'TEXT', nullable: true, description: 'kg | lbs' },
      { name: 'target_duration_sec', type: 'INTEGER', nullable: true },
      { name: 'rest_period_sec', type: 'INTEGER', nullable: true },
      { name: 'instructions', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'training_programs',
    module: 'Workout & Training',
    description: 'Multi-week macrocycle and mesocycle training programs',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'duration_weeks', type: 'INTEGER' },
      { name: 'difficulty_level', type: 'TEXT', nullable: true, description: 'beginner | intermediate | advanced' },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'program_workouts',
    module: 'Workout & Training',
    description: 'Mapping of workouts to program weeks and training days',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'program_id', type: 'UUID', isFk: true, fkTarget: 'training_programs.id' },
      { name: 'workout_id', type: 'UUID', isFk: true, fkTarget: 'workouts.id' },
      { name: 'week_number', type: 'INTEGER' },
      { name: 'day_of_week', type: 'INTEGER', description: '0 = Sunday through 6 = Saturday' },
      { name: 'order_index', type: 'INTEGER' },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'program_assignments',
    module: 'Workout & Training',
    description: 'Assigned periodized training blocks to athletes',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'program_id', type: 'UUID', isFk: true, fkTarget: 'training_programs.id' },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'TEXT', description: 'active | paused | completed | cancelled' },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'workout_assignments',
    module: 'Workout & Training',
    description: 'Calendar date workout schedule for athletes',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'workout_id', type: 'UUID', isFk: true, fkTarget: 'workouts.id' },
      { name: 'program_assignment_id', type: 'UUID', isFk: true, fkTarget: 'program_assignments.id', nullable: true },
      { name: 'scheduled_date', type: 'DATE' },
      { name: 'status', type: 'TEXT', description: 'scheduled | due | completed | missed | skipped' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'workout_completions',
    module: 'Workout & Training',
    description: 'Actual logged workout performance sessions',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'assignment_id', type: 'UUID', isFk: true, fkTarget: 'workout_assignments.id' },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'completed_at', type: 'TIMESTAMPTZ' },
      { name: 'duration_min', type: 'INTEGER' },
      { name: 'perceived_difficulty', type: 'INTEGER', nullable: true, description: '1 through 10' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'coach_feedback', type: 'TEXT', nullable: true },
      { name: 'coach_feedback_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'completed_exercise_sets',
    module: 'Workout & Training',
    description: 'Actual sets, weights lifted, reps, and RPE executed',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'completion_id', type: 'UUID', isFk: true, fkTarget: 'workout_completions.id' },
      { name: 'exercise_id', type: 'UUID', isFk: true, fkTarget: 'exercises.id' },
      { name: 'set_number', type: 'INTEGER' },
      { name: 'actual_reps', type: 'INTEGER' },
      { name: 'actual_weight', type: 'NUMERIC' },
      { name: 'weight_unit', type: 'TEXT', nullable: true, description: 'kg | lbs' },
      { name: 'actual_duration_sec', type: 'INTEGER', nullable: true },
      { name: 'completed', type: 'BOOLEAN' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },

  // 3. Nutrition
  {
    name: 'food_catalog',
    module: 'Nutrition',
    description: 'Shared food catalog contributed to by authenticated users; barcode is optional',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'name', type: 'TEXT' },
      { name: 'brand', type: 'TEXT', nullable: true },
      { name: 'category', type: 'TEXT' },
      { name: 'food_type', type: 'TEXT', description: 'packaged | home_cooked | restaurant | fast_food | generic' },
      { name: 'barcode', type: 'TEXT', nullable: true, description: 'Optional barcode; blank for foods without packaging' },
      { name: 'serving_size', type: 'NUMERIC' },
      { name: 'serving_unit', type: 'TEXT', description: 'g | ml | piece | burger | slice | order, etc.' },
      { name: 'calories', type: 'NUMERIC' },
      { name: 'protein_g', type: 'NUMERIC' },
      { name: 'carbs_g', type: 'NUMERIC' },
      { name: 'fat_g', type: 'NUMERIC' },
      { name: 'fiber_g', type: 'NUMERIC' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_by', type: 'UUID', isFk: true, fkTarget: 'profiles.id', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'nutrition_plans',
    module: 'Nutrition',
    description: 'Prescribed dietary macro targets and meal templates',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'name', type: 'VARCHAR(255)' },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'target_calories', type: 'NUMERIC' },
      { name: 'target_protein_g', type: 'NUMERIC' },
      { name: 'target_carbs_g', type: 'NUMERIC' },
      { name: 'target_fat_g', type: 'NUMERIC' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'nutrition_plan_meals',
    module: 'Nutrition',
    description: 'Meals defined within a nutrition plan',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'plan_id', type: 'UUID', isFk: true, fkTarget: 'nutrition_plans.id' },
      { name: 'meal_name', type: 'VARCHAR(100)' },
      { name: 'meal_order', type: 'INTEGER' },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'target_calories', type: 'NUMERIC' },
      { name: 'target_protein_g', type: 'NUMERIC' },
      { name: 'target_carbs_g', type: 'NUMERIC' },
      { name: 'target_fat_g', type: 'NUMERIC' },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'meal_foods',
    module: 'Nutrition',
    description: 'Individual food items and portions within a planned meal',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'plan_meal_id', type: 'UUID', isFk: true, fkTarget: 'nutrition_plan_meals.id' },
      { name: 'food_name', type: 'VARCHAR(255)' },
      { name: 'quantity', type: 'NUMERIC' },
      { name: 'unit', type: 'VARCHAR(50)' },
      { name: 'calories', type: 'NUMERIC' },
      { name: 'protein_g', type: 'NUMERIC' },
      { name: 'carbs_g', type: 'NUMERIC' },
      { name: 'fat_g', type: 'NUMERIC' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'nutrition_plan_assignments',
    module: 'Nutrition',
    description: 'Client nutrition plan assignments with individual adjustments',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'plan_id', type: 'UUID', isFk: true, fkTarget: 'nutrition_plans.id' },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'start_date', type: 'DATE' },
      { name: 'end_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'VARCHAR(30)' },
      { name: 'custom_target_calories', type: 'NUMERIC', nullable: true },
      { name: 'custom_target_protein_g', type: 'NUMERIC', nullable: true },
      { name: 'custom_target_carbs_g', type: 'NUMERIC', nullable: true },
      { name: 'custom_target_fat_g', type: 'NUMERIC', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'daily_nutrition_logs',
    module: 'Nutrition',
    description: 'Daily food tracking aggregations and adherence rating',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'log_date', type: 'DATE' },
      { name: 'total_calories', type: 'NUMERIC' },
      { name: 'total_protein_g', type: 'NUMERIC' },
      { name: 'total_carbs_g', type: 'NUMERIC' },
      { name: 'total_fat_g', type: 'NUMERIC' },
      { name: 'adherence_rating', type: 'INTEGER', nullable: true },
      { name: 'adherence_notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'nutrition_log_meals',
    module: 'Nutrition',
    description: 'Meals logged by an athlete on a specific day',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'daily_log_id', type: 'UUID', isFk: true, fkTarget: 'daily_nutrition_logs.id' },
      { name: 'meal_name', type: 'VARCHAR(100)' },
      { name: 'meal_order', type: 'INTEGER' },
      { name: 'consumed_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'nutrition_log_foods',
    module: 'Nutrition',
    description: 'Foods consumed inside a logged meal',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'log_meal_id', type: 'UUID', isFk: true, fkTarget: 'nutrition_log_meals.id' },
      { name: 'food_name', type: 'VARCHAR(255)' },
      { name: 'quantity', type: 'NUMERIC' },
      { name: 'unit', type: 'VARCHAR(50)' },
      { name: 'calories', type: 'NUMERIC' },
      { name: 'protein_g', type: 'NUMERIC' },
      { name: 'carbs_g', type: 'NUMERIC' },
      { name: 'fat_g', type: 'NUMERIC' },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },

  // 4. Check-Ins
  {
    name: 'check_in_schedules',
    module: 'Check-Ins',
    description: 'Automated recurring check-in configuration for clients',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'frequency', type: 'TEXT', description: 'daily | weekly | biweekly | monthly | custom' },
      { name: 'custom_interval_days', type: 'INTEGER', nullable: true },
      { name: 'day_of_week', type: 'INTEGER', nullable: true, description: '0 = Sunday through 6 = Saturday' },
      { name: 'time_of_day', type: 'TIME', nullable: true },
      { name: 'is_active', type: 'BOOLEAN' },
      { name: 'questions', type: 'JSONB', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'check_ins',
    module: 'Check-Ins',
    description: 'Submitted athlete check-in entries with coach review & feedback',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'schedule_id', type: 'UUID', isFk: true, fkTarget: 'check_in_schedules.id' },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'due_date', type: 'DATE' },
      { name: 'status', type: 'TEXT', description: 'pending | submitted | missed | reviewed' },
      { name: 'submitted_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'responses', type: 'JSONB', nullable: true },
      { name: 'weight_kg', type: 'NUMERIC', nullable: true },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'coach_feedback', type: 'TEXT', nullable: true },
      { name: 'coach_reviewed_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  },

  // 5. Progress
  {
    name: 'progress_records',
    module: 'Progress',
    description: 'Anthropometric measurements, daily steps, and body composition',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'recorded_at', type: 'TIMESTAMPTZ' },
      { name: 'record_type', type: 'TEXT', description: 'weight | measurement | steps | photo | general' },
      { name: 'weight_kg', type: 'NUMERIC', nullable: true },
      { name: 'chest_cm', type: 'NUMERIC', nullable: true },
      { name: 'waist_cm', type: 'NUMERIC', nullable: true },
      { name: 'hips_cm', type: 'NUMERIC', nullable: true },
      { name: 'bicep_left_cm', type: 'NUMERIC', nullable: true },
      { name: 'bicep_right_cm', type: 'NUMERIC', nullable: true },
      { name: 'thigh_left_cm', type: 'NUMERIC', nullable: true },
      { name: 'thigh_right_cm', type: 'NUMERIC', nullable: true },
      { name: 'calf_left_cm', type: 'NUMERIC', nullable: true },
      { name: 'calf_right_cm', type: 'NUMERIC', nullable: true },
      { name: 'step_count', type: 'INTEGER', nullable: true },
      { name: 'body_fat_percentage', type: 'NUMERIC', nullable: true },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'progress_photos',
    module: 'Progress',
    description: 'Physique check-in photos with pose tagging',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'progress_record_id', type: 'UUID', isFk: true, fkTarget: 'progress_records.id', nullable: true },
      { name: 'storage_path', type: 'TEXT' },
      { name: 'photo_type', type: 'TEXT', nullable: true, description: 'front | side | back | other' },
      { name: 'caption', type: 'TEXT', nullable: true },
      { name: 'uploaded_at', type: 'TIMESTAMPTZ' }
    ]
  },

  // 6. Messaging
  {
    name: 'conversations',
    module: 'Messaging',
    description: 'Thread between coach and client',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'last_message_at', type: 'TIMESTAMPTZ' },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'messages',
    module: 'Messaging',
    description: 'Chat messages with timestamps and read status',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'conversation_id', type: 'UUID', isFk: true, fkTarget: 'conversations.id' },
      { name: 'sender_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'recipient_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'content', type: 'TEXT' },
      { name: 'is_read', type: 'BOOLEAN' },
      { name: 'read_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },

  // 7. Notifications & Settings
  {
    name: 'notifications',
    module: 'Notifications & Settings',
    description: 'Real-time alert notifications for athletes and coaches',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'user_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'type', type: 'VARCHAR(100)' },
      { name: 'title', type: 'VARCHAR(255)' },
      { name: 'body', type: 'TEXT' },
      { name: 'data', type: 'JSONB', nullable: true },
      { name: 'is_read', type: 'BOOLEAN' },
      { name: 'read_at', type: 'TIMESTAMPTZ', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },
  {
    name: 'system_settings',
    module: 'Notifications & Settings',
    description: 'Global and tenant configuration parameters',
    columns: [
      { name: 'id', type: 'UUID', isPk: true },
      { name: 'key', type: 'VARCHAR(100)', description: 'Unique setting key' },
      { name: 'value', type: 'JSONB' },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'updated_by', type: 'UUID', isFk: true, fkTarget: 'profiles.id', nullable: true },
      { name: 'updated_at', type: 'TIMESTAMPTZ' }
    ]
  }
];

export const FITNESS_SCHEMA_DDL_SQL = `-- ====================================================================
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
  target_weight_kg NUMERIC CHECK (target_weight_kg IS NULL OR target_weight_kg > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE fitness.profiles
  ADD COLUMN IF NOT EXISTS target_weight_kg NUMERIC
  CHECK (target_weight_kg IS NULL OR target_weight_kg > 0);


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


CREATE OR REPLACE FUNCTION fitness.log_workout_completion(
  p_assignment_id UUID,
  p_perceived_difficulty INTEGER DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_sets JSONB DEFAULT '[]'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_client_id UUID;
  v_workout_id UUID;
  v_assignment_status TEXT;
  v_completion_id UUID;
  v_exercise JSONB;
  v_set JSONB;
  v_exercise_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Sign in before logging a workout.';
  END IF;
  IF p_perceived_difficulty IS NOT NULL AND (p_perceived_difficulty < 1 OR p_perceived_difficulty > 10) THEN
    RAISE EXCEPTION 'Perceived difficulty must be between 1 and 10.';
  END IF;
  IF p_sets IS NULL OR jsonb_typeof(p_sets) <> 'array' THEN
    RAISE EXCEPTION 'Workout sets must be supplied as a JSON array.';
  END IF;

  SELECT wa.client_id, wa.workout_id, wa.status
    INTO v_client_id, v_workout_id, v_assignment_status
    FROM fitness.workout_assignments wa
   WHERE wa.id = p_assignment_id
   FOR UPDATE;
  IF NOT FOUND OR v_client_id <> v_user_id THEN
    RAISE EXCEPTION 'You can only log your own assigned workout.';
  END IF;
  IF v_assignment_status = 'completed'
    OR EXISTS (SELECT 1 FROM fitness.workout_completions wc WHERE wc.assignment_id = p_assignment_id) THEN
    RAISE EXCEPTION 'This workout has already been logged.';
  END IF;

  INSERT INTO fitness.workout_completions (
    assignment_id, client_id, completed_at, perceived_difficulty, notes
  )
  VALUES (
    p_assignment_id, v_user_id, now(), p_perceived_difficulty, NULLIF(btrim(p_notes), '')
  )
  RETURNING id INTO v_completion_id;

  FOR v_exercise IN SELECT value FROM jsonb_array_elements(p_sets) AS value LOOP
    IF jsonb_typeof(v_exercise->'sets') <> 'array'
      OR COALESCE(v_exercise->>'exerciseId', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
      CONTINUE;
    END IF;
    v_exercise_id := (v_exercise->>'exerciseId')::UUID;

    IF NOT EXISTS (
      SELECT 1 FROM fitness.workout_exercises we
      WHERE we.workout_id = v_workout_id AND we.exercise_id = v_exercise_id
    ) THEN
      CONTINUE;
    END IF;

    FOR v_set IN SELECT value FROM jsonb_array_elements(v_exercise->'sets') AS value LOOP
      INSERT INTO fitness.completed_exercise_sets (
        completion_id, exercise_id, set_number, actual_reps, actual_weight, weight_unit, completed, notes
      )
      VALUES (
        v_completion_id,
        v_exercise_id,
        GREATEST(COALESCE(NULLIF(v_set->>'setNumber', '')::INTEGER, 1), 1),
        NULLIF(v_set->>'actualReps', '')::INTEGER,
        NULLIF(v_set->>'actualWeightKg', '')::NUMERIC,
        'kg',
        COALESCE((v_set->>'completed')::BOOLEAN, false),
        NULLIF(btrim(v_exercise->>'clientNotes'), '')
      );
    END LOOP;
  END LOOP;

  UPDATE fitness.workout_assignments
     SET status = 'completed',
         updated_at = now()
   WHERE id = p_assignment_id AND client_id = v_user_id;
  RETURN v_completion_id;
END;
$function$;

REVOKE ALL ON FUNCTION fitness.log_workout_completion(UUID, INTEGER, TEXT, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION fitness.log_workout_completion(UUID, INTEGER, TEXT, JSONB) TO authenticated;

-- --------------------------------------------------------------------
-- 3. NUTRITION
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fitness.food_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (length(btrim(name)) > 0),
  brand TEXT,
  category TEXT NOT NULL DEFAULT 'Other'
    CHECK (category IN ('Protein','Carbohydrates','Fats','Dairy','Fruits','Vegetables','Snacks','Beverages','Other')),
  food_type TEXT NOT NULL DEFAULT 'generic'
    CHECK (food_type IN ('packaged','home_cooked','restaurant','fast_food','generic')),
  barcode TEXT NULL CHECK (barcode IS NULL OR (length(btrim(barcode)) > 0 AND barcode = btrim(barcode))),
  serving_size NUMERIC NOT NULL DEFAULT 100 CHECK (serving_size > 0),
  serving_unit TEXT NOT NULL DEFAULT 'g' CHECK (length(btrim(serving_unit)) > 0),
  calories NUMERIC NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein_g NUMERIC NOT NULL DEFAULT 0 CHECK (protein_g >= 0),
  carbs_g NUMERIC NOT NULL DEFAULT 0 CHECK (carbs_g >= 0),
  fat_g NUMERIC NOT NULL DEFAULT 0 CHECK (fat_g >= 0),
  fiber_g NUMERIC NOT NULL DEFAULT 0 CHECK (fiber_g >= 0),
  notes TEXT,
  created_by UUID REFERENCES fitness.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS food_catalog_barcode_unique
  ON fitness.food_catalog (lower(btrim(barcode)))
  WHERE barcode IS NOT NULL AND btrim(barcode) <> '';
CREATE INDEX IF NOT EXISTS food_catalog_name_search_idx
  ON fitness.food_catalog (lower(name));

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
  SELECT p.role INTO caller_role
  FROM fitness.profiles AS p
  WHERE p.id = auth.uid();
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

  SELECT p.role INTO caller_role
  FROM fitness.profiles AS p
  WHERE p.id = auth.uid();
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
    'food_catalog:food_catalog_authenticated_read',
    'food_catalog:food_catalog_authenticated_insert',
    'food_catalog:food_catalog_users_update_own',
    'food_catalog:food_catalog_users_delete_own',
    'food_catalog:food_catalog_admins_manage_all',
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

CREATE POLICY food_catalog_authenticated_read ON fitness.food_catalog
  FOR SELECT TO authenticated
  USING (true);
CREATE POLICY food_catalog_authenticated_insert ON fitness.food_catalog
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());
CREATE POLICY food_catalog_users_update_own ON fitness.food_catalog
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());
CREATE POLICY food_catalog_users_delete_own ON fitness.food_catalog
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());
CREATE POLICY food_catalog_admins_manage_all ON fitness.food_catalog
  FOR ALL TO authenticated
  USING (fitness.is_admin())
  WITH CHECK (fitness.is_admin());

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

NOTIFY pgrst, 'reload schema';
`;
