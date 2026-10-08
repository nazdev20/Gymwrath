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
  Conversation,
  Message,
  AppNotification
} from '../types';

// Empty datasets - App relies dynamically on Supabase live database tables
export const INITIAL_PROFILES: Profile[] = [];
export const INITIAL_EXERCISES: Exercise[] = [];
export const INITIAL_PROGRAMS: Program[] = [];
export const INITIAL_SCHEDULED_WORKOUTS: ScheduledWorkout[] = [];
export const INITIAL_CHECKINS: CheckIn[] = [];
export const INITIAL_STEP_RECORDS: StepRecord[] = [];
export const INITIAL_FOODS: Food[] = [];
export const INITIAL_NUTRITION_TARGETS: NutritionTarget[] = [];
export const INITIAL_MEAL_PLANS: MealPlan[] = [];
export const INITIAL_FOOD_LOGS: FoodLogItem[] = [];
export const INITIAL_CONVERSATIONS: Conversation[] = [];
export const INITIAL_MESSAGES: Message[] = [];
export const INITIAL_NOTIFICATIONS: AppNotification[] = [];
