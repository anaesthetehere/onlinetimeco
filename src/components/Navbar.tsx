import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
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
  HeartHandshake
} from 'lucide-react';
import { WorkspaceMode, AppState } from '../types';
import { exportStateAsJSON, exportTasksAsCSV } from '../services/storage';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  workspaceMode: WorkspaceMode;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
  onOpenCommandMenu: () => void;
  onOpenAiPlanner: () => void;
  onOpenFocusStudio: () => void;
  onResetData: () => void;
  onImportData: (data: AppState) => void;
  onOpenAccessKeysModal?: () => void;
  onOpenManual?: () => void;
  onOpenContactUs?: () => void;
  onNavigateHome?: () => void;
  activeFocusSession?: { taskTitle?: string; timeLeft: string; isRunning: boolean };
  appState: AppState;
  mobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  workspaceMode,
  onSelectWorkspaceMode,
  onOpenCommandMenu,
  onOpenAiPlanner,
  onOpenFocusStudio,
  onResetData,
  onImportData,
  onOpenAccessKeysModal,
  onOpenManual,
  onOpenContactUs,
  onNavigateHome,
  activeFocusSession,
  appState,
  mobileSidebarOpen,
  onToggleMobileSidebar
}) => {
  const { theme, toggleTheme } = useTheme();
  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const dataDropdownRef = useRef<HTMLDivElement>(null);

  // Automatically dismiss dropdowns when clicking outside anywhere on the site or pressing Esc
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
      if (dataDropdownRef.current && !dataDropdownRef.current.contains(event.target as Node)) {
        setDataDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setWorkspaceMenuOpen(false);
        setDataDropdownOpen(false);
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
          setDataDropdownOpen(false);
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

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-30 sticky top-0 transition-colors duration-150">
      {/* Left: Mobile Drawer Button & Brand & Workspace Mode */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          id="mobile-sidebar-toggle-btn"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus:outline-none"
          title="Return to Time-Co Welcome Landing Page"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-black/5 dark:ring-white/20 shrink-0 group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                TIME<span className="text-indigo-600 dark:text-indigo-400">-CO</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                OS v2.4
              </span>
            </div>
          </div>
        </button>

        <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Workspace Dropdown */}
        <div className="relative" ref={workspaceRef}>
          <button
            id="workspace-switcher-btn"
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="hidden md:inline">{getWorkspaceTitle(workspaceMode)}</span>
            <span className="md:hidden text-[11px] capitalize">{workspaceMode}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-60 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Workspace Mode
              </div>
              <button
                onClick={() => { onSelectWorkspaceMode('enterprise'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                  workspaceMode === 'enterprise' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold">Enterprise Fleet</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">All Depts + Room RBAC Keys</div>
                </div>
                {workspaceMode === 'enterprise' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { onSelectWorkspaceMode('startup'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                  workspaceMode === 'startup' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold">Startup Core</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Shared Sprint Key</div>
                </div>
                {workspaceMode === 'startup' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { onSelectWorkspaceMode('personal'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800/80 ${
                  workspaceMode === 'personal' ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold">Personal Flow</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Full Rights & Solo Autonomy</div>
                </div>
                {workspaceMode === 'personal' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />
              {onNavigateHome && (
                <button
                  onClick={() => { setWorkspaceMenuOpen(false); onNavigateHome(); }}
                  className="w-full text-left px-3 py-2 text-xs text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 font-medium"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Welcome Landing Page</span>
                </button>
              )}
              {onOpenManual && (
                <button
                  id="dropdown-manual-btn"
                  onClick={() => { setWorkspaceMenuOpen(false); onOpenManual(); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between font-medium"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Instruction Manual</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Free</span>
                </button>
              )}
              {onOpenContactUs && (
                <button
                  onClick={() => { setWorkspaceMenuOpen(false); onOpenContactUs(); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Contact Us & Reviews</span>
                </button>
              )}
              {onOpenAccessKeysModal && (
                <button
                  onClick={() => { setWorkspaceMenuOpen(false); onOpenAccessKeysModal(); }}
                  className="w-full text-left px-3 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex items-center gap-2 font-medium"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Manage Access & Room Keys</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Command Search Bar (Desktop) */}
      <div className="flex-1 max-w-md mx-4 hidden lg:block">
        <button
          id="global-search-btn"
          onClick={onOpenCommandMenu}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">Search tasks, projects, schedules, risks...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-700 shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Mobile search trigger */}
        <button
          id="mobile-search-btn"
          onClick={onOpenCommandMenu}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors"
          title="Search (⌘K)"
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </button>

        {/* Active Focus Pill */}
        {activeFocusSession?.isRunning ? (
          <button
            onClick={onOpenFocusStudio}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-medium animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span className="text-[11px] sm:text-xs">Focus: {activeFocusSession.timeLeft}</span>
          </button>
        ) : (
          <button
            id="open-focus-btn"
            onClick={onOpenFocusStudio}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
            title="Open Pomodoro Focus Studio"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Focus Mode</span>
          </button>
        )}

        {/* AI Autopilot Button */}
        <button
          id="open-ai-planner-btn"
          onClick={onOpenAiPlanner}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-medium shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="hidden sm:inline">AI Schedule Planner</span>
          <span className="sm:hidden">AI Planner</span>
        </button>

        {/* User Instruction Manual Button */}
        {onOpenManual && (
          <button
            id="navbar-manual-btn"
            onClick={onOpenManual}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            title="Instruction Manual & Button Guide (Enterprise, Startup & Personal Levels)"
            aria-label="User Instruction Manual"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="hidden md:inline">Manual</span>
            <span className="hidden lg:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Free
            </span>
          </button>
        )}

        {/* Contact Us Button (placed AFTER Manual in navigation bar as requested) */}
        {onOpenContactUs && (
          <button
            id="navbar-contact-btn"
            onClick={onOpenContactUs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 border border-amber-300/90 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Contact Us: Share Reviews, Feedback, Feature Enhancements, Bugs or Help (anweshasenapati4@gmail.com)"
            aria-label="Contact Us"
          >
            <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Contact Us</span>
          </button>
        )}

        {/* Access Control & Room Keys Button */}
        {onOpenAccessKeysModal && (
          <button
            id="access-keys-btn"
            onClick={onOpenAccessKeysModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            title="Manage Access Keys & Room Permissions"
            aria-label="Access Keys and Room Permissions"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="hidden xl:inline text-[11px] font-mono capitalize">{workspaceMode} Keys</span>
          </button>
        )}

        {/* Theme Toggle Button (Dark / Light) */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-2 rounded-md bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform -rotate-12 hover:rotate-0" />
          )}
        </button>

        {/* Local Storage & Export Controls */}
        <div className="relative" ref={dataDropdownRef}>
          <button
            id="data-sync-menu-btn"
            onClick={() => setDataDropdownOpen(!dataDropdownOpen)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 transition-colors"
            title="Local Data & Sync Management"
          >
            <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="hidden xl:inline text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">100% Local</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dataDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Local Persistence Engine</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Stored securely in browser IndexedDB. Zero external login required.
                </div>
              </div>
              <button
                onClick={() => { exportStateAsJSON(appState); setDataDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Backup Workspace (JSON)</span>
              </button>
              <button
                onClick={() => { exportTasksAsCSV(appState.tasks); setDataDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export Tasks as CSV</span>
              </button>
              <label className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Restore Backup (JSON)</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />
              <button
                onClick={() => {
                  if (confirm('Reset to initial sample enterprise workspace data?')) {
                    onResetData();
                    setDataDropdownOpen(false);
                  }
                }}
                className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default Demo Data</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
