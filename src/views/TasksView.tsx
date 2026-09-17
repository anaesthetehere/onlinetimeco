import React, { useState } from 'react';
import { 
  Kanban, 
  List, 
  Grid2X2, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Tag, 
  Layers, 
  ChevronRight, 
  MoreHorizontal, 
  Trash2, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { AppState, Task, TaskStatus, Priority, EisenhowerQuadrant } from '../types';

interface TasksViewProps {
  appState: AppState;
  onUpdateTasks: (tasks: Task[]) => void;
  onOpenNewTaskModal: () => void;
  onSelectTask: (task: Task) => void;
  onStartFocusOnTask: (task: Task) => void;
}

type TaskSubView = 'kanban' | 'list' | 'matrix' | 'timeline';

export const TasksView: React.FC<TasksViewProps> = ({
  appState,
  onUpdateTasks,
  onOpenNewTaskModal,
  onSelectTask,
  onStartFocusOnTask
}) => {
  const [subView, setSubView] = useState<TaskSubView>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [quickTitle, setQuickTitle] = useState('');

  // Filtering
  const filteredTasks = appState.tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesProj = filterProject === 'all' || t.projectId === filterProject;
    const matchesPri = filterPriority === 'all' || t.priority === filterPriority;
    return matchesSearch && matchesProj && matchesPri;
  });

  const handleToggleTaskDone = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateTasks(appState.tasks.map(t => {
      if (t.id === taskId) {
        const isDone = t.status === 'done';
        return {
          ...t,
          status: isDone ? 'todo' : 'done',
          completedAt: isDone ? undefined : new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onUpdateTasks(appState.tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === 'done' ? new Date().toISOString().split('T')[0] : undefined,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return t;
    }));
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: quickTitle.trim(),
      status: 'todo',
      priority: 'medium',
      quadrant: 'q2_schedule',
      estimatedMinutes: 45,
      tags: ['New'],
      subtasks: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    onUpdateTasks([newTask, ...appState.tasks]);
    setQuickTitle('');
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateTasks(appState.tasks.filter(t => t.id !== taskId));
  };

  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: '#64748b' },
    { id: 'todo', label: 'To Do', color: '#3b82f6' },
    { id: 'in_progress', label: 'In Progress', color: '#6366f1' },
    { id: 'in_review', label: 'In Review', color: '#f59e0b' },
    { id: 'done', label: 'Done', color: '#10b981' }
  ];

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'urgent': return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">P1 Urgent</span>;
      case 'high': return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">P2 High</span>;
      case 'medium': return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">P3 Medium</span>;
      case 'low': return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">P4 Low</span>;
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Top Controls Bar */}
      <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/40 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Tasks & Linear Issues</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track tasks, epics, Eisenhower matrices, and sprint deliverables
            </p>
          </div>

          {/* Subview Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 overflow-x-auto shadow-xs">
            <button
              onClick={() => setSubView('kanban')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                subView === 'kanban' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setSubView('list')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                subView === 'list' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>List Table</span>
            </button>
            <button
              onClick={() => setSubView('matrix')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                subView === 'matrix' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Eisenhower</span>
            </button>
            <button
              onClick={() => setSubView('timeline')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                subView === 'timeline' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {/* Search, Filter & New Task Button */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs w-full sm:w-44 focus:sm:w-56 transition-all focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:border-indigo-500 shadow-xs"
          >
            <option value="all">All Projects</option>
            {appState.projects.map(p => (
              <option key={p.id} value={p.id}>[{p.key}] {p.name}</option>
            ))}
          </select>

          <button
            id="create-task-main-btn"
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/20">
        <form onSubmit={handleQuickAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick add a new task and press Enter..."
            className="flex-1 bg-transparent border-none outline-none text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
          {quickTitle.trim() && (
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[11px] font-semibold"
            >
              Add
            </button>
          )}
        </form>
      </div>

      {/* Main View Render Area */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {/* 1. KANBAN VIEW */}
        {subView === 'kanban' && (
          <div className="flex gap-4 h-full min-w-full overflow-x-auto pb-4">
            {kanbanColumns.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <div
                  key={col.id}
                  className="flex-1 min-w-[260px] sm:min-w-[280px] max-w-xs rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 flex flex-col overflow-hidden shadow-xs"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/80">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                      <span className="font-bold text-slate-800 dark:text-white text-xs">{col.label}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks List in Column */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                    {colTasks.map(task => {
                      const proj = appState.projects.find(p => p.id === task.projectId);
                      return (
                        <div
                          key={task.id}
                          onClick={() => onSelectTask(task)}
                          className="p-3 rounded-lg bg-slate-50/80 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 hover:border-indigo-400 dark:hover:border-indigo-500/60 transition-all cursor-pointer space-y-2 shadow-2xs group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                              {task.title}
                            </span>
                            <button
                              onClick={(e) => handleDeleteTask(task.id, e)}
                              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-900 text-[10px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {getPriorityBadge(task.priority)}
                              {proj && (
                                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                                  {proj.key}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono">
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {task.estimatedMinutes}m
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); onStartFocusOnTask(task); }}
                                className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 font-mono"
                                title="Start Pomodoro Focus on this Task"
                              >
                                Focus
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {colTasks.length === 0 && (
                      <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs italic">
                        No tasks in {col.label}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. LIST TABLE VIEW */}
        {subView === 'list' && (
          <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 overflow-x-auto shadow-xs">
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">Done</th>
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4 w-32">Status</th>
                  <th className="py-3 px-4 w-28">Priority</th>
                  <th className="py-3 px-4 w-24">Estimate</th>
                  <th className="py-3 px-4 w-28">Due Date</th>
                  <th className="py-3 px-4 w-32">Project</th>
                  <th className="py-3 px-4 w-20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredTasks.map(task => {
                  const isDone = task.status === 'done';
                  const proj = appState.projects.find(p => p.id === task.projectId);
                  return (
                    <tr
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggleTaskDone(task.id, e)}
                          className="text-slate-400 hover:text-emerald-500"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                        <span className={isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                          {task.title}
                        </span>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <span className="ml-2 text-[10px] font-mono text-slate-400">
                            ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length} subtasks)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task.id, e.target.value as TaskStatus)}
                          className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-[11px] text-slate-800 dark:text-slate-300 font-mono capitalize"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="in_review">In Review</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {task.estimatedMinutes}m
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {task.dueDate || '—'}
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400">
                        {proj ? `[${proj.key}]` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onStartFocusOnTask(task)}
                            className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono"
                          >
                            Focus
                          </button>
                          <button
                            onClick={(e) => handleDeleteTask(task.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. EISENHOWER MATRIX VIEW */}
        {subView === 'matrix' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Q1: Urgent & Important */}
            <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-rose-200 dark:border-rose-500/30 p-4 flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-rose-200/80 dark:border-rose-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Q1: Do First (Urgent & Important)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300">
                  {filteredTasks.filter(t => t.quadrant === 'q1_do_first').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pt-3 space-y-2">
                {filteredTasks.filter(t => t.quadrant === 'q1_do_first').map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500/50 cursor-pointer flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{t.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.estimatedMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Q2: Important, Not Urgent (The Gold Zone) */}
            <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-indigo-200 dark:border-indigo-500/30 p-4 flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-200/80 dark:border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Q2: Schedule (Important, Not Urgent)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                  {filteredTasks.filter(t => t.quadrant === 'q2_schedule').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pt-3 space-y-2">
                {filteredTasks.filter(t => t.quadrant === 'q2_schedule').map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 cursor-pointer flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{t.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.estimatedMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Q3: Urgent, Not Important */}
            <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-amber-200 dark:border-amber-500/30 p-4 flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/80 dark:border-amber-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Q3: Delegate (Urgent, Not Important)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  {filteredTasks.filter(t => t.quadrant === 'q3_delegate').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pt-3 space-y-2">
                {filteredTasks.filter(t => t.quadrant === 'q3_delegate').map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 cursor-pointer flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{t.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.estimatedMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Q4: Eliminate */}
            <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 p-4 flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Q4: Eliminate (Not Urgent, Not Important)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {filteredTasks.filter(t => t.quadrant === 'q4_eliminate').length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pt-3 space-y-2">
                {filteredTasks.filter(t => t.quadrant === 'q4_eliminate').map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 cursor-pointer flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-medium text-slate-600 dark:text-slate-400 text-xs">{t.title}</span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{t.estimatedMinutes}m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. TIMELINE VIEW */}
        {subView === 'timeline' && (
          <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Gantt-like Task Schedule & Deadlines</span>
            </div>

            <div className="space-y-2">
              {filteredTasks.map(task => {
                const isScheduled = !!task.scheduledDate;
                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500/40 cursor-pointer flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.status === 'done' ? 'bg-emerald-500' :
                        task.status === 'in_progress' ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-slate-600'
                      }`} />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-xs">{task.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {isScheduled ? `Scheduled: ${task.scheduledDate} (${task.scheduledStartTime || 'Flexible'})` : 'Not yet time-blocked'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{task.estimatedMinutes}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
