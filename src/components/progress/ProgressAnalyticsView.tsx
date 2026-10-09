import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Award,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Footprints,
  Scale,
  Target,
  TrendingUp,
  Utensils
} from 'lucide-react';

type RangeDays = 7 | 30;

const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const dateFromKey = (dateKey: string) => new Date(`${dateKey}T12:00:00`);
const formatShortDate = (dateKey: string) => dateFromKey(dateKey).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const formatDay = (dateKey: string) => dateFromKey(dateKey).toLocaleDateString('en-US', { weekday: 'short' });

export const ProgressAnalyticsView: React.FC = () => {
  const {
    currentUser,
    scheduledWorkouts,
    stepRecords,
    foodLogs,
    checkIns,
    nutritionTargets,
    updateProfile
  } = useApp();

  const [rangeDays, setRangeDays] = useState<RangeDays>(7);
  const [targetWeightInput, setTargetWeightInput] = useState(
    currentUser.targetWeightKg == null ? '' : String(currentUser.targetWeightKg)
  );
  const [isSavingTarget, setIsSavingTarget] = useState(false);
  const [targetMessage, setTargetMessage] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);

  const today = new Date();
  const todayKey = toLocalDateKey(today);
  const periodStart = new Date(today);
  periodStart.setDate(periodStart.getDate() - (rangeDays - 1));
  const periodStartKey = toLocalDateKey(periodStart);

  const periodDates = useMemo(() => {
    return Array.from({ length: rangeDays }, (_, index) => {
      const date = new Date(periodStart);
      date.setDate(periodStart.getDate() + index);
      return toLocalDateKey(date);
    });
  }, [rangeDays, periodStartKey]);

  const myWorkouts = scheduledWorkouts.filter(workout => {
    if (workout.clientId !== currentUser.id || workout.status !== 'completed') return false;
    const completedDate = workout.completedAt ? toLocalDateKey(new Date(workout.completedAt)) : workout.scheduledDate;
    return completedDate >= periodStartKey && completedDate <= todayKey;
  });

  const myStepRecords = stepRecords.filter(
    record => record.clientId === currentUser.id && record.logDate >= periodStartKey && record.logDate <= todayKey
  );
  const stepByDate = new Map<string, number>();
  myStepRecords.forEach(record => stepByDate.set(record.logDate, record.stepCount));
  const averageSteps = myStepRecords.length
    ? Math.round(myStepRecords.reduce((sum, record) => sum + record.stepCount, 0) / myStepRecords.length)
    : 0;
  const stepGoalDays = myStepRecords.filter(record => record.stepCount >= 10000).length;

  const myFoodLogs = foodLogs.filter(
    log => log.clientId === currentUser.id && log.logDate >= periodStartKey && log.logDate <= todayKey
  );
  const foodByDate = new Map<string, { calories: number; protein: number; entries: number }>();
  myFoodLogs.forEach(log => {
    const current = foodByDate.get(log.logDate) || { calories: 0, protein: 0, entries: 0 };
    current.calories += log.calories;
    current.protein += log.proteinG;
    current.entries += 1;
    foodByDate.set(log.logDate, current);
  });
  const nutritionDays = foodByDate.size;
  const averageLoggedCalories = nutritionDays
    ? Math.round(Array.from(foodByDate.values()).reduce((sum, day) => sum + day.calories, 0) / nutritionDays)
    : 0;
  const averageLoggedProtein = nutritionDays
    ? Math.round(Array.from(foodByDate.values()).reduce((sum, day) => sum + day.protein, 0) / nutritionDays)
    : 0;

  const myCheckIns = checkIns
    .filter(checkIn => checkIn.clientId === currentUser.id && checkIn.checkInDate <= todayKey)
    .sort((a, b) => b.checkInDate.localeCompare(a.checkInDate));
  const latestCheckIn = myCheckIns[0];
  const weightHistory = [...myCheckIns]
    .filter(checkIn => checkIn.weightKg > 0)
    .slice(0, 8)
    .reverse();

  const currentWeight = latestCheckIn?.weightKg || currentUser.currentWeightKg;
  const targetWeight = currentUser.targetWeightKg;
  const nutritionTarget = nutritionTargets
    .filter(target => target.clientId === currentUser.id)
    .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate))[0];

  const personalBests = useMemo(() => {
    const bestByExercise = new Map<string, { exerciseName: string; weight: number; reps: number; date: string }>();
    scheduledWorkouts
      .filter(workout => workout.clientId === currentUser.id && workout.status === 'completed')
      .forEach(workout => {
        (workout.loggedData || []).forEach(exercise => {
          exercise.sets.filter(set => set.completed && set.actualWeightKg > 0).forEach(set => {
            const previous = bestByExercise.get(exercise.exerciseId);
            if (!previous || set.actualWeightKg > previous.weight) {
              bestByExercise.set(exercise.exerciseId, {
                exerciseName: exercise.exerciseName,
                weight: set.actualWeightKg,
                reps: set.actualReps,
                date: workout.completedAt ? toLocalDateKey(new Date(workout.completedAt)) : workout.scheduledDate
              });
            }
          });
        });
      });
    return Array.from(bestByExercise.values()).sort((a, b) => b.weight - a.weight).slice(0, 5);
  }, [scheduledWorkouts, currentUser.id]);

  const handleSaveTarget = async (event: React.FormEvent) => {
    event.preventDefault();
    setTargetError(null);
    setTargetMessage(null);

    const trimmed = targetWeightInput.trim();
    const parsed = trimmed ? Number(trimmed) : undefined;
    if (trimmed && (!Number.isFinite(parsed) || parsed! <= 0 || parsed! > 500)) {
      setTargetError('Enter a target weight between 0.1 and 500 kg, or leave it blank to clear the target.');
      return;
    }

    setIsSavingTarget(true);
    try {
      const saved = await updateProfile({ targetWeightKg: parsed });
      if (!saved) {
        setTargetError('The target could not be saved. Check your connection and try again.');
        return;
      }
      setTargetMessage(parsed == null ? 'Target cleared.' : 'Target saved. Keep the plan measurable.');
    } catch (error) {
      setTargetError(error instanceof Error ? error.message : 'The target could not be saved.');
    } finally {
      setIsSavingTarget(false);
    }
  };

  const maxStepCount = Math.max(10000, ...periodDates.map(date => stepByDate.get(date) || 0));
  const stepBarHeight = (count: number) => `${Math.max(3, Math.round((count / maxStepCount) * 100))}%`;

  return (
    <div className="min-w-0 space-y-6">
      <header className="space-y-3 border-b border-slate-800 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          <TrendingUp className="h-4 w-4" />
          Proof of work
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">The work speaks.</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              Channel the fire. Own the result. Review your logged progress and set the next target.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            {([7, 30] as RangeDays[]).map(days => (
              <button
                key={days}
                type="button"
                onClick={() => setRangeDays(days)}
                aria-pressed={rangeDays === days}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${rangeDays === days ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                {days === 7 ? '7 days' : '30 days'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Workouts completed</span>
            <DumbbellIcon />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-white">{myWorkouts.length}</p>
          <p className="mt-1 text-xs text-slate-500">In the last {rangeDays} days</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average steps</span>
            <Footprints className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-white">{averageSteps.toLocaleString()}</p>
          <p className="mt-1 text-xs text-slate-500">{stepGoalDays} logged days reached 10,000</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Nutrition logged</span>
            <Utensils className="h-4 w-4 text-orange-400" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-white">{nutritionDays}<span className="ml-1 text-base font-semibold text-slate-400">/ {rangeDays}</span></p>
          <p className="mt-1 text-xs text-slate-500">Days with at least one food entry</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Latest check-in</span>
            <CalendarCheck className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white">{latestCheckIn ? `${latestCheckIn.weightKg} kg` : '—'}</p>
          <p className="mt-1 text-xs text-slate-500">{latestCheckIn ? formatShortDate(latestCheckIn.checkInDate) : 'No check-in logged yet'}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Daily movement</h2>
              <p className="mt-1 text-xs text-slate-400">Logged steps · 10,000-step reference line</p>
            </div>
            <Footprints className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex h-36 items-end gap-1.5 border-b border-slate-700 pb-2">
            {periodDates.map(date => {
              const count = stepByDate.get(date) || 0;
              return (
                <div key={date} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                  <div className="flex h-full w-full items-end">
                    <div
                      className={`w-full rounded-t-sm ${count >= 10000 ? 'bg-emerald-500' : count > 0 ? 'bg-slate-600' : 'bg-slate-800'}`}
                      style={{ height: stepBarHeight(count) }}
                      title={`${date}: ${count.toLocaleString()} steps`}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500">{rangeDays === 7 ? formatDay(date) : date.slice(-2)}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">Only recorded step entries are counted. Missing days are not treated as zero effort.</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Fuel check</h2>
              <p className="mt-1 text-xs text-slate-400">Average on days when food was logged</p>
            </div>
            <Utensils className="h-5 w-5 text-orange-400" />
          </div>
          {nutritionDays ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-slate-300">Calories</span>
                  <span className="font-mono text-lg font-bold text-white">{averageLoggedCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {nutritionTarget?.caloriesKcal || 2000} kcal</span></span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, (averageLoggedCalories / (nutritionTarget?.caloriesKcal || 2000)) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-slate-300">Protein</span>
                  <span className="font-mono text-lg font-bold text-white">{averageLoggedProtein} <span className="text-xs font-normal text-slate-400">/ {nutritionTarget?.proteinG || 140} g</span></span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${Math.min(100, (averageLoggedProtein / (nutritionTarget?.proteinG || 140)) * 100)}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-28 flex-col items-center justify-center text-center">
              <Utensils className="mb-2 h-6 w-6 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No food entries in this period</p>
              <p className="mt-1 text-xs text-slate-500">Log a meal to establish a baseline.</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Body-weight trend</h2>
              <p className="mt-1 text-xs text-slate-400">Based on submitted check-ins</p>
            </div>
            <Scale className="h-5 w-5 text-amber-400" />
          </div>
          {weightHistory.length ? (
            <div className="space-y-3">
              {weightHistory.map((checkIn, index) => (
                <div key={checkIn.id || checkIn.checkInDate} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-xs text-slate-500">{formatShortDate(checkIn.checkInDate)}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-amber-500"
                      style={{ width: `${Math.max(8, (checkIn.weightKg / Math.max(...weightHistory.map(item => item.weightKg), 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-sm font-semibold text-white">{checkIn.weightKg} kg</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-28 flex-col items-center justify-center text-center">
              <Scale className="mb-2 h-6 w-6 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">No weight history yet</p>
              <p className="mt-1 text-xs text-slate-500">Your next check-in will start the trend.</p>
            </div>
          )}
          {currentWeight && targetWeight != null && (
            <div className="mt-4 border-t border-slate-800 pt-3 text-sm">
              <span className="text-slate-400">Current vs target:</span>
              <span className="ml-2 font-semibold text-white">{currentWeight} kg → {targetWeight} kg</span>
              <p className="mt-1 text-xs text-slate-500">{Math.abs(currentWeight - targetWeight).toFixed(1)} kg from your target. Trends matter more than one reading.</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-white">Set the next target</h2>
              <p className="mt-1 text-xs text-slate-400">Save your target body weight in kilograms.</p>
            </div>
            <Target className="h-5 w-5 text-emerald-400" />
          </div>
          <form onSubmit={handleSaveTarget} className="space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              Target weight (kg)
              <input
                type="number"
                min="0.1"
                max="500"
                step="0.1"
                value={targetWeightInput}
                onChange={event => setTargetWeightInput(event.target.value)}
                placeholder="Set an optional target"
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white"
              />
            </label>
            {targetError && <p role="alert" className="text-xs text-rose-400">{targetError}</p>}
            {targetMessage && <p role="status" className="text-xs text-emerald-400">{targetMessage}</p>}
            <button type="submit" disabled={isSavingTarget} className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">
              {isSavingTarget ? 'Saving target…' : 'Save target'}
            </button>
          </form>
          {currentUser.goals && (
            <div className="mt-4 border-t border-slate-800 pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Current focus</p>
              <p className="mt-1 text-sm text-slate-300">{currentUser.goals}</p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-white">Strength records</h2>
            <p className="mt-1 text-xs text-slate-400">Highest completed working weight from your saved workout logs</p>
          </div>
          <Award className="h-5 w-5 text-emerald-400" />
        </div>
        {personalBests.length ? (
          <div className="divide-y divide-slate-800">
            {personalBests.map(record => (
              <div key={record.exerciseName} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{record.exerciseName}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{formatShortDate(record.date)} · {record.reps} reps</p>
                </div>
                <p className="shrink-0 font-mono text-lg font-bold text-emerald-400">{record.weight} kg</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-24 flex-col items-center justify-center text-center">
            <Award className="mb-2 h-6 w-6 text-slate-600" />
            <p className="text-sm font-semibold text-slate-300">No strength records available</p>
            <p className="mt-1 text-xs text-slate-500">Complete and save a workout to start tracking your best loads.</p>
          </div>
        )}
      </section>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <Activity className="mt-0.5 h-4 w-4 shrink-0" />
        This report only summarizes saved entries. Blank days mean no record was submitted—not that you made no progress.
      </p>
    </div>
  );
};

const DumbbellIcon: React.FC = () => <Activity className="h-4 w-4 text-emerald-400" />;
