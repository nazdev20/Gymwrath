import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
    setIsCheckInModalOpen
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'reviewed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const isClient = currentUser.role === 'client';

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
            <h1 className="text-2xl font-extrabold text-white">Athlete Weekly Check-Ins</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isClient
              ? 'Submit weekly weight, measurements, biofeedback, and progress photos to your coach.'
              : 'Review athlete weekly logs, monitor weight and circumference deltas, and deliver audio/text feedback.'}
          </p>
        </div>

        {isClient ? (
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Submit Weekly Check-In
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Check-Ins</option>
              <option value="submitted">Needs Coach Review</option>
              <option value="reviewed">Reviewed</option>
            </select>
          </div>
        )}
      </div>

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
                        ci.status === 'reviewed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
                      }`}>
                        {ci.status === 'reviewed' ? '✓ Reviewed' : 'Pending Review'}
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
