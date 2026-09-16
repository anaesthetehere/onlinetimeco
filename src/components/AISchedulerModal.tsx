import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Task, TimeBlock, Project, AppState } from '../types';
import { runLocalSmartScheduler, aiGenerateDailyStrategy, AutoScheduleResult } from '../services/aiScheduler';

interface AISchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onApplySchedule: (result: AutoScheduleResult) => void;
}

export const AISchedulerModal: React.FC<AISchedulerModalProps> = ({
  isOpen,
  onClose,
  appState,
  onApplySchedule
}) => {
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<AutoScheduleResult | null>(null);
  const [strategy, setStrategy] = useState<{
    headline: string;
    focusTheme: string;
    suggestedActionPlan: string[];
    burnoutRisk: 'low' | 'moderate' | 'high';
    productivityTip: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadStrategy();
    }
  }, [isOpen, targetDate]);

  const loadStrategy = async () => {
    setIsAnalyzing(true);
    try {
      const strat = await aiGenerateDailyStrategy(appState.tasks, appState.projects, targetDate);
      setStrategy(strat);

      // Also compute preliminary auto-schedule
      const res = runLocalSmartScheduler(
        targetDate,
        appState.tasks,
        appState.timeBlocks,
        appState.userProfile.workStartHour,
        appState.userProfile.workEndHour
      );
      setScheduleResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  const handleApply = () => {
    if (scheduleResult) {
      onApplySchedule(scheduleResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">TIME-CO AI Autopilot Scheduler</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Autonomous Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Constraint-satisfaction calendar optimizer & circadian deep-work packing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Date Selector & Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-slate-200">Target Date:</span>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadStrategy}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
              >
                <Cpu className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Re-analyzing...' : 'Re-Run Optimization'}</span>
              </button>
            </div>
          </div>

          {/* Strategy & Burnout Card */}
          {strategy && (
            <div className="rounded-xl bg-slate-950/70 border border-indigo-500/20 p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                    Strategic Focus Theme: {strategy.focusTheme}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {strategy.headline}
                  </h3>
                </div>

                {/* Burnout Risk Badge */}
                <div className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 shrink-0 ${
                  strategy.burnoutRisk === 'high'
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                    : strategy.burnoutRisk === 'moderate'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                }`}>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Burnout Risk: {strategy.burnoutRisk.toUpperCase()}</span>
                </div>
              </div>

              {/* Action Plan items */}
              <div className="space-y-1.5 pt-1">
                {strategy.suggestedActionPlan.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Pro Tip:</strong> {strategy.productivityTip}</span>
              </div>
            </div>
          )}

          {/* AI Scheduled Blocks Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200 text-sm">
                  Recommended Time Blocks ({scheduleResult?.scheduledBlocks.length || 0} slots planned)
                </span>
              </div>
              {scheduleResult && (
                <div className="text-[11px] text-slate-400 font-mono">
                  Total Allocated: {Math.round(scheduleResult.summary.minutesAllocated / 60 * 10) / 10}h 
                  ({Math.round(scheduleResult.summary.deepWorkMinutes / 60 * 10) / 10}h Deep Work)
                </div>
              )}
            </div>

            {scheduleResult?.scheduledBlocks && scheduleResult.scheduledBlocks.length > 0 ? (
              <div className="space-y-2">
                {scheduleResult.scheduledBlocks.map((block) => (
                  <div
                    key={block.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-semibold">
                        {block.startTime} - {block.endTime}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-xs">{block.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{block.notes}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        block.category === 'deep_work'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {block.category === 'deep_work' ? 'Deep Work' : 'Admin'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-slate-950 border border-slate-800 text-center text-slate-400">
                No unscheduled pending tasks found for this date. All tasks are currently scheduled or completed.
              </div>
            )}
          </div>

          {/* Solver Rationale & Notes */}
          {scheduleResult?.summary.notes && scheduleResult.summary.notes.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 space-y-1">
              <div className="font-semibold text-slate-300 text-[11px]">AI Solver Insights:</div>
              {scheduleResult.summary.notes.map((note, idx) => (
                <div key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                  <span className="text-indigo-400">•</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-apply-schedule-btn"
            onClick={handleApply}
            disabled={!scheduleResult || scheduleResult.scheduledBlocks.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply AI Schedule to Calendar ({scheduleResult?.scheduledBlocks.length || 0} Blocks)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
