import React from 'react';
import { 
  CalendarDays, 
  CheckSquare, 
  Timer, 
  Calendar, 
  Briefcase, 
  Building2, 
  AlertTriangle, 
  BarChart3, 
  HeartHandshake, 
  Plus, 
  ShieldCheck,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppState } from '../types';

export type ActiveView = 
  | 'planner' 
  | 'tasks' 
  | 'calendar' 
  | 'focus' 
  | 'projects' 
  | 'enterprise' 
  | 'risks' 
  | 'analytics' 
  | 'personal';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onOpenNewTaskModal: () => void;
  appState: AppState;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  onOpenNewTaskModal,
  appState
}) => {
  const openTasksCount = appState.tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled').length;
  const urgentTasksCount = appState.tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const activeRisksCount = appState.risks.filter(r => r.status !== 'resolved').length;
  const todayHabitsPending = appState.habits.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    return !h.completedDates.includes(today);
  }).length;

  const navItems = [
    {
      id: 'planner' as ActiveView,
      label: 'AI Day Planner',
      icon: Sparkles,
      badge: 'Smart',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'tasks' as ActiveView,
      label: 'Tasks & Issues',
      icon: CheckSquare,
      badge: openTasksCount.toString(),
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    },
    {
      id: 'calendar' as ActiveView,
      label: 'Calendar & Time Blocks',
      icon: Calendar,
      badge: `${appState.timeBlocks.length}`,
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700'
    },
    {
      id: 'focus' as ActiveView,
      label: 'Pomodoro Focus Studio',
      icon: Timer,
      badge: 'Audio',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'projects' as ActiveView,
      label: 'Projects & Roadmap',
      icon: Briefcase,
      badge: `${appState.projects.length}`,
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700'
    },
    {
      id: 'enterprise' as ActiveView,
      label: 'Departments & OKRs',
      icon: Building2,
      badge: `${appState.departments.length} Depts`,
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    },
    {
      id: 'risks' as ActiveView,
      label: 'Risks & Dependencies',
      icon: AlertTriangle,
      badge: activeRisksCount > 0 ? `${activeRisksCount} Active` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'analytics' as ActiveView,
      label: 'Productivity Analytics',
      icon: BarChart3
    },
    {
      id: 'personal' as ActiveView,
      label: 'Habits & Reflection',
      icon: HeartHandshake,
      badge: todayHabitsPending > 0 ? `${todayHabitsPending} Due` : 'Done',
      badgeColor: todayHabitsPending > 0 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950 flex flex-col h-[calc(100vh-3.5rem)] select-none">
      {/* Quick Action: New Task */}
      <div className="p-3 border-b border-slate-900">
        <button
          id="sidebar-create-task-btn"
          onClick={onOpenNewTaskModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Task / Issue</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <div className="px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Platform Views
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-800/90 text-white font-semibold shadow-sm border border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Department Quick List */}
        <div className="pt-5 px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
          <span>Departments</span>
          <span className="text-[10px] text-slate-400">4</span>
        </div>

        <div className="space-y-0.5">
          {appState.departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => onSelectView('enterprise')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dept.color }} />
                <span className="truncate max-w-[130px]">{dept.name}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{dept.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Offline & Resiliency Footer Banner */}
      <div className="p-3 border-t border-slate-900 bg-slate-950/80">
        <div className="rounded-lg bg-slate-900/80 border border-slate-800/80 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold text-slate-300">Offline & Sync Engine</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed">
            IndexedDB zero-latency persistence active. Operates fully offline without server dependence.
          </div>
        </div>
      </div>
    </aside>
  );
};
