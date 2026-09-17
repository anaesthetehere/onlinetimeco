import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus,
  Search, 
  Clock, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Layers, 
  Play, 
  CheckCircle2, 
  FileSpreadsheet, 
  Cpu, 
  ChevronDown, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Shield, 
  Key, 
  BookOpen, 
  Mail, 
  HeartHandshake,
  MoreVertical,
  Calendar,
  CheckSquare,
  Timer,
  Briefcase,
  Trash2
} from 'lucide-react';
import { WorkspaceMode, AppState } from '../types';
import { ActiveView } from './Sidebar';
import { exportStateAsJSON, exportTasksAsCSV } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  workspaceMode: WorkspaceMode;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
  onOpenCommandMenu: () => void;
  onOpenFocusStudio: () => void;
  onResetData: () => void;
  onStartFresh?: () => void;
  onImportData: (data: AppState) => void;
  onOpenAccessKeysModal?: () => void;
  onOpenManual?: () => void;
  onOpenContactUs?: () => void;
  onNavigateHome?: () => void;
  activeFocusSession?: { taskTitle?: string; timeLeft: string; isRunning: boolean };
  appState: AppState;
  mobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
  activeView?: ActiveView;
  onSelectView?: (view: ActiveView) => void;
  onOpenNewTaskModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  workspaceMode,
  onSelectWorkspaceMode,
  onOpenCommandMenu,
  onOpenFocusStudio,
  onResetData,
  onStartFresh,
  onImportData,
  onOpenAccessKeysModal,
  onOpenManual,
  onOpenContactUs,
  onNavigateHome,
  activeFocusSession,
  appState,
  mobileSidebarOpen,
  onToggleMobileSidebar,
  activeView = 'landing',
  onSelectView,
  onOpenNewTaskModal
}) => {
  const { theme, toggleTheme } = useTheme();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmDemoOpen, setConfirmDemoOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setWorkspaceMenuOpen(false);
        setMoreMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.tasks && parsed.projects) {
          onImportData(parsed);
          setMoreMenuOpen(false);
        }
      } catch (err) {
        console.error('Failed to parse import file', err);
      }
    };
    reader.readAsText(file);
  };

  const getWorkspaceTitle = (mode: WorkspaceMode) => {
    switch (mode) {
      case 'enterprise': return 'Enterprise Fleet';
      case 'startup': return 'Startup Core';
      case 'personal': return 'Personal Flow';
    }
  };

  // Primary top navigation links for seamless, instant travel between pages
  const topTabs = [
    { id: 'landing' as ActiveView, label: 'Overview' },
    { id: 'planner' as ActiveView, label: 'Day Planner' },
    { id: 'tasks' as ActiveView, label: 'Tasks' },
    { id: 'calendar' as ActiveView, label: 'Calendar' },
    { id: 'focus' as ActiveView, label: 'Focus' },
    { id: 'projects' as ActiveView, label: 'Projects' },
    { id: 'personal' as ActiveView, label: 'Habits' }
  ];

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 sticky top-0 transition-colors">
      
      {/* Left: Hamburger & Brand & Workspace Mode */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          id="mobile-sidebar-toggle-btn"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none"
          title="Return to Time-Co Overview"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-sm text-white shrink-0 group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              TIME<span className="text-indigo-600 dark:text-indigo-400">-CO</span>
            </span>
          </div>
        </button>

        {/* Workspace Dropdown */}
        <div className="relative ml-1" ref={workspaceRef}>
          <button
            id="workspace-switcher-btn"
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="hidden sm:inline">{getWorkspaceTitle(workspaceMode)}</span>
            <span className="sm:hidden text-[11px] capitalize">{workspaceMode}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Workspace Tier
              </div>
              <button
                onClick={() => { onSelectWorkspaceMode('enterprise'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  workspaceMode === 'enterprise' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold">Enterprise Fleet</div>
                  <div className="text-[10px] text-slate-500">Depts, OKRs & Room Keys</div>
                </div>
                {workspaceMode === 'enterprise' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { onSelectWorkspaceMode('startup'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  workspaceMode === 'startup' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold">Startup Core</div>
                  <div className="text-[10px] text-slate-500">Sprint Boards & Tokens</div>
                </div>
                {workspaceMode === 'startup' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { onSelectWorkspaceMode('personal'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  workspaceMode === 'personal' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold">Personal Flow</div>
                  <div className="text-[10px] text-slate-500">Solo Focus & Habits</div>
                </div>
                {workspaceMode === 'personal' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Seamless Top Navigation Tabs (Desktop & Tablet) */}
      {onSelectView && (
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
          {topTabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectView(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Controls: Unified, uncluttered layout */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Search */}
        <button
          id="global-search-btn"
          onClick={onOpenCommandMenu}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          title="Search (⌘K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Focus Timer active pill */}
        {activeFocusSession?.isRunning && (
          <button
            onClick={onOpenFocusStudio}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{activeFocusSession.timeLeft}</span>
          </button>
        )}

        {/* Quick Action: New Task or Start Planning */}
        {onOpenNewTaskModal && activeView !== 'landing' ? (
          <button
            id="navbar-new-task-btn"
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">Task</span>
          </button>
        ) : activeView === 'landing' && onSelectView ? (
          <button
            id="navbar-start-btn"
            onClick={() => onSelectView('tasks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>Start Planning</span>
          </button>
        ) : null}

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* More Actions Unified Dropdown (Unclutters Manual, Contact Us, Access Keys, Backup) */}
        <div className="relative" ref={moreMenuRef}>
          <button
            id="more-actions-menu-btn"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            title="More Options & Utilities"
            aria-label="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {moreMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Support & Guides
              </div>

              {onOpenManual && (
                <button
                  id="dropdown-manual-btn"
                  onClick={() => { setMoreMenuOpen(false); onOpenManual(); }}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Instruction Manual & Guide</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Free</span>
                </button>
              )}

              {onOpenContactUs && (
                <button
                  onClick={() => { setMoreMenuOpen(false); onOpenContactUs(); }}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                >
                  <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Contact Us & Reviews</span>
                </button>
              )}

              {onOpenAccessKeysModal && (
                <button
                  onClick={() => { setMoreMenuOpen(false); onOpenAccessKeysModal(); }}
                  className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                >
                  <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Cryptographic Room Keys</span>
                </button>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Local Data Management
              </div>

              <button
                onClick={() => { exportStateAsJSON(appState); setMoreMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Backup Workspace (JSON)</span>
              </button>

              <button
                onClick={() => { exportTasksAsCSV(appState.tasks); setMoreMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Export Tasks as CSV</span>
              </button>

              <label className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Restore Backup (JSON)</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              {onStartFresh && (
                <button
                  onClick={() => {
                    setMoreMenuOpen(false);
                    setConfirmClearOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All & Start Fresh</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  setConfirmDemoOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Load Sample Demo Data</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* In-App Confirmation Modal: Clear Workspace */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <Trash2 className="w-5 h-5" />
              <span>Clear Entire Workspace?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This will permanently remove all tasks, projects, time blocks, and personal notes, resetting your workspace to a completely clean slate.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmClearOpen(false);
                  if (onStartFresh) onStartFresh();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                Yes, Clear Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Confirmation Modal: Load Demo Data */}
      {confirmDemoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <RotateCcw className="w-5 h-5" />
              <span>Load Sample Demo Data?</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This populates the workspace with sample projects, sprint tasks, and time blocks so you can explore the features.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDemoOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDemoOpen(false);
                  onResetData();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                Load Demo Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
