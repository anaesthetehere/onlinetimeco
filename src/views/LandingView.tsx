import React, { useState } from 'react';
import { 
  Building2, 
  Rocket, 
  User, 
  Sparkles, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Layers, 
  BookOpen, 
  Key, 
  Workflow, 
  HeartHandshake, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Play,
  Zap,
  Star,
  Compass,
  Edit2,
  UserPlus,
  DollarSign,
  Plus,
  Volume2,
  CheckSquare,
  Sliders
} from 'lucide-react';
import { WorkspaceMode, AppState } from '../types';

interface LandingViewProps {
  workspaceMode: WorkspaceMode;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
  onEnterWorkspace: (targetView?: string) => void;
  onOpenManual: (tier?: WorkspaceMode) => void;
  onOpenContactUs: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  workspaceMode,
  onSelectWorkspaceMode,
  onEnterWorkspace,
  onOpenManual,
  onOpenContactUs
}) => {
  const [selectedRole, setSelectedRole] = useState<WorkspaceMode | null>(workspaceMode);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">

        {/* Top Warm Welcome Hero Banner */}
        <section className="text-center space-y-4 pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-xs font-semibold shadow-xs">
            <HeartHandshake className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>A Warm Welcome to Time-Co • Made for You</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Every Minute of Your Life Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:via-orange-300 dark:to-amber-200">Sacred</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            We warmly welcome every student, independent developer, startup founder, director, and visionary from any background to explore this prototype. 
            Time-Co is designed from the ground up to respect your attention, protect your focus, and give you complete sovereignty over your time.
          </p>

          {/* Prototype and Zero Sign-In Notice Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Free Prototype
            </span>
            <span>•</span>
            <span>No Sign-in Required</span>
            <span>•</span>
            <span>Local Browser IndexedDB Storage</span>
            <span>•</span>
            <span>Zero Tracking</span>
          </div>
        </section>

        {/* Dedicated Feedback & Reviews Welcome Card */}
        <section className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-amber-100/50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500/30" />
                <span>Share Reviews, Feedback & Future Enhancements</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                How is Time-Co working for your workflow? Do you have an enhancement idea, an integration you'd love, a bug or fix needed, or need any type of help? 
                Please share your review or note directly with our team at <strong className="font-mono text-indigo-600 dark:text-indigo-400">{contactEmail}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-300/80 dark:border-amber-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                title="Copy developer email address"
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
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white text-xs font-semibold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open Contact & Reviews</span>
              </button>
            </div>
          </div>
        </section>

        {/* Role Selection & Focus Area Discovery */}
        <section className="space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tell Us Who You Are Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Select which operational tier matches your primary goal. We will instantly tailor your workspace and provide the exact focused manual for your flow.
            </p>
          </div>

          {/* 3 Interactive Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Enterprise Fleet */}
            <div 
              onClick={() => handleRoleSelection('enterprise')}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'enterprise'
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-lg'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              {selectedRole === 'enterprise' && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selected
                </div>
              )}

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Enterprise Fleet
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    For C-Suite, PMO Leaders & Cross-Functional Orgs
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cryptographic Room Access Keys (RBAC), department budget burn rates, OKR progress trees, team capacity heatmaps, and enterprise risk radars.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Configure for Enterprise</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 2. Startup Core */}
            <div 
              onClick={() => handleRoleSelection('startup')}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'startup'
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-lg'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              {selectedRole === 'startup' && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selected
                </div>
              )}

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Startup Core
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    For Agile Squads, Tech Leads & Founders
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  High-velocity sprint boards, shared team sprint cryptographic tokens, Motion-style AI constraint solving, and dynamic milestone tracking.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Configure for Startup</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* 3. Personal Flow */}
            <div 
              onClick={() => handleRoleSelection('personal')}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedRole === 'personal'
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 shadow-lg'
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-700 hover:shadow-md'
              }`}
            >
              {selectedRole === 'personal' && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Selected
                </div>
              )}

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Personal Flow
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
                    For Solo Developers, Researchers & Creators
                  </p>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Deep work flow state, Pomodoro Focus Studio with custom attention span calibrator (-5m/+5m), offline binaural sound synthesizers, and atomic habits.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Configure for Personal Flow</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

          </div>
        </section>

        {/* Dynamic Focus Area Guide Revealed Upon Role Selection */}
        {selectedRole && (
          <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 shadow-md space-y-6 animate-in fade-in duration-200">
            
            {/* Focus Area Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 uppercase">
                    Your Personalized Focus Guide
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    • Active Profile: <strong className="text-slate-900 dark:text-white capitalize">{selectedRole}</strong>
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {selectedRole === 'enterprise' && 'Enterprise Fleet Operational Playbook'}
                  {selectedRole === 'startup' && 'Startup Core Agile Sprint Playbook'}
                  {selectedRole === 'personal' && 'Personal Flow Mastery Playbook'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenManual(selectedRole)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Open Dedicated Manual</span>
                </button>

                <button
                  onClick={() => onEnterWorkspace(selectedRole === 'enterprise' ? 'enterprise' : 'planner')}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <span>Launch {selectedRole === 'enterprise' ? 'Enterprise' : selectedRole === 'startup' ? 'Startup' : 'Personal'} Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Specific Instructions for their Focus Area with Concrete Button Walkthroughs */}
            {selectedRole === 'enterprise' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Edit2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 1. "Edit" Employee Button (`Edit2`)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      In <strong>Enterprise</strong> &rarr; <strong>Team Workload & Capacity</strong>, click the pencil or <strong>Edit</strong> button next to any employee (e.g. Elena Rostova) to edit their legal name, corporate designation (e.g. Principal Architect), department, and weekly capacity hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" /> 2. Set Project Budget Amounts ($)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      In <strong>Projects</strong>, click the blue <strong>"New Project Initiative"</strong> (`+`) button to set the exact <strong>Budget Allocated Amount ($)</strong> (e.g. $50k to $500k). Live spent vs. allocated tracking rolls up into the department burn rate.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 3. "+ Add" Member Button
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click <strong>+ Add</strong> in the Team Workload card to scale enterprise headcount. Auto-generates a unique cryptographic SHA-256 room access key bounded to their department.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" /> 4. "Room Access Keys" (RBAC)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click <strong>Access Keys</strong> in the top navbar to manage and copy SHA-256 tokens per departmental chamber (Engineering, Product, Marketing, Ops) to isolate confidential roadmap initiatives.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'startup' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 1. "AI Schedule Planner" (Sparkles)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click the magic wand or <strong>AI Schedule Planner</strong> button to mathematically solve task constraints and auto-slot sprint backlog stories into open calendar blocks around meetings.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 2. "+ New Task" & Story Sizing
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click <strong>+ New Task</strong> in Tasks & Issues to size sprint stories, set duration estimates, assign engineers, and tag priority flags (Urgent, High, Medium, Low).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 3. Sprint Kanban Columns
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Drag or transition task cards across <strong>Backlog &rarr; Todo &rarr; In Progress &rarr; Review &rarr; Done</strong> for real-time standups and velocity tracking.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Key className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 4. Shared Squad Sprint Token
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Startup squads use the shared cryptographic token (<code className="font-mono text-[10px]">TIME-ROOM-StartupCore-...</code>) to sync and test without heavyweight user administration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 1. Attention Span Calibrator (-5m/+5m)
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      In <strong>Focus Studio</strong>, click <strong>-5m</strong> or <strong>+5m</strong> or input your exact stamina (e.g. 35m, 45m) and click "Save as Default" to calibrate timers to your natural biological rhythms.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 2. "Start Focus" & Live Navbar Pill
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click <strong>Start Focus</strong> (`Play`) to anchor deep work on a single task. The navbar button transforms into a live ticking countdown pill visible anywhere in the app.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 3. Ambient Audio Synthesizers
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Click White Noise, Pink Noise, Deep Theta (Binaural Beats), or Rain chips to generate 100% offline acoustic shielding synthesized in your browser's Web Audio API.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <strong className="text-slate-900 dark:text-white flex items-center gap-1.5 font-semibold">
                      <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 4. Habits & Evening Reflection
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Under <strong>Personal Growth</strong>, check off habits with 1-click circular buttons to increment streak flames, and log end-of-day energy and stress scores locally.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action to Enter Workspace */}
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-indigo-900 dark:text-indigo-200">
                <span>Ready to start organizing your day? Your mode has been switched to </span>
                <strong className="capitalize underline">{selectedRole}</strong>.
              </div>

              <button
                onClick={() => onEnterWorkspace(selectedRole === 'enterprise' ? 'enterprise' : 'planner')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Enter Workspace Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </section>
        )}

        {/* Feature Map / Quick Jump Highlights */}
        <section className="space-y-4 pt-2">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Explore All Prototype Modules
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Jump directly to any section of the application or use the top navigation buttons
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <button
              onClick={() => onEnterWorkspace('planner')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left space-y-1.5 transition-all shadow-2xs group"
            >
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Day Planner</div>
              <div className="text-[11px] text-slate-500">Constraint-solved time blocks</div>
            </button>

            <button
              onClick={() => onEnterWorkspace('tasks')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left space-y-1.5 transition-all shadow-2xs group"
            >
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Tasks & Kanban</div>
              <div className="text-[11px] text-slate-500">Backlog, issues & priorities</div>
            </button>

            <button
              onClick={() => onEnterWorkspace('focus')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left space-y-1.5 transition-all shadow-2xs group"
            >
              <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Focus Studio</div>
              <div className="text-[11px] text-slate-500">Calibrated Pomodoro & Audio</div>
            </button>

            <button
              onClick={() => onEnterWorkspace('enterprise')}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left space-y-1.5 transition-all shadow-2xs group"
            >
              <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-slate-900 dark:text-white">Enterprise OKRs</div>
              <div className="text-[11px] text-slate-500">Budgets & department keys</div>
            </button>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="pt-6 pb-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">TIME-CO Prototype</span>
            <span>•</span>
            <span>Built with care for every user</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenContactUs}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Contact & Review ({contactEmail})
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenManual()}
              className="text-slate-600 dark:text-slate-400 hover:underline"
            >
              Master Instruction Manual
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
