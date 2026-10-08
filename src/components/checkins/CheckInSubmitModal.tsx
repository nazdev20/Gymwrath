import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgressPhoto } from '../../types';
import {
  X,
  ClipboardCheck,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CheckInSubmitModal: React.FC = () => {
  const {
    isCheckInModalOpen,
    setIsCheckInModalOpen,
    currentUser,
    submitCheckIn
  } = useApp();

  const [weightKg, setWeightKg] = useState<string>(currentUser.currentWeightKg ? String(currentUser.currentWeightKg) : '65.0');
  const [waistCm, setWaistCm] = useState<string>('70.0');
  const [chestCm, setChestCm] = useState<string>('86.0');
  const [armsCm, setArmsCm] = useState<string>('28.5');
  const [hipsCm, setHipsCm] = useState<string>('94.0');
  const [thighsCm, setThighsCm] = useState<string>('54.0');

  // Ratings
  const [sleepRating, setSleepRating] = useState<number>(8);
  const [stressRating, setStressRating] = useState<number>(4);
  const [energyRating, setEnergyRating] = useState<number>(8);
  const [hungerRating, setHungerRating] = useState<number>(5);
  const [digestionRating, setDigestionRating] = useState<number>(9);
  const [workoutAdherence, setWorkoutAdherence] = useState<number>(9);
  const [nutritionAdherence, setNutritionAdherence] = useState<number>(9);

  // Notes
  const [clientNotes, setClientNotes] = useState<string>('');
  const [questions, setQuestions] = useState<string>('');

  // Photos
  const [photos, setPhotos] = useState<ProgressPhoto[]>([
    {
      id: `ph-${Date.now()}-1`,
      checkInId: '',
      clientId: currentUser.id,
      photoType: 'front',
      url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400',
      uploadedAt: new Date().toISOString()
    }
  ]);

  if (!isCheckInModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weightKg);
    if (isNaN(parsedWeight) || parsedWeight <= 0) return;

    submitCheckIn({
      clientId: currentUser.id,
      coachId: currentUser.assignedCoachId || 'user-coach-1',
      checkInDate: new Date().toISOString().slice(0, 10),
      weightKg: parsedWeight,
      waistCm: parseFloat(waistCm) || undefined,
      chestCm: parseFloat(chestCm) || undefined,
      armsCm: parseFloat(armsCm) || undefined,
      hipsCm: parseFloat(hipsCm) || undefined,
      thighsCm: parseFloat(thighsCm) || undefined,
      sleepRating,
      stressRating,
      energyRating,
      hungerRating,
      digestionRating,
      workoutAdherenceRating: workoutAdherence,
      nutritionAdherenceRating: nutritionAdherence,
      clientNotes: clientNotes.trim() || 'Weekly check-in submitted.',
      questions: questions.trim() || undefined,
      photos
    });

    setIsCheckInModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-white flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Weekly Athlete Check-In</h2>
              <p className="text-xs text-slate-400">Submit weight, body tape measurements, biofeedback & progress photos</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckInModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Section 1: Bodyweight & Tape Measurements */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> 1. Weight & Circumference Measurements
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Morning Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Waist (Navel cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={e => setWaistCm(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Hips / Glutes (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={hipsCm}
                  onChange={e => setHipsCm(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={chestCm}
                  onChange={e => setChestCm(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Arms / Biceps (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={armsCm}
                  onChange={e => setArmsCm(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 bg-slate-850 rounded-xl border border-slate-750">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Thighs (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={thighsCm}
                  onChange={e => setThighsCm(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Biofeedback Sliders */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> 2. Biofeedback & Adherence (1-10)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Sleep Quality & Duration</span>
                  <span className="font-mono font-bold text-amber-400">{sleepRating} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={sleepRating}
                  onChange={e => setSleepRating(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Daily Energy & Vitality</span>
                  <span className="font-mono font-bold text-amber-400">{energyRating} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={energyRating}
                  onChange={e => setEnergyRating(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Life / Work Stress Level</span>
                  <span className="font-mono font-bold text-amber-400">{stressRating} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={stressRating}
                  onChange={e => setStressRating(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="p-3.5 bg-slate-850 rounded-xl border border-slate-750">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Workout Adherence</span>
                  <span className="font-mono font-bold text-emerald-400">{workoutAdherence} / 10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={workoutAdherence}
                  onChange={e => setWorkoutAdherence(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Notes & Questions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> 3. Client Notes & Questions
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                How did this week go? (Wins, challenges, energy, workout highlights) *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Give your coach a summary of how training, nutrition, and recovery felt..."
                value={clientNotes}
                onChange={e => setClientNotes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Any specific questions or adjustment requests for next week?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Can we adjust training days or swap exercises?"
                value={questions}
                onChange={e => setQuestions(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Section 4: Progress Photos */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> 4. Progress Photos (Front, Side, Back)
            </h3>

            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-3">
              {photos.map(p => (
                <div key={p.id} className="relative rounded-xl overflow-hidden border border-slate-750 group">
                  <img src={p.url} alt="Progress" className="w-full h-32 object-cover" />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-[10px] uppercase font-bold text-white">
                    {p.photoType}
                  </span>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setPhotos(prev => [
                    ...prev,
                    {
                      id: `ph-${Date.now()}`,
                      checkInId: '',
                      clientId: currentUser.id,
                      photoType: 'side',
                      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400',
                      uploadedAt: new Date().toISOString()
                    }
                  ]);
                }}
                className="h-32 rounded-xl border border-dashed border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white flex flex-col items-center justify-center gap-1 text-xs transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Add Photo</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 flex gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCheckInModalOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              Submit Check-In to Coach
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
