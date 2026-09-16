import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  Sparkles, 
  Trash2, 
  Filter,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { AppState, TimeBlock } from '../types';
import { getTodayString } from '../services/storage';

interface CalendarViewProps {
  appState: AppState;
  onUpdateBlocks: (blocks: TimeBlock[]) => void;
  onOpenAiPlanner: () => void;
}

type CalendarMode = 'day' | 'week' | 'month';

export const CalendarView: React.FC<CalendarViewProps> = ({
  appState,
  onUpdateBlocks,
  onOpenAiPlanner
}) => {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('week');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [quickModalSlot, setQuickModalSlot] = useState<{ date: string; hour: number } | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<'deep_work' | 'meeting' | 'review' | 'admin' | 'break'>('deep_work');

  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

  // Calculate current week days (Monday to Sunday)
  const getWeekDates = (baseDate: Date): Date[] => {
    const d = new Date(baseDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const next = new Date(monday);
      next.setDate(monday.getDate() + i);
      return next;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const formatDateString = (d: Date) => d.toISOString().split('T')[0];

  const navigateDate = (amount: number) => {
    const next = new Date(currentDate);
    if (calendarMode === 'day') next.setDate(next.getDate() + amount);
    else if (calendarMode === 'week') next.setDate(next.getDate() + amount * 7);
    else next.setMonth(next.getMonth() + amount);
    setCurrentDate(next);
  };

  const filteredBlocks = appState.timeBlocks.filter(b => {
    return categoryFilter === 'all' || b.category === categoryFilter;
  });

  const handleCreateBlockInSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickModalSlot || !quickTitle.trim()) return;

    const startH = quickModalSlot.hour.toString().padStart(2, '0');
    const endH = (quickModalSlot.hour + 1).toString().padStart(2, '0');

    const colors: Record<string, string> = {
      deep_work: '#6366f1',
      meeting: '#ec4899',
      review: '#f59e0b',
      admin: '#3b82f6',
      break: '#10b981'
    };

    const newBlock: TimeBlock = {
      id: `tb-slot-${Date.now()}`,
      title: quickTitle.trim(),
      date: quickModalSlot.date,
      startTime: `${startH}:00`,
      endTime: `${endH}:00`,
      category: quickCategory,
      color: colors[quickCategory] || '#6366f1'
    };

    onUpdateBlocks([...appState.timeBlocks, newBlock]);
    setQuickModalSlot(null);
    setQuickTitle('');
  };

  const handleDeleteBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateBlocks(appState.timeBlocks.filter(b => b.id !== id));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Calendar Header Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Calendar & Time Blocking</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive Google Calendar & Motion style time grid with click-to-block
            </p>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-xs">
            <button
              onClick={() => setCalendarMode('day')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                calendarMode === 'day' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setCalendarMode('week')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                calendarMode === 'week' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Week
            </button>
          </div>
        </div>

        {/* Date Navigation & Category Filter */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-xs">
            <button onClick={() => navigateDate(-1)} className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 sm:px-3 text-xs font-semibold text-slate-900 dark:text-white font-mono">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' })}
            </span>
            <button onClick={() => navigateDate(1)} className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500 shadow-xs"
          >
            <option value="all">All Categories</option>
            <option value="deep_work">Deep Work</option>
            <option value="meeting">Meetings</option>
            <option value="review">Reviews</option>
            <option value="admin">Admin</option>
            <option value="break">Breaks</option>
          </select>

          <button
            onClick={onOpenAiPlanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>AI Auto-Fill Open Gaps</span>
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <div className="min-w-[720px] rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 overflow-hidden flex flex-col h-full shadow-xs">
          {/* Weekday Columns Header */}
          <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-mono text-xs">
            <div className="p-3 text-center border-r border-slate-200 dark:border-slate-800/80 font-bold">
              Time
            </div>
            {calendarMode === 'week' ? (
              weekDates.map(d => {
                const isToday = formatDateString(d) === getTodayString();
                return (
                  <div
                    key={d.toISOString()}
                    className={`p-3 text-center border-r border-slate-200 dark:border-slate-800/80 last:border-r-0 ${
                      isToday ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold' : ''
                    }`}
                  >
                    <div>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{d.getDate()}</div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-7 p-3 text-center font-bold text-slate-900 dark:text-white bg-indigo-50/50 dark:bg-indigo-950/30">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            )}
          </div>

          {/* Hourly Slots Table */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800/40">
            {hours.map(hour => {
              const hourStr = `${hour.toString().padStart(2, '0')}:00`;
              return (
                <div key={hour} className="grid grid-cols-8 min-h-[64px]">
                  {/* Time label */}
                  <div className="p-2 border-r border-slate-200 dark:border-slate-800/80 text-[11px] font-mono text-slate-500 dark:text-slate-400 text-center flex items-center justify-center">
                    {hourStr}
                  </div>

                  {/* Day Slots */}
                  {calendarMode === 'week' ? (
                    weekDates.map(d => {
                      const dateStr = formatDateString(d);
                      const matchingBlocks = filteredBlocks.filter(b => {
                        if (b.date !== dateStr) return false;
                        const [startH] = b.startTime.split(':').map(Number);
                        return startH === hour;
                      });

                      return (
                        <div
                          key={dateStr}
                          onClick={() => setQuickModalSlot({ date: dateStr, hour })}
                          className="p-1 border-r border-slate-200 dark:border-slate-800/40 last:border-r-0 relative hover:bg-indigo-50/30 dark:hover:bg-slate-800/20 cursor-pointer transition-colors group flex flex-col gap-1"
                        >
                          {matchingBlocks.map(block => (
                            <div
                              key={block.id}
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded text-[10px] text-white shadow-xs flex flex-col justify-between overflow-hidden relative group/block"
                              style={{ backgroundColor: `${block.color}f0`, borderLeft: `3px solid ${block.color}` }}
                            >
                              <div className="font-semibold truncate pr-4">{block.title}</div>
                              <div className="text-[9px] opacity-90 font-mono mt-0.5 flex items-center justify-between">
                                <span>{block.startTime} - {block.endTime}</span>
                                {block.isAiScheduled && <Sparkles className="w-2.5 h-2.5" />}
                              </div>
                              <button
                                onClick={(e) => handleDeleteBlock(block.id, e)}
                                className="absolute right-1 top-1 text-white/80 hover:text-white opacity-0 group-hover/block:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}

                          {matchingBlocks.length === 0 && (
                            <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              + Block
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    // Single Day view slot
                    (() => {
                      const dateStr = formatDateString(currentDate);
                      const matchingBlocks = filteredBlocks.filter(b => {
                        if (b.date !== dateStr) return false;
                        const [startH] = b.startTime.split(':').map(Number);
                        return startH === hour;
                      });
                      return (
                        <div
                          onClick={() => setQuickModalSlot({ date: dateStr, hour })}
                          className="col-span-7 p-1.5 relative hover:bg-indigo-50/30 dark:hover:bg-slate-800/20 cursor-pointer transition-colors group flex gap-2"
                        >
                          {matchingBlocks.map(block => (
                            <div
                              key={block.id}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 p-2 rounded-lg text-white shadow-xs flex items-center justify-between overflow-hidden relative group/block"
                              style={{ backgroundColor: `${block.color}f0`, borderLeft: `4px solid ${block.color}` }}
                            >
                              <div>
                                <div className="font-bold text-xs">{block.title}</div>
                                <div className="text-[11px] opacity-90 font-mono mt-0.5">
                                  {block.startTime} - {block.endTime} • {block.category.replace('_', ' ')}
                                </div>
                              </div>
                              <button
                                onClick={(e) => handleDeleteBlock(block.id, e)}
                                className="text-white/80 hover:text-white p-1 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      );
                    })()
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Add Time Block Modal */}
      {quickModalSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateBlockInSlot}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 w-full max-w-md shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                Create Time Block ({quickModalSlot.date} @ {quickModalSlot.hour}:00)
              </span>
              <button
                type="button"
                onClick={() => setQuickModalSlot(null)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Block Title</label>
              <input
                type="text"
                autoFocus
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="e.g., Deep Focus: Architecture Design"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Category</label>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="deep_work">Deep Work (Indigo)</option>
                <option value="meeting">Meeting (Pink)</option>
                <option value="review">Review & QA (Amber)</option>
                <option value="admin">Operations / Admin (Blue)</option>
                <option value="break">Health / Break (Emerald)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuickModalSlot(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
              >
                Save Block
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
