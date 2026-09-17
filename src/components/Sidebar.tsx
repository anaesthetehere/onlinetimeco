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
  Sparkles,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { AppState } from '../types';
import { useTheme } from '../context/ThemeContext';

export type ActiveView = 
  | 'landing'
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
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  onOpenNewTaskModal,
  appState,
  mobileOpen,
  onCloseMobile
}) => {
  const { theme, toggleTheme } = useTheme();

  const openTasksCount = appState.tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled').length;
  const urgentTasksCount = appState.tasks.filter(t => t.priority === 'urgent' && t.status !== 'done').length;
  const activeRisksCount = appState.risks.filter(r => r.status !== 'resolved').length;
  const todayHabitsPending = appState.habits.filter(h => {
    const today = new Date().toISOString().split('T')[0];
    return !h.completedDates.includes(today);
  }).length;

  const navItems = [
    {
      id: 'landing' as ActiveView,
      label: 'Welcome & Overview',
      icon: HeartHandshake,
      badge: 'Start',
      badgeColor: 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
    },
    {
      id: 'planner' as ActiveView,
      label: 'AI Day Planner',
      icon: Sparkles,
      badge: 'Smart',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30'
    },
    {
      id: 'tasks' as ActiveView,
      label: 'Tasks & Issues',
      icon: CheckSquare,
      badge: openTasksCount.toString(),
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
    },
    {
      id: 'calendar' as ActiveView,
      label: 'Calendar & Time Blocks',
      icon: Calendar,
      badge: `${appState.timeBlocks.length}`,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    },
    {
      id: 'focus' as ActiveView,
      label: 'Pomodoro Focus Studio',
      icon: Timer,
      badge: 'Audio',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
    },
    {
      id: 'projects' as ActiveView,
      label: 'Projects & Roadmap',
      icon: Briefcase,
      badge: `${appState.projects.length}`,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
    },
    {
      id: 'enterprise' as ActiveView,
      label: 'Departments & OKRs',
      icon: Building2,
      badge: `${appState.departments.length} Depts`,
      badgeColor: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30'
    },
    {
      id: 'risks' as ActiveView,
      label: 'Risks & Dependencies',
      icon: AlertTriangle,
      badge: activeRisksCount > 0 ? `${activeRisksCount} Active` : undefined,
      badgeColor: 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30'
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
      badgeColor: todayHabitsPending > 0 
        ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30' 
        : 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
    }
  ];

  const handleItemClick = (id: ActiveView) => {
    onSelectView(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const content = (
    <div className="flex flex-col h-full select-none bg-white dark:bg-slate-950 transition-colors duration-150">
      {/* Mobile Drawer Header with Close Button */}
      <div className="lg:hidden p-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action: New Task */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800/80">
        <button
          id="sidebar-create-task-btn"
          onClick={() => {
            onOpenNewTaskModal();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Task / Issue</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <div className="px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-400 font-semibold">
          Platform Views
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-slate-800/90 text-indigo-900 dark:text-white font-semibold shadow-xs border border-indigo-200 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400'}`} />
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
        <div className="pt-5 px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-400 font-semibold flex items-center justify-between">
          <span>Departments</span>
          <span className="text-[10px] text-slate-400">4</span>
        </div>

        <div className="space-y-0.5">
          {appState.departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => handleItemClick('enterprise')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                <span className="truncate max-w-[130px]">{dept.name}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{dept.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Offline & Resiliency Footer Banner + Theme Switcher */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/80 space-y-2">
        {/* Theme mode pill */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">Theme Mode</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-200 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3 h-3 text-indigo-400" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-amber-500" />
                <span>Light</span>
              </>
            )}
          </button>
        </div>

        {/* Sync engine */}
        <div className="rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 p-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-300">Offline & Sync Engine</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
            IndexedDB zero-latency persistence active. Operates fully offline without server dependence.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex-col h-[calc(100vh-3.5rem)] shrink-0 transition-colors duration-150">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Sliding drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
