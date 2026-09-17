import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  Calendar, 
  Tag, 
  CheckSquare, 
  AlertCircle,
  Zap,
  Layers,
  Building2,
  User,
  GitBranch,
  UserPlus,
  FolderPlus
} from 'lucide-react';
import { Task, Project, Department, TeamMember, Priority, EisenhowerQuadrant, TaskStatus } from '../types';
import { generateSecureAccessKey } from '../services/accessKeyService';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Task) => void;
  initialTask?: Task | null;
  projects: Project[];
  departments: Department[];
  teamMembers: TeamMember[];
  allTasks: Task[];
  customCategories?: string[];
  onAddCustomCategory?: (category: string) => void;
  onAddTeamMember?: (member: TeamMember) => void;
  onAddDepartment?: (dept: Department) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialTask,
  projects,
  departments,
  teamMembers,
  allTasks,
  customCategories = [],
  onAddCustomCategory,
  onAddTeamMember,
  onAddDepartment
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>('q2_schedule');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [dependencies, setDependencies] = useState<string[]>([]);

  // Inline forms for adding custom person, department, category
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const [isAddingDept, setIsAddingDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setQuadrant(initialTask.quadrant || 'q2_schedule');
      setEstimatedMinutes(initialTask.estimatedMinutes || 45);
      setDueDate(initialTask.dueDate || '');
      setProjectId(initialTask.projectId || '');
      setDepartmentId(initialTask.departmentId || '');
      setAssignedTo(initialTask.assignedTo || '');
      setEnergyLevel(initialTask.energyLevelRequired || 'medium');
      setTags(initialTask.tags || []);
      setSubtasks(initialTask.subtasks || []);
      setDependencies(initialTask.dependencies || []);
    } else {
      // Defaults for new task
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setQuadrant('q2_schedule');
      setEstimatedMinutes(45);
      setDueDate(today);
      setProjectId(projects[0]?.id || '');
      setDepartmentId(departments[0]?.id || '');
      setAssignedTo(teamMembers[0]?.id || '');
      setEnergyLevel('medium');
      setTags(['Feature']);
      setSubtasks([]);
      setDependencies([]);
    }
  }, [initialTask, isOpen, projects, departments, teamMembers]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
      ]);
      setNewSubtaskTitle('');
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskToSave: Task = {
      id: initialTask ? initialTask.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      quadrant,
      estimatedMinutes: Number(estimatedMinutes) || 45,
      actualMinutes: initialTask?.actualMinutes,
      dueDate: dueDate || undefined,
      projectId: projectId || undefined,
      departmentId: departmentId || undefined,
      assignedTo: assignedTo || undefined,
      energyLevelRequired: energyLevel,
      tags,
      subtasks,
      dependencies,
      scheduledDate: initialTask?.scheduledDate,
      scheduledStartTime: initialTask?.scheduledStartTime,
      scheduledEndTime: initialTask?.scheduledEndTime,
      createdAt: initialTask ? initialTask.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      completedAt: status === 'done' ? (initialTask?.completedAt || new Date().toISOString().split('T')[0]) : undefined
    };

    onSaveTask(taskToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              {initialTask ? 'Edit Task / Issue' : 'Create Task / Issue'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              TIME-CO Linear Engine
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
              <span>Task Title</span>
              <span className="text-rose-500 ml-1">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finalize project roadmap deliverables"
              required
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-white text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Description / Acceptance Criteria</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add details, technical notes, or operational deliverables..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:outline-none text-slate-900 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>

          {/* Grid properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Status */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="urgent">🔴 Urgent (P1)</option>
                <option value="high">🟠 High (P2)</option>
                <option value="medium">🟡 Medium (P3)</option>
                <option value="low">⚪ Low (P4)</option>
              </select>
            </div>

            {/* Eisenhower Quadrant */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Eisenhower Matrix</label>
              <select
                value={quadrant}
                onChange={(e) => setQuadrant(e.target.value as EisenhowerQuadrant)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="q1_do_first">Q1: Urgent & Important (Do First)</option>
                <option value="q2_schedule">Q2: Important, Not Urgent (Schedule)</option>
                <option value="q3_delegate">Q3: Urgent, Not Important (Delegate)</option>
                <option value="q4_eliminate">Q4: Not Urgent, Not Important (Eliminate)</option>
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">No Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>[{p.key}] {p.name}</option>
                ))}
              </select>
            </div>

            {/* Department with + Custom Dept */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-600 dark:text-slate-400">Department</label>
                {onAddDepartment && (
                  <button
                    type="button"
                    onClick={() => setIsAddingDept(!isAddingDept)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    <FolderPlus className="w-2.5 h-2.5" />
                    <span>{isAddingDept ? 'Cancel' : '+ New Dept'}</span>
                  </button>
                )}
              </div>

              {isAddingDept ? (
                <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-1.5 mb-1.5">
                  <input
                    type="text"
                    placeholder="Dept Name (e.g. AI Research)"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Code (e.g. AIR)"
                      value={newDeptCode}
                      onChange={(e) => setNewDeptCode(e.target.value)}
                      className="w-20 px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newDeptName.trim()) return;
                        const code = (newDeptCode.trim() || newDeptName.substring(0, 3)).toUpperCase();
                        const newDept: Department = {
                          id: `dept-${Date.now()}`,
                          name: newDeptName.trim(),
                          code,
                          leadName: 'Self',
                          color: '#6366f1',
                          headcount: 1,
                          quarterlyBudget: 50000,
                          quarterlySpent: 0,
                          activeProjectsCount: 1,
                          okrs: []
                        };
                        onAddDepartment(newDept);
                        setDepartmentId(newDept.id);
                        setNewDeptName('');
                        setNewDeptCode('');
                        setIsAddingDept(false);
                      }}
                      className="flex-1 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium"
                    >
                      Save Dept
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">No Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Assignee with + Add Employee by Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-600 dark:text-slate-400">Assignee / Employee</label>
                {onAddTeamMember && (
                  <button
                    type="button"
                    onClick={() => setIsAddingMember(!isAddingMember)}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                  >
                    <UserPlus className="w-2.5 h-2.5" />
                    <span>{isAddingMember ? 'Cancel' : '+ Add Person'}</span>
                  </button>
                )}
              </div>

              {isAddingMember ? (
                <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-1.5 mb-1.5">
                  <input
                    type="text"
                    placeholder="Person's Full Name (e.g. Maya Lin)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Role (e.g. Lead Designer)"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newMemberName.trim()) return;
                        const newKey = generateSecureAccessKey('ROOM', newMemberName);
                        const newMember: TeamMember = {
                          id: `member-${Date.now()}`,
                          name: newMemberName.trim(),
                          role: newMemberRole.trim() || 'Contributor',
                          email: `${newMemberName.trim().toLowerCase().replace(/\s+/g, '.')}@acme-corp.internal`,
                          departmentId: departmentId || departments[0]?.id || 'dept-eng',
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                          capacityHoursPerWeek: 40,
                          currentWorkloadHours: 0,
                          isOnline: true,
                          accessKey: newKey
                        };
                        onAddTeamMember(newMember);
                        setAssignedTo(newMember.id);
                        setNewMemberName('');
                        setNewMemberRole('');
                        setIsAddingMember(false);
                      }}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium"
                    >
                      Allot & Grant
                    </button>
                  </div>
                </div>
              ) : (
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Estimated Minutes */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Estimate (Minutes)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={10}
                  max={480}
                  step={5}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {[25, 45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEstimatedMinutes(mins)}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Target Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Energy Level Required */}
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Cognitive Energy Level</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="high">⚡ High Energy (Deep Focus)</option>
                <option value="medium">🔋 Medium Energy (Execution)</option>
                <option value="low">🌱 Low Energy (Routine/Admin)</option>
              </select>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Actionable Subtasks ({subtasks.filter(s => s.completed).length}/{subtasks.length})</span>
              </span>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2 max-h-40 overflow-y-auto pr-1">
                {subtasks.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
                    <label className="flex items-center gap-2 cursor-pointer flex-1 mr-2">
                      <input
                        type="checkbox"
                        checked={s.completed}
                        onChange={() => handleToggleSubtask(s.id)}
                        className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className={`text-xs ${s.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {s.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(s.id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                placeholder="Add subtask and press enter..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Categories & Subcategories Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Tag className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>Category / Subcategory</span>
              </label>
              {onAddCustomCategory && (
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>{isAddingCategory ? 'Cancel' : '+ Add Category'}</span>
                </button>
              )}
            </div>

            {/* Custom Category Inline Adder */}
            {isAddingCategory && (
              <div className="p-2 mb-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newCategoryName.trim()) {
                        onAddCustomCategory?.(newCategoryName.trim());
                        if (!tags.includes(newCategoryName.trim())) {
                          setTags([...tags, newCategoryName.trim()]);
                        }
                        setNewCategoryName('');
                        setIsAddingCategory(false);
                      }
                    }
                  }}
                  className="flex-1 px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCategoryName.trim()) {
                      onAddCustomCategory?.(newCategoryName.trim());
                      if (!tags.includes(newCategoryName.trim())) {
                        setTags([...tags, newCategoryName.trim()]);
                      }
                      setNewCategoryName('');
                      setIsAddingCategory(false);
                    }
                  }}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium"
                >
                  Save Category
                </button>
              </div>
            )}

            {/* Category Quick Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {Array.from(new Set(['Deep Work', 'Architecture', 'Meeting', 'Review', 'Bugfix', 'Operations', ...(customCategories || [])])).map(cat => {
                const isSelected = tags.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setTags(tags.filter(t => t !== cat));
                      } else {
                        setTags([...tags, cat]);
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{cat}
                  </button>
                );
              })}
            </div>

            {/* Custom Freeform Tags Section */}
            <label className="block text-slate-600 dark:text-slate-400 mb-1 text-[11px]">Specific Task Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 text-[11px]">
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                placeholder="Type additional tag name and press Enter..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            Auto-saves locally to IndexedDB
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
