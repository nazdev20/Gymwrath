/**
 * Complete Supabase PostgreSQL Schema Types
 * Based on the Fitness Coaching Platform Database ER Diagram
 */

export interface DbProfile {
  id: string;
  role: 'admin' | 'coach' | 'client';
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  approval_status: 'pending' | 'active' | 'suspended' | 'archived';
  specializations?: string[];
  bio?: string;
  certifications?: string[];
  years_of_experience?: number;
  onboarding_completed: boolean;
  fitness_goals?: string[];
  medical_conditions?: string;
  height_cm?: number;
  current_weight_kg?: number;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DbCoachClientAssignment {
  id: string;
  coach_id: string;
  client_id: string;
  status: 'active' | 'inactive' | 'requested' | 'declined';
  requested_at: string;
  responded_at?: string;
  deactivated_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbExercise {
  id: string;
  coach_id?: string;
  name: string;
  description: string;
  category: string;
  muscle_groups: string[];
  equipment: string;
  instructions: string;
  difficulty_level: string;
  is_global: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbWorkout {
  id: string;
  coach_id: string;
  name: string;
  description?: string;
  type: string;
  estimated_duration_min: number;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

export interface DbWorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  notes?: string;
  created_at: string;
}

export interface DbExerciseSetTemplate {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  target_reps: string;
  target_weight?: number;
  weight_unit: string;
  target_duration_sec?: number;
  rest_period_sec?: number;
  instructions?: string;
  created_at: string;
}

export interface DbTrainingProgram {
  id: string;
  coach_id: string;
  name: string;
  description?: string;
  duration_weeks: number;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
}

export interface DbProgramWorkout {
  id: string;
  program_id: string;
  workout_id: string;
  week_number: number;
  day_of_week: number;
  order_index: number;
  created_at: string;
}

export interface DbProgramAssignment {
  id: string;
  program_id: string;
  client_id: string;
  coach_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface DbWorkoutAssignment {
  id: string;
  client_id: string;
  coach_id: string;
  workout_id: string;
  program_assignment_id?: string;
  scheduled_date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbWorkoutCompletion {
  id: string;
  assignment_id: string;
  client_id: string;
  completed_at: string;
  duration_min: number;
  perceived_difficulty: number;
  notes?: string;
  coach_feedback?: string;
  coach_feedback_at?: string;
  created_at: string;
}

export interface DbCompletedExerciseSet {
  id: string;
  completion_id: string;
  exercise_id: string;
  set_number: number;
  actual_reps: number;
  actual_weight: number;
  weight_unit: string;
  actual_duration_sec?: number;
  completed: boolean;
  notes?: string;
  created_at: string;
}

export interface DbNutritionPlan {
  id: string;
  coach_id: string;
  name: string;
  description?: string;
  target_calories: number;
  target_protein_g: number;
  target_carbs_g: number;
  target_fat_g: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbNutritionPlanMeal {
  id: string;
  plan_id: string;
  meal_name: string;
  meal_order: number;
  description?: string;
  target_calories: number;
  target_protein_g: number;
  target_carbs_g: number;
  target_fat_g: number;
  created_at: string;
}

export interface DbMealFood {
  id: string;
  plan_meal_id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  notes?: string;
  created_at: string;
}

export interface DbNutritionPlanAssignment {
  id: string;
  plan_id: string;
  client_id: string;
  coach_id: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'paused';
  custom_target_calories?: number;
  custom_target_protein_g?: number;
  custom_target_carbs_g?: number;
  custom_target_fat_g?: number;
  created_at: string;
  updated_at: string;
}

export interface DbDailyNutritionLog {
  id: string;
  client_id: string;
  log_date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  adherence_rating?: number;
  adherence_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DbNutritionLogMeal {
  id: string;
  daily_log_id: string;
  meal_name: string;
  meal_order: number;
  consumed_at?: string;
  created_at: string;
}

export interface DbNutritionLogFood {
  id: string;
  log_meal_id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}

export interface DbCheckInSchedule {
  id: string;
  coach_id: string;
  client_id: string;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  custom_interval_days?: number;
  day_of_week?: string;
  time_of_day?: string;
  is_active: boolean;
  questions?: any;
  created_at: string;
  updated_at: string;
}

export interface DbCheckIn {
  id: string;
  schedule_id?: string;
  client_id: string;
  coach_id: string;
  due_date: string;
  status: 'pending' | 'submitted' | 'reviewed';
  submitted_at?: string;
  responses?: any;
  weight_kg?: number;
  notes?: string;
  coach_feedback?: string;
  coach_reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DbProgressRecord {
  id: string;
  client_id: string;
  recorded_at: string;
  record_type: 'daily_metrics' | 'weekly_checkin' | 'body_measurement' | 'step_entry';
  weight_kg?: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  bicep_left_cm?: number;
  bicep_right_cm?: number;
  thigh_left_cm?: number;
  thigh_right_cm?: number;
  calf_left_cm?: number;
  calf_right_cm?: number;
  step_count?: number;
  body_fat_percentage?: number;
  notes?: string;
  created_at: string;
}

export interface DbProgressPhoto {
  id: string;
  client_id: string;
  progress_record_id?: string;
  storage_path: string;
  photo_type: 'front' | 'side' | 'back' | 'other';
  caption?: string;
  uploaded_at: string;
}

export interface DbConversation {
  id: string;
  coach_id: string;
  client_id: string;
  last_message_at: string;
  created_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface DbSystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  updated_by?: string;
  updated_at: string;
}
