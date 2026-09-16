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
  AlertTriangle,
  Key,
  Shield,
  Lock,
  Unlock,
  Copy,
  Check,
  Edit2,
  Trash2,
  UserPlus,
  X
} from 'lucide-react';
import { AppState, Department, TeamMember } from '../types';

interface EnterpriseViewProps {
  appState: AppState;
  onOpenAccessKeysModal?: () => void;
  onUpdateTeamMember?: (member: TeamMember) => void;
  onDeleteTeamMember?: (memberId: string) => void;
  onAddTeamMember?: (member: TeamMember) => void;
}

export const EnterpriseView: React.FC<EnterpriseViewProps> = ({
  appState,
  onOpenAccessKeysModal,
  onUpdateTeamMember,
  onDeleteTeamMember,
  onAddTeamMember
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(appState.departments[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Edit / Add Team Member state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAddingNewMember, setIsAddingNewMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberDeptId, setMemberDeptId] = useState('');
  const [memberCapacity, setMemberCapacity] = useState(40);
  const [memberEmail, setMemberEmail] = useState('');

  const openEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberName(member.name);
    setMemberRole(member.role);
    setMemberDeptId(member.departmentId);
    setMemberCapacity(member.capacityHoursPerWeek);
    setMemberEmail(member.email || '');
    setIsAddingNewMember(false);
  };

  const openAddMember = () => {
    setEditingMember(null);
    setMemberName('');
    setMemberRole('');
    setMemberDeptId(selectedDeptId || appState.departments[0]?.id || 'dept-eng');
    setMemberCapacity(40);
    setMemberEmail('');
    setIsAddingNewMember(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    if (isAddingNewMember) {
      const newMember: TeamMember = {
        id: `tm-${Date.now()}`,
        name: memberName.trim(),
        role: memberRole.trim() || 'Contributor',
        email: memberEmail.trim() || `${memberName.trim().toLowerCase().replace(/\s+/g, '.')}@acme-corp.internal`,
        departmentId: memberDeptId || appState.departments[0]?.id || 'dept-eng',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        capacityHoursPerWeek: Number(memberCapacity) || 40,
        currentWorkloadHours: 0,
        isOnline: true,
        accessKey: `TIME-ROOM-${(memberDeptId || 'General').substring(0, 4)}-${Math.random().toString(36).substring(2, 6)}-KEY`
      };
      onAddTeamMember?.(newMember);
    } else if (editingMember) {
      const updated: TeamMember = {
        ...editingMember,
        name: memberName.trim(),
        role: memberRole.trim() || 'Contributor',
        email: memberEmail.trim() || editingMember.email,
        departmentId: memberDeptId,
        capacityHoursPerWeek: Number(memberCapacity) || 40
      };
      onUpdateTeamMember?.(updated);
    }

    setEditingMember(null);
    setIsAddingNewMember(false);
  };

  const selectedDept = appState.departments.find(d => d.id === selectedDeptId) || appState.departments[0];
  const unlockedRoomIds = appState.unlockedRoomIds || ['dept-eng', 'dept-prod', 'dept-mkt', 'dept-ops'];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Total enterprise stats
  const totalHeadcount = appState.departments.reduce((acc, d) => acc + d.headcount, 0);
  const totalBudget = appState.departments.reduce((acc, d) => acc + d.quarterlyBudget, 0);
  const totalSpent = appState.departments.reduce((acc, d) => acc + d.quarterlySpent, 0);
  const budgetBurnRate = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 space-y-5 sm:space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">Enterprise Operations & OKRs</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
              Department Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Quarterly objectives, departmental resource allocation, headcount, and budget burn
          </p>
        </div>

        {/* Global KPI Summary & Access Keys CTA */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400">Total Headcount:</span>{' '}
            <strong className="text-slate-900 dark:text-white font-semibold">{totalHeadcount} FTEs</strong>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400">Q3 Budget Burn:</span>{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">${(totalSpent / 1000).toFixed(0)}k / ${(totalBudget / 1000).toFixed(0)}k ({budgetBurnRate}%)</strong>
          </div>
          {onOpenAccessKeysModal && (
            <button
              onClick={onOpenAccessKeysModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-sans font-medium transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Room Access Keys</span>
            </button>
          )}
        </div>
      </div>

      {/* Department Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {appState.departments.map(dept => {
          const isSelected = dept.id === selectedDept?.id;
          const deptSpentPercent = Math.round((dept.quarterlySpent / dept.quarterlyBudget) * 100);
          const isUnlocked = unlockedRoomIds.includes(dept.id);

          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all relative overflow-hidden shadow-xs cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-indigo-500 dark:border-indigo-500/80 shadow-md dark:shadow-lg dark:shadow-indigo-500/10'
                  : 'bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={{ color: dept.color, backgroundColor: `${dept.color}18` }}>
                  {dept.code}
                </span>
                <span className="text-[10px] font-mono flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  {isUnlocked ? (
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                      <Unlock className="w-2.5 h-2.5" /> Room Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                      <Lock className="w-2.5 h-2.5" /> Key Required
                    </span>
                  )}
                </span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">{dept.name}</div>
              <div className="mt-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Spent: ${dept.quarterlySpent.toLocaleString()}</span>
                <span>{deptSpentPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${deptSpentPercent}%`, backgroundColor: dept.color }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Department Deep-Dive */}
      {selectedDept && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left: Department Details & OKR List */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: selectedDept.color }} />
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedDept.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Lead: {selectedDept.leadName}</p>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                  {selectedDept.okrs.length} Active OKRs
                </div>
              </div>

              {/* OKRs */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Strategic Objectives & Key Results (Q3)</span>
                </div>

                {selectedDept.okrs.map(okr => (
                  <div key={okr.id} className="p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-xs leading-snug">{okr.objective}</h4>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                        {okr.progress}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${okr.progress}%` }} />
                    </div>

                    <div className="space-y-2 pt-1">
                      {okr.keyResults.map(kr => {
                        const krPct = Math.min(100, Math.round((kr.current / kr.target) * 100));
                        return (
                          <div key={kr.id} className="text-[11px] flex items-center justify-between text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2 sm:p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800/40 shadow-2xs">
                            <span className="truncate mr-3">{kr.title}</span>
                            <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0">
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
            <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Team Workload & Capacity</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openAddMember}
                    className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>+ Add</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Hours / Wk</span>
                </div>
              </div>

              <div className="space-y-3">
                {appState.teamMembers.map(member => {
                  const isOverload = member.currentWorkloadHours > member.capacityHoursPerWeek;
                  return (
                    <div key={member.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-2xs group relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                              <span>{member.name}</span>
                              <button
                                type="button"
                                onClick={() => openEditMember(member)}
                                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                title="Edit Name & Designation"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{member.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isOverload && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" /> High
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditMember(member)}
                            className="px-2 py-0.5 text-[10px] rounded bg-slate-200/70 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <span>Capacity Load</span>
                          <span className={isOverload ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                            {member.currentWorkloadHours}h / {member.capacityHoursPerWeek}h
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isOverload ? 'bg-rose-500' : 'bg-indigo-600 dark:bg-indigo-500'}`}
                            style={{ width: `${Math.min(100, (member.currentWorkloadHours / member.capacityHoursPerWeek) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Access Key Badge */}
                      {member.accessKey && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[10px] font-mono">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Key className="w-2.5 h-2.5 text-indigo-500" />
                            <span className="truncate max-w-[150px]">{member.accessKey}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(member.id, member.accessKey!)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Copy Access Key"
                          >
                            {copiedKey === member.id ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Team Member Modal */}
      {(editingMember || isAddingNewMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isAddingNewMember ? 'Add New Team Member' : `Edit Member: ${editingMember?.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => { setEditingMember(null); setIsAddingNewMember(false); }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Designation / Role Title</label>
                <input
                  type="text"
                  required
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="e.g. Head of Product & Strategy, VP of Design..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Department</label>
                  <select
                    value={memberDeptId}
                    onChange={(e) => setMemberDeptId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    {appState.departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Capacity (Hours/Week)</label>
                  <input
                    type="number"
                    min="5"
                    max="80"
                    value={memberCapacity}
                    onChange={(e) => setMemberCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Internal Corporate Email</label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="e.g. elena@time-co.internal"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                {editingMember && onDeleteTeamMember ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${editingMember.name} from team roster?`)) {
                        onDeleteTeamMember(editingMember.id);
                        setEditingMember(null);
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingMember(null); setIsAddingNewMember(false); }}
                    className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-xs"
                  >
                    {isAddingNewMember ? 'Add Member' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
