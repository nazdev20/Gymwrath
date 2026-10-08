export type UserRole = 'admin' | 'coach' | 'client';
export type AccountStatus = 'pending' | 'active' | 'suspended' | 'archived';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl: string;
  phone?: string;
  timezone: string; // e.g. "America/New_York", "Australia/Sydney"
  createdAt: string;
  bio?: string;
  // Specific to clients:
  assignedCoachId?: string;
  goals?: string;
  startingWeightKg?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  heightCm?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  checkInDay?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

export interface ClientCoachAssignment {
  id: string;
  clientId: string;
  coachId: string;
  isPrimary: boolean;
  status: 'active' | 'inactive';
  assignedAt: string;
}

export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Quads' | 'Hamstrings' | 'Glutes' | 'Calves' | 'Biceps' | 'Triceps' | 'Core' | 'Full Body' | 'Cardio';
export type EquipmentType = 'Barbell' | 'Dumbbell' | 'Kettlebell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Bands' | 'Cardio Machine' | 'Other';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  muscleGroup: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment: EquipmentType;
  videoUrl?: string;
  isGlobal: boolean;
  createdBy: string; // userId or 'system'
  createdAt: string;
}

export interface PrescribedSet {
  setNumber: number;
  reps: string; // e.g. "8-10", "12", "AMRAP"
  targetWeightKg?: number;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  restSeconds?: number;
  tempo?: string; // e.g. "3-0-1-0"
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  sets: PrescribedSet[];
  notes?: string;
  supersetGroupId?: string;
}

export interface ProgramWorkout {
  id: string;
  programId: string;
  weekNumber: number;
  dayOfWeek: number; // 1 = Monday ... 7 = Sunday
  title: string;
  description?: string;
  exercises: WorkoutExercise[];
  estimatedDurationMin?: number;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  createdBy: string; // coachId
  isTemplate: boolean;
  createdAt: string;
  workouts: ProgramWorkout[];
}

export type WorkoutStatus = 'scheduled' | 'in_progress' | 'completed' | 'missed';

export interface LoggedSet {
  setNumber: number;
  actualReps: number;
  actualWeightKg: number;
  rpe?: number;
  completed: boolean;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: LoggedSet[];
  clientNotes?: string;
}

export interface ScheduledWorkout {
  id: string;
  clientId: string;
  coachId: string;
  programId?: string;
  scheduledDate: string; // YYYY-MM-DD
  title: string;
  description?: string;
  exercises: WorkoutExercise[];
  status: WorkoutStatus;
  completedAt?: string;
  actualDurationMin?: number;
  loggedData?: LoggedExercise[];
  clientFeedback?: string;
  coachFeedback?: string;
  overallRpe?: number;
}

export interface ProgressPhoto {
  id: string;
  checkInId: string;
  clientId: string;
  photoType: 'front' | 'side' | 'back';
  url: string;
  uploadedAt: string;
}

export interface CheckIn {
  id: string;
  clientId: string;
  coachId: string;
  checkInDate: string; // YYYY-MM-DD
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  armsCm?: number;
  hipsCm?: number;
  thighsCm?: number;
  sleepRating: number; // 1-10
  stressRating: number; // 1-10
  energyRating: number; // 1-10
  hungerRating: number; // 1-10
  digestionRating?: number; // 1-10
  workoutAdherenceRating: number; // 1-10
  nutritionAdherenceRating: number; // 1-10
  clientNotes: string;
  questions?: string;
  photos: ProgressPhoto[];
  status: 'submitted' | 'reviewed';
  reviewedAt?: string;
  coachFeedback?: string;
  submittedAt: string;
}

export interface StepRecord {
  id: string;
  clientId: string;
  logDate: string; // YYYY-MM-DD (Strict unique per client+date)
  stepCount: number;
  notes?: string;
  loggedAt: string;
  updatedAt?: string;
}

export interface Food {
  id: string;
  name: string;
  category: 'Protein' | 'Carbohydrates' | 'Fats' | 'Dairy' | 'Fruits' | 'Vegetables' | 'Snacks' | 'Beverages' | 'Other';
  servingSize: number;
  servingUnit: string; // 'g', 'ml', 'unit', 'tbsp', 'scoop'
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  isGlobal: boolean;
  createdBy: string;
  createdAt: string;
}

export interface NutritionTarget {
  id: string;
  clientId: string;
  coachId: string;
  targetType: 'daily' | 'training_day' | 'rest_day';
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterLiters?: number;
  notes?: string;
  effectiveDate: string; // YYYY-MM-DD
}

export interface MealPlanItem {
  id: string;
  mealName: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Post-Workout';
  foodId: string;
  foodName: string;
  quantity: number; // in servingUnit
  unit: string;
  calculatedCalories: number;
  calculatedProtein: number;
  calculatedCarbs: number;
  calculatedFat: number;
  notes?: string;
}

export interface MealPlan {
  id: string;
  clientId: string;
  coachId: string;
  title: string;
  notes?: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  items: MealPlanItem[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodLogItem {
  id: string;
  clientId: string;
  logDate: string; // YYYY-MM-DD
  mealName: 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Post-Workout';
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  loggedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  isRead: boolean;
  createdAt: string;
  attachmentUrl?: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  coachId: string;
  coachName: string;
  coachAvatar: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCountCoach: number;
  unreadCountClient: number;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'checkin_submitted' | 'checkin_reviewed' | 'workout_completed' | 'workout_assigned' | 'new_message' | 'account_pending' | 'step_goal';
  linkTarget?: {
    view: 'dashboard' | 'clients' | 'workouts' | 'checkins' | 'steps' | 'nutrition' | 'messages' | 'admin';
    entityId?: string;
  };
  isRead: boolean;
  createdAt: string;
}
