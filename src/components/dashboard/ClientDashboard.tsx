import React, { useState } from 'react';
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
  const todayStr = new Date().toISOString().slice(0, 10);

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

  const handleSaveSteps = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(stepInput, 10);
    if (!isNaN(count) && count >= 0) {
      logDailySteps(todayStr, count);
      setStepSuccessMsg(true);
      setTimeout(() => setStepSuccessMsg(false), 2500);
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

  return (
    <div className="min-w-0 space-y-6">
      {/* Welcome Banner */}
      <div className="min-w-0 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="relative z-10 flex min-w-0 flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Athlete Today's Hub
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="break-words text-xl sm:text-3xl leading-tight font-extrabold text-white tracking-tight">
              Ready to train, {currentUser.fullName.split(' ')[0]}? 🔥
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {todayWorkout
                ? todayWorkout.status === 'completed'
                  ? 'Great job! You crushed today\'s training session.'
                  : `Your session "${todayWorkout.title}" is ready. Log your weights and sets when you train.`
                : 'Today is a scheduled recovery day. Hit your step and hydration goals!'}
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
                  <p className="text-xs text-slate-400">Prescribed programming for today</p>
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
                  <h2 className="text-lg font-bold text-white">Today's Nutrition Budget</h2>
                  <p className="text-xs text-slate-400">Macro targets prescribed by your coach</p>
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
                >
                  Save
                </button>
              </div>
              {stepSuccessMsg && (
                <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Step record saved for today!
                </p>
              )}
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
