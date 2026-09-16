import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Zap, 
  CheckCircle2, 
  Flame, 
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AppState, TimeBlock, Task } from '../types';
import { runLocalSmartScheduler } from '../services/aiScheduler';
import { getTodayString } from '../services/storage';

interface PlannerViewProps {
  appState: AppState;
  onUpdateBlocks: (blocks: TimeBlock[]) => void;
  onUpdateTasks: (tasks: Task[]) => void;
  onOpenAiModal: () => void;
  onSelectTask: (task: Task) => void;
  onOpenNewTaskModal: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  appState,
  onUpdateBlocks,
  onUpdateTasks,
  onOpenAiModal,
  onSelectTask,
  onOpenNewTaskModal
}) => {
  const [selectedDate, setSelectedDate] = useState(() => getTodayString());
  const [newBlockTitle, setNewBlockTitle] = useState('');
  const [newBlockStart, setNewBlockStart] = useState('10:00');
  const [newBlockEnd, setNewBlockEnd] = useState('11:00');
  const [newBlockCategory, setNewBlockCategory] = useState<'deep_work' | 'meeting' | 'review' | 'admin' | 'break'>('deep_work');
  const [isAddingBlock, setIsAddingBlock] = useState(false);

  // Time slots for the day (08:00 to 19:00)
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  // Current day blocks
  const dayBlocks = appState.timeBlocks
    .filter(b => b.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Calculate day stats
  let totalMins = 0;
  let deepWorkMins = 0;
  dayBlocks.forEach(b => {
    const [sh, sm] = b.startTime.split(':').map(Number);
    const [eh, em] = b.endTime.split(':').map(Number);
    const dur = Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
    totalMins += dur;
    if (b.category === 'deep_work') deepWorkMins += dur;
  });

  const totalHours = Math.round(totalMins / 60 * 10) / 10;
  const deepWorkHours = Math.round(deepWorkMins / 60 * 10) / 10;
  const workloadRatio = Math.min(100, Math.round((totalMins / (9 * 60)) * 100));

  // Unscheduled or pending tasks
  const unscheduledTasks = appState.tasks.filter(t => 
    t.status !== 'done' && 
    t.status !== 'cancelled' &&
    !dayBlocks.some(b => b.taskId === t.id)
  );

  const handleQuickAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockTitle.trim()) return;

    const colors: Record<string, string> = {
      deep_work: '#6366f1',
      meeting: '#ec4899',
      review: '#f59e0b',
      admin: '#3b82f6',
      break: '#10b981'
    };

    const newBlock: TimeBlock = {
      id: `tb-${Date.now()}`,
      title: newBlockTitle.trim(),
      date: selectedDate,
      startTime: newBlockStart,
      endTime: newBlockEnd,
      category: newBlockCategory,
      color: colors[newBlockCategory] || '#6366f1'
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
    <div className="h-full flex flex-col overflow-hidden bg-slate-950">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">AI Time Planner & Day Blocks</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Motion Style
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time constraint solver balancing deep work intervals and meetings
          </p>
        </div>

        {/* Date Controls & AI Autopilot Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => navigateDay(-1)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 text-xs font-semibold text-white font-mono flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{selectedDate === getTodayString() ? `Today (${selectedDate})` : selectedDate}</span>
            </div>
            <button
              onClick={() => navigateDay(1)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            id="planner-quick-auto-schedule-btn"
            onClick={handleQuickAutoSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Auto-Schedule Day</span>
          </button>
        </div>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Day Timeline */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Day Load Indicator Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Allocated Time</div>
                <div className="text-xl font-bold text-white mt-0.5">{totalHours}h <span className="text-xs text-slate-400 font-normal">/ 9h</span></div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Deep Work Capacity</div>
                <div className="text-xl font-bold text-emerald-400 mt-0.5">{deepWorkHours}h</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400 uppercase">Day Load Index</div>
                <div className={`text-xl font-bold mt-0.5 ${workloadRatio > 90 ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {workloadRatio}% {workloadRatio > 85 ? '(Optimal)' : '(Room for Focus)'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Flame className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Timeline Visual Grid */}
          <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                  Timeline Time Blocks ({dayBlocks.length} Scheduled)
                </span>
              </div>
              <button
                onClick={() => setIsAddingBlock(!isAddingBlock)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>Custom Block</span>
              </button>
            </div>

            {/* Custom Block Form */}
            {isAddingBlock && (
              <form onSubmit={handleQuickAddBlock} className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-end gap-3 text-xs">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-slate-400 mb-1">Block Title</label>
                  <input
                    type="text"
                    value={newBlockTitle}
                    onChange={(e) => setNewBlockTitle(e.target.value)}
                    placeholder="e.g., Code Review & Architecture Sync"
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Start</label>
                  <input
                    type="time"
                    value={newBlockStart}
                    onChange={(e) => setNewBlockStart(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End</label>
                  <input
                    type="time"
                    value={newBlockEnd}
                    onChange={(e) => setNewBlockEnd(e.target.value)}
                    className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newBlockCategory}
                    onChange={(e) => setNewBlockCategory(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="deep_work">Deep Work</option>
                    <option value="meeting">Meeting</option>
                    <option value="review">Review</option>
                    <option value="admin">Admin</option>
                    <option value="break">Break / Lunch</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                  >
                    Add Block
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingBlock(false)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Time Blocks Stream */}
            <div className="p-4 divide-y divide-slate-800/50 space-y-2">
              {dayBlocks.length > 0 ? (
                dayBlocks.map(block => (
                  <div
                    key={block.id}
                    className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: block.color }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs">{block.title}</span>
                          {block.isAiScheduled && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                          <span>{block.startTime} — {block.endTime}</span>
                          <span>•</span>
                          <span className="capitalize">{block.category.replace('_', ' ')}</span>
                          {block.notes && (
                            <>
                              <span>•</span>
                              <span className="italic text-slate-400">{block.notes}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        title="Remove Time Block"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="text-xs">No time blocks scheduled for {selectedDate}.</p>
                  <button
                    onClick={handleQuickAutoSchedule}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium"
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
        <div className="w-80 border-l border-slate-800/80 bg-slate-950/90 flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">Backlog Ready to Schedule</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                {unscheduledTasks.length}
              </span>
            </div>
            <button
              onClick={onOpenNewTaskModal}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              title="Add New Task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2">
            {unscheduledTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-slate-200 text-xs group-hover:text-indigo-300">
                    {task.title}
                  </span>
                  <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                    task.priority === 'urgent' ? 'bg-rose-500' :
                    task.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {task.estimatedMinutes}m
                  </span>
                  {task.dueDate && <span>Due: {task.dueDate}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              onClick={onOpenAiModal}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
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
