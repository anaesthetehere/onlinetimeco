import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AppState, Project } from '../types';

interface ProjectsViewProps {
  appState: AppState;
  onUpdateProjects: (projects: Project[]) => void;
  onFilterTasksByProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  appState,
  onUpdateProjects,
  onFilterTasksByProject
}) => {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState(appState.departments[0]?.id || '');
  const [targetDate, setTargetDate] = useState('');
  const [budgetAllocated, setBudgetAllocated] = useState(50000);
  const [sprint, setSprint] = useState('Sprint 28');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    const colors = ['#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim(),
      departmentId,
      color: randomColor,
      progress: 0,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      status: 'active',
      leadId: appState.teamMembers[0]?.id || 'tm-1',
      budgetAllocated: Number(budgetAllocated) || 50000,
      budgetSpent: 0,
      sprint
    };

    onUpdateProjects([...appState.projects, newProject]);
    setIsCreatingProject(false);
    setName('');
    setKey('');
    setDescription('');
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Projects & Sprint Roadmaps</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Linear / Asana Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-functional initiative tracking, milestone progress, and budget burn-down
          </p>
        </div>

        <button
          onClick={() => setIsCreatingProject(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project Initiative</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {appState.projects.map(project => {
          const dept = appState.departments.find(d => d.id === project.departmentId);
          const lead = appState.teamMembers.find(m => m.id === project.leadId);
          const projectTasks = appState.tasks.filter(t => t.projectId === project.id);
          const doneTasks = projectTasks.filter(t => t.status === 'done');
          const calculatedProgress = projectTasks.length > 0 
            ? Math.round((doneTasks.length / projectTasks.length) * 100)
            : project.progress;

          const budgetPercent = Math.round((project.budgetSpent / project.budgetAllocated) * 100);

          return (
            <div
              key={project.id}
              className="rounded-xl bg-slate-900/60 border border-slate-800/90 p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 group shadow-sm"
            >
              <div className="space-y-3">
                {/* Top badges */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                    style={{ backgroundColor: `${project.color}20`, color: project.color, border: `1px solid ${project.color}40` }}
                  >
                    {project.key}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                    project.status === 'active' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                    project.status === 'at_risk' ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' :
                    'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Project Title & Desc */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Task Completion</span>
                    <span>{calculatedProgress}% ({doneTasks.length}/{projectTasks.length})</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${calculatedProgress}%`, backgroundColor: project.color }}
                    />
                  </div>
                </div>

                {/* Budget Gauge */}
                <div className="pt-2 border-t border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      Budget Burn: ${project.budgetSpent.toLocaleString()} / ${project.budgetAllocated.toLocaleString()}
                    </span>
                    <span className={budgetPercent > 90 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {budgetPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${budgetPercent > 90 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, budgetPercent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer: Lead, Sprint & Filter link */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {lead?.avatar && (
                    <img src={lead.avatar} alt={lead.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700" />
                  )}
                  <span className="text-slate-300 text-[11px] truncate max-w-[110px]">{lead?.name || 'Lead'}</span>
                </div>

                <button
                  onClick={() => onFilterTasksByProject(project.id)}
                  className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <span>View Tasks</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateProject}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white text-sm">Create New Project Initiative</span>
              <button
                type="button"
                onClick={() => setIsCreatingProject(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-slate-300 mb-1 font-semibold">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Q4 Real-Time Sync Cluster"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Project Key (Short Prefix) *</label>
                <input
                  type="text"
                  required
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="e.g., SYNC"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {appState.departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Initiative scope and technical deliverable goals..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Target Launch Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Budget Allocation ($)</label>
                <input
                  type="number"
                  step={1000}
                  value={budgetAllocated}
                  onChange={(e) => setBudgetAllocated(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsCreatingProject(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
