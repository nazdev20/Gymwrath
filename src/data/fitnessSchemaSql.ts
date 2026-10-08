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
      { name: 'gender', type: 'VARCHAR(50)', nullable: true },
      { name: 'approval_status', type: 'VARCHAR(30)', description: 'pending | active | suspended' },
      { name: 'specializations', type: 'TEXT[]', nullable: true },
      { name: 'bio', type: 'TEXT', nullable: true },
      { name: 'certifications', type: 'TEXT[]', nullable: true },
      { name: 'years_of_experience', type: 'NUMERIC', nullable: true },
      { name: 'onboarding_completed', type: 'BOOLEAN' },
      { name: 'fitness_goals', type: 'TEXT[]', nullable: true },
      { name: 'medical_conditions', type: 'TEXT', nullable: true },
      { name: 'height_cm', type: 'NUMERIC', nullable: true },
      { name: 'current_weight_kg', type: 'NUMERIC', nullable: true },
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
      { name: 'status', type: 'VARCHAR(30)', description: 'active | inactive | requested | declined' },
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
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'muscle_groups', type: 'TEXT[]' },
      { name: 'equipment', type: 'VARCHAR(100)' },
      { name: 'instructions', type: 'TEXT' },
      { name: 'difficulty_level', type: 'VARCHAR(50)' },
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
      { name: 'type', type: 'VARCHAR(50)' },
      { name: 'estimated_duration_min', type: 'INTEGER' },
      { name: 'difficulty_level', type: 'VARCHAR(50)' },
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
      { name: 'target_reps', type: 'VARCHAR(50)' },
      { name: 'target_weight', type: 'NUMERIC', nullable: true },
      { name: 'weight_unit', type: 'VARCHAR(10)' },
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
      { name: 'difficulty_level', type: 'VARCHAR(50)' },
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
      { name: 'day_of_week', type: 'INTEGER' },
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
      { name: 'end_date', type: 'DATE' },
      { name: 'status', type: 'VARCHAR(30)' },
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
      { name: 'status', type: 'VARCHAR(30)' },
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
      { name: 'perceived_difficulty', type: 'NUMERIC' },
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
      { name: 'weight_unit', type: 'VARCHAR(10)' },
      { name: 'actual_duration_sec', type: 'INTEGER', nullable: true },
      { name: 'completed', type: 'BOOLEAN' },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMPTZ' }
    ]
  },

  // 3. Nutrition
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
      { name: 'frequency', type: 'VARCHAR(50)' },
      { name: 'custom_interval_days', type: 'INTEGER', nullable: true },
      { name: 'day_of_week', type: 'VARCHAR(50)', nullable: true },
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
      { name: 'schedule_id', type: 'UUID', isFk: true, fkTarget: 'check_in_schedules.id', nullable: true },
      { name: 'client_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'coach_id', type: 'UUID', isFk: true, fkTarget: 'profiles.id' },
      { name: 'due_date', type: 'DATE' },
      { name: 'status', type: 'VARCHAR(30)', description: 'pending | submitted | reviewed' },
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
      { name: 'record_type', type: 'VARCHAR(50)' },
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
      { name: 'photo_type', type: 'VARCHAR(50)' },
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
