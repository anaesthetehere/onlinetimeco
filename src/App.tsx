import React, { useState, useEffect } from 'react';
import { AppState, Task, TimeBlock, Project, FocusSession, RiskItem, Habit, DailyReflection, WorkspaceMode } from './types';
import { loadAppState, saveAppState, getInitialData } from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveView } from './components/Sidebar';
import { TaskModal } from './components/TaskModal';
import { AISchedulerModal } from './components/AISchedulerModal';
import { CommandMenu } from './components/CommandMenu';

// Views
import { PlannerView } from './views/PlannerView';
import { TasksView } from './views/TasksView';
import { CalendarView } from './views/CalendarView';
import { FocusView } from './views/FocusView';
import { ProjectsView } from './views/ProjectsView';
import { EnterpriseView } from './views/EnterpriseView';
import { RisksView } from './views/RisksView';
import { AnalyticsView } from './views/AnalyticsView';
import { PersonalView } from './views/PersonalView';

export default function App() {
  const [appState, setAppState] = useState<AppState>(getInitialData);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('planner');

  // Modals state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<string | undefined>(undefined);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initial load from IndexedDB / localStorage
  useEffect(() => {
    loadAppState().then(data => {
      setAppState(data);
      setIsLoading(false);
    }).catch(err => {
      console.error('Failed to load state from storage:', err);
      setIsLoading(false);
    });
  }, []);

  // Save whenever appState changes (debounced/auto)
  useEffect(() => {
    if (!isLoading) {
      saveAppState(appState);
    }
  }, [appState, isLoading]);

  // Keyboard shortcut listener (Cmd+K, C for new task)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandMenuOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to add audit log
  const logAction = (action: string, entityType: 'task' | 'project' | 'schedule' | 'focus' | 'risk', details: string) => {
    const newLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      entityType,
      details
    };
    setAppState(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs].slice(0, 100) // keep last 100
    }));
  };

  // State update handlers
  const handleSaveTask = (task: Task) => {
    const isExisting = appState.tasks.some(t => t.id === task.id);
    const updatedTasks = isExisting
      ? appState.tasks.map(t => t.id === task.id ? task : t)
      : [task, ...appState.tasks];

    setAppState(prev => ({ ...prev, tasks: updatedTasks }));
    logAction(
      isExisting ? 'TASK_UPDATED' : 'TASK_CREATED',
      'task',
      `Task "${task.title}" was ${isExisting ? 'updated' : 'created'} with priority ${task.priority.toUpperCase()}.`
    );
  };

  const handleUpdateTasks = (tasks: Task[]) => {
    setAppState(prev => ({ ...prev, tasks }));
  };

  const handleUpdateBlocks = (timeBlocks: TimeBlock[]) => {
    setAppState(prev => ({ ...prev, timeBlocks }));
    logAction('SCHEDULE_MODIFIED', 'schedule', `Calendar time blocks updated (Total: ${timeBlocks.length}).`);
  };

  const handleUpdateProjects = (projects: Project[]) => {
    setAppState(prev => ({ ...prev, projects }));
    logAction('PROJECT_UPDATED', 'project', `Project catalog updated.`);
  };

  const handleUpdateRisks = (risks: RiskItem[]) => {
    setAppState(prev => ({ ...prev, risks }));
    logAction('RISK_REGISTER_UPDATED', 'risk', `Operational risk status adjusted.`);
  };

  const handleUpdateHabits = (habits: Habit[]) => {
    setAppState(prev => ({ ...prev, habits }));
  };

  const handleSaveReflection = (reflection: DailyReflection) => {
    const exists = appState.reflections.some(r => r.date === reflection.date);
    const updated = exists
      ? appState.reflections.map(r => r.date === reflection.date ? reflection : r)
      : [...appState.reflections, reflection];
    setAppState(prev => ({ ...prev, reflections: updated }));
    logAction('REFLECTION_RECORDED', 'task', `Daily wellness & focus reflection recorded for ${reflection.date}.`);
  };

  const handleSaveFocusSession = (session: FocusSession) => {
    setAppState(prev => ({
      ...prev,
      focusSessions: [...prev.focusSessions, session]
    }));
    logAction('FOCUS_SESSION_COMPLETED', 'focus', `Completed ${session.durationMinutes}m focus session: "${session.taskTitle || 'Open Focus'}".`);
  };

  const handleApplyAiSchedule = (result: { scheduledBlocks: TimeBlock[]; updatedTasks: Task[] }) => {
    setAppState(prev => ({
      ...prev,
      timeBlocks: [...prev.timeBlocks, ...result.scheduledBlocks],
      tasks: prev.tasks.map(t => {
        const match = result.updatedTasks.find(ut => ut.id === t.id);
        return match || t;
      })
    }));
    logAction('AI_AUTOPILOT_APPLIED', 'schedule', `AI Autopilot scheduled ${result.scheduledBlocks.length} task blocks.`);
  };

  const handleSelectWorkspaceMode = (mode: WorkspaceMode) => {
    setAppState(prev => ({ ...prev, workspaceMode: mode }));
  };

  const handleResetData = () => {
    const initial = getInitialData();
    setAppState(initial);
    saveAppState(initial);
  };

  const handleImportData = (data: AppState) => {
    setAppState(data);
    saveAppState(data);
  };

  const handleStartFocusOnTask = (task: Task) => {
    setFocusTaskId(task.id);
    setActiveView('focus');
  };

  const handleOpenTaskForEditing = (task: Task) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setTaskModalOpen(true);
  };

  // Workspace Mode filtering:
  // When in "Personal Flow", filter views primarily to personal tasks
  // When in "Startup Core", focus on Sprint 28 projects
  let displayedState = appState;
  if (appState.workspaceMode === 'personal') {
    displayedState = {
      ...appState,
      tasks: appState.tasks.filter(t => t.assignedTo === 'tm-2' || !t.assignedTo)
    };
  } else if (appState.workspaceMode === 'startup') {
    displayedState = {
      ...appState,
      projects: appState.projects.filter(p => p.sprint === 'Sprint 28')
    };
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 font-mono text-xs transition-colors duration-150">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-500 animate-ping" />
          <span>Mounting TIME-CO Local Persistence Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100/90 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden select-none transition-colors duration-150">
      {/* Top Navigation Bar */}
      <Navbar
        workspaceMode={appState.workspaceMode}
        onSelectWorkspaceMode={handleSelectWorkspaceMode}
        onOpenCommandMenu={() => setCommandMenuOpen(true)}
        onOpenAiPlanner={() => setAiModalOpen(true)}
        onOpenFocusStudio={() => setActiveView('focus')}
        onResetData={handleResetData}
        onImportData={handleImportData}
        appState={appState}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          activeView={activeView}
          onSelectView={(view) => {
            setActiveView(view);
            setMobileSidebarOpen(false);
          }}
          onOpenNewTaskModal={handleOpenNewTask}
          appState={displayedState}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* View Rendering */}
        <main className="flex-1 overflow-hidden relative">
          {activeView === 'planner' && (
            <PlannerView
              appState={displayedState}
              onUpdateBlocks={handleUpdateBlocks}
              onUpdateTasks={handleUpdateTasks}
              onOpenAiModal={() => setAiModalOpen(true)}
              onSelectTask={handleOpenTaskForEditing}
              onOpenNewTaskModal={handleOpenNewTask}
            />
          )}

          {activeView === 'tasks' && (
            <TasksView
              appState={displayedState}
              onUpdateTasks={handleUpdateTasks}
              onOpenNewTaskModal={handleOpenNewTask}
              onSelectTask={handleOpenTaskForEditing}
              onStartFocusOnTask={handleStartFocusOnTask}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              appState={displayedState}
              onUpdateBlocks={handleUpdateBlocks}
              onOpenAiPlanner={() => setAiModalOpen(true)}
            />
          )}

          {activeView === 'focus' && (
            <FocusView
              appState={displayedState}
              onSaveSession={handleSaveFocusSession}
              onUpdateTasks={handleUpdateTasks}
              initialTaskId={focusTaskId}
            />
          )}

          {activeView === 'projects' && (
            <ProjectsView
              appState={displayedState}
              onUpdateProjects={handleUpdateProjects}
              onFilterTasksByProject={(projId) => {
                setActiveView('tasks');
              }}
            />
          )}

          {activeView === 'enterprise' && (
            <EnterpriseView appState={displayedState} />
          )}

          {activeView === 'risks' && (
            <RisksView
              appState={displayedState}
              onUpdateRisks={handleUpdateRisks}
            />
          )}

          {activeView === 'analytics' && (
            <AnalyticsView appState={displayedState} />
          )}

          {activeView === 'personal' && (
            <PersonalView
              appState={displayedState}
              onUpdateHabits={handleUpdateHabits}
              onSaveReflection={handleSaveReflection}
            />
          )}
        </main>
      </div>

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        initialTask={editingTask}
        projects={appState.projects}
        departments={appState.departments}
        teamMembers={appState.teamMembers}
        allTasks={appState.tasks}
      />

      {/* AI Schedule Optimization Modal */}
      <AISchedulerModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        appState={appState}
        onApplySchedule={handleApplyAiSchedule}
      />

      {/* Raycast / Linear Style Command Palette */}
      <CommandMenu
        isOpen={commandMenuOpen}
        onClose={() => setCommandMenuOpen(false)}
        appState={appState}
        onSelectView={setActiveView}
        onOpenNewTaskModal={handleOpenNewTask}
        onOpenAiPlanner={() => setAiModalOpen(true)}
        onOpenFocusStudio={() => setActiveView('focus')}
        onSelectTask={handleOpenTaskForEditing}
      />
    </div>
  );
}
