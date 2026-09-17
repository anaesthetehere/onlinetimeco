import React, { useState, useEffect } from 'react';
import { AppState, Task, TimeBlock, Project, FocusSession, RiskItem, Habit, DailyReflection, WorkspaceMode, RoomAccessKey, TeamMember, Department } from './types';
import { loadAppState, saveAppState, getInitialData, getFreshInitialData, clearAllStorage, loadSampleDemoData } from './services/storage';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveView } from './components/Sidebar';
import { TaskModal } from './components/TaskModal';
import { CommandMenu } from './components/CommandMenu';
import { AccessKeysModal } from './components/AccessKeysModal';
import { InstructionManualModal, ManualTab } from './components/InstructionManualModal';
import { ContactUsModal } from './components/ContactUsModal';

// Views
import { LandingView } from './views/LandingView';
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
  const [activeView, setActiveView] = useState<ActiveView>('landing');

  // Modals state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [accessKeysModalOpen, setAccessKeysModalOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualInitialTab, setManualInitialTab] = useState<ManualTab | undefined>(undefined);
  const [contactUsModalOpen, setContactUsModalOpen] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<string | undefined>(undefined);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleOpenManual = (tab?: ManualTab) => {
    setManualInitialTab(tab);
    setManualOpen(true);
  };

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

  // Keyboard shortcut listener (Cmd+K)
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

  const handleSelectWorkspaceMode = (mode: WorkspaceMode) => {
    setAppState(prev => ({ ...prev, workspaceMode: mode }));
  };

  const handleUpdateRoomKeys = (keys: RoomAccessKey[]) => {
    setAppState(prev => ({ ...prev, roomAccessKeys: keys }));
    logAction('ACCESS_KEYS_MODIFIED', 'task', `Updated cryptographic room access keys register (${keys.length} keys).`);
  };

  const handleUnlockRoom = (roomId: string) => {
    setAppState(prev => ({
      ...prev,
      unlockedRoomIds: Array.from(new Set([...(prev.unlockedRoomIds || []), roomId]))
    }));
    logAction('ROOM_UNLOCKED', 'task', `Unlocked department room chamber: ${roomId}`);
  };

  const handleSetActiveKey = (key: string) => {
    setAppState(prev => ({ ...prev, activeAccessKey: key }));
  };

  const handleAddTeamMember = (member: TeamMember) => {
    setAppState(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, member]
    }));
    logAction('TEAM_MEMBER_ALLOTTED', 'task', `Allotted ${member.name} (${member.role}) with cryptographic key ${member.accessKey || 'N/A'}`);
  };

  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    setAppState(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(m => m.id === updatedMember.id ? updatedMember : m)
    }));
    logAction('TEAM_MEMBER_UPDATED', 'task', `Updated designation/profile for ${updatedMember.name} (${updatedMember.role})`);
  };

  const handleDeleteTeamMember = (memberId: string) => {
    const member = appState.teamMembers.find(m => m.id === memberId);
    setAppState(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(m => m.id !== memberId),
      tasks: prev.tasks.map(t => t.assignedTo === memberId ? { ...t, assignedTo: undefined } : t)
    }));
    logAction('TEAM_MEMBER_REMOVED', 'task', `Removed team member ${member?.name || memberId}`);
  };

  const handleAddDepartment = (dept: Department) => {
    setAppState(prev => ({
      ...prev,
      departments: [...prev.departments, dept],
      unlockedRoomIds: Array.from(new Set([...(prev.unlockedRoomIds || []), dept.id]))
    }));
    logAction('DEPARTMENT_CREATED', 'project', `Created department room: ${dept.name} (${dept.code})`);
  };

  const handleAddCustomCategory = (category: string) => {
    setAppState(prev => ({
      ...prev,
      customCategories: Array.from(new Set([...(prev.customCategories || []), category]))
    }));
    logAction('CATEGORY_CREATED', 'task', `Created custom task category: ${category}`);
  };

  const handleUpdateUserProfile = (userProfile: AppState['userProfile']) => {
    setAppState(prev => ({ ...prev, userProfile }));
    logAction('USER_PROFILE_UPDATED', 'task', `Calibrated user focus span: ${userProfile.customAttentionSpanMinutes || 25}m`);
  };

  // Reset to initial sample workspace data
  const handleResetData = async () => {
    const demo = await loadSampleDemoData();
    setAppState(demo);
  };

  // Start completely fresh with an empty, zero-placeholder workspace
  const handleStartFreshWorkspace = async (targetView: ActiveView = 'tasks') => {
    const fresh = await clearAllStorage();
    setAppState(fresh);
    setActiveView(targetView);
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

  // Workspace Mode filtering
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
          <span>Mounting TIME-CO Sovereign Workspace...</span>
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
        onOpenFocusStudio={() => setActiveView('focus')}
        onResetData={handleResetData}
        onStartFresh={() => handleStartFreshWorkspace('tasks')}
        onImportData={handleImportData}
        onOpenAccessKeysModal={() => setAccessKeysModalOpen(true)}
        onOpenManual={() => handleOpenManual()}
        onOpenContactUs={() => setContactUsModalOpen(true)}
        onNavigateHome={() => setActiveView('landing')}
        appState={appState}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        activeView={activeView}
        onSelectView={(view) => setActiveView(view)}
        onOpenNewTaskModal={handleOpenNewTask}
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
          {activeView === 'landing' && (
            <LandingView
              workspaceMode={appState.workspaceMode}
              onSelectWorkspaceMode={handleSelectWorkspaceMode}
              onEnterWorkspace={(targetView?: ActiveView) => {
                setActiveView(targetView || 'tasks');
              }}
              onStartFreshWorkspace={handleStartFreshWorkspace}
              onOpenManual={(tab) => handleOpenManual(tab)}
              onOpenContactUs={() => setContactUsModalOpen(true)}
              totalTasks={appState.tasks.length}
              totalProjects={appState.projects.length}
              totalMembers={appState.teamMembers.length}
            />
          )}

          {activeView === 'planner' && (
            <PlannerView
              appState={displayedState}
              onUpdateBlocks={handleUpdateBlocks}
              onUpdateTasks={handleUpdateTasks}
              onSelectTask={handleOpenTaskForEditing}
              onOpenNewTaskModal={handleOpenNewTask}
              onOpenManual={() => setManualOpen(true)}
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
            />
          )}

          {activeView === 'focus' && (
            <FocusView
              appState={displayedState}
              onSaveSession={handleSaveFocusSession}
              onUpdateTasks={handleUpdateTasks}
              onUpdateUserProfile={handleUpdateUserProfile}
              initialTaskId={focusTaskId}
            />
          )}

          {activeView === 'projects' && (
            <ProjectsView
              appState={displayedState}
              onUpdateProjects={handleUpdateProjects}
              onFilterTasksByProject={(_projId) => {
                setActiveView('tasks');
              }}
            />
          )}

          {activeView === 'enterprise' && (
            <EnterpriseView
              appState={displayedState}
              onOpenAccessKeysModal={() => setAccessKeysModalOpen(true)}
              onUpdateTeamMember={handleUpdateTeamMember}
              onDeleteTeamMember={handleDeleteTeamMember}
              onAddTeamMember={handleAddTeamMember}
            />
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
        customCategories={appState.customCategories}
        onAddCustomCategory={handleAddCustomCategory}
        onAddTeamMember={handleAddTeamMember}
        onAddDepartment={handleAddDepartment}
      />

      {/* Raycast / Linear Style Command Palette */}
      <CommandMenu
        isOpen={commandMenuOpen}
        onClose={() => setCommandMenuOpen(false)}
        appState={appState}
        onSelectView={setActiveView}
        onOpenNewTaskModal={handleOpenNewTask}
        onOpenFocusStudio={() => setActiveView('focus')}
        onSelectTask={handleOpenTaskForEditing}
        onOpenManual={() => handleOpenManual()}
        onOpenContactUs={() => setContactUsModalOpen(true)}
      />

      {/* User Instruction Manual Modal */}
      <InstructionManualModal
        isOpen={manualOpen}
        onClose={() => {
          setManualOpen(false);
          setManualInitialTab(undefined);
        }}
        workspaceMode={appState.workspaceMode}
        onSelectWorkspaceMode={handleSelectWorkspaceMode}
        onOpenAccessKeysModal={() => setAccessKeysModalOpen(true)}
        onOpenContactUs={() => setContactUsModalOpen(true)}
        initialTab={manualInitialTab}
      />

      {/* Access Keys & RBAC Management Modal */}
      <AccessKeysModal
        isOpen={accessKeysModalOpen}
        onClose={() => setAccessKeysModalOpen(false)}
        appState={appState}
        onSelectWorkspaceMode={handleSelectWorkspaceMode}
        onUpdateRoomKeys={handleUpdateRoomKeys}
        onUnlockRoom={handleUnlockRoom}
        onSetActiveKey={handleSetActiveKey}
      />

      {/* Contact Us & Community Reviews Modal */}
      <ContactUsModal
        isOpen={contactUsModalOpen}
        onClose={() => setContactUsModalOpen(false)}
        workspaceMode={appState.workspaceMode}
      />
    </div>
  );
}
