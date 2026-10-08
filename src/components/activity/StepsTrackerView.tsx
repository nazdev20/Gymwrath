import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Footprints,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  ArrowRight
} from 'lucide-react';

export const StepsTrackerView: React.FC = () => {
  const {
    currentUser,
    allProfiles,
    stepRecords,
    logDailySteps
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    currentUser.role === 'client' ? currentUser.id : (allProfiles.find(p => p.role === 'client')?.id || '')
  );

  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [stepInput, setStepInput] = useState('10500');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const clients = allProfiles.filter(p => p.role === 'client');

  const clientSteps = stepRecords
    .filter(r => r.clientId === selectedClientId)
    .sort((a, b) => b.logDate.localeCompare(a.logDate));

  const totalLogs = clientSteps.length;
  const avgSteps = totalLogs > 0
    ? Math.round(clientSteps.reduce((sum, r) => sum + r.stepCount, 0) / totalLogs)
    : 0;

  const hitGoalCount = clientSteps.filter(r => r.stepCount >= 10000).length;
  const complianceRate = totalLogs > 0 ? Math.round((hitGoalCount / totalLogs) * 100) : 0;
  const highestDay = totalLogs > 0 ? Math.max(...clientSteps.map(r => r.stepCount)) : 0;

  const handleSaveStep = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(stepInput, 10);
    if (!isNaN(count) && count >= 0) {
      logDailySteps(logDate, count);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Footprints className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Daily Steps & NEAT Tracker</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manual step tracking logs, baseline activity trends, and daily compliance records.
          </p>
        </div>

        {currentUser.role !== 'client' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Athlete:</span>
            <select
              value={selectedClientId}
              onChange={e => setSelectedClientId(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.fullName}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average Daily Steps</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{avgSteps.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Across all logged days</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">10k Goal Hit Rate</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{complianceRate}%</div>
          <p className="text-xs text-slate-400 mt-1">{hitGoalCount} of {totalLogs} days &gt;= 10,000</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Personal Record</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{highestDay.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Single highest day</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Logged Entries</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalLogs} days</div>
          <p className="text-xs text-slate-400 mt-1">Manual records in database</p>
        </div>
      </div>

      {/* Manual Step Logger Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-1">Log Daily Step Count</h2>
        <p className="text-xs text-slate-400 mb-4">Input your total daily steps as recorded by your phone or fitness wearable</p>

        <form onSubmit={handleSaveStep} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Date</label>
            <input
              type="date"
              required
              value={logDate}
              onChange={e => setLogDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Total Steps Count</label>
            <input
              type="number"
              min={0}
              max={150000}
              required
              value={stepInput}
              onChange={e => setStepInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Save Step Record
            </button>
          </div>
        </form>

        {saveSuccess && (
          <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-3 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" /> Step record successfully saved to database!
          </p>
        )}
      </div>

      {/* History Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold text-white">Historical Step Records</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {clientSteps.map(rec => {
            const isHit = rec.stepCount >= 10000;

            return (
              <div
                key={rec.id}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isHit
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-850 border-slate-750'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-mono block mb-1">{rec.logDate}</span>
                <span className={`text-base font-extrabold font-mono block ${isHit ? 'text-emerald-400' : 'text-white'}`}>
                  {rec.stepCount.toLocaleString()}
                </span>
                <span className={`text-[10px] font-semibold mt-1 inline-block ${isHit ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isHit ? '✓ Goal Met' : 'Under'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
