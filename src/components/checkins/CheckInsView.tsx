import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckInFrequency, CheckInStatus, ProgramDayOfWeek } from '../../types';
import {
  ClipboardCheck,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  Camera
} from 'lucide-react';

export const CheckInsView: React.FC = () => {
  const {
    checkIns,
    currentUser,
    allProfiles,
    setActiveCheckInReviewId,
    setIsCheckInModalOpen,
    createCheckInSchedule
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | CheckInStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [scheduleClientId, setScheduleClientId] = useState('');
  const [scheduleFrequency, setScheduleFrequency] = useState<CheckInFrequency>('weekly');
  const [scheduleDay, setScheduleDay] = useState('');
  const [customIntervalDays, setCustomIntervalDays] = useState(7);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleSaved, setScheduleSaved] = useState(false);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const isClient = currentUser.role === 'client';
  const coachClients = allProfiles.filter(p =>
    p.role === 'client' && p.status === 'active' && p.assignedCoachId === currentUser.id
  );

  const handleCreateSchedule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!scheduleClientId || isSavingSchedule) return;
    setIsSavingSchedule(true);
    setScheduleError(null);
    setScheduleSaved(false);
    try {
      const result = await createCheckInSchedule({
        clientId: scheduleClientId,
        frequency: scheduleFrequency,
        customIntervalDays: scheduleFrequency === 'custom' ? customIntervalDays : undefined,
        dayOfWeek: scheduleDay === '' ? undefined : Number(scheduleDay) as ProgramDayOfWeek
      });
      if (!result.success) {
        setScheduleError(result.error || 'Check-in schedule was not saved.');
        return;
      }
      setScheduleSaved(true);
    } catch (error) {
      setScheduleError(error instanceof Error ? error.message : 'Check-in schedule was not saved.');
    } finally {
      setIsSavingSchedule(false);
    }
  };

  const filteredCheckIns = checkIns.filter(ci => {
    if (isClient && ci.clientId !== currentUser.id) return false;
    if (statusFilter !== 'all' && ci.status !== statusFilter) return false;

    if (searchTerm) {
      const client = allProfiles.find(p => p.id === ci.clientId);
      const nameMatch = client?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const noteMatch = ci.clientNotes.toLowerCase().includes(searchTerm.toLowerCase());
      if (!nameMatch && !noteMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Athlete Check-Ins</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isClient
              ? 'Submit weight, measurements, biofeedback, and progress photos to your coach.'
              : 'Review athlete check-ins, monitor weight and circumference changes, and provide feedback.'}
          </p>
        </div>

        {isClient ? (
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Submit Check-In
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as 'all' | CheckInStatus)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Check-Ins</option>
              <option value="pending">Pending</option>
              <option value="submitted">Needs Coach Review</option>
              <option value="missed">Missed</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        )}
      </div>

      {currentUser.role === 'coach' && (
        <form onSubmit={handleCreateSchedule} className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-3">
          <div>
            <h2 className="text-sm font-bold text-white">Create Check-In Schedule</h2>
            <p className="text-xs text-slate-400 mt-1">Clients need an active schedule before they can submit check-ins.</p>
          </div>
          {scheduleError && <p role="alert" className="text-xs text-rose-300">{scheduleError}</p>}
          {scheduleSaved && <p role="status" className="text-xs text-emerald-300">Schedule created. The client can now submit check-ins.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <label className="text-xs text-slate-400">
              Client
              <select
                required
                value={scheduleClientId}
                onChange={event => setScheduleClientId(event.target.value)}
                disabled={coachClients.length === 0}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
                <option value="">Select an assigned client</option>
                {coachClients.map(client => <option key={client.id} value={client.id}>{client.fullName}</option>)}
              </select>
            </label>
            <label className="text-xs text-slate-400">
              Frequency
              <select
                value={scheduleFrequency}
                onChange={event => setScheduleFrequency(event.target.value as CheckInFrequency)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every two weeks</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom interval</option>
              </select>
            </label>
            <label className="text-xs text-slate-400">
              Day of week (optional)
              <select
                value={scheduleDay}
                onChange={event => setScheduleDay(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
              >
                <option value="">No specific day</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
            </label>
            {scheduleFrequency === 'custom' && (
              <label className="text-xs text-slate-400">
                Interval (days)
                <input
                  type="number"
                  min={1}
                  required
                  value={customIntervalDays}
                  onChange={event => setCustomIntervalDays(Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
                />
              </label>
            )}
          </div>
          <button
            type="submit"
            disabled={isSavingSchedule || coachClients.length === 0}
            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 disabled:opacity-50"
          >
            {isSavingSchedule ? 'Saving…' : 'Create Schedule'}
          </button>
        </form>
      )}

      {/* CheckIns List */}
      <div className="space-y-3">
        {filteredCheckIns.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-medium">No check-ins found</p>
            {isClient && (
              <button
                onClick={() => setIsCheckInModalOpen(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Submit Your First Check-In
              </button>
            )}
          </div>
        ) : (
          filteredCheckIns
            .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())
            .map(ci => {
              const client = allProfiles.find(p => p.id === ci.clientId);

              return (
                <div
                  key={ci.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-base">{client?.fullName || 'Athlete'}</span>
                      <span className="text-xs text-slate-400 font-mono">({ci.checkInDate})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ci.status === 'reviewed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ci.status === 'missed'
                            ? 'bg-rose-500/20 text-rose-400'
                            : ci.status === 'submitted'
                              ? 'bg-amber-500/20 text-amber-400 animate-pulse'
                              : 'bg-slate-700 text-slate-300'
                      }`}>
                        {ci.status === 'reviewed' ? '✓ Reviewed' : ci.status === 'submitted' ? 'Needs Review' : ci.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span>Weight: <strong className="text-white font-mono">{ci.weightKg} kg</strong></span>
                      {ci.waistCm && <span>Waist: <strong className="text-white font-mono">{ci.waistCm} cm</strong></span>}
                      <span>Sleep: <strong className="text-amber-400">{ci.sleepRating}/10</strong></span>
                      <span>Energy: <strong className="text-amber-400">{ci.energyRating}/10</strong></span>
                      {ci.photos && ci.photos.length > 0 && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Camera className="w-3 h-3" /> {ci.photos.length} photos
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 italic line-clamp-2 max-w-2xl">
                      "{ci.clientNotes}"
                    </p>

                    {ci.coachFeedback && (
                      <p className="text-xs text-emerald-400 bg-slate-850 p-2 rounded-lg border border-slate-750 max-w-2xl">
                        <strong>Coach Feedback:</strong> {ci.coachFeedback}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setActiveCheckInReviewId(ci.id)}
                      className={`w-full md:w-auto px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                        ci.status === 'submitted'
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 hover:bg-slate-750 text-white'
                      }`}
                    >
                      {ci.status === 'submitted' ? 'Review & Give Feedback' : 'View Check-In Details'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
