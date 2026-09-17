import React, { useState } from 'react';
import { 
  BookOpen, 
  Building2, 
  Rocket, 
  User, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  X, 
  Search, 
  Key, 
  Layers, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Copy, 
  Check, 
  Workflow, 
  Cpu, 
  ArrowRight,
  Database,
  Lock,
  Zap,
  Globe
} from 'lucide-react';
import { WorkspaceMode, AppState } from '../types';

interface InstructionManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceMode: WorkspaceMode;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
  onOpenAiPlanner?: () => void;
  onOpenAccessKeysModal?: () => void;
}

type ManualTab = 'enterprise' | 'startup' | 'personal' | 'future_roadmap' | 'architecture';

export const InstructionManualModal: React.FC<InstructionManualModalProps> = ({
  isOpen,
  onClose,
  workspaceMode,
  onSelectWorkspaceMode,
  onOpenAiPlanner,
  onOpenAccessKeysModal
}) => {
  const [activeTab, setActiveTab] = useState<ManualTab>(
    workspaceMode === 'enterprise' ? 'enterprise' : workspaceMode === 'startup' ? 'startup' : 'personal'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  TIME-CO Master Instruction Manual
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Free Prototype · No Sign-in
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comprehensive operational guide tailored across all 3 user operational tiers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Close Manual"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('enterprise')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'enterprise'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Enterprise Fleet</span>
            </button>

            <button
              onClick={() => setActiveTab('startup')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'startup'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Startup Core</span>
            </button>

            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Personal Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('future_roadmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'future_roadmap'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Future Integrations & AI</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Free Prototype Model</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative pb-2 w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search manual topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm leading-relaxed">
          
          {/* ========================================================================= */}
          {/* TAB 1: ENTERPRISE FLEET                                                  */}
          {/* ========================================================================= */}
          {activeTab === 'enterprise' && (
            <div className="space-y-6">
              {/* Mandatory Prototype Notice Banner */}
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Free · No Sign-in Prototype Model</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-normal">
                  This entire <strong>Enterprise Fleet</strong> operating tier is provided as an <strong>absolutely free, zero-sign-in prototype model</strong>. 
                  There are no enterprise sales gates, no credit cards required, and zero user account registrations. 
                  All organizational structures, budgets, OKRs, and cryptographic room access keys are executed and persisted locally on your device in browser IndexedDB.
                </p>
              </div>

              {/* Title & Tier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Enterprise Fleet Operational Guide
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Designed for C-Level Executives, VP/Directors, PMO Leaders, and Cross-Functional Organizations
                  </p>
                </div>
                {workspaceMode !== 'enterprise' ? (
                  <button
                    onClick={() => onSelectWorkspaceMode('enterprise')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>Activate Enterprise Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active Workspace Mode
                  </span>
                )}
              </div>

              {/* Detailed Walkthrough */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Detailed Operational Walkthrough
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Key className="w-4 h-4" />
                      <span>1. Cryptographic Room Access Keys (RBAC)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Enterprise Fleet isolates data across departments (Engineering, Product, Marketing, Operations). 
                      Click <strong>Room Access Keys</strong> in the navigation to audit, generate, and distribute SHA-256 tokens. 
                      Team members cannot access locked departmental chambers without an active allotted key.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Workflow className="w-4 h-4" />
                      <span>2. Department OKRs & Budget Burn Tracking</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Navigate to <strong>Enterprise</strong> in the sidebar. Review quarterly budget burn rates ($k spent vs. allocated), 
                      headcount FTE distribution, and Objectives & Key Results (OKRs) with progress tracking down to the individual key result.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Layers className="w-4 h-4" />
                      <span>3. Team Roster & Capacity Management</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Under the Enterprise view, monitor total team workload vs. weekly hour capacity (e.g., 40h/wk). 
                      Click <strong>Edit</strong> on any team member (like Elena Rostova) to modify their designation, role title, department, or allotted cryptographic key.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>4. Enterprise Risk Matrix Registry</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Head to the <strong>Risks</strong> view to audit corporate blockers, technical debt, and compliance exposure on an interactive 
                      Probability vs. Impact 9-block grid with custom mitigation playbooks and assignees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advantages of Enterprise Fleet */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Key Advantages for Enterprise Fleet Users
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Zero Vendor Lock-In & $0 Seat Tax:</strong> Zero per-seat monthly SaaS subscription overhead. Run full cross-department planning without procurement approvals.</li>
                  <li><strong>Total Air-Gapped Data Sovereignty:</strong> Confidential corporate OKRs, financial budgets, and executive roadmap notes never touch third-party servers.</li>
                  <li><strong>Instant Department Isolation:</strong> Cryptographic token chambers prevent unauthorized personnel from viewing sensitive strategic initiatives.</li>
                  <li><strong>One-Click JSON/CSV Audit Exports:</strong> Export full enterprise state or CSV task logs anytime for board presentations or archival compliance.</li>
                </ul>
              </div>

              {/* Future Integrations & Strong AI Presence */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Future Integrations & Strong AI Presence</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" /> Corporate Integrations
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Planned native bridges for <strong>Google Workspace</strong> (Google Drive, Docs, Sheets, Calendar Enterprise), 
                      <strong>Microsoft 365 / Azure AD Entra SSO</strong>, <strong>Jira & Linear Enterprise bi-directional sync</strong>, and <strong>Workday capacity connectors</strong>.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Strong AI Presence (Gemini Multimodal)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Autonomous cross-department dependency constraint solving, predictive budget burn forecasting, 
                      generative executive briefing digests, and automated meeting action-item dispatching.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: STARTUP CORE                                                      */}
          {/* ========================================================================= */}
          {activeTab === 'startup' && (
            <div className="space-y-6">
              {/* Mandatory Prototype Notice Banner */}
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Free · No Sign-in Prototype Model</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-normal">
                  The <strong>Startup Core</strong> operational tier is an <strong>absolutely free, zero-sign-in prototype model</strong>. 
                  Zero friction: founders and squads can start running agile sprint cycles instantly without registration, contracts, or credentials.
                  All sprint backlogs and velocity telemetry stay in client-side IndexedDB.
                </p>
              </div>

              {/* Title & Tier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Startup Core Operational Guide
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Optimized for Agile Squads, Tech Leads, Startup Founders, and High-Velocity Product Teams
                  </p>
                </div>
                {workspaceMode !== 'startup' ? (
                  <button
                    onClick={() => onSelectWorkspaceMode('startup')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>Activate Startup Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active Workspace Mode
                  </span>
                )}
              </div>

              {/* Detailed Walkthrough */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Detailed Operational Walkthrough
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Clock className="w-4 h-4" />
                      <span>1. AI Time Planner & Day Blocks</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      The core landing view features a Motion-style constraint solver. Click <strong>AI Schedule Planner</strong> (or the magic wand) 
                      to automatically fit your sprint backlog tasks into uninterrupted deep-work time blocks between scheduled meetings.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Layers className="w-4 h-4" />
                      <span>2. Unified Sprint Board & Kanban Columns</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      In the <strong>Tasks</strong> view, switch between Kanban board and List views. Group tasks by Project, Priority, or Department. 
                      Assign tasks to team members, toggle urgent flags, estimate durations, and record actual effort.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Key className="w-4 h-4" />
                      <span>3. Shared Sprint Key Protocol</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Startup Core utilizes a shared cryptographic sprint token (<code className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">TIME-ROOM-StartupCore-...</code>) 
                      enabling your squad to work without bureaucratic permissions while maintaining cryptographically bounded workspace state.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Calendar className="w-4 h-4" />
                      <span>4. Month & Week Calendar Oversight</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Switch to the <strong>Calendar</strong> view to view your full team schedule in Day, Week, or the newly integrated 7-column Month grid. 
                      Filter by category (Deep Work, Meeting, Architecture, Bugfix, Operations) to prevent team burnout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advantages of Startup Core */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Key Advantages for Startup Core Users
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Zero Signup Latency:</strong> Onboard new engineers in 5 seconds. Open the URL and the entire sprint environment is operational immediately.</li>
                  <li><strong>High-Velocity Sprint Shield:</strong> AI constraint solver actively defends deep work windows against meeting creep.</li>
                  <li><strong>Lightweight Project Architecture:</strong> Manage products with project keys (e.g., [CORE], [ALPHA]), tags, and subtasks without JIRA bloat.</li>
                  <li><strong>Instant Disaster Recovery:</strong> Export full workspace JSON snapshots in one click and distribute to teammates.</li>
                </ul>
              </div>

              {/* Future Integrations & Strong AI Presence */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Future Integrations & Strong AI Presence</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" /> Developer & Sprint Integrations
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Planned integrations for <strong>GitHub Issues & PR Sync</strong>, <strong>Linear sprint import/export</strong>, 
                      <strong>Slack daily standup summarizer</strong>, <strong>Notion database sync</strong>, and <strong>Figma milestone notifications</strong>.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Strong AI Presence (Gemini Autopilot)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Predictive sprint velocity modeling, automated triage of bug reports vs. technical debt, 
                      intelligent scope clipping before release deadlines, and one-click investor sprint progress digests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PERSONAL FLOW                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              {/* Mandatory Prototype Notice Banner */}
              <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>100% Free · No Sign-in Prototype Model</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-normal">
                  The <strong>Personal Flow</strong> operational tier is an <strong>absolutely free, zero-sign-in prototype model</strong>. 
                  There are no email requirements, no trackers, and zero paywalls. Your personal habits, focus sessions, 
                  and confidential daily reflections are strictly stored in local browser IndexedDB and never uploaded to any remote server.
                </p>
              </div>

              {/* Title & Tier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Personal Flow Operational Guide
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tailored for Solo Creators, Software Engineers, Researchers, Freelancers, and Deep-Work Practitioners
                  </p>
                </div>
                {workspaceMode !== 'personal' ? (
                  <button
                    onClick={() => onSelectWorkspaceMode('personal')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <span>Activate Personal Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active Workspace Mode
                  </span>
                )}
              </div>

              {/* Detailed Walkthrough */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Detailed Operational Walkthrough
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Clock className="w-4 h-4" />
                      <span>1. Focus Studio & Custom Attention Span</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Open <strong>Focus Mode</strong> from the top bar or sidebar. Select any task to anchor your focus. 
                      Use the <strong>Custom Attention Span Calibrator</strong> (-5m, +5m or direct input) to match your cognitive stamina 
                      (e.g., 35m custom interval) and save it as your default profile.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <Zap className="w-4 h-4" />
                      <span>2. Built-in Ambient Focus Synthesizer</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Inside Focus Studio, engage real-time synthesized audio generators: <strong>White Noise</strong>, 
                      <strong>Pink Noise</strong>, <strong>Deep Theta (Binaural Beats)</strong>, or <strong>Rain Ambience</strong>. 
                      Runs entirely via Web Audio API with zero internet connection required.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>3. Atomic Habits & Daily Streak Tracking</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Navigate to <strong>Personal Growth</strong> in the sidebar. Build consistency with positive habit streaks (Deep Work, Hydration, Exercise, Reading) 
                      and negative habit avoidance counters with interactive check-offs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                      <span>4. Daily Reflections & Cognitive Journal</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      Log daily mood scores (1-5), energy levels, wins, and tomorrow’s primary priorities. 
                      Track historical productivity telemetry without fear of personal data leakage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advantages of Personal Flow */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Key Advantages for Personal Flow Users
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Absolute Personal Privacy:</strong> Your personal thoughts, mental health logs, and unfinished tasks are never sent across the wire.</li>
                  <li><strong>Cognitive Attention Calibration:</strong> Unlike rigid 25-minute Pomodoro timers, calibrate the timer to your natural biological attention span.</li>
                  <li><strong>True Offline Freedom:</strong> Use the application on airplanes, remote cabins, or low-connectivity environments without interruption.</li>
                  <li><strong>Zero Spam & Zero Upsells:</strong> No subscription popups, marketing newsletters, or premium tier paywalls.</li>
                </ul>
              </div>

              {/* Future Integrations & Strong AI Presence */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-3">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Future Integrations & Strong AI Presence</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" /> Personal Integrations
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Planned support for <strong>Google Calendar two-way sync</strong>, <strong>Apple Calendar (iCal/ICS)</strong>, 
                      <strong>Spotify & Apple Music focus playlist grounding</strong>, and <strong>Obsidian / Logseq markdown vault export</strong>.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Strong AI Presence (Gemini Cognitive Coach)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Personal circadian rhythm analysis, adaptive focus interval suggestions based on completed Pomodoros, 
                      contextual anti-procrastination nudges, and generative end-of-day audio journal summaries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: FUTURE INTEGRATIONS & AI ROADMAP                                  */}
          {/* ========================================================================= */}
          {activeTab === 'future_roadmap' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Next-Generation Architecture & Strong AI Presence</span>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-normal">
                  While the current prototype is 100% free and fully functional offline in your browser, 
                  upcoming versions are engineered for deep cloud integrations and autonomous multimodal Gemini AI agents.
                </p>
              </div>

              {/* Integrations Grid */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Upcoming System Integrations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span>Google Workspace Ecosystem</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Bi-directional live sync with <strong>Google Calendar</strong>, automatic meeting block ingestion, 
                      Google Drive attachment attachments, and Docs/Sheets OKR reporting synchronization.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>Developer & Agile Toolchains</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Native webhooks and API connectors for <strong>GitHub Issues / PRs</strong>, <strong>Linear Projects</strong>, 
                      and <strong>Jira Cloud</strong> to map code commits to scheduled deep work blocks.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <Workflow className="w-4 h-4 text-indigo-500" />
                      <span>Enterprise Identity & Messaging</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Enterprise SSO via <strong>Azure Active Directory (Entra ID)</strong> and <strong>Google Cloud Identity</strong>, 
                      coupled with Slack and Microsoft Teams bot notifications for focus timer states.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <Database className="w-4 h-4 text-indigo-500" />
                      <span>Durable Multi-Device Cloud Sync</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Optional end-to-end encrypted Firestore replication allowing cross-device synchronization 
                      between desktop, tablet, and mobile workspaces while preserving zero-knowledge client keys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Strong AI Presence */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Deep Multimodal AI Capabilities (Gemini Architecture)
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <strong className="text-indigo-600 dark:text-indigo-400 font-semibold block">
                        Autonomous Schedule Solver
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400">
                        Dynamically recalibrates entire team schedules when meetings run long or emergency production incidents occur.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-indigo-600 dark:text-indigo-400 font-semibold block">
                        Predictive OKR & Risk Forecasting
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400">
                        Detects lagging key results 3 weeks before quarter end and proposes real-time resource reallocation.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-indigo-600 dark:text-indigo-400 font-semibold block">
                        Generative Focus & Biofeedback
                      </strong>
                      <p className="text-slate-600 dark:text-slate-400">
                        Tailors binaural beat frequencies and task chunk sizes to individual fatigue telemetry throughout the day.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: FREE PROTOTYPE MODEL ARCHITECTURE                                 */}
          {/* ========================================================================= */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Free Prototype Model Guarantee</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-normal">
                  TIME-CO is deliberately engineered as a <strong>free, zero-sign-in prototype model</strong>. 
                  Below is a transparent technical overview of how your data, permissions, and offline operations function.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <Database className="w-4 h-4 text-indigo-500" />
                    <span>1. Client-Side IndexedDB Storage</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Your tasks, time blocks, departments, team members, habits, and focus logs are stored in a dedicated browser 
                    IndexedDB database (<code className="font-mono text-[10px]">time_co_db</code>) and mirrored in <code className="font-mono text-[10px]">localStorage</code>. 
                    No data is transmitted to external analytics or marketing servers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <Lock className="w-4 h-4 text-indigo-500" />
                    <span>2. Zero Authentication / No Login Needed</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    You never have to remember a password, verify an email, or sign in with third-party tracking cookies. 
                    The application boots instantly with complete access to all 3 workspace tiers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <Key className="w-4 h-4 text-indigo-500" />
                    <span>3. Cryptographic Room Tokens</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    Role-Based Access Control (RBAC) is implemented via deterministic cryptographic tokens that you can generate, 
                    assign, and share without needing an active backend user directory.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span>4. Portability & Sovereign Backups</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    You can download a complete JSON backup of your workspace at any second from the top right 
                    <strong>100% Local</strong> menu, or restore an existing backup on any other browser or machine.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>Current Active Workspace:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
              {workspaceMode === 'enterprise' ? 'Enterprise Fleet' : workspaceMode === 'startup' ? 'Startup Core' : 'Personal Flow'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAiPlanner && (
              <button
                onClick={() => { onClose(); onOpenAiPlanner(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch AI Planner</span>
              </button>
            )}

            {onOpenAccessKeysModal && (
              <button
                onClick={() => { onClose(); onOpenAccessKeysModal(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-300/70 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Room Access Keys</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
