import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduledWorkout, LoggedExercise, LoggedSet } from '../../types';
import {
  X,
  Dumbbell,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Award
} from 'lucide-react';

export const ActiveWorkoutModal: React.FC = () => {
  const { activeWorkoutModalId, scheduledWorkouts } = useApp();

  if (!activeWorkoutModalId) return null;
  const workout = scheduledWorkouts.find(w => w.id === activeWorkoutModalId);
  if (!workout) return null;

  return <ActiveWorkoutSession key={workout.id} workout={workout} />;
};

const ActiveWorkoutSession: React.FC<{ workout: ScheduledWorkout }> = ({ workout }) => {
  const { setActiveWorkoutModalId, scheduledWorkouts, logWorkoutCompletion } = useApp();

  // Initialize logged data from existing or template
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>(() => {
    if (workout.loggedData && workout.loggedData.length > 0) {
      return workout.loggedData;
    }
    return workout.exercises.map(we => ({
      exerciseId: we.exerciseId,
      exerciseName: we.exerciseName,
      clientNotes: '',
      sets: we.sets.map(s => ({
        setNumber: s.setNumber,
        actualReps: parseInt(s.reps, 10) || 10,
        actualWeightKg: s.targetWeightKg || 0,
        rpe: s.rpe || 8,
        completed: false
      }))
    }));
  });

  const [overallRpe, setOverallRpe] = useState<number>(workout.overallRpe || 8);
  const [clientFeedback, setClientFeedback] = useState<string>(workout.clientFeedback || '');
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);
  const [saveWorkoutError, setSaveWorkoutError] = useState<string | null>(null);
  const [saveWorkoutWarning, setSaveWorkoutWarning] = useState<string | null>(null);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(90);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [initialTimer, setInitialTimer] = useState<number>(90);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setInitialTimer(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const handleSetChange = (exIdx: number, setIdx: number, field: keyof LoggedSet, value: any) => {
    setLoggedExercises(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[exIdx].sets[setIdx][field] = value;
      return copy;
    });
  };

  const handleToggleSetComplete = (exIdx: number, setIdx: number) => {
    const isCurrentlyComplete = loggedExercises[exIdx].sets[setIdx].completed;
    handleSetChange(exIdx, setIdx, 'completed', !isCurrentlyComplete);

    // Auto-trigger rest timer if set just marked complete
    if (!isCurrentlyComplete) {
      const restSec = workout.exercises[exIdx]?.sets[setIdx]?.restSeconds || 90;
      startRestTimer(restSec);
    }
  };

  const newPersonalRecords = loggedExercises.flatMap(exercise => {
    const previousBest = scheduledWorkouts
      .filter(previous =>
        previous.clientId === workout.clientId &&
        previous.status === 'completed' &&
        previous.id !== workout.id &&
        (previous.completedAt || previous.scheduledDate) < (workout.completedAt || workout.scheduledDate)
      )
      .flatMap(previous => (previous.loggedData || [])
        .filter(logged => logged.exerciseId === exercise.exerciseId)
        .flatMap(logged => logged.sets.filter(set => set.completed && set.actualWeightKg > 0).map(set => set.actualWeightKg)))
      .reduce((best, weight) => Math.max(best, weight), 0);
    const bestCurrentSet = exercise.sets
      .filter(set => set.completed && set.actualWeightKg > previousBest && set.actualWeightKg > 0)
      .sort((a, b) => b.actualWeightKg - a.actualWeightKg)[0];
    return previousBest > 0 && bestCurrentSet
      ? [{ exerciseName: exercise.exerciseName, weight: bestCurrentSet.actualWeightKg, reps: bestCurrentSet.actualReps }]
      : [];
  });

  const handleFinishWorkout = async () => {
    if (isSavingWorkout) return;
    setSaveWorkoutError(null);
    setSaveWorkoutWarning(null);
    setIsSavingWorkout(true);
    try {
      const result = await logWorkoutCompletion(workout.id, loggedExercises, overallRpe, clientFeedback);
      if (!result.success) {
        setSaveWorkoutError(result.error || 'Workout was not saved.');
        return;
      }
      if (result.warning) {
        setSaveWorkoutWarning(result.warning);
        return;
      }
      setActiveWorkoutModalId(null);
    } catch (error) {
      setSaveWorkoutError(error instanceof Error ? error.message : 'Workout was not saved.');
    } finally {
      setIsSavingWorkout(false);
    }
  };

  const totalSets = loggedExercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const completedSets = loggedExercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0);
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-white flex flex-col max-h-[95vh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95 rounded-t-2xl">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-lg font-bold text-white truncate max-w-[170px] sm:max-w-md">
                  {workout.title}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase shrink-0 ${
                  workout.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {workout.status}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                {workout.scheduledDate} • {completedSets}/{totalSets} sets logged ({progressPercent}%)
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveWorkoutModalId(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
            aria-label="Close workout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-800 shrink-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Floating Rest Timer Widget Bar */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-850 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Rest Timer:</span>
            <span className={`font-mono text-sm sm:text-base font-extrabold ${timerRunning ? 'text-emerald-400 animate-pulse' : 'text-white'}`}>
              {formatTime(timerSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-2.5 sm:px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center gap-1 transition-colors text-xs min-h-[32px]"
            >
              {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => {
                setTimerRunning(false);
                setTimerSeconds(initialTimer);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 ml-1 sm:ml-2 border-l border-slate-750 pl-1.5 sm:pl-2">
              {[60, 90, 120, 180].map(s => (
                <button
                  key={s}
                  onClick={() => startRestTimer(s)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    initialTimer === s && timerRunning
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {s}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {timerSeconds === 0 && !timerRunning && (
          <div role="status" className="flex items-center gap-2 border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300">
            <Clock className="h-4 w-4 shrink-0" />
            Rest is over. Get back on the bar.
          </div>
        )}

        {newPersonalRecords.length > 0 && (
          <div className="flex items-start gap-2 border-b border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-300">Target destroyed. Set the bar higher.</p>
              <p className="mt-0.5 text-slate-300">
                {newPersonalRecords.map(record => `${record.exerciseName}: ${record.weight} kg × ${record.reps}`).join(' · ')}
              </p>
              <p className="mt-1 text-slate-400">Finish and save the workout to lock in the result.</p>
            </div>
          </div>
        )}

        {saveWorkoutError && (
          <p role="alert" className="border-b border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">{saveWorkoutError}</p>
        )}
        {saveWorkoutWarning && (
          <div role="status" className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
            <p className="font-bold">Session completed in this browser</p>
            <p className="mt-1">{saveWorkoutWarning}</p>
            <p className="mt-1">Reopen or create an assigned workout to save it to your workout history.</p>
          </div>
        )}

        {/* Exercises Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          {loggedExercises.map((lex, exIdx) => {
            const prescribedEx = workout.exercises[exIdx];

            return (
              <div
                key={lex.exerciseId}
                className="bg-slate-850/80 border border-slate-750 rounded-2xl p-3.5 sm:p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {exIdx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">{lex.exerciseName}</h3>
                    </div>
                    {prescribedEx?.notes && (
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-1 italic pl-8">
                        Coach Note: {prescribedEx.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sets Table with mobile horizontal scroll safety */}
                <div className="overflow-x-auto -mx-1 px-1">
                  <table className="w-full text-left text-xs text-slate-300 min-w-[340px]">
                    <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-750">
                      <tr>
                        <th className="py-2 px-1.5 text-center w-8">Set</th>
                        <th className="py-2 px-1.5">Target</th>
                        <th className="py-2 px-1.5">Weight (kg)</th>
                        <th className="py-2 px-1.5">Reps</th>
                        <th className="py-2 px-1.5">RPE</th>
                        <th className="py-2 px-1.5 text-center w-12">Done</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {lex.sets.map((set, setIdx) => {
                        const pSet = prescribedEx?.sets[setIdx];

                        return (
                          <tr
                            key={set.setNumber}
                            className={`transition-colors ${set.completed ? 'bg-emerald-950/20' : ''}`}
                          >
                            <td className="py-2 px-1.5 text-center font-bold text-slate-300 font-mono">
                              {set.setNumber}
                            </td>
                            <td className="py-2 px-1.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                              {pSet ? `${pSet.reps} ${pSet.targetWeightKg ? `@ ${pSet.targetWeightKg}kg` : ''}` : '--'}
                            </td>
                            <td className="py-2 px-1.5">
                              <input
                                type="number"
                                step="0.5"
                                value={set.actualWeightKg}
                                onChange={e => handleSetChange(exIdx, setIdx, 'actualWeightKg', parseFloat(e.target.value) || 0)}
                                className="w-16 sm:w-20 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                              />
                            </td>
                            <td className="py-2 px-1.5">
                              <input
                                type="number"
                                value={set.actualReps}
                                onChange={e => handleSetChange(exIdx, setIdx, 'actualReps', parseInt(e.target.value, 10) || 0)}
                                className="w-14 sm:w-16 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                              />
                            </td>
                            <td className="py-2 px-1.5">
                              <input
                                type="number"
                                min={1}
                                max={10}
                                step="0.5"
                                value={set.rpe}
                                onChange={e => handleSetChange(exIdx, setIdx, 'rpe', parseFloat(e.target.value) || 8)}
                                className="w-14 sm:w-16 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                              />
                            </td>
                            <td className="py-2 px-1.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                                className={`w-8 h-8 rounded-xl inline-flex items-center justify-center transition-all min-h-[32px] min-w-[32px] ${
                                  set.completed
                                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                                    : 'border border-slate-700 bg-slate-800 hover:border-emerald-500/50 text-slate-500'
                                }`}
                                aria-label={`Mark set ${set.setNumber} complete`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Session Overview & Feedback Card */}
          <div className="bg-slate-850/80 border border-slate-750 rounded-2xl p-4 sm:p-5 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Session Debrief & Feedback</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Overall Session RPE (1-10)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={overallRpe}
                    onChange={e => setOverallRpe(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-emerald-400 text-sm w-12 text-center shrink-0">
                    {overallRpe}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">1 = Easy warm-up • 10 = Max effort / failure</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Athlete Notes / Comments to Coach
                </label>
                <textarea
                  rows={2}
                  value={clientFeedback}
                  onChange={e => setClientFeedback(e.target.value)}
                  placeholder="How did the session feel? Any fatigue, pain, or load adjustments?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            {workout.coachFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <p className="font-bold text-emerald-400">Coach Feedback on this Session:</p>
                <p className="text-slate-200 mt-0.5">{workout.coachFeedback}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 shrink-0 bg-slate-900 rounded-b-2xl">
          <button
            onClick={() => setActiveWorkoutModalId(null)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold order-2 sm:order-1 transition-colors min-h-[40px]"
          >
            {saveWorkoutWarning ? 'Close' : 'Close session'}
          </button>

          <button
            onClick={handleFinishWorkout}
            disabled={isSavingWorkout || Boolean(saveWorkoutWarning)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 order-1 sm:order-2 min-h-[44px] disabled:cursor-wait disabled:opacity-60"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSavingWorkout ? 'Saving session…' : newPersonalRecords.length > 0 ? 'Finish · New PR' : 'Finish & Log Workout'}
          </button>
        </div>
      </div>
    </div>
  );
};
