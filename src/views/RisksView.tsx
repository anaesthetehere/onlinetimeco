import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  GitBranch, 
  Layers, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AppState, RiskItem } from '../types';

interface RisksViewProps {
  appState: AppState;
  onUpdateRisks: (risks: RiskItem[]) => void;
}

export const RisksView: React.FC<RisksViewProps> = ({ appState, onUpdateRisks }) => {
  const [isAddingRisk, setIsAddingRisk] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [likelihood, setLikelihood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [impact, setImpact] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [projectId, setProjectId] = useState(appState.projects[0]?.id || '');
  const [departmentId, setDepartmentId] = useState(appState.departments[0]?.id || '');

  // Detect task blockers
  const tasksWithDependencies = appState.tasks.filter(t => t.dependencies && t.dependencies.length > 0);
  const blockerAlerts: { blockedTaskTitle: string; blockerTaskTitle: string; isResolved: boolean }[] = [];

  tasksWithDependencies.forEach(t => {
    t.dependencies?.forEach(depId => {
      const blocker = appState.tasks.find(bt => bt.id === depId);
      if (blocker) {
        blockerAlerts.push({
          blockedTaskTitle: t.title,
          blockerTaskTitle: blocker.title,
          isResolved: blocker.status === 'done'
        });
      }
    });
  });

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRisk: RiskItem = {
      id: `risk-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      projectId,
      departmentId,
      likelihood,
      impact,
      mitigationPlan: mitigationPlan.trim() || 'Active mitigation monitoring under review.',
      ownerId: appState.teamMembers[0]?.id || 'tm-1',
      status: 'identified'
    };

    onUpdateRisks([...appState.risks, newRisk]);
    setIsAddingRisk(false);
    setTitle('');
    setDescription('');
    setMitigationPlan('');
  };

  const handleToggleStatus = (riskId: string) => {
    onUpdateRisks(appState.risks.map(r => {
      if (r.id === riskId) {
        const nextStatus = r.status === 'identified' ? 'mitigating' : r.status === 'mitigating' ? 'resolved' : 'identified';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const getRiskScoreBadge = (likelihood: number, impact: number) => {
    const score = likelihood * impact;
    if (score >= 15) return 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40';
    if (score >= 8) return 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40';
    return 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40';
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 space-y-5 sm:space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Risk & Dependency Radar</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
              Enterprise Risk 5x5
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify operational bottlenecks, critical dependency paths, and automated mitigation workflows
          </p>
        </div>

        <button
          onClick={() => setIsAddingRisk(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Identified Risk</span>
        </button>
      </div>

      {/* Blocker & Critical Path Alerts */}
      <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Critical Task Dependency Chain ({blockerAlerts.length} Tracked Links)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            {blockerAlerts.filter(b => !b.isResolved).length} Active Blockers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {blockerAlerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 shadow-2xs ${
                alert.isResolved
                  ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/40 text-rose-900 dark:text-rose-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-200 flex-wrap">
                  <span className="truncate max-w-[180px] sm:max-w-[200px]">{alert.blockerTaskTitle}</span>
                  <ArrowRight className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-[200px]">{alert.blockedTaskTitle}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {alert.isResolved ? '✓ Prerequisite resolved — dependency unblocked' : '⚠️ Dependent task cannot start until prerequisite completes'}
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                alert.isResolved ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-semibold'
              }`}>
                {alert.isResolved ? 'Resolved' : 'Blocking'}
              </span>
            </div>
          ))}

          {blockerAlerts.length === 0 && (
            <div className="col-span-2 py-4 text-center text-slate-400 dark:text-slate-500 text-xs">
              Zero dependency deadlocks detected. All tasks are freely actionable.
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: 5x5 Matrix & Risk Register */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left: 5x5 Likelihood x Impact Heatmap */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs overflow-x-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>5×5 Risk Exposure Matrix</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Severity = L × I</span>
          </div>

          {/* Matrix Grid */}
          <div className="min-w-[280px] space-y-1 text-center font-mono text-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Impact (1 to 5) →</div>
            {[5, 4, 3, 2, 1].map(l => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-4 text-[10px] text-slate-500 dark:text-slate-400 font-bold">{l}</span>
                {[1, 2, 3, 4, 5].map(i => {
                  const itemsInCell = appState.risks.filter(r => r.likelihood === l && r.impact === i);
                  const score = l * i;
                  let bgClass = 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800/80 text-slate-400';
                  if (score >= 15) bgClass = 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300';
                  else if (score >= 8) bgClass = 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300';
                  else bgClass = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300';

                  return (
                    <div
                      key={i}
                      className={`flex-1 h-9 sm:h-10 rounded-lg border flex items-center justify-center text-xs font-bold transition-all ${bgClass}`}
                      title={`Likelihood: ${l}, Impact: ${i} (${itemsInCell.length} risks)`}
                    >
                      {itemsInCell.length > 0 ? (
                        <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900/15 dark:bg-white/20 flex items-center justify-center text-slate-900 dark:text-white">
                          {itemsInCell.length}
                        </span>
                      ) : (
                        <span className="opacity-30 text-[10px]">{score}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-500 dark:text-slate-400">
              <span className="w-4">L↓</span>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex-1 font-bold">{i}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Risk Register Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Identified Enterprise Risks ({appState.risks.length})
          </div>

          {appState.risks.map(risk => {
            const score = risk.likelihood * risk.impact;

            return (
              <div
                key={risk.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-indigo-300 dark:hover:border-slate-700 transition-colors shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{risk.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{risk.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRiskScoreBadge(risk.likelihood, risk.impact)}`}>
                      Score: {score} (L{risk.likelihood} × I{risk.impact})
                    </span>
                    <button
                      onClick={() => handleToggleStatus(risk.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono capitalize transition-all cursor-pointer ${
                        risk.status === 'resolved'
                          ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40'
                          : risk.status === 'mitigating'
                          ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40'
                          : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/40'
                      }`}
                    >
                      {risk.status}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">Mitigation Strategy:</strong> {risk.mitigationPlan}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Risk Modal */}
      {isAddingRisk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <form
            onSubmit={handleCreateRisk}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Register Operational Risk</span>
              <button type="button" onClick={() => setIsAddingRisk(false)} className="text-slate-400 hover:text-slate-800 dark:hover:text-white">✕</button>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Risk Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Cross-region replication queue lag"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Risk Impact & Context</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the potential consequence to timeline or SLA..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Likelihood (1 to 5)</label>
                <select
                  value={likelihood}
                  onChange={(e) => setLikelihood(Number(e.target.value) as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>1 - Rare</option>
                  <option value={2}>2 - Unlikely</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={4}>4 - Likely</option>
                  <option value={5}>5 - Almost Certain</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Impact (1 to 5)</label>
                <select
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value) as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>1 - Negligible</option>
                  <option value={2}>2 - Minor</option>
                  <option value={3}>3 - Moderate</option>
                  <option value={4}>4 - Major</option>
                  <option value={5}>5 - Critical / Blocker</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">Mitigation Action Plan</label>
              <input
                type="text"
                value={mitigationPlan}
                onChange={(e) => setMitigationPlan(e.target.value)}
                placeholder="Specific architectural or managerial countermeasure..."
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingRisk(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30"
              >
                Save Risk Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
