import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Footprints,
  Flame,
  Utensils,
  ClipboardCheck,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const {
    currentUser,
    scheduledWorkouts,
    stepRecords,
    nutritionTargets,
    foodLogs,
    checkIns,
    getCoachForCurrentClient,
    setActiveView,
    setActiveWorkoutModalId,
    setIsCheckInModalOpen,
    logDailySteps
  } = useApp();

  const coach = getCoachForCurrentClient();
  const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const todayStr = toLocalDateKey(today);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 6);
  const weekStartStr = toLocalDateKey(weekStart);

  // Today's workout
  const todayWorkout = scheduledWorkouts.find(
    w => w.clientId === currentUser.id && w.scheduledDate === todayStr
  );

  // Today's steps
  const todayStepRecord = stepRecords.find(
    r => r.clientId === currentUser.id && r.logDate === todayStr
  );
  const [stepInput, setStepInput] = useState<string>(todayStepRecord ? String(todayStepRecord.stepCount) : '');
  const [stepSuccessMsg, setStepSuccessMsg] = useState(false);
  const [stepSaveError, setStepSaveError] = useState<string | null>(null);
  const [isSavingSteps, setIsSavingSteps] = useState(false);

  useEffect(() => {
    if (todayStepRecord) setStepInput(String(todayStepRecord.stepCount));
  }, [todayStepRecord?.stepCount]);

  const handleSaveSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingSteps) return;
    const count = Number(stepInput);
    if (!Number.isInteger(count) || count < 0 || count > 100000) {
      setStepSaveError('Enter a step count from 0 to 100,000.');
      return;
    }

    setStepSaveError(null);
    setStepSuccessMsg(false);
    setIsSavingSteps(true);
    try {
      const result = await logDailySteps(todayStr, count);
      if (!result.success) {
        setStepSaveError(result.error || 'Step record was not saved.');
        return;
      }
      setStepSuccessMsg(true);
      setTimeout(() => setStepSuccessMsg(false), 2500);
    } catch (error) {
      setStepSaveError(error instanceof Error ? error.message : 'Step record was not saved.');
    } finally {
      setIsSavingSteps(false);
    }
  };

  // Today's Nutrition & Macros
  const currentTarget = nutritionTargets.find(t => t.clientId === currentUser.id) || {
    caloriesKcal: 2000,
    proteinG: 140,
    carbsG: 210,
    fatG: 55
  };

  const todayFoodLogs = foodLogs.filter(
    fl => fl.clientId === currentUser.id && fl.logDate === todayStr
  );

  const consumedCalories = todayFoodLogs.reduce((sum, f) => sum + f.calories, 0);
  const consumedProtein = todayFoodLogs.reduce((sum, f) => sum + f.proteinG, 0);
  const consumedCarbs = todayFoodLogs.reduce((sum, f) => sum + f.carbsG, 0);
  const consumedFat = todayFoodLogs.reduce((sum, f) => sum + f.fatG, 0);

  // Check-In Status
  const latestCheckIn = checkIns
    .filter(c => c.clientId === currentUser.id)
    .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())[0];

  const weeklyCompletedWorkouts = scheduledWorkouts.filter(workout => {
    if (workout.clientId !== currentUser.id || workout.status !== 'completed') return false;
    const completedDate = workout.completedAt ? toLocalDateKey(new Date(workout.completedAt)) : workout.scheduledDate;
    return completedDate >= weekStartStr && completedDate <= todayStr;
  });
  // Count distinct calendar days, not workouts, so multiple sessions on one day do not inflate consistency.
  const weeklyTrainingDays = new Set(weeklyCompletedWorkouts.map(workout =>
    workout.completedAt ? toLocalDateKey(new Date(workout.completedAt)) : workout.scheduledDate
  )).size;
  const weeklySteps = stepRecords.filter(record =>
    record.clientId === currentUser.id && record.logDate >= weekStartStr && record.logDate <= todayStr
  );
  const weeklyAverageSteps = weeklySteps.length
    ? Math.round(weeklySteps.reduce((sum, record) => sum + record.stepCount, 0) / weeklySteps.length)
    : 0;
  const weeklyNutritionDays = new Set(
    foodLogs
      .filter(log => log.clientId === currentUser.id && log.logDate >= weekStartStr && log.logDate <= todayStr)
      .map(log => log.logDate)
  ).size;

  const latestCompletedWorkout = scheduledWorkouts
    .filter(workout => workout.clientId === currentUser.id && workout.status === 'completed')
    .sort((a, b) => (b.completedAt || b.scheduledDate).localeCompare(a.completedAt || a.scheduledDate))[0];

  const latestWorkoutPersonalRecords = (() => {
    if (!latestCompletedWorkout?.loggedData?.length) return [];
    const latestDate = latestCompletedWorkout.completedAt || latestCompletedWorkout.scheduledDate;
    const earlierWorkouts = scheduledWorkouts.filter(workout =>
      workout.clientId === currentUser.id &&
      workout.status === 'completed' &&
      workout.id !== latestCompletedWorkout.id &&
      (workout.completedAt || workout.scheduledDate) < latestDate
    );
    const bestByExercise = new Map<string, number>();
    earlierWorkouts.forEach(workout => (workout.loggedData || []).forEach(exercise => {
      exercise.sets.filter(set => set.completed && set.actualWeightKg > 0).forEach(set => {
        bestByExercise.set(exercise.exerciseId, Math.max(bestByExercise.get(exercise.exerciseId) || 0, set.actualWeightKg));
      });
    }));
    return latestCompletedWorkout.loggedData.flatMap(exercise => {
      const previousBest = bestByExercise.get(exercise.exerciseId) || 0;
      const bestSet = exercise.sets
        .filter(set => set.completed && set.actualWeightKg > previousBest && set.actualWeightKg > 0)
        .sort((a, b) => b.actualWeightKg - a.actualWeightKg)[0];
      return bestSet && previousBest > 0
        ? [{ exerciseName: exercise.exerciseName, weight: bestSet.actualWeightKg, reps: bestSet.actualReps }]
        : [];
    });
  })();

  return (
    <div className="min-w-0 space-y-6">
      {/* Welcome Banner */}
      <div className="min-w-0 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="relative z-10 flex min-w-0 flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Today's Mission
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="break-words text-xl sm:text-3xl leading-tight font-extrabold text-white tracking-tight">
              Ready to lock in, {currentUser.fullName.split(' ')[0]}?
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {todayWorkout
                ? todayWorkout.status === 'completed'
                  ? 'Work logged. Review your next target and keep the progress measurable.'
                  : `Your session "${todayWorkout.title}" is ready. Follow the plan, log each set, and own the result.`
                : 'No session is assigned today. Recovery is part of the plan—move, refuel, and come back ready.'}
            </p>
          </div>

          {coach && (
            <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 shrink-0">
              <img
                src={coach.avatarUrl}
                alt={coach.fullName}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-emerald-500/50"
              />
              <div>
                <p className="text-xs text-slate-400">Your Coach</p>
                <p className="text-sm font-bold text-white">{coach.fullName}</p>
                <button
                  onClick={() => setActiveView('messages')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 mt-0.5"
                >
                  <MessageSquare className="w-3 h-3" /> Send message
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Summary: a concise report of logged activity */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Weekly report</h2>
            <p className="mt-1 text-xs text-slate-400">Work logged. The target is getting closer.</p>
          </div>
          <button onClick={() => setActiveView('progress')} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
            View progress report →
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Sessions completed</span>
              <Dumbbell className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">{weeklyCompletedWorkouts.length}</p>
            <p className="mt-1 text-xs text-slate-500">In the last 7 days</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Training days</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">{weeklyTrainingDays}<span className="ml-1 text-sm font-semibold text-slate-400">/ 7</span></p>
            <p className="mt-1 text-xs text-slate-500">Distinct days with a saved session</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Average steps</span>
              <Footprints className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">{weeklyAverageSteps.toLocaleString()}</p>
            <p className="mt-1 text-xs text-slate-500">{weeklySteps.length} logged days</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Nutrition days logged</span>
              <Utensils className="h-4 w-4 text-orange-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white">{weeklyNutritionDays}<span className="ml-1 text-sm font-semibold text-slate-400">/ 7</span></p>
            <p className="mt-1 text-xs text-slate-500">At least one meal entry</p>
          </div>
        </div>
      </section>

      {latestWorkoutPersonalRecords.length > 0 && (
        <section className="rounded-xl border border-emerald-500/30 bg-slate-900 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">New personal record</p>
              <h2 className="mt-1 text-base font-extrabold text-white">The bar just moved.</h2>
              <p className="mt-1 text-xs text-slate-400">A saved set beat your previous recorded best. Target hit—set the bar higher.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {latestWorkoutPersonalRecords.map(record => (
                  <span key={record.exerciseName} className="rounded-lg border border-slate-700 bg-slate-850 px-3 py-2 text-xs text-slate-200">
                    <strong className="text-white">{record.exerciseName}</strong>
                    <span className="ml-2 font-mono text-emerald-400">{record.weight} kg × {record.reps}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid: Workout Card & Step Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Workout Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Today's Workout</h2>
                  <p className="text-xs text-slate-400">Every rep has a target.</p>
                </div>
              </div>

              {todayWorkout && (
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    todayWorkout.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}
                >
                  {todayWorkout.status === 'completed' ? '✓ Completed' : 'Scheduled'}
                </span>
              )}
            </div>

            {todayWorkout ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-750">
                  <h3 className="text-base font-bold text-white">{todayWorkout.title}</h3>
                  {todayWorkout.description && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{todayWorkout.description}</p>
                  )}

                  {/* Exercise list preview */}
                  <div className="mt-4 space-y-2 border-t border-slate-750 pt-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Exercises ({todayWorkout.exercises.length})
                    </p>
                    <div className="space-y-1.5">
                      {todayWorkout.exercises.map((we, idx) => (
                        <div
                          key={we.id}
                          className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-800/60"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 font-mono text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span className="font-medium text-slate-200">{we.exerciseName}</span>
                          </div>
                          <span className="text-slate-400 font-mono">
                            {we.sets.length} sets • {we.sets[0]?.reps || '8-10'} reps
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setActiveWorkoutModalId(todayWorkout.id)}
                    className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {todayWorkout.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> View / Edit Logged Workout
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" /> Start & Log Workout Now
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveView('calendar')}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    View Schedule
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 px-4 rounded-xl bg-slate-850/50 border border-slate-800">
                <Dumbbell className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <h3 className="text-base font-bold text-white">Active Recovery Day</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  No workout scheduled for today. Focus on mobility, hydration, and hitting your daily step target.
                </p>
                <button
                  onClick={() => setActiveView('calendar')}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-white border border-slate-700 transition-colors"
                >
                  Browse Program Calendar
                </button>
              </div>
            )}
          </div>

          {/* Daily Nutrition Macro Tracker */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Fuel the Target</h2>
                  <p className="text-xs text-slate-400">Today's calories and macros, measured against your plan.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('nutrition')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                Open Meal Diary <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Macro Bars */}
            <div className="space-y-3">
              {/* Calories */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Calories</span>
                  <span className="text-slate-400">
                    <span className="text-white font-bold">{consumedCalories}</span> / {currentTarget.caloriesKcal} kcal
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (consumedCalories / currentTarget.caloriesKcal) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 min-[420px]:grid-cols-3 gap-2 sm:gap-3 pt-2">
                {/* Protein */}
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">Protein</p>
                  <p className="text-base font-extrabold text-white mt-0.5">
                    {Math.round(consumedProtein)} <span className="text-xs font-normal text-slate-400">/ {currentTarget.proteinG}g</span>
                  </p>
                  <div className="h-1.5 w-full bg-slate-750 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, (consumedProtein / currentTarget.proteinG) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Carbs */}
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">Carbs</p>
                  <p className="text-base font-extrabold text-white mt-0.5">
                    {Math.round(consumedCarbs)} <span className="text-xs font-normal text-slate-400">/ {currentTarget.carbsG}g</span>
                  </p>
                  <div className="h-1.5 w-full bg-slate-750 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (consumedCarbs / currentTarget.carbsG) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Fat */}
                <div className="p-3 rounded-xl bg-slate-850 border border-slate-750">
                  <p className="text-[11px] font-semibold uppercase text-slate-400">Fats</p>
                  <p className="text-base font-extrabold text-white mt-0.5">
                    {Math.round(consumedFat)} <span className="text-xs font-normal text-slate-400">/ {currentTarget.fatG}g</span>
                  </p>
                  <div className="h-1.5 w-full bg-slate-750 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${Math.min(100, (consumedFat / currentTarget.fatG) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Step Tracker & Check-In Card */}
        <div className="space-y-6">
          {/* Step Logger Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Daily Steps</h2>
                  <p className="text-xs text-slate-400">Manual step entry</p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('steps')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                History →
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 text-center mb-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Today's Step Count</span>
              <div className="text-3xl font-extrabold text-white my-1 font-mono">
                {todayStepRecord ? todayStepRecord.stepCount.toLocaleString() : '0'}
              </div>
              <span className="text-xs text-slate-400">Target: 10,000 steps</span>
            </div>

            {/* Quick Log Form */}
            <form onSubmit={handleSaveSteps} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={100000}
                  placeholder="Enter step count..."
                  value={stepInput}
                  onChange={e => setStepInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={isSavingSteps}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0 disabled:cursor-wait disabled:opacity-60"
                >
                  {isSavingSteps ? 'Saving…' : 'Log steps'}
                </button>
              </div>
              {stepSuccessMsg && (
                <p role="status" className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Movement logged. Keep momentum.
                </p>
              )}
              {stepSaveError && <p role="alert" className="text-xs text-rose-400">{stepSaveError}</p>}
            </form>
          </div>

          {/* Check-In Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Check-In</h2>
                <p className="text-xs text-slate-400">Weight, measurements & photos</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Check-in Day:</span>
                <span className="text-white font-semibold">{currentUser.checkInDay || 'Sunday'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Latest Submission:</span>
                <span className="text-slate-200 font-mono">
                  {latestCheckIn ? latestCheckIn.checkInDate : 'None yet'}
                </span>
              </div>
              {latestCheckIn && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Coach Feedback:</span>
                  <span className={`font-semibold ${latestCheckIn.status === 'reviewed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {latestCheckIn.status === 'reviewed' ? '✓ Feedback Received' : 'Pending Review'}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardCheck className="w-4 h-4" /> Submit Check-In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
