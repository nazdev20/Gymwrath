import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise, ExerciseCategory, MuscleGroup, EquipmentType } from '../../types';
import {
  Dumbbell,
  Search,
  Plus,
  Filter,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

const MUSCLE_GROUPS: (MuscleGroup | 'All')[] = [
  'All',
  'Chest',
  'Back',
  'Quads',
  'Hamstrings',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Core'
];

const EQUIPMENT_TYPES: (EquipmentType | 'All')[] = [
  'All',
  'Barbell',
  'Dumbbell',
  'Cable',
  'Machine',
  'Bodyweight'
];

const EXERCISE_CATEGORIES: ExerciseCategory[] = [
  'strength',
  'cardio',
  'flexibility',
  'balance',
  'plyometric',
  'other'
];

export const ExerciseLibrary: React.FC = () => {
  const { exercises, addExercise, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | 'All'>('All');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingExercise, setIsSavingExercise] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [newExName, setNewExName] = useState('');
  const [newExDesc, setNewExDesc] = useState('');
  const [newExCategory, setNewExCategory] = useState<ExerciseCategory>('strength');
  const [newExMuscle, setNewExMuscle] = useState<MuscleGroup>('Chest');
  const [newExEquipment, setNewExEquipment] = useState<EquipmentType>('Barbell');
  const [newExInstructions, setNewExInstructions] = useState('');

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ex.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle || ex.secondaryMuscles?.includes(selectedMuscle as MuscleGroup);
    const matchesEquip = selectedEquipment === 'All' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquip;
  });

  const handleCreateExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim() || isSavingExercise) return;

    setIsSavingExercise(true);
    setSaveError(null);
    try {
      const saveResult = await addExercise({
        name: newExName.trim(),
        description: newExDesc.trim() || 'Custom coach exercise',
        category: newExCategory,
        instructions: newExInstructions.split('\n').filter(i => i.trim().length > 0),
        muscleGroup: newExMuscle,
        equipment: newExEquipment,
        isGlobal: currentUser.role === 'admin',
        createdBy: currentUser.id
      });

      if (!saveResult.success) {
        setSaveError(`Exercise was not saved: ${saveResult.error || 'unknown error'}`);
        return;
      } else if (saveResult.warning) {
        setSaveError(saveResult.warning);
      }
      setIsAddModalOpen(false);
      setNewExName('');
      setNewExDesc('');
      setNewExInstructions('');
    } catch (error) {
      console.error('Failed to create exercise:', error);
      setSaveError(`Exercise could not be saved to Supabase: ${error instanceof Error ? error.message : 'unknown error'}`);
    } finally {
      setIsSavingExercise(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Movement Library</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized movement catalog with biomechanics, execution cues, and video references.
          </p>
        </div>

        {(currentUser.role === 'coach' || currentUser.role === 'admin') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" /> Add Custom Exercise
          </button>
        )}
      </div>

      {saveError && (
        <p role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
          {saveError}
        </p>
      )}

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search exercise name or keyword..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Equipment Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 shrink-0">Equipment:</span>
            <select
              value={selectedEquipment}
              onChange={e => setSelectedEquipment(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {EQUIPMENT_TYPES.map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Muscle Group Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 mr-1 text-[11px] font-semibold uppercase shrink-0">Target:</span>
          {MUSCLE_GROUPS.map(muscle => (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedMuscle === muscle
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.map(ex => {
          const isExpanded = expandedExerciseId === ex.id;

          return (
            <div
              key={ex.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-white text-base leading-snug">{ex.name}</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {ex.equipment}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{ex.description}</p>

                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Primary: {ex.muscleGroup}
                  </span>
                  {ex.secondaryMuscles?.map(sm => (
                    <span key={sm} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800 text-slate-400">
                      + {sm}
                    </span>
                  ))}
                </div>

                {/* Expandable Execution Instructions */}
                {isExpanded && ex.instructions && ex.instructions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-in fade-in duration-150">
                    <p className="text-[11px] font-bold uppercase text-slate-400">Execution Form Cues:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                      {ex.instructions.map((inst, i) => (
                        <li key={i} className="leading-relaxed">{inst}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {ex.isGlobal ? 'Verified System Exercise' : 'Custom Coach Exercise'}
                </span>
                <button
                  onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>Hide Cues <ChevronUp className="w-3.5 h-3.5" /></>
                  ) : (
                    <>View Form Cues <ChevronDown className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Exercise Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Create Custom Exercise
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deficit Reverse Lunge"
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Category</label>
                  <select
                    value={newExCategory}
                    onChange={e => setNewExCategory(e.target.value as ExerciseCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {EXERCISE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Primary Muscle</label>
                  <select
                    value={newExMuscle}
                    onChange={e => setNewExMuscle(e.target.value as MuscleGroup)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {MUSCLE_GROUPS.filter(m => m !== 'All').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Equipment</label>
                  <select
                    value={newExEquipment}
                    onChange={e => setNewExEquipment(e.target.value as EquipmentType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    {EQUIPMENT_TYPES.filter(eq => eq !== 'All').map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Description / Focus</label>
                <textarea
                  rows={2}
                  placeholder="Summary of exercise mechanics and target outcomes..."
                  value={newExDesc}
                  onChange={e => setNewExDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Execution Cues (One step per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="1. Step back with 1.5x hip width...\n2. Maintain vertical front shin...\n3. Drive through front heel..."
                  value={newExInstructions}
                  onChange={e => setNewExInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingExercise}
                  className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs"
                >
                  {isSavingExercise ? 'Saving...' : 'Save Exercise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
