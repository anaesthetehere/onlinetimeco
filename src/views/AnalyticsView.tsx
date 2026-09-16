import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Zap, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  Calendar, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  PieChart, 
  FileText 
} from 'lucide-react';
import { AppState } from '../types';
import { exportStateAsJSON, exportTasksAsCSV } from '../services/storage';

interface AnalyticsViewProps {
  appState: AppState;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ appState }) => {
  // Calculations
  const totalTasks = appState.tasks.length;
  const completedTasks = appState.tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Focus time from completed focus sessions
  const totalFocusMinutes = appState.focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalFocusHours = Math.round(totalFocusMinutes / 60 * 10) / 10;

  // TimeBlocks allocation by category
  const categoryMinutes: Record<string, number> = {
    deep_work: 0,
    meeting: 0,
    review: 0,
    admin: 0,
    break: 0
  };

  appState.timeBlocks.forEach(b => {
    const [sh, sm] = b.startTime.split(':').map(Number);
    const [eh, em] = b.endTime.split(':').map(Number);
    const dur = Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
    if (categoryMinutes[b.category] !== undefined) {
      categoryMinutes[b.category] += dur;
    }
  });

  const totalBlockMins = Object.values(categoryMinutes).reduce((a, b) => a + b, 0) || 1;
  const deepWorkPct = Math.round((categoryMinutes.deep_work / totalBlockMins) * 100);
  const meetingPct = Math.round((categoryMinutes.meeting / totalBlockMins) * 100);

  // Burnout Index: high meetings + high overload = high burnout risk
  const burnoutScore = meetingPct > 35 ? 'High (Meeting Overload)' : deepWorkPct > 70 ? 'Optimal Flow' : 'Balanced';

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 space-y-5 sm:space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Productivity Analytics & Historical Audit</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
              Executive Velocity
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time focus ratios, meeting fatigue index, and immutable work audit logs
          </p>
        </div>

        {/* Data Export Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button
            onClick={() => exportTasksAsCSV(appState.tasks)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => exportStateAsJSON(appState)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Workspace JSON Backup</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
            <span>TASK VELOCITY</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{completionRate}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {completedTasks} completed of {totalTasks} deliverables
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
            <span>FOCUS TIME LOGGED</span>
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{totalFocusHours}h</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Across {appState.focusSessions.length} completed Pomodoros
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
            <span>DEEP WORK VS MEETINGS</span>
            <PieChart className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{deepWorkPct}% / {meetingPct}%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Target healthy ratio: &gt;60% Deep Work
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-mono">
            <span>BURNOUT RADAR</span>
            <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{burnoutScore}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Calendar schedule health analysis
          </div>
        </div>
      </div>

      {/* Time Allocation Bars */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Time Block Category Allocation
        </h3>

        <div className="space-y-3 text-xs">
          {[
            { label: 'Deep Work Flow', mins: categoryMinutes.deep_work, color: '#6366f1' },
            { label: 'Meetings & Cross-Team Syncs', mins: categoryMinutes.meeting, color: '#ec4899' },
            { label: 'Code Review & QA', mins: categoryMinutes.review, color: '#f59e0b' },
            { label: 'Administrative & Triage', mins: categoryMinutes.admin, color: '#3b82f6' },
            { label: 'Recovery Breaks & Lunch', mins: categoryMinutes.break, color: '#10b981' }
          ].map(cat => {
            const pct = Math.round((cat.mins / totalBlockMins) * 100);
            return (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  <span>{cat.label}</span>
                  <span>{Math.round(cat.mins / 60 * 10) / 10}h ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Audit Trail Log */}
      <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Work Tracking & Immutable Audit Logs ({appState.auditLogs.length} Events)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">IndexedDB Audit Log Active</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 space-y-1">
          {appState.auditLogs.slice().reverse().map(log => (
            <div key={log.id} className="pt-2.5 pb-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                    {log.action}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 capitalize">[{log.entityType}]</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5 leading-relaxed">{log.details}</p>
              </div>

              <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
