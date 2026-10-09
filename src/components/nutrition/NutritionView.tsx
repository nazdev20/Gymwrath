import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Food } from '../../types';
import {
  Utensils,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Sliders,
  Flame,
  ChevronRight,
  Sparkles,
  PieChart
} from 'lucide-react';

type MealSectionName = 'Breakfast' | 'Morning Snack' | 'Lunch' | 'Afternoon Snack' | 'Dinner' | 'Post-Workout';
const MEAL_TYPES: MealSectionName[] = ['Breakfast', 'Morning Snack', 'Lunch', 'Afternoon Snack', 'Dinner', 'Post-Workout'];

export const NutritionView: React.FC = () => {
  const {
    currentUser,
    allProfiles,
    nutritionTargets,
    setNutritionTarget,
    foodLogs,
    logFoodItem,
    deleteFoodLogItem,
    foods,
    addFood,
    mealPlans
  } = useApp();

  const [selectedClientId, setSelectedClientId] = useState<string>(
    currentUser.role === 'client' ? currentUser.id : (allProfiles.find(p => p.role === 'client')?.id || '')
  );

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  // Modals
  const [isLogFoodOpen, setIsLogFoodOpen] = useState(false);
  const [isSetTargetOpen, setIsSetTargetOpen] = useState(false);
  const [isAddCustomFoodOpen, setIsAddCustomFoodOpen] = useState(false);

  // Food Log inputs
  const [selectedMeal, setSelectedMeal] = useState<MealSectionName>('Breakfast');
  const [selectedFoodId, setSelectedFoodId] = useState(foods[0]?.id || '');
  const [foodQuantity, setFoodQuantity] = useState<number>(100);
  const [foodLogError, setFoodLogError] = useState<string | null>(null);
  const [isSavingFoodLog, setIsSavingFoodLog] = useState(false);
  const [deletingFoodLogId, setDeletingFoodLogId] = useState<string | null>(null);

  // Macro Target inputs
  const currentTarget = nutritionTargets.find(t => t.clientId === selectedClientId) || {
    caloriesKcal: 2000,
    proteinG: 140,
    carbsG: 210,
    fatG: 55
  };
  const [targetCalories, setTargetCalories] = useState(currentTarget.caloriesKcal);
  const [targetProtein, setTargetProtein] = useState(currentTarget.proteinG);
  const [targetCarbs, setTargetCarbs] = useState(currentTarget.carbsG);
  const [targetFat, setTargetFat] = useState(currentTarget.fatG);

  // Custom Food inputs
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodBrand, setNewFoodBrand] = useState('');
  const [newFoodBarcode, setNewFoodBarcode] = useState('');
  const [newFoodType, setNewFoodType] = useState<NonNullable<Food['foodType']>>('generic');
  const [newFoodServingSize, setNewFoodServingSize] = useState(100);
  const [newFoodServingUnit, setNewFoodServingUnit] = useState('g');
  const [newFoodCalories, setNewFoodCalories] = useState(150);
  const [newFoodProtein, setNewFoodProtein] = useState(20);
  const [newFoodCarbs, setNewFoodCarbs] = useState(10);
  const [newFoodFat, setNewFoodFat] = useState(3);
  const [newFoodCategory, setNewFoodCategory] = useState<Food['category']>('Protein');
  const [customFoodError, setCustomFoodError] = useState<string | null>(null);
  const [isSavingCustomFood, setIsSavingCustomFood] = useState(false);
  const [customFoodReturnToLog, setCustomFoodReturnToLog] = useState(false);

  const clients = allProfiles.filter(p => p.role === 'client');
  const canManageFoodLogs = currentUser.role === 'admin' || currentUser.role === 'client';
  const canCreateFoods = Boolean(currentUser.id);

  useEffect(() => {
    if (foods.length > 0 && !foods.some(food => food.id === selectedFoodId)) {
      setSelectedFoodId(foods[0].id);
      setFoodQuantity(foods[0].servingSize || 1);
    }
  }, [foods, selectedFoodId]);

  // Logs for selected date and client
  const clientLogs = foodLogs.filter(
    l => l.clientId === selectedClientId && l.logDate === selectedDate
  );

  const totalCalories = clientLogs.reduce((sum, l) => sum + l.calories, 0);
  const totalProtein = clientLogs.reduce((sum, l) => sum + l.proteinG, 0);
  const totalCarbs = clientLogs.reduce((sum, l) => sum + l.carbsG, 0);
  const totalFat = clientLogs.reduce((sum, l) => sum + l.fatG, 0);

  const handleSaveFoodLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingFoodLog) return;
    const food = foods.find(f => f.id === selectedFoodId);
    if (!food) return;

    const multiplier = foodQuantity / (food.servingSize || 100);

    setFoodLogError(null);
    setIsSavingFoodLog(true);
    try {
      const result = await logFoodItem({
        clientId: selectedClientId,
        foodId: food.id,
        foodName: food.name,
        mealName: selectedMeal,
        logDate: selectedDate,
        quantity: foodQuantity,
        unit: food.servingUnit || 'g',
        calories: Math.round(food.calories * multiplier),
        proteinG: Math.round(food.proteinG * multiplier * 10) / 10,
        carbsG: Math.round(food.carbsG * multiplier * 10) / 10,
        fatG: Math.round(food.fatG * multiplier * 10) / 10
      });
      if (!result.success) {
        setFoodLogError(result.error || 'Food entry was not saved.');
        return;
      }
      setIsLogFoodOpen(false);
    } catch (error) {
      setFoodLogError(error instanceof Error ? error.message : 'Food entry was not saved.');
    } finally {
      setIsSavingFoodLog(false);
    }
  };

  const handleDeleteFoodLog = async (id: string) => {
    setFoodLogError(null);
    setDeletingFoodLogId(id);
    try {
      const result = await deleteFoodLogItem(id);
      if (!result.success) setFoodLogError(result.error || 'Food entry was not deleted.');
    } catch (error) {
      setFoodLogError(error instanceof Error ? error.message : 'Food entry was not deleted.');
    } finally {
      setDeletingFoodLogId(null);
    }
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    setNutritionTarget({
      clientId: selectedClientId,
      coachId: currentUser.id,
      targetType: 'daily',
      effectiveDate: new Date().toISOString().slice(0, 10),
      caloriesKcal: targetCalories,
      proteinG: targetProtein,
      carbsG: targetCarbs,
      fatG: targetFat
    });
    setIsSetTargetOpen(false);
  };

  const handleSaveCustomFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingCustomFood) return;
    if (!newFoodName.trim()) {
      setCustomFoodError('Enter a food name.');
      return;
    }
    if (!Number.isFinite(newFoodServingSize) || newFoodServingSize <= 0 || !newFoodServingUnit.trim()) {
      setCustomFoodError('Enter a valid serving size and unit.');
      return;
    }

    setCustomFoodError(null);
    setIsSavingCustomFood(true);
    try {
      const result = await addFood({
        name: newFoodName.trim(),
        brand: newFoodBrand.trim() || undefined,
        barcode: newFoodBarcode.trim() || undefined,
        foodType: newFoodType,
        category: newFoodCategory,
        servingSize: newFoodServingSize,
        servingUnit: newFoodServingUnit.trim(),
        calories: newFoodCalories,
        proteinG: newFoodProtein,
        carbsG: newFoodCarbs,
        fatG: newFoodFat,
        fiberG: 0,
        notes: undefined,
        isGlobal: true,
        createdBy: currentUser.id
      });

      if (!result.success || !result.food) {
        setCustomFoodError(result.error || 'Food item was not saved.');
        return;
      }

      setSelectedFoodId(result.food.id);
      setFoodQuantity(result.food.servingSize);
      setIsAddCustomFoodOpen(false);
      if (customFoodReturnToLog) setIsLogFoodOpen(true);
      setNewFoodName('');
      setNewFoodBrand('');
      setNewFoodBarcode('');
      setNewFoodType('generic');
      setNewFoodServingSize(100);
      setNewFoodServingUnit('g');
      setNewFoodCalories(150);
      setNewFoodProtein(20);
      setNewFoodCarbs(10);
      setNewFoodFat(3);
      setCustomFoodReturnToLog(false);
    } catch (error) {
      setCustomFoodError(error instanceof Error ? error.message : 'Food item was not saved.');
    } finally {
      setIsSavingCustomFood(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Utensils className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Nutrition & Macro Coaching</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track daily macronutrient intake, build tailored meal plans, and monitor nutrition compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {canCreateFoods && (
            <button
              onClick={() => {
                setCustomFoodError(null);
                setCustomFoodReturnToLog(false);
                setIsAddCustomFoodOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-orange-400" /> Add Food
            </button>
          )}
          {currentUser.role !== 'client' && (
            <>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Athlete:</span>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.fullName}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsSetTargetOpen(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-4 h-4 text-blue-400" /> Prescribe Targets
              </button>
            </>
          )}

          {canManageFoodLogs && <button
              onClick={() => setIsLogFoodOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" /> Log Food / Meal
            </button>}
        </div>
      </div>

      {/* Date Bar & Daily Macro Progress Rings */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Log Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <span className="text-xs text-slate-400">
            Target Budget: <strong className="text-white">{currentTarget.caloriesKcal} kcal</strong> (P: {currentTarget.proteinG}g • C: {currentTarget.carbsG}g • F: {currentTarget.fatG}g)
          </span>
        </div>

        {/* Macro Progress Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories */}
          <div className="p-4 bg-slate-850 rounded-2xl border border-slate-750">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-400 uppercase">Calories</span>
              <Flame className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold text-white font-mono">
              {totalCalories} <span className="text-xs font-normal text-slate-400">/ {currentTarget.caloriesKcal}</span>
            </div>
            <div className="h-2 w-full bg-slate-750 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                style={{ width: `${Math.min(100, (totalCalories / currentTarget.caloriesKcal) * 100)}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="p-4 bg-slate-850 rounded-2xl border border-slate-750">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-400 uppercase">Protein</span>
              <span className="text-xs font-bold text-blue-400">4 kcal/g</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-400 font-mono">
              {Math.round(totalProtein)}g <span className="text-xs font-normal text-slate-400">/ {currentTarget.proteinG}g</span>
            </div>
            <div className="h-2 w-full bg-slate-750 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(100, (totalProtein / currentTarget.proteinG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="p-4 bg-slate-850 rounded-2xl border border-slate-750">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-400 uppercase">Carbohydrates</span>
              <span className="text-xs font-bold text-amber-400">4 kcal/g</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">
              {Math.round(totalCarbs)}g <span className="text-xs font-normal text-slate-400">/ {currentTarget.carbsG}g</span>
            </div>
            <div className="h-2 w-full bg-slate-750 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${Math.min(100, (totalCarbs / currentTarget.carbsG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="p-4 bg-slate-850 rounded-2xl border border-slate-750">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-400 uppercase">Dietary Fats</span>
              <span className="text-xs font-bold text-rose-400">9 kcal/g</span>
            </div>
            <div className="text-2xl font-extrabold text-rose-400 font-mono">
              {Math.round(totalFat)}g <span className="text-xs font-normal text-slate-400">/ {currentTarget.fatG}g</span>
            </div>
            <div className="h-2 w-full bg-slate-750 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-rose-500 rounded-full"
                style={{ width: `${Math.min(100, (totalFat / currentTarget.fatG) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meals Logged Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        {foodLogError && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{foodLogError}</p>}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Daily Meal Diary ({selectedDate})</h2>
          {canManageFoodLogs && <button
              onClick={() => setIsLogFoodOpen(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Log Another Item
            </button>}
        </div>

        {clientLogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-850/50 border border-slate-800 rounded-xl text-slate-400">
            <Utensils className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-xs">No food entries logged for this date.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {MEAL_TYPES.map(meal => {
              const mealItems = clientLogs.filter(l => l.mealName === meal);
              if (mealItems.length === 0) return null;

              const mealCals = mealItems.reduce((s, i) => s + i.calories, 0);

              return (
                <div key={meal} className="bg-slate-850 rounded-xl border border-slate-750 p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase text-white tracking-wider">{meal}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{mealCals} kcal</span>
                  </div>

                  <div className="divide-y divide-slate-800/60">
                    {mealItems.map(item => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-200">{item.foodName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {item.quantity}{item.unit} • P: {item.proteinG}g • C: {item.carbsG}g • F: {item.fatG}g
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">{item.calories} kcal</span>
                          {canManageFoodLogs && item.foodId !== 'legacy-daily-log' && <button
                            onClick={() => void handleDeleteFoodLog(item.id)}
                            disabled={deletingFoodLogId === item.id}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1 disabled:opacity-50"
                            aria-label={`Delete ${item.foodName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Food Modal */}
      {isLogFoodOpen && canManageFoodLogs && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Log Food to Meal Diary</h3>

            <form onSubmit={handleSaveFoodLog} className="space-y-4">
              {foodLogError && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{foodLogError}</p>}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Meal Period</label>
                <select
                  value={selectedMeal}
                  onChange={e => setSelectedMeal(e.target.value as MealSectionName)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {MEAL_TYPES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold uppercase text-slate-300">Food Item</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomFoodError(null);
                      setCustomFoodReturnToLog(true);
                      setIsLogFoodOpen(false);
                      setIsAddCustomFoodOpen(true);
                    }}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    + Create Custom Food
                  </button>
                </div>
                <select
                  value={selectedFoodId}
                  onChange={e => {
                    const nextFoodId = e.target.value;
                    const nextFood = foods.find(food => food.id === nextFoodId);
                    setSelectedFoodId(nextFoodId);
                    setFoodQuantity(nextFood?.servingSize || 1);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {foods.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.calories} kcal / {f.servingSize} {f.servingUnit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Quantity ({foods.find(f => f.id === selectedFoodId)?.servingUnit || 'servings'})</label>
                <input
                  type="number"
                  min={0.01}
                  step={0.01}
                  required
                  value={foodQuantity}
                  onChange={e => setFoodQuantity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogFoodOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingFoodLog}
                  className="flex-1 py-2 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs disabled:opacity-60"
                >
                  {isSavingFoodLog ? 'Saving…' : 'Save to Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Macro Target Modal */}
      {isSetTargetOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Prescribe Daily Macro Targets</h3>

            <form onSubmit={handleSaveTarget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Total Calories (kcal)</label>
                <input
                  type="number"
                  required
                  value={targetCalories}
                  onChange={e => setTargetCalories(parseInt(e.target.value, 10) || 2000)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-3 sm:gap-2">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    required
                    value={targetProtein}
                    onChange={e => setTargetProtein(parseInt(e.target.value, 10) || 140)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    required
                    value={targetCarbs}
                    onChange={e => setTargetCarbs(parseInt(e.target.value, 10) || 200)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    required
                    value={targetFat}
                    onChange={e => setTargetFat(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSetTargetOpen(false)}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs"
                >
                  Update Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Food Modal */}
      {isAddCustomFoodOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Food to Shared Catalog</h3>
            <p className="text-[11px] leading-relaxed text-slate-400">Enter nutrition values for the serving shown below. Barcodes are optional—skip them for home-cooked meals, restaurant dishes, and fast food.</p>

            <form onSubmit={handleSaveCustomFood} className="space-y-4">
              {customFoodError && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{customFoodError}</p>}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Food Name</label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  placeholder="e.g. Cooked white rice or 1 pc chicken burger"
                  value={newFoodName}
                  onChange={e => setNewFoodName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Food Type</label>
                  <select
                    value={newFoodType}
                    onChange={e => setNewFoodType(e.target.value as NonNullable<Food['foodType']>)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="packaged">Packaged Product</option>
                    <option value="home_cooked">Home-Cooked</option>
                    <option value="restaurant">Restaurant Meal</option>
                    <option value="fast_food">Fast Food</option>
                    <option value="generic">Generic Ingredient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Brand / Restaurant (Optional)</label>
                  <input
                    type="text"
                    maxLength={120}
                    placeholder="e.g. Jollibee"
                    value={newFoodBrand}
                    onChange={e => setNewFoodBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Barcode (Optional)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={80}
                  placeholder="Scan or enter barcode; leave blank if none"
                  value={newFoodBarcode}
                  onChange={e => setNewFoodBarcode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Barcode is stored as text to preserve leading zeroes. You can add food manually without one.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Category</label>
                <select
                  value={newFoodCategory}
                  onChange={e => setNewFoodCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Protein">Protein</option>
                  <option value="Carbohydrates">Carbohydrates</option>
                  <option value="Fats">Fats</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Serving Size</label>
                  <input
                    type="number"
                    min={0.01}
                    step={0.01}
                    required
                    value={newFoodServingSize}
                    onChange={e => setNewFoodServingSize(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Serving Unit</label>
                  <input
                    type="text"
                    required
                    maxLength={32}
                    placeholder="g, ml, piece, burger, order"
                    value={newFoodServingUnit}
                    onChange={e => setNewFoodServingUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase text-slate-300 mb-2">Nutrition per {newFoodServingSize || '?'} {newFoodServingUnit.trim() || 'unit'}</p>
                <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    required
                    value={newFoodCalories}
                    onChange={e => setNewFoodCalories(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    required
                    value={newFoodProtein}
                    onChange={e => setNewFoodProtein(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    required
                    value={newFoodCarbs}
                    onChange={e => setNewFoodCarbs(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    required
                    value={newFoodFat}
                    onChange={e => setNewFoodFat(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCustomFoodOpen(false);
                    if (customFoodReturnToLog) setIsLogFoodOpen(true);
                    setCustomFoodReturnToLog(false);
                  }}
                  className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingCustomFood}
                  className="flex-1 py-2 px-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-xs disabled:opacity-60"
                >
                  {isSavingCustomFood ? 'Saving…' : 'Save Food'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
