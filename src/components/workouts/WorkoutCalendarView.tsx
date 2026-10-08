import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduledWorkout } from '../../types';
import {
  Calendar as CalendarIcon,
  Dumbbell,
  CheckCircle2,
  Play,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User
} from 'lucide-react';

export const WorkoutCalendarView: React.FC = () => {
  const {
    scheduledWorkouts,
    currentUser,
    allProfiles,
    setActiveWorkoutModalId,
    scheduleWorkout,
    exercises
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    currentUser.role === 'client' ? currentUser.id : (allProfiles.find(p => p.role === 'client')?.id || '')
  );

  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));

  const clients = allProfiles.filter(p => p.role === 'client');

  const filteredWorkouts = scheduledWorkouts.filter(w => {
    if (currentUser.role === 'client') return w.clientId === currentUser.id;
    return selectedClientId ? w.clientId === selectedClientId : true;
  });

  const handleCreateAdhocWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const defaultEx = exercises[0] || { id: 'ex-1', name: 'Barbell Back Squat' };

    scheduleWorkout({
      clientId: currentUser.role === 'client' ? currentUser.id : selectedClientId,
      coachId: currentUser.role === 'coach' ? currentUser.id : (allProfiles.find(p => p.id === selectedClientId)?.assignedCoachId || 'user-coach-1'),
      scheduledDate: newDate,
      title: newTitle.trim(),
      status: 'scheduled',
      exercises: [
        {
          id: `we-${Date.now()}`,
          exerciseId: defaultEx.id,
          exerciseName: defaultEx.name,
          orderIndex: 1,
          sets: [
            { setNumber: 1, reps: '8-10', targetWeightKg: 50, rpe: 8, restSeconds: 90 },
            { setNumber: 2, reps: '8-10', targetWeightKg: 50, rpe: 8, restSeconds: 90 },
            { setNumber: 3, reps: '8-10', targetWeightKg: 50, rpe: 8.5, restSeconds: 90 }
          ]
        }
      ]
    });

    setIsAddWorkoutOpen(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Workout Training Calendar</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse upcoming training days, log completed exercises, and inspect past performance notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role !== 'client' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Athlete:</span>
              <select
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setIsAddWorkoutOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Schedule Session
          </button>
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
            <Dumbbell className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium">No workouts found for this athlete</p>
            <p className="text-xs mt-1">Assign a program template or click "Schedule Session" above.</p>
          </div>
        ) : (
          filteredWorkouts
            .sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))
            .map(workout => {
              const isToday = workout.scheduledDate === new Date().toISOString().slice(0, 10);

              return (
                <div
                  key={workout.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'bg-slate-850 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        {workout.scheduledDate} {isToday && <span className="text-emerald-400 font-bold ml-1">(Today)</span>}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        workout.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {workout.status === 'completed' ? '✓ Completed' : 'Scheduled'}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base mb-1">{workout.title}</h3>
                    {workout.description && (
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{workout.description}</p>
                    )}

                    <div className="space-y-1 py-2 border-t border-slate-800">
                      {workout.exercises.map((we, idx) => (
                        <div key={we.id} className="text-xs text-slate-300 flex justify-between">
                          <span className="truncate max-w-[170px]">{idx + 1}. {we.exerciseName}</span>
                          <span className="text-slate-400 font-mono">{we.sets.length} sets</span>
                        </div>
                      ))}
                    </div>

                    {workout.clientFeedback && (
                      <p className="text-xs text-emerald-400 italic mt-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        "{workout.clientFeedback}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800">
                    <button
                      onClick={() => setActiveWorkoutModalId(workout.id)}
                      className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                        workout.status === 'completed'
                          ? 'bg-slate-800 hover:bg-slate-750 text-white'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/10'
                      }`}
                    >
                      {workout.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" /> View Logged Data
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> Start / Log Workout
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>

      {/* Schedule Ad-hoc Workout Modal */}
      {isAddWorkoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Schedule Custom Workout Session</h3>
            <form onSubmit={handleCreateAdhocWorkout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Workout Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heavy Deadlift & Back Accessories"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Scheduled Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddWorkoutOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Schedule Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
