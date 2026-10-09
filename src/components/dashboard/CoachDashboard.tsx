import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Profile } from '../../types';
import {
  Users,
  AlertCircle,
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Dumbbell,
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';

export const CoachDashboard: React.FC = () => {
  const {
    currentUser,
    allProfiles,
    checkIns,
    scheduledWorkouts,
    conversations,
    stepRecords,
    setActiveView,
    setSelectedClientId,
    setActiveCheckInReviewId
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'attention' | 'pending'>('all');

  // Filter clients assigned to this coach (or all clients if admin)
  const myClients = allProfiles.filter(p => {
    if (p.role !== 'client') return false;
    if (currentUser.role === 'admin') return true;
    return p.assignedCoachId === currentUser.id;
  });

  // Calculate "Needing Attention" items
  const pendingCheckins = checkIns.filter(
    c => c.status === 'submitted' && (currentUser.role === 'admin' || c.coachId === currentUser.id)
  );

  // Local calendar dates keep overdue-training and recent-activity checks aligned to the user's day.
  const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const todayStr = toLocalDateKey(today);
  const stepCutoff = new Date(today);
  stepCutoff.setDate(stepCutoff.getDate() - 2);
  const stepCutoffStr = toLocalDateKey(stepCutoff);
  const workoutCutoff = new Date(today);
  workoutCutoff.setDate(workoutCutoff.getDate() - 6);
  const workoutCutoffStr = toLocalDateKey(workoutCutoff);

  const getAttentionReasons = (clientId: string) => {
    const reasons: string[] = [];
    if (pendingCheckins.some(checkIn => checkIn.clientId === clientId)) reasons.push('Check-in to review');
    const unreadMessages = conversations.find(conversation => conversation.clientId === clientId)?.unreadCountCoach || 0;
    if (unreadMessages > 0) reasons.push('Unread message');

    const hasOverdueWorkout = scheduledWorkouts.some(workout =>
      workout.clientId === clientId &&
      workout.scheduledDate >= workoutCutoffStr &&
      workout.scheduledDate <= todayStr &&
      workout.status !== 'completed'
    );
    if (hasOverdueWorkout) reasons.push('Workout needs follow-up');

    const hasAnyStepHistory = stepRecords.some(record => record.clientId === clientId);
    const hasRecentSteps = stepRecords.some(record => record.clientId === clientId && record.logDate >= stepCutoffStr && record.logDate <= todayStr);
    if (hasAnyStepHistory && !hasRecentSteps) reasons.push('Step log is quiet');

    return reasons;
  };

  const clientsNeedingAttention = myClients.filter(client => getAttentionReasons(client.id).length > 0);

  // Filter roster
  const filteredClients = myClients.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.goals && c.goals.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return c.status === 'active';
    if (statusFilter === 'pending') return c.status === 'pending';
    if (statusFilter === 'attention') {
      return clientsNeedingAttention.some(a => a.id === c.id);
    }
    return true;
  });

  const getClientCheckInStatus = (client: Profile) => {
    const clientCheckin = checkIns.find(c => c.clientId === client.id);
    if (!clientCheckin) return { label: 'No check-ins yet', color: 'text-slate-400' };
    if (clientCheckin.status === 'submitted') return { label: 'Review Ready', color: 'text-amber-400 font-bold' };
    return { label: `Reviewed (${clientCheckin.checkInDate})`, color: 'text-emerald-400' };
  };

  const getClientTodayWorkout = (clientId: string) => {
    return scheduledWorkouts.find(w => w.clientId === clientId && w.scheduledDate === todayStr);
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Welcome Banner */}
      <div className="min-w-0 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="relative z-10 flex min-w-0 flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Coaching Overview
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  timeZone: 'UTC'
                })}
              </span>
            </div>
            <h1 className="break-words text-xl sm:text-3xl leading-tight font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.fullName.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              You have <span className="text-amber-400 font-semibold">{clientsNeedingAttention.length} follow-up{clientsNeedingAttention.length === 1 ? '' : 's'}</span> to work through and <span className="text-emerald-400 font-semibold">{myClients.length} clients</span> on your roster. Coach the process. Measure the outcome.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row md:w-auto md:shrink-0">
            <button
              onClick={() => setActiveView('programs')}
              className="justify-center px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Create Program
            </button>
            <button
              onClick={() => setActiveView('exercises')}
              className="justify-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Dumbbell className="w-4 h-4" /> Exercise DB
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Clients</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">{myClients.filter(c => c.status === 'active').length}</div>
          <p className="text-xs text-slate-400 mt-1">Managed roster</p>
        </div>

        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Check-Ins</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingCheckins.length}</div>
          <p className="text-xs text-slate-400 mt-1">Requires coach review</p>
        </div>

        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Workouts</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {scheduledWorkouts.filter(w => w.scheduledDate === todayStr && (currentUser.role === 'admin' || w.coachId === currentUser.id)).length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Prescribed for today</p>
        </div>

        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Needs Attention</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-400">{clientsNeedingAttention.length}</div>
          <p className="text-xs text-slate-400 mt-1">Check-in, unread message, overdue session, or quiet step log</p>
        </div>
      </div>

      {/* Coach Attention Queue */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-2 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-white">Coach Attention Queue</h2>
            <p className="mt-1 text-xs text-slate-400">Coach the process. Measure the outcome.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-xs font-bold text-amber-400">{clientsNeedingAttention.length} follow-up{clientsNeedingAttention.length === 1 ? '' : 's'}</span>
            <button
              onClick={() => { setStatusFilter('attention'); setActiveView('clients'); setSelectedClientId(null); }}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              View roster →
            </button>
          </div>
        </div>
        {clientsNeedingAttention.length ? (
          <div className="divide-y divide-slate-800">
            {clientsNeedingAttention.slice(0, 5).map(client => (
              <div key={client.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <img src={client.avatarUrl || undefined} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-slate-700" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{client.fullName}</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-400">{getAttentionReasons(client.id).join(' · ')}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => { setSelectedClientId(client.id); setActiveView('clients'); }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
                  >
                    View client
                  </button>
                  <button
                    onClick={() => { setSelectedClientId(client.id); setActiveView('messages'); }}
                    aria-label={`Message ${client.fullName}`}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5">
            <p className="text-sm font-semibold text-slate-300">No follow-ups are waiting.</p>
            <p className="mt-1 text-xs text-slate-500">Keep the plan clear, review progress, and stay ahead of the next check-in.</p>
          </div>
        )}
      </section>

      {/* Attention Board (Check-Ins to Review) */}
      {pendingCheckins.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Check-Ins Awaiting Review ({pendingCheckins.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveView('checkins')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingCheckins.map(ci => {
              const client = allProfiles.find(p => p.id === ci.clientId);
              return (
                <div
                  key={ci.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-750 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={client?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                      alt={client?.fullName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-amber-500/40"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{client?.fullName || 'Client'}</p>
                      <p className="text-xs text-slate-400">
                        Weight: <span className="text-slate-200 font-semibold">{ci.weightKg} kg</span> • Energy: {ci.energyRating}/10
                      </p>
                      <p className="text-xs text-slate-400 italic truncate mt-0.5">"{ci.clientNotes}"</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('checkins');
                      setActiveCheckInReviewId(ci.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
                  >
                    Review Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Client Roster Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Client Management Roster</h2>
            <p className="text-xs text-slate-400">Overview of assigned athletes, goals, and training compliance</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${statusFilter === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All ({myClients.length})
              </button>
              <button
                onClick={() => setStatusFilter('attention')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${statusFilter === 'attention' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-white'}`}
              >
                Attention ({clientsNeedingAttention.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${statusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'}`}
              >
                Active
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-850/80 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Client Profile</th>
                <th className="px-5 py-3.5">Goals / Notes</th>
                <th className="px-5 py-3.5">Weight Progress</th>
                <th className="px-5 py-3.5">Check-In Status</th>
                <th className="px-5 py-3.5">Today's Workout</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-sm font-bold text-white">No clients in roster</h3>
                      <p className="text-xs text-slate-400">
                        {myClients.length === 0
                          ? 'No clients have registered or been assigned yet. You can register a client or sync data directly from your Supabase PostgreSQL database.'
                          : 'No clients match your search/filter criteria.'}
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-2">
                        <button
                          onClick={() => setActiveView('database')}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                        >
                          Database & Schema View
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map(client => {
                  const checkinStatus = getClientCheckInStatus(client);
                  const todayWorkout = getClientTodayWorkout(client.id);

                  return (
                    <tr key={client.id} className="hover:bg-slate-850/50 transition-colors group">
                      {/* Name & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={client.avatarUrl}
                            alt={client.fullName}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {client.fullName}
                              </span>
                              {client.status !== 'active' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {client.status}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 block">{client.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Goals */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="text-xs text-slate-300 line-clamp-2" title={client.goals}>
                          {client.goals || 'No specific goals recorded'}
                        </p>
                      </td>

                      {/* Weight */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs">
                          <span className="font-bold text-white">{client.currentWeightKg || '--'} kg</span>
                          {client.startingWeightKg && client.currentWeightKg && (
                            <span className="text-slate-400 block text-[11px]">
                              Start: {client.startingWeightKg}kg ({client.currentWeightKg < client.startingWeightKg ? '-' : '+'}
                              {Math.abs(client.currentWeightKg - client.startingWeightKg).toFixed(1)}kg)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Check-In */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`text-xs ${checkinStatus.color}`}>
                          {checkinStatus.label}
                        </span>
                      </td>

                      {/* Today's Workout */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {todayWorkout ? (
                          <div>
                            <span className="text-xs font-medium text-slate-200 block truncate max-w-[140px]">
                              {todayWorkout.title}
                            </span>
                            <span className={`text-[10px] uppercase font-bold ${
                              todayWorkout.status === 'completed' ? 'text-emerald-400' : 'text-blue-400'
                            }`}>
                              {todayWorkout.status}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Rest Day / None</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedClientId(client.id);
                              setActiveView('client_detail');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              setSelectedClientId(client.id);
                              setActiveView('messages');
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Chat with client"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
