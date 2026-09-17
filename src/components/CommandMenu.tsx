import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckSquare, 
  Calendar, 
  Timer, 
  Briefcase, 
  Building2, 
  AlertTriangle, 
  BarChart3, 
  HeartHandshake, 
  Plus, 
  Download, 
  X, 
  ArrowRight,
  BookOpen,
  Mail
} from 'lucide-react';
import { AppState, Task } from '../types';
import { ActiveView } from './Sidebar';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onSelectView: (view: ActiveView) => void;
  onOpenNewTaskModal: () => void;
  onOpenFocusStudio: () => void;
  onSelectTask: (task: Task) => void;
  onOpenManual?: () => void;
  onOpenContactUs?: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  appState,
  onSelectView,
  onOpenNewTaskModal,
  onOpenFocusStudio,
  onSelectTask,
  onOpenManual,
  onOpenContactUs
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = appState.tasks.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5);

  const filteredProjects = appState.projects.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.key.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const navigationActions = [
    { label: 'Welcome & Role Selection Landing Page (Time-Co)', icon: HeartHandshake, action: () => { onSelectView('landing'); onClose(); } },
    { label: 'Open Instruction Manual & Button Guide', icon: BookOpen, action: () => { if (onOpenManual) onOpenManual(); onClose(); } },
    { label: 'Contact Us & Share Reviews (anweshasenapati4@gmail.com)', icon: Mail, action: () => { if (onOpenContactUs) onOpenContactUs(); onClose(); } },
    { label: 'Go to Day Planner & Time Blocks', icon: Clock, action: () => { onSelectView('planner'); onClose(); } },
    { label: 'Go to Tasks & Issues (Kanban/List/Matrix)', icon: CheckSquare, action: () => { onSelectView('tasks'); onClose(); } },
    { label: 'Go to Calendar & Time Blocking', icon: Calendar, action: () => { onSelectView('calendar'); onClose(); } },
    { label: 'Open Pomodoro Focus Studio & Ambient Sound', icon: Timer, action: () => { onOpenFocusStudio(); onClose(); } },
    { label: 'Go to Projects & Sprints', icon: Briefcase, action: () => { onSelectView('projects'); onClose(); } },
    { label: 'Go to Enterprise Departments & OKRs', icon: Building2, action: () => { onSelectView('enterprise'); onClose(); } },
    { label: 'Go to Risk & Dependency Radar', icon: AlertTriangle, action: () => { onSelectView('risks'); onClose(); } },
    { label: 'Go to Productivity Analytics & Velocity', icon: BarChart3, action: () => { onSelectView('analytics'); onClose(); } },
    { label: 'Go to Personal Habits & Wellness Reflection', icon: HeartHandshake, action: () => { onSelectView('personal'); onClose(); } }
  ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search tasks, or navigate..."
            className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Quick Actions
            </div>
            <button
              onClick={() => { onOpenNewTaskModal(); onClose(); }}
              className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Create New Task or Issue</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">C</span>
            </button>
            <button
              onClick={() => { onSelectView('planner'); onClose(); }}
              className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Open Day Planner & Time Blocks</span>
              </div>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">P</span>
            </button>
          </div>

          {/* Matched Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Tasks ({filteredTasks.length})
              </div>
              {filteredTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => { onSelectTask(task); onClose(); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      task.priority === 'urgent' ? 'bg-rose-500' :
                      task.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="truncate">{task.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 capitalize">
                    {task.status.replace('_', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Matched Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Projects
              </div>
              {filteredProjects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => { onSelectView('projects'); onClose(); }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>[{proj.key}] {proj.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{proj.progress}%</span>
                </button>
              ))}
            </div>
          )}

          {/* Navigation items */}
          {navigationActions.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Navigation
              </div>
              {navigationActions.map((nav, i) => {
                const Icon = nav.icon;
                return (
                  <button
                    key={i}
                    onClick={nav.action}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{nav.label}</span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
