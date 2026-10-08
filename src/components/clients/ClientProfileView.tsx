import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  ClipboardCheck,
  Footprints,
  Utensils,
  Dumbbell,
  MessageSquare,
  TrendingUp,
  Award,
  Plus,
  Clock,
  Sparkles,
  FileText,
  UserCheck
} from 'lucide-react';

export const ClientProfileView: React.FC = () => {
  const {
    allProfiles,
    selectedClientId,
    setSelectedClientId,
    setActiveView,
    scheduledWorkouts,
    checkIns,
    stepRecords,
    nutritionTargets,
    mealPlans,
    programs,
    assignProgramToClient,
    setActiveWorkoutModalId,
    setActiveCheckInReviewId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'workouts' | 'checkins' | 'steps' | 'nutrition'>('overview');
  const [isAssignProgramOpen, setIsAssignProgramOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || '');
  const [programStartDate, setProgramStartDate] = useState(new Date().toISOString().slice(0, 10));

  const client = allProfiles.find(p => p.id === selectedClientId) || allProfiles.find(p => p.role === 'client');
  if (!client) return null;

  const coach = allProfiles.find(p => p.id === client.assignedCoachId);
  const clientWorkouts = scheduledWorkouts.filter(w => w.clientId === client.id);
  const clientCheckins = checkIns.filter(c => c.clientId === client.id);
  const clientSteps = stepRecords.filter(r => r.clientId === client.id).sort((a, b) => b.logDate.localeCompare(a.logDate));
  const clientTarget = nutritionTargets.find(t => t.clientId === client.id);
  const clientMealPlan = mealPlans.find(mp => mp.clientId === client.id);

  const avgSteps = clientSteps.length > 0
    ? Math.round(clientSteps.slice(0, 7).reduce((sum, r) => sum + r.stepCount, 0) / Math.min(clientSteps.length, 7))
    : 0;

  const handleAssignProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProgramId && client.id && programStartDate) {
      assignProgramToClient(selectedProgramId, client.id, programStartDate);
      setIsAssignProgramOpen(false);
      setActiveTab('workouts');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Back & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => {
            setSelectedClientId(null);
            setActiveView('clients');
          }}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Client Roster
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedClientId(client.id);
              setActiveView('messages');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" /> Message Athlete
          </button>
          <button
            onClick={() => setIsAssignProgramOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Assign Program
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img
            src={client.avatarUrl}
            alt={client.fullName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">{client.fullName}</h1>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                client.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {client.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">TZ: {client.timezone}</span>
            </div>
            <p className="text-xs text-slate-400">{client.email} • Assigned to: <span className="text-white font-medium">{coach?.fullName || 'Unassigned'}</span></p>
            {client.goals && (
              <p className="text-xs text-slate-300 mt-2 bg-slate-850 p-2 rounded-lg border border-slate-750 max-w-2xl">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block">Primary Goals:</span>
                {client.goals}
              </p>
            )}
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'workouts' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" /> Workouts ({clientWorkouts.length})
          </button>
          <button
            onClick={() => setActiveTab('checkins')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'checkins' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" /> Check-Ins ({clientCheckins.length})
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'steps' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" /> Steps (Avg: {avgSteps.toLocaleString()})
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'nutrition' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" /> Nutrition Plan
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Physical Stats</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Starting Weight</span>
                <span className="font-mono text-white font-bold">{client.startingWeightKg || '--'} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Current Weight</span>
                <span className="font-mono text-emerald-400 font-bold">{client.currentWeightKg || '--'} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target Weight</span>
                <span className="font-mono text-white font-bold">{client.targetWeightKg || '--'} kg</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Height</span>
                <span className="font-mono text-white font-medium">{client.heightCm ? `${client.heightCm} cm` : '--'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Check-in Day</span>
                <span className="font-semibold text-amber-400">{client.checkInDay || 'Sunday'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Compliance & Averages</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">7-Day Step Average</span>
                <span className="font-mono text-emerald-400 font-bold">{avgSteps.toLocaleString()} steps</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Completed Workouts</span>
                <span className="font-mono text-white font-bold">
                  {clientWorkouts.filter(w => w.status === 'completed').length} / {clientWorkouts.length}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Total Check-Ins</span>
                <span className="font-mono text-white font-bold">{clientCheckins.length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Activity Level</span>
                <span className="font-semibold text-slate-200 capitalize">{client.activityLevel?.replace('_', ' ') || 'Moderate'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Nutrition Target</h3>
            {clientTarget ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-850 rounded-xl border border-slate-750 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily Calories</span>
                  <div className="text-2xl font-extrabold text-emerald-400">{clientTarget.caloriesKcal} kcal</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-750">
                    <p className="text-[10px] text-slate-400">Protein</p>
                    <p className="font-bold text-white text-sm">{clientTarget.proteinG}g</p>
                  </div>
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-750">
                    <p className="text-[10px] text-slate-400">Carbs</p>
                    <p className="font-bold text-white text-sm">{clientTarget.carbsG}g</p>
                  </div>
                  <div className="p-2 bg-slate-850 rounded-lg border border-slate-750">
                    <p className="text-[10px] text-slate-400">Fat</p>
                    <p className="font-bold text-white text-sm">{clientTarget.fatG}g</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active macro targets assigned.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'workouts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Scheduled Workouts</h3>
            <button
              onClick={() => setIsAssignProgramOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Assign New Program
            </button>
          </div>

          <div className="space-y-3">
            {clientWorkouts.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No workouts scheduled for this athlete yet.</p>
            ) : (
              clientWorkouts.map(w => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{w.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        w.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Date: <span className="font-mono text-slate-300">{w.scheduledDate}</span> • {w.exercises.length} exercises
                    </p>
                    {w.clientFeedback && (
                      <p className="text-xs text-emerald-400 italic mt-1">Client log note: "{w.clientFeedback}"</p>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveWorkoutModalId(w.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                  >
                    View / Log Data
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'checkins' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Submitted Check-Ins</h3>
          <div className="space-y-3">
            {clientCheckins.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No check-ins submitted yet.</p>
            ) : (
              clientCheckins.map(ci => (
                <div
                  key={ci.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Check-in: {ci.checkInDate}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ci.status === 'reviewed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {ci.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Weight: <span className="text-white font-bold">{ci.weightKg} kg</span> • Sleep: {ci.sleepRating}/10 • Energy: {ci.energyRating}/10
                    </p>
                    <p className="text-xs text-slate-300 italic">"{ci.clientNotes}"</p>
                    {ci.coachFeedback && (
                      <p className="text-xs text-emerald-400 mt-1">Feedback: {ci.coachFeedback}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('checkins');
                      setActiveCheckInReviewId(ci.id);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white shrink-0 transition-colors"
                  >
                    Review / Compare
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'steps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Manual Step History</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {clientSteps.slice(0, 14).map(s => (
              <div key={s.id} className="p-3 bg-slate-850 rounded-xl border border-slate-750 text-center">
                <p className="text-[10px] text-slate-400 font-mono">{s.logDate}</p>
                <p className="text-base font-extrabold text-white mt-1 font-mono">{s.stepCount.toLocaleString()}</p>
                <span className={`text-[10px] font-bold ${s.stepCount >= 10000 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {s.stepCount >= 10000 ? '✓ Goal Hit' : 'Under'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-white">Prescribed Meal Plan & Foods</h3>
          {clientMealPlan ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <h4 className="text-sm font-bold text-emerald-400">{clientMealPlan.title}</h4>
                {clientMealPlan.notes && <p className="text-xs text-slate-400 mt-1">{clientMealPlan.notes}</p>}
              </div>

              <div className="divide-y divide-slate-800">
                {clientMealPlan.items.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">{item.mealName}</span>
                      <span className="font-semibold text-white">{item.foodName}</span>
                      <span className="text-slate-400 ml-2">({item.quantity}{item.unit})</span>
                    </div>
                    <span className="font-mono text-slate-300">
                      {item.calculatedCalories} kcal • P: {item.calculatedProtein}g • C: {item.calculatedCarbs}g • F: {item.calculatedFat}g
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No specific meal plan assigned yet.</p>
          )}
        </div>
      )}

      {/* Program Assignment Modal */}
      {isAssignProgramOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Assign Program to {client.fullName}</h3>
            <form onSubmit={handleAssignProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Select Program Template</label>
                <select
                  value={selectedProgramId}
                  onChange={e => setSelectedProgramId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.durationWeeks} weeks)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Program Start Date</label>
                <input
                  type="date"
                  required
                  value={programStartDate}
                  onChange={e => setProgramStartDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignProgramOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
