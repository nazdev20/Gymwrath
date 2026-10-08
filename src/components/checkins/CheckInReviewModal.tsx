import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  ClipboardCheck,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Minus,
  MessageSquare,
  Sparkles,
  Camera
} from 'lucide-react';

export const CheckInReviewModal: React.FC = () => {
  const {
    activeCheckInReviewId,
    setActiveCheckInReviewId,
    checkIns,
    allProfiles,
    reviewCheckIn
  } = useApp();

  const [feedbackText, setFeedbackText] = useState('');

  if (!activeCheckInReviewId) return null;

  const currentCheckIn = checkIns.find(c => c.id === activeCheckInReviewId);
  if (!currentCheckIn) return null;

  const client = allProfiles.find(p => p.id === currentCheckIn.clientId);

  // Find previous check-in for this client to calculate deltas
  const allClientCheckIns = checkIns
    .filter(c => c.clientId === currentCheckIn.clientId && c.id !== currentCheckIn.id)
    .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());

  const prevCheckIn = allClientCheckIns[0];

  const weightDelta = prevCheckIn ? (currentCheckIn.weightKg - prevCheckIn.weightKg).toFixed(1) : null;
  const waistDelta = prevCheckIn && currentCheckIn.waistCm && prevCheckIn.waistCm
    ? (currentCheckIn.waistCm - prevCheckIn.waistCm).toFixed(1)
    : null;

  const handleSendReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    reviewCheckIn(currentCheckIn.id, feedbackText.trim());
    setActiveCheckInReviewId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-white flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Review Check-In: {client?.fullName || 'Athlete'}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentCheckIn.status === 'reviewed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {currentCheckIn.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">Submission Date: {currentCheckIn.checkInDate}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveCheckInReviewId(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Comparison Cards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Metrics & Weekly Delta
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Weight</span>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                  {currentCheckIn.weightKg} kg
                </div>
                {weightDelta !== null && (
                  <span className={`text-xs font-bold flex items-center gap-0.5 mt-0.5 ${
                    parseFloat(weightDelta) < 0 ? 'text-emerald-400' : parseFloat(weightDelta) > 0 ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {parseFloat(weightDelta) < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {parseFloat(weightDelta) > 0 ? `+${weightDelta}` : weightDelta} kg vs prev
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Waist</span>
                <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                  {currentCheckIn.waistCm ? `${currentCheckIn.waistCm} cm` : '--'}
                </div>
                {waistDelta !== null && (
                  <span className={`text-xs font-bold flex items-center gap-0.5 mt-0.5 ${
                    parseFloat(waistDelta) < 0 ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {parseFloat(waistDelta) > 0 ? `+${waistDelta}` : waistDelta} cm
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Sleep Quality</span>
                <div className="text-xl font-extrabold text-amber-400 font-mono mt-0.5">
                  {currentCheckIn.sleepRating} / 10
                </div>
                <span className="text-[10px] text-slate-400">Energy: {currentCheckIn.energyRating}/10</span>
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Adherence</span>
                <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">
                  {currentCheckIn.workoutAdherenceRating || 9} / 10
                </div>
                <span className="text-[10px] text-slate-400">Nutrition: {currentCheckIn.nutritionAdherenceRating || 9}/10</span>
              </div>
            </div>
          </div>

          {/* Client Notes & Questions */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-750 space-y-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Athlete Log Notes</h4>
              <p className="text-sm text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap">
                "{currentCheckIn.clientNotes}"
              </p>
            </div>

            {currentCheckIn.questions && (
              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Client Questions for Coach</h4>
                <p className="text-xs text-slate-200 mt-0.5 italic">
                  "{currentCheckIn.questions}"
                </p>
              </div>
            )}
          </div>

          {/* Photos */}
          {currentCheckIn.photos && currentCheckIn.photos.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Progress Photos ({currentCheckIn.photos.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentCheckIn.photos.map(p => (
                  <div key={p.id} className="relative rounded-xl overflow-hidden border border-slate-750">
                    <img src={p.url} alt="Checkin" className="w-full h-44 object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-[10px] uppercase font-bold text-white">
                      {p.photoType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coach Feedback Form */}
          <form onSubmit={handleSendReview} className="space-y-3 border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Coach Feedback & Next Week Instructions
              </label>
            </div>

            <textarea
              rows={4}
              required
              placeholder="Provide constructive feedback, acknowledge wins, calibrate macros or training volume for next week..."
              defaultValue={currentCheckIn.coachFeedback || ''}
              onChange={e => setFeedbackText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveCheckInReviewId(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
              >
                Submit Feedback & Mark Reviewed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
