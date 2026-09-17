import React, { useState } from 'react';
import { 
  Building2, 
  Rocket, 
  User, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Layers, 
  BookOpen, 
  Key, 
  HeartHandshake, 
  Copy, 
  Check, 
  ChevronRight,
  Play,
  Zap,
  Star,
  DollarSign,
  Plus,
  Volume2,
  CheckSquare,
  Sliders,
  Calendar,
  Timer,
  Briefcase,
  Lock,
  Database
} from 'lucide-react';
import { WorkspaceMode } from '../types';
import { ActiveView } from '../components/Sidebar';
import { PageDepictionsShowcase } from '../components/PageDepictionsShowcase';

interface LandingViewProps {
  workspaceMode: WorkspaceMode;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
  onEnterWorkspace: (targetView?: ActiveView, startFresh?: boolean) => void;
  onStartFreshWorkspace: (targetView?: ActiveView) => void;
  onOpenManual: (tier?: WorkspaceMode) => void;
  onOpenContactUs: () => void;
  totalTasks?: number;
  totalProjects?: number;
  totalMembers?: number;
}

export const LandingView: React.FC<LandingViewProps> = ({
  workspaceMode,
  onSelectWorkspaceMode,
  onEnterWorkspace,
  onStartFreshWorkspace,
  onOpenManual,
  onOpenContactUs
}) => {
  const [selectedRole, setSelectedRole] = useState<WorkspaceMode>(workspaceMode);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const contactEmail = 'anweshasenapati4@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleRoleSelection = (role: WorkspaceMode) => {
    setSelectedRole(role);
    onSelectWorkspaceMode(role);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 selection:bg-amber-400/30">
      
      {/* Container with optimal reading width */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">

        {/* Top Warm Welcome Hero Banner */}
        <section className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-xs">
            <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>A Warm Welcome to Time-Co • Direct, Seamless & Uncluttered</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Every Minute of Your Life Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-300 dark:to-amber-200">Sacred</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Welcome to Time-Co. A simple, sovereign productivity tool for instant project planning, task management, and day scheduling. No databases, no sign-ups, no hidden fees, and zero tracking—your data stays entirely on your local device.
          </p>

          {/* Prototype and Security Notice Pills */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Public Prototype
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-indigo-500" /> Zero Sign-Up Required
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-amber-500" /> Zero External Database
            </span>
            <span>•</span>
            <span>100% Private Client State</span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              id="landing-start-fresh-btn"
              onClick={() => onStartFreshWorkspace('tasks')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white font-bold text-sm shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Start Planning (Fresh Workspace)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEnterWorkspace('tasks')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <span>Open Workspace</span>
            </button>

            <button
              onClick={() => onOpenManual()}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>User Manual</span>
            </button>
          </div>
        </section>

        {/* SECTION 1: Quick-Start Dedicated Modules (1-Click Launch to Fresh Workspace) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Quick-Start Functional Sections
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any section below to start with a fresh, ready-to-use page with zero placeholders
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. To-Do & Tasks */}
            <div
              onClick={() => onStartFreshWorkspace('tasks')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/80 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    To-Do & Tasks
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Kanban board, List views, Eisenhower Q1-Q4 urgent matrix, and subtasks.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Start Fresh To-Do</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* 2. Projects & Roadmap */}
            <div
              onClick={() => onStartFreshWorkspace('projects')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/80 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Projects & Roadmap
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Strategic initiatives, sprint timelines, progress tracking, and deliverables.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Start Fresh Projects</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* 3. Day Planner & Schedule */}
            <div
              onClick={() => onStartFreshWorkspace('planner')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/80 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Day Planner & Schedule
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Time-block your day, manage workload capacity, and schedule backlog tasks.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Start Fresh Day Plan</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* 4. Focus Studio */}
            <div
              onClick={() => onStartFreshWorkspace('focus')}
              className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/80 transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    Focus Studio
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Pomodoro timer with offline audio synthesizers (rain, pink noise, brown noise).
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
                <span>Start Focus Session</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Depictions of How Users Have Already Used Each Page */}
        <section id="page-depictions-section" className="space-y-4 pt-2">
          <PageDepictionsShowcase
            onSelectView={(view) => onEnterWorkspace(view)}
          />
        </section>

        {/* SECTION 3: Privacy, Security & Prototype Trust Guarantee */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Security & Privacy by Architecture</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              The Most Secure Productivity Tool for Instant Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              We do not keep or harvest any personal information of the user. In this public prototype phase, client-side isolation ensures total privacy:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Zero Server Databases</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                All data resides strictly in your browser session. No remote servers ever receive, inspect, or retain your plans.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>No Signups or Accounts</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                No credentials, passwords, or emails required to plan. The app is immediately usable by the public upon load.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
              <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Future Cloud Trust</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Optional cloud synchronization and end-to-end encryption can be introduced in the future as a transparent trust-building step.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: Role Selection & Operational Button Directory */}
        <section className="space-y-4 pt-2">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Operational Roles & Button Significance Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Select your tier to view how buttons operate specifically for your needs (e.g. edit employee names, set project budget amounts, room keys).
            </p>
          </div>

          {/* 3 Interactive Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* Enterprise Fleet */}
            <div 
              onClick={() => handleRoleSelection('enterprise')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'enterprise'
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  {selectedRole === 'enterprise' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Level
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Enterprise Fleet
                  </h3>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    C-Suite, PMO Leaders & Cross-Functional Orgs
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cryptographic Room Keys (RBAC), department budget burn rates, employee editing, and team capacity heatmaps.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>View Enterprise Buttons</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Startup Core */}
            <div 
              onClick={() => handleRoleSelection('startup')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'startup'
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Rocket className="w-4 h-4" />
                  </div>
                  {selectedRole === 'startup' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Level
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Startup Core
                  </h3>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Founders, Tech Leads & High-Velocity Teams
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Fast sprint roadmaps, day time-blocking, task energy tagging, and quick issue backlogs.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>View Startup Buttons</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Personal Flow */}
            <div 
              onClick={() => handleRoleSelection('personal')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'personal'
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User className="w-4 h-4" />
                  </div>
                  {selectedRole === 'personal' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Level
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Personal Flow
                  </h3>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Solo Builders, Creators & Mindful Planners
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pomodoro focus timers with offline synthesizers, habit streaks, and daily reflections.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>View Personal Buttons</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 5: Feedback & Review Card */}
        <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-100/50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500/30" />
                <span>Share Reviews, Feedback & Future Requests</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Have an enhancement idea or need any help? Share your review or suggestion directly with our development team at <strong className="font-mono text-indigo-600 dark:text-indigo-400">{contactEmail}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-300/80 dark:border-amber-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-300">Copied Email</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy {contactEmail}</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenContactUs}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Contact & Reviews</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-4 pb-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">TIME-CO</span>
            <span>•</span>
            <span>Sovereign Client-Side Productivity Workspace</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenManual()}
              className="text-slate-600 dark:text-slate-400 hover:underline cursor-pointer"
            >
              Master User Manual
            </button>
            <span>•</span>
            <button
              onClick={onOpenContactUs}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              Contact & Review
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
