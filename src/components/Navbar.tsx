import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { WorkspaceMode, AppState } from '../types';
import { exportStateAsJSON, exportTasksAsCSV } from '../services/storage';

interface NavbarProps {
  workspaceMode: WorkspaceMode;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
  onOpenCommandMenu: () => void;
  onOpenAiPlanner: () => void;
  onOpenFocusStudio: () => void;
  onResetData: () => void;
  onImportData: (data: AppState) => void;
  activeFocusSession?: { taskTitle?: string; timeLeft: string; isRunning: boolean };
  appState: AppState;
}

export const Navbar: React.FC<NavbarProps> = ({
  workspaceMode,
  onSelectWorkspaceMode,
  onOpenCommandMenu,
  onOpenAiPlanner,
  onOpenFocusStudio,
  onResetData,
  onImportData,
  activeFocusSession,
  appState
}) => {
  const [dataDropdownOpen, setDataDropdownOpen] = useState(false);
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);

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
    <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Workspace Mode */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-base">TIME<span className="text-indigo-400">-CO</span></span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                OS v2.4
              </span>
            </div>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            id="workspace-switcher-btn"
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>{getWorkspaceTitle(workspaceMode)}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-48 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Workspace
              </div>
              <button
                onClick={() => { onSelectWorkspaceMode('enterprise'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                  workspaceMode === 'enterprise' ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-300'
                }`}
              >
                <span>Enterprise Fleet (All Depts)</span>
                {workspaceMode === 'enterprise' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { onSelectWorkspaceMode('startup'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                  workspaceMode === 'startup' ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-300'
                }`}
              >
                <span>Startup Core (Sprint Focus)</span>
                {workspaceMode === 'startup' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { onSelectWorkspaceMode('personal'); setWorkspaceMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                  workspaceMode === 'personal' ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-slate-300'
                }`}
              >
                <span>Personal Flow (My Tasks)</span>
                {workspaceMode === 'personal' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Command Search Bar */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <button
          id="global-search-btn"
          onClick={onOpenCommandMenu}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search tasks, projects, schedules, risks...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Active Focus Pill */}
        {activeFocusSession?.isRunning ? (
          <button
            onClick={onOpenFocusStudio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-medium animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Focus: {activeFocusSession.timeLeft}</span>
          </button>
        ) : (
          <button
            id="open-focus-btn"
            onClick={onOpenFocusStudio}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
            title="Open Pomodoro Focus Studio"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>Focus Mode</span>
          </button>
        )}

        {/* AI Autopilot Button */}
        <button
          id="open-ai-planner-btn"
          onClick={onOpenAiPlanner}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-medium shadow-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-spin" style={{ animationDuration: '6s' }} />
          <span>AI Schedule Planner</span>
        </button>

        {/* Local Storage & Export Controls */}
        <div className="relative">
          <button
            id="data-sync-menu-btn"
            onClick={() => setDataDropdownOpen(!dataDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors"
            title="Local Data & Sync Management"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline text-[11px] text-emerald-400 font-mono">100% Local</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dataDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-60 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-800/80">
                <div className="font-semibold text-slate-200">Local Persistence Engine</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Stored securely in browser IndexedDB. Zero external login required.
                </div>
              </div>
              <button
                onClick={() => { exportStateAsJSON(appState); setDataDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Backup Workspace (JSON)</span>
              </button>
              <button
                onClick={() => { exportTasksAsCSV(appState.tasks); setDataDropdownOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Tasks as CSV</span>
              </button>
              <label className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Restore Backup (JSON)</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>
              <div className="border-t border-slate-800/80 my-1" />
              <button
                onClick={() => {
                  if (confirm('Reset to initial sample enterprise workspace data?')) {
                    onResetData();
                    setDataDropdownOpen(false);
                  }
                }}
                className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
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
