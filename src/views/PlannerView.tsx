import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  Plus, 
  Trash2, 
  Flame, 
  AlertCircle,
  ExternalLink,
  Sliders,
  Play,
  BookOpen
} from 'lucide-react';
import { AppState, TimeBlock, Task } from '../types';
import { runLocalSmartScheduler, calculateWorkloadMetric } from '../services/aiScheduler';
import { getTodayString } from '../services/storage';

interface PlannerViewProps {
  appState: AppState;
  onUpdateBlocks: (blocks: TimeBlock[]) => void;
  onUpdateTasks: (tasks: Task[]) => void;
  onOpenAiModal: () => void;
  onSelectTask: (task: Task) => void;
  onOpenNewTaskModal: () => void;
  onOpenManual?: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  appState,
  onUpdateBlocks,
  onUpdateTasks,
  onOpenAiModal,
  onSelectTask,
  onOpenNewTaskModal,
  onOpenManual
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'schedule' | 'backlog'>('schedule');

  // New manual block state
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockStart, setNewBlockStart] = useState('14:00');
  const [newBlockEnd, setNewBlockEnd] = useState('15:00');
  const [newBlockCategory, setNewBlockCategory] = useState<TimeBlock['category']>('deep_work');

  // Filter blocks for selected date
  const dayBlocks = appState.timeBlocks
    .filter(b => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Compute workload
  const metrics = calculateWorkloadMetric(
    dayBlocks,
    appState.userProfile.workStartHour,
    appState.userProfile.workEndHour
  );

  const totalHours = (metrics.totalScheduledMinutes / 60).toFixed(1);
  const deepHours = (metrics.deepWorkMinutes / 60).toFixed(1);

  // Unscheduled tasks
  const unscheduledTasks = appState.tasks.filter(t => 
    t.status !== 'done' && 
    t.status !== 'cancelled' &&
    (!t.scheduledBlockId || !appState.timeBlocks.some(b => b.id === t.scheduledBlockId))
  );

  const handleQuickAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle.trim()) return;

    const colors: Record<string, string> = {
      deep_work: '#6366f1',
      meeting: '#ec4899',
      review: '#3b82f6',
      admin: '#64748b',
      break: '#10b981'
    };

    const blockColor = colors[newBlockCategory] || '#8b5cf6';

    const newBlock: TimeBlock = {
      id: `block-${Date.now()}`,
      title: newBlockTitle.trim(),
      date: selectedDate,
      startTime: newBlockStart,
      endTime: newBlockEnd,
      category: newBlockCategory,
      isAiScheduled: false,
      color: blockColor
    };

    onUpdateBlocks([...appState.timeBlocks, newBlock]);
    setNewBlockTitle('');
    setIsAddingBlock(false);
  };

  const handleDeleteBlock = (blockId: string) => {
    onUpdateBlocks(appState.timeBlocks.filter(b => b.id !== blockId));
  };

  const handleQuickAutoSchedule = () => {
    const res = runLocalSmartScheduler(
      selectedDate,
      appState.tasks,
      appState.timeBlocks,
      appState.userProfile.workStartHour,
      appState.userProfile.workEndHour
    );
    if (res.scheduledBlocks.length > 0) {
      onUpdateBlocks([...appState.timeBlocks, ...res.scheduledBlocks]);
      onUpdateTasks(appState.tasks.map(t => {
        const match = res.updatedTasks.find(ut => ut.id === t.id);
        return match || t;
      }));
    }
  };

  const navigateDay = (offset: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Header Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI Time Planner & Day Blocks</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              Motion Style
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time constraint solver balancing deep work intervals and meetings
          </p>
        </div>

        {/* Date Controls & AI Autopilot Button */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Landing Page Instruction Manual Button */}
          {onOpenManual && (
            <button
              id="landing-manual-btn"
              onClick={onOpenManual}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors shadow-2xs cursor-pointer"
              title="Open Instruction Manual for Enterprise Fleet, Startup Core & Personal Flow"
              aria-label="Open Instruction Manual"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>Instruction Manual</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                Free Prototype
              </span>
            </button>
          )}

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-xs">
            <button
              onClick={() => navigateDay(-1)}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Previous Day"
              aria-label="Previous day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-2 sm:px-3 text-xs font-semibold text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{selectedDate === getTodayString() ? `Today (${selectedDate})` : selectedDate}</span>
            </div>
            <button
              onClick={() => navigateDay(1)}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Next Day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            id="planner-quick-auto-schedule-btn"
            onClick={handleQuickAutoSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Auto-Schedule Day</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-Navigation Tab for Responsive Viewing */}
      <div className="xl:hidden flex items-center border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 px-3 py-1.5 gap-2">
        <button
          onClick={() => setActiveMobileTab('schedule')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
            activeMobileTab === 'schedule'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Day Timeline ({dayBlocks.length})
        </button>
        <button
          onClick={() => setActiveMobileTab('backlog')}
          className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
            activeMobileTab === 'backlog'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Backlog Ready ({unscheduledTasks.length})
        </button>
      </div>

      {/* Main Content: Split View on Desktop, Tabbed on Mobile/Tablet */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Day Timeline */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 ${
          activeMobileTab === 'backlog' ? 'hidden xl:block' : 'block'
        }`}>
          {/* Day Load Indicator Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Allocated Time</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {totalHours}h <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ 9h</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Deep Work Capacity</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {deepHours}h <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({metrics.deepWorkPercentage}%)</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
              <div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Day Load Profile</div>
                <div className="text-xl font-bold capitalize text-slate-900 dark:text-white mt-0.5">
                  {metrics.overloaded ? (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-base">
                      <AlertCircle className="w-4 h-4" /> Overloaded
                    </span>
                  ) : (
                    <span className="text-cyan-600 dark:text-cyan-400 text-base font-semibold">Healthy Velocity</span>
                  )}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Flame className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Timeline Visual Grid */}
          <div className="rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wider">
                  Timeline Time Blocks ({dayBlocks.length} Scheduled)
                </span>
              </div>
              <button
                onClick={() => setIsAddingBlock(!isAddingBlock)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Custom Block</span>
              </button>
            </div>

            {/* Custom Block Form */}
            {isAddingBlock && (
              <form onSubmit={handleQuickAddBlock} className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-end gap-3 text-xs">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Block Title</label>
                  <input
                    type="text"
                    value={newBlockTitle}
                    onChange={(e) => setNewBlockTitle(e.target.value)}
                    placeholder="e.g., Code Review & Architecture Sync"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Start</label>
                  <input
                    type="time"
                    value={newBlockStart}
                    onChange={(e) => setNewBlockStart(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">End</label>
                  <input
                    type="time"
                    value={newBlockEnd}
                    onChange={(e) => setNewBlockEnd(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={newBlockCategory}
                    onChange={(e) => setNewBlockCategory(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="deep_work">Deep Work</option>
                    <option value="meeting">Meeting</option>
                    <option value="review">Review</option>
                    <option value="admin">Admin</option>
                    <option value="break">Break / Lunch</option>
                    {Array.from(new Set(appState.customCategories || [])).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
                  >
                    Add Block
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingBlock(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Time Blocks Stream */}
            <div className="p-4 space-y-2.5">
              {dayBlocks.length > 0 ? (
                dayBlocks.map(block => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-slate-700 transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-10 rounded-full shrink-0" style={{ backgroundColor: block.color }} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 dark:text-white text-xs">{block.title}</span>
                          {block.isAiScheduled && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>AI Locked</span>
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {block.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          {block.startTime} – {block.endTime}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Remove Block"
                        aria-label="Remove time block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No blocks scheduled for {selectedDate}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Let the intelligent AI scheduler allocate your focus blocks, or add custom calendar slots manually.
                  </p>
                  <button
                    onClick={handleQuickAutoSchedule}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Autopilot for {selectedDate}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Unscheduled Task Backlog */}
        <div className={`w-full xl:w-80 border-t xl:border-t-0 xl:border-l border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 flex flex-col p-4 shrink-0 ${
          activeMobileTab === 'schedule' ? 'hidden xl:flex' : 'flex'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs">Backlog Ready to Schedule</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-mono">
                {unscheduledTasks.length}
              </span>
            </div>
            <button
              onClick={onOpenNewTaskModal}
              className="p-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Add New Task"
              aria-label="Add new task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2">
            {unscheduledTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/50 cursor-pointer transition-all space-y-1.5 group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-xs group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                    {task.title}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                    task.priority === 'urgent' ? 'bg-rose-500' :
                    task.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {task.estimatedMinutes}m
                  </span>
                  {task.dueDate && <span>Due: {task.dueDate}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onOpenAiModal}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch AI Workload Planner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
