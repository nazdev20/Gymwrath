import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Program, ProgramDayOfWeek, ProgramWorkout, WorkoutExercise, PrescribedSet } from '../../types';
import {
  BookOpen,
  Plus,
  Dumbbell,
  Calendar,
  Users,
  CheckCircle2,
  Trash2,
  X,
  ChevronRight,
  ArrowRight,
  Clock
} from 'lucide-react';

const WEEKDAYS: { value: ProgramDayOfWeek; label: string }[] = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

export const ProgramBuilder: React.FC = () => {
  const {
    programs,
    createProgram,
    exercises,
    allProfiles,
    assignProgramToClient,
    currentUser
  } = useApp();

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(programs[0] || null);

  // New Program Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [progName, setProgName] = useState('');
  const [progDesc, setProgDesc] = useState('');
  const [progWeeks, setProgWeeks] = useState(8);

  // Workouts in creation
  const [newWorkouts, setNewWorkouts] = useState<ProgramWorkout[]>([
    {
      id: `pw-${Date.now()}-1`,
      programId: '',
      weekNumber: 1,
      dayOfWeek: 1,
      title: 'Upper Body A',
      description: 'Chest & Lat Emphasis',
      estimatedDurationMin: 60,
      exercises: [
        {
          id: `we-new-1`,
          exerciseId: exercises[2]?.id || 'ex-3',
          exerciseName: exercises[2]?.name || 'Barbell Bench Press',
          orderIndex: 1,
          sets: [
            { setNumber: 1, reps: '8-10', targetWeightKg: 60, rpe: 8, restSeconds: 120 },
            { setNumber: 2, reps: '8-10', targetWeightKg: 60, rpe: 8, restSeconds: 120 },
            { setNumber: 3, reps: '8-10', targetWeightKg: 60, rpe: 8.5, restSeconds: 120 }
          ]
        }
      ]
    }
  ]);

  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignClientId, setAssignClientId] = useState('');
  const [assignStartDate, setAssignStartDate] = useState(new Date().toISOString().slice(0, 10));

  const clients = allProfiles.filter(p => p.role === 'client' && p.status === 'active');

  const handleAddWorkoutToNewProgram = () => {
    const nextDay = ((newWorkouts.length + 1) % 7) as ProgramDayOfWeek;
    setNewWorkouts(prev => [
      ...prev,
      {
        id: `pw-${Date.now()}-${prev.length + 1}`,
        programId: '',
        weekNumber: 1,
        dayOfWeek: nextDay,
        title: `Workout ${prev.length + 1}`,
        description: 'Resistance training session',
        estimatedDurationMin: 60,
        exercises: [
          {
            id: `we-new-${Date.now()}`,
            exerciseId: exercises[0]?.id || 'ex-1',
            exerciseName: exercises[0]?.name || 'Barbell Back Squat',
            orderIndex: 1,
            sets: [
              { setNumber: 1, reps: '6-8', targetWeightKg: 80, rpe: 8, restSeconds: 150 },
              { setNumber: 2, reps: '6-8', targetWeightKg: 80, rpe: 8, restSeconds: 150 },
              { setNumber: 3, reps: '6-8', targetWeightKg: 80, rpe: 8.5, restSeconds: 150 }
            ]
          }
        ]
      }
    ]);
  };

  const handleAddExerciseToWorkout = (workoutIdx: number) => {
    const defaultEx = exercises[0];
    if (!defaultEx) return;

    setNewWorkouts(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[workoutIdx].exercises.push({
        id: `we-new-${Date.now()}`,
        exerciseId: defaultEx.id,
        exerciseName: defaultEx.name,
        orderIndex: copy[workoutIdx].exercises.length + 1,
        sets: [
          { setNumber: 1, reps: '10-12', targetWeightKg: 20, rpe: 8, restSeconds: 90 },
          { setNumber: 2, reps: '10-12', targetWeightKg: 20, rpe: 8, restSeconds: 90 },
          { setNumber: 3, reps: '10-12', targetWeightKg: 20, rpe: 8.5, restSeconds: 90 }
        ]
      });
      return copy;
    });
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName.trim()) return;

    const created = createProgram({
      name: progName.trim(),
      description: progDesc.trim() || 'Custom periodized strength and hypertrophy program.',
      durationWeeks: progWeeks,
      createdBy: currentUser.id,
      isTemplate: true,
      workouts: newWorkouts
    });

    setSelectedProgram(created);
    setIsCreateModalOpen(false);
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProgram && assignClientId && assignStartDate) {
      assignProgramToClient(selectedProgram.id, assignClientId, assignStartDate);
      setIsAssignModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Build the Plan</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Turn the target into a repeatable plan. Build the sessions, assign the work, and measure follow-through.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedProgram && (
            <button
              onClick={() => {
                if (clients.length > 0) setAssignClientId(clients[0].id);
                setIsAssignModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-emerald-400" /> Assign Current Program
            </button>
          )}

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Create New Program
          </button>
        </div>
      </div>

      {/* Program Selection Cards & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Program Templates Roster */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Program Catalog</h2>
          {programs.map(prog => {
            const isSelected = selectedProgram?.id === prog.id;

            return (
              <div
                key={prog.id}
                onClick={() => setSelectedProgram(prog)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-850 border-emerald-500 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`font-bold text-sm ${isSelected ? 'text-emerald-400' : 'text-white'}`}>
                    {prog.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 shrink-0">
                    {prog.durationWeeks} Wks
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{prog.description}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                  <span>{prog.workouts.length} scheduled workouts / wk</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                    View Specs <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 cols: Selected Program Breakdown */}
        <div className="lg:col-span-2">
          {selectedProgram ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{selectedProgram.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {selectedProgram.durationWeeks} Weeks
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedProgram.description}</p>
                </div>

                <button
                  onClick={() => {
                    if (clients.length > 0) setAssignClientId(clients[0].id);
                    setIsAssignModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" /> Assign to Client
                </button>
              </div>

              {/* Workouts inside Program */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Weekly Schedule & Workouts ({selectedProgram.workouts.length})
                </h3>

                <div className="space-y-3">
                  {selectedProgram.workouts.map(pw => (
                    <div
                      key={pw.id}
                      className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-slate-750 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                            {WEEKDAYS.find(day => day.value === pw.dayOfWeek)?.label.slice(0, 3)}
                          </span>
                          <h4 className="text-sm font-bold text-white">{pw.title}</h4>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          ~{pw.estimatedDurationMin || 60} mins • {pw.exercises.length} exercises
                        </span>
                      </div>

                      {/* Exercises in workout */}
                      <div className="divide-y divide-slate-800 border-t border-slate-750 pt-2">
                        {pw.exercises.map((we, idx) => (
                          <div key={we.id} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                              <span className="font-semibold text-slate-200">{we.exerciseName}</span>
                            </div>
                            <span className="text-slate-400 font-mono">
                              {we.sets.length} sets × {we.sets[0]?.reps || '8-10'} reps
                              {we.sets[0]?.targetWeightKg ? ` @ ${we.sets[0].targetWeightKg}kg` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium">Select a program to inspect</p>
            </div>
          )}
        </div>
      </div>

      {/* Program Assign Modal */}
      {isAssignModalOpen && selectedProgram && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> Assign "{selectedProgram.name}"
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Select Client</label>
                <select
                  value={assignClientId}
                  onChange={e => setAssignClientId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Start Date (Calculates Workout Dates)
                </label>
                <input
                  type="date"
                  required
                  value={assignStartDate}
                  onChange={e => setAssignStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Schedule Workouts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Program Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-white flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Build New Workout Program
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Program Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12-Week Powerbuilding Phase 1"
                    value={progName}
                    onChange={e => setProgName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    min={1}
                    max={52}
                    value={progWeeks}
                    onChange={e => setProgWeeks(parseInt(e.target.value, 10) || 8)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Description / Focus</label>
                <textarea
                  rows={2}
                  placeholder="Program overview and progressive overload rules..."
                  value={progDesc}
                  onChange={e => setProgDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Workouts in Program */}
              <div className="space-y-4 border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Workouts ({newWorkouts.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddWorkoutToNewProgram}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-emerald-400 border border-slate-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Workout
                  </button>
                </div>

                <div className="space-y-4">
                  {newWorkouts.map((workout, wIdx) => (
                    <div key={workout.id} className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Workout Title (e.g. Upper Body A)"
                          value={workout.title}
                          onChange={e => {
                            const val = e.target.value;
                            setNewWorkouts(prev => {
                              const copy = JSON.parse(JSON.stringify(prev));
                              copy[wIdx].title = val;
                              return copy;
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          placeholder="Short description"
                          value={workout.description}
                          onChange={e => {
                            const val = e.target.value;
                            setNewWorkouts(prev => {
                              const copy = JSON.parse(JSON.stringify(prev));
                              copy[wIdx].description = val;
                              return copy;
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Training Day</label>
                        <select
                          value={workout.dayOfWeek}
                          onChange={event => {
                            const dayOfWeek = Number(event.target.value) as ProgramDayOfWeek;
                            setNewWorkouts(prev => prev.map((item, index) =>
                              index === wIdx ? { ...item, dayOfWeek } : item
                            ));
                          }}
                          className="w-full sm:w-1/2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                        >
                          {WEEKDAYS.map(day => (
                            <option key={day.value} value={day.value}>{day.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Exercises */}
                      <div className="space-y-2 pt-2">
                        {workout.exercises.map((we, exIdx) => (
                          <div key={we.id} className="p-2.5 bg-slate-800 rounded-lg flex items-center justify-between text-xs gap-3">
                            <select
                              value={we.exerciseId}
                              onChange={e => {
                                const targetEx = exercises.find(ex => ex.id === e.target.value);
                                if (targetEx) {
                                  setNewWorkouts(prev => {
                                    const copy = JSON.parse(JSON.stringify(prev));
                                    copy[wIdx].exercises[exIdx].exerciseId = targetEx.id;
                                    copy[wIdx].exercises[exIdx].exerciseName = targetEx.name;
                                    return copy;
                                  });
                                }
                              }}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs flex-1"
                            >
                              {exercises.map(ex => (
                                <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscleGroup})</option>
                              ))}
                            </select>

                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-mono">{we.sets.length} Sets</span>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleAddExerciseToWorkout(wIdx)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 mt-1"
                        >
                          <Plus className="w-3 h-3" /> Add Exercise to {workout.title}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Save & Publish Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
