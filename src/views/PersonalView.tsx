import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Flame, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Zap, 
  Smile, 
  BookOpen, 
  Sparkles,
  Award
} from 'lucide-react';
import { AppState, Habit, DailyReflection } from '../types';
import { getTodayString } from '../services/storage';

interface PersonalViewProps {
  appState: AppState;
  onUpdateHabits: (habits: Habit[]) => void;
  onSaveReflection: (reflection: DailyReflection) => void;
}

export const PersonalView: React.FC<PersonalViewProps> = ({
  appState,
  onUpdateHabits,
  onSaveReflection
}) => {
  const today = getTodayString();
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'deep_work' | 'health' | 'learning' | 'mindset'>('deep_work');

  // Daily Reflection Form
  const existingReflection = appState.reflections.find(r => r.date === today);
  const [energyScore, setEnergyScore] = useState(existingReflection?.energyScore || 8);
  const [stressScore, setStressScore] = useState(existingReflection?.stressScore || 3);
  const [highlight, setHighlight] = useState(existingReflection?.highlight || '');
  const [blockers, setBlockers] = useState(existingReflection?.blockers || '');
  const [tomorrowFocus, setTomorrowFocus] = useState(existingReflection?.tomorrowFocus || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleHabit = (habitId: string) => {
    onUpdateHabits(appState.habits.map(h => {
      if (h.id === habitId) {
        const isDoneToday = h.completedDates.includes(today);
        const newDates = isDoneToday
          ? h.completedDates.filter(d => d !== today)
          : [...h.completedDates, today];
        const newStreak = isDoneToday ? Math.max(0, h.streak - 1) : h.streak + 1;
        return {
          ...h,
          completedDates: newDates,
          streak: newStreak
        };
      }
      return h;
    }));
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    const newHabit: Habit = {
      id: `hab-${Date.now()}`,
      title: habitTitle.trim(),
      category: habitCategory,
      frequency: 'daily',
      streak: 1,
      completedDates: [today]
    };

    onUpdateHabits([...appState.habits, newHabit]);
    setIsAddingHabit(false);
    setHabitTitle('');
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    const reflection: DailyReflection = {
      date: today,
      energyScore,
      stressScore,
      highlight,
      blockers,
      tomorrowFocus
    };
    onSaveReflection(reflection);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 space-y-5 sm:space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Personal Productivity & Habits</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              Flow & Wellness
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Circadian energy check-ins, daily ritual streaks, and evening executive reflection
          </p>
        </div>

        <button
          onClick={() => setIsAddingHabit(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Daily Habit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: Daily Habits Checklist & Streaks */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                <span>Habit Streaks for Today</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {appState.habits.filter(h => h.completedDates.includes(today)).length}/{appState.habits.length} Complete
              </span>
            </div>

            <div className="space-y-2.5">
              {appState.habits.map(habit => {
                const isCompletedToday = habit.completedDates.includes(today);

                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between shadow-2xs ${
                      isCompletedToday
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                        {isCompletedToday ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>
                      <div>
                        <div className={`text-xs font-semibold ${isCompletedToday ? 'text-slate-900 dark:text-white line-through opacity-80' : 'text-slate-850 dark:text-slate-200'}`}>
                          {habit.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 capitalize">
                          {habit.category.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{habit.streak}d streak</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Daily Energy & Evening Reflection Journal */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleSaveReflection} className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 text-xs shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Daily Reflection & Energy Journal ({today})</span>
              </span>
              {savedSuccess && (
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">✓ Saved Locally!</span>
              )}
            </div>

            {/* Energy Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold flex items-center justify-between">
                  <span>Circadian Energy Level</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{energyScore}/10</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={energyScore}
                  onChange={(e) => setEnergyScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold flex items-center justify-between">
                  <span>Stress / Friction Score</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{stressScore}/10</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={stressScore}
                  onChange={(e) => setStressScore(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Reflection Questions */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Today's Core Accomplishment</label>
                <textarea
                  rows={2}
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="What was the most impactful outcome achieved today?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Context Switches or Blockers Encountered</label>
                <textarea
                  rows={2}
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  placeholder="What distracted you from deep focus?"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Tomorrow's #1 Focus Anchor</label>
                <input
                  type="text"
                  value={tomorrowFocus}
                  onChange={(e) => setTomorrowFocus(e.target.value)}
                  placeholder="The single task that makes tomorrow a win..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
              >
                Record Daily Journal
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Habit Modal */}
      {isAddingHabit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateHabit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Create Productivity Habit</span>
              <button type="button" onClick={() => setIsAddingHabit(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer">✕</button>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Habit Title *</label>
              <input
                type="text"
                required
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                placeholder="e.g., 90-min High Energy Deep Work Block"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Category</label>
              <select
                value={habitCategory}
                onChange={(e) => setHabitCategory(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="deep_work">Deep Work & Focus</option>
                <option value="health">Physical Health & Energy</option>
                <option value="learning">Continuous Learning</option>
                <option value="mindset">Mindset & Mindfulness</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingHabit(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer shadow-md shadow-indigo-600/25"
              >
                Save Habit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
