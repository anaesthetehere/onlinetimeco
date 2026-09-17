import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckSquare, 
  Calendar, 
  Timer, 
  Briefcase, 
  Building2, 
  AlertTriangle, 
  HeartHandshake, 
  Key, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  Clock, 
  Layers, 
  Play, 
  ShieldCheck, 
  Volume2, 
  DollarSign, 
  Users, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ActiveView } from './Sidebar';

interface PageDepictionsShowcaseProps {
  onSelectView: (view: ActiveView) => void;
}

export const PageDepictionsShowcase: React.FC<PageDepictionsShowcaseProps> = ({
  onSelectView
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'planning' | 'execution' | 'enterprise'>('all');

  const depictions = [
    {
      id: 'planner' as ActiveView,
      category: 'planning',
      title: 'Day Planner & Time-Blocking Timeline',
      badge: 'Workload Capacity & Slots',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      icon: Clock,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      description: 'How users plan their day: Allocate deep work intervals and meetings around daily workload capacity with zero server tracking.',
      mockup: (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-slate-100 text-[11px] font-mono space-y-2 select-none shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Clock className="w-3.5 h-3.5" /> 1.5h Allocated • 0.5h Deep Work
            </span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px]">
              Optimal Pacing
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 rounded-lg bg-indigo-950/80 border border-indigo-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">09:00 - 09:45 AM</div>
                <div className="text-[10px] text-indigo-200">Finalize constraint matrix for time-blocking</div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[9px]">Deep Work</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">10:00 - 10:45 AM</div>
                <div className="text-[10px] text-slate-300">Sprint Planning & Dependency Alignment</div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px]">Meeting</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tasks' as ActiveView,
      category: 'execution',
      title: 'Eisenhower Matrix & Linear Issues',
      badge: 'Q1-Q4 Priority Grid',
      badgeColor: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      icon: CheckSquare,
      iconColor: 'text-rose-600 dark:text-rose-400',
      description: 'How users prioritize work: Quadrants organize urgent vs. strategic items with estimated minutes, energy levels, and 1-click status toggles.',
      mockup: (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-slate-100 text-[11px] space-y-2 select-none shadow-inner">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 font-mono text-[10px]">
            <span className="text-rose-400 font-bold">Q1: DO FIRST (Urgent & High Impact)</span>
            <span>2 Tasks Active</span>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-white text-[11px] font-medium">Finalize constraint matrix for heuristics</span>
              </div>
              <span className="px-1.5 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300 text-[9px]">45m</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0" />
                <span className="text-white text-[11px] font-medium">Finalize client budget & deliverables</span>
              </div>
              <span className="px-1.5 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 text-[9px]">60m</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'calendar' as ActiveView,
      category: 'planning',
      title: 'Weekly Calendar & Time Blocking',
      badge: 'Visual Flow Schedule',
      badgeColor: 'bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      icon: Calendar,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      description: 'How users block their week: Visual calendar showing protected deep work chunks, team syncs, and healthy mindful recovery breaks.',
      mockup: (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-slate-100 text-[11px] space-y-2 select-none shadow-inner">
          <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[9px] text-slate-400 border-b border-slate-800 pb-1">
            <span>MON</span><span className="text-cyan-400 font-bold">TUE (Today)</span><span>WED</span><span>THU</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-20">
            <div className="bg-indigo-950/60 border border-indigo-800/60 rounded p-1 text-[9px] text-indigo-300">
              Deep Focus Block
            </div>
            <div className="space-y-1">
              <div className="bg-indigo-600 text-white rounded p-1 text-[9px] font-semibold">
                09:00 Matrix
              </div>
              <div className="bg-emerald-950/70 border border-emerald-800 rounded p-1 text-[8px] text-emerald-300">
                12:30 Recovery
              </div>
            </div>
            <div className="bg-blue-950/60 border border-blue-800/60 rounded p-1 text-[9px] text-blue-300">
              Sprint Sync
            </div>
            <div className="bg-indigo-950/60 border border-indigo-800/60 rounded p-1 text-[9px] text-indigo-300">
              Architecture
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'focus' as ActiveView,
      category: 'execution',
      title: 'Pomodoro Focus Studio',
      badge: 'Offline Audio Synthesizer',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      icon: Timer,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      description: 'How users sustain attention: Circular flow timer (25:00), custom attention span calibration (-5m/+5m), and offline Web Audio pink noise.',
      mockup: (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-slate-100 text-[11px] flex items-center justify-between gap-3 select-none shadow-inner">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex flex-col items-center justify-center shrink-0">
            <span className="font-mono text-xs font-bold text-white">25:00</span>
            <span className="text-[8px] text-emerald-300">Flow</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-bold text-white text-xs">Active Task Anchor</div>
            <div className="text-[10px] text-slate-400 truncate">Finalize constraint matrix</div>
            <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
              <Volume2 className="w-3 h-3" /> Synthesizer: Deep Rain
            </div>
          </div>
          <span className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 shadow-xs">
            <Play className="w-3.5 h-3.5" />
          </span>
        </div>
      )
    },
    {
      id: 'projects' as ActiveView,
      category: 'enterprise',
      title: 'Projects & Sprint Roadmaps',
      badge: 'Budget & Burn Tracking',
      badgeColor: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      icon: Briefcase,
      iconColor: 'text-amber-600 dark:text-amber-400',
      description: 'How founders & PMs manage velocity: Tracks Next-Gen Time Engine and SOC2 initiatives with live $ spend vs. budget meters.',
      mockup: (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-slate-100 text-[11px] space-y-2 select-none shadow-inner">
          <div className="flex items-center justify-between font-mono text-[10px] border-b border-slate-800 pb-1">
            <span className="text-white font-bold">Next-Gen Autonomous Time Engine</span>
            <span className="text-emerald-400 font-bold">65% Done</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }} />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Budget: $80,000 / $120,000</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300">Sprint 28</span>
          </div>
        </div>
      )
    },
    {
      id: 'personal' as ActiveView,
      category: 'execution',
      title: 'Personal Habits & Daily Journal',
      badge: '15d Streak & Real Reflection',
      badgeColor: 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      icon: HeartHandshake,
      iconColor: 'text-orange-600 dark:text-orange-400',
      description: 'Real user reflections from prototype: Users log streak flames, daily energy scores, and journal blockers ("Procrastination", "Diary writing").',
      mockup: (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 text-slate-100 text-[11px] space-y-2 select-none shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span className="font-bold text-white text-xs">Morning Deep Work</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-orange-950 text-orange-300 font-mono text-[9px] font-bold">
              15d Streak 🔥
            </span>
          </div>
          <div className="p-2 rounded bg-slate-800/80 border border-slate-700/80 text-[10px] space-y-1 text-slate-300">
            <div><strong>Highlight:</strong> "Built a system"</div>
            <div><strong>Blocker:</strong> "Procrastination resolved"</div>
            <div><strong>Tomorrow:</strong> "Diary writing & focus"</div>
          </div>
        </div>
      )
    }
  ];

  const filteredDepictions = activeCategory === 'all' 
    ? depictions 
    : depictions.filter(d => d.category === activeCategory);

  return (
    <div className="space-y-4">
      {/* Category filter pills */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Depictions of How Users Have Already Used Each Page
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real workflows captured from actual user prototypes. Click any depiction to travel straight to that page.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Pages ({depictions.length})
          </button>
          <button
            onClick={() => setActiveCategory('planning')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === 'planning'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Planning
          </button>
          <button
            onClick={() => setActiveCategory('execution')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === 'execution'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Execution
          </button>
          <button
            onClick={() => setActiveCategory('enterprise')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeCategory === 'enterprise'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Enterprise
          </button>
        </div>
      </div>

      {/* Grid of Depictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepictions.map((depict) => {
          const Icon = depict.icon;
          return (
            <div
              key={depict.id}
              onClick={() => onSelectView(depict.id)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 flex flex-col justify-between space-y-3 transition-all cursor-pointer shadow-xs hover:shadow-md group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${depict.iconColor}`} />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {depict.title}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono border font-semibold ${depict.badgeColor}`}>
                    {depict.badge}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {depict.description}
                </p>

                {/* Real Mockup Depiction */}
                <div className="pt-1">
                  {depict.mockup}
                </div>
              </div>

              {/* Action link */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                <span>Open This Page</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
