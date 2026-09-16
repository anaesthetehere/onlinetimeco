import React, { useState } from 'react';
import { 
  Building2, 
  Target, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight,
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AppState, Department } from '../types';

interface EnterpriseViewProps {
  appState: AppState;
}

export const EnterpriseView: React.FC<EnterpriseViewProps> = ({ appState }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(appState.departments[0]?.id || '');

  const selectedDept = appState.departments.find(d => d.id === selectedDeptId) || appState.departments[0];

  // Total enterprise stats
  const totalHeadcount = appState.departments.reduce((acc, d) => acc + d.headcount, 0);
  const totalBudget = appState.departments.reduce((acc, d) => acc + d.quarterlyBudget, 0);
  const totalSpent = appState.departments.reduce((acc, d) => acc + d.quarterlySpent, 0);
  const budgetBurnRate = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-950 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Enterprise Operations & OKRs</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Department Hub
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Quarterly objectives, departmental resource allocation, headcount, and budget burn
          </p>
        </div>

        {/* Global KPI Summary */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Total Headcount:</span>{' '}
            <strong className="text-white">{totalHeadcount} FTEs</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Q3 Budget Burn:</span>{' '}
            <strong className="text-emerald-400">${(totalSpent / 1000).toFixed(0)}k / ${(totalBudget / 1000).toFixed(0)}k ({budgetBurnRate}%)</strong>
          </div>
        </div>
      </div>

      {/* Department Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {appState.departments.map(dept => {
          const isSelected = dept.id === selectedDept?.id;
          const deptSpentPercent = Math.round((dept.quarterlySpent / dept.quarterlyBudget) * 100);

          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={{ color: dept.color, backgroundColor: `${dept.color}20` }}>
                  {dept.code}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{dept.headcount} Team</span>
              </div>
              <div className="font-bold text-white text-xs truncate">{dept.name}</div>
              <div className="mt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Spent: ${dept.quarterlySpent.toLocaleString()}</span>
                <span>{deptSpentPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${deptSpentPercent}%`, backgroundColor: dept.color }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Department Deep-Dive */}
      {selectedDept && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Department Details & OKR List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedDept.color }} />
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedDept.name}</h2>
                    <p className="text-xs text-slate-400 font-mono">Lead: {selectedDept.leadName}</p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">
                  {selectedDept.okrs.length} Active OKRs
                </div>
              </div>

              {/* OKRs */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-400" />
                  <span>Strategic Objectives & Key Results (Q3)</span>
                </div>

                {selectedDept.okrs.map(okr => (
                  <div key={okr.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-white text-xs leading-snug">{okr.objective}</h4>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300">
                        {okr.progress}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${okr.progress}%` }} />
                    </div>

                    <div className="space-y-2 pt-1">
                      {okr.keyResults.map(kr => {
                        const krPct = Math.min(100, Math.round((kr.current / kr.target) * 100));
                        return (
                          <div key={kr.id} className="text-[11px] flex items-center justify-between text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                            <span className="truncate mr-3">{kr.title}</span>
                            <span className="font-mono text-slate-400 shrink-0">
                              {kr.current} / {kr.target} {kr.unit} ({krPct}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Department Team Members & Workload */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Team Workload & Capacity</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Hours / Wk</span>
              </div>

              <div className="space-y-3">
                {appState.teamMembers.map(member => {
                  const isOverload = member.currentWorkloadHours > member.capacityHoursPerWeek;
                  return (
                    <div key={member.id} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700" />
                          <div>
                            <div className="font-semibold text-white text-xs">{member.name}</div>
                            <div className="text-[10px] text-slate-400">{member.role}</div>
                          </div>
                        </div>
                        {isOverload && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5" /> High
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>Capacity Load</span>
                          <span className={isOverload ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {member.currentWorkloadHours}h / {member.capacityHoursPerWeek}h
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isOverload ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.min(100, (member.currentWorkloadHours / member.capacityHoursPerWeek) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
