import React, { useState } from 'react';
import { 
  Building2, 
  Rocket, 
  User, 
  Edit2, 
  UserPlus, 
  Trash2, 
  DollarSign, 
  Plus, 
  Key, 
  Shield, 
  Layers, 
  Workflow, 
  Clock, 
  Calendar, 
  Play, 
  CheckSquare, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  BookOpen, 
  ArrowRight, 
  Search, 
  Database, 
  Copy, 
  Check,
  ChevronRight,
  HelpCircle,
  Hash,
  Target
} from 'lucide-react';
import { WorkspaceMode } from '../types';

interface RolePlaybookProps {
  onOpenAccessKeysModal?: () => void;
  onNavigateView?: (view: string) => void;
}

/**
 * Enterprise Fleet Detailed Button-by-Button Guide & How-To Manual
 */
export const EnterprisePlaybookGuide: React.FC<RolePlaybookProps> = ({
  onOpenAccessKeysModal
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
      
      {/* Overview Card */}
      <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
          <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Enterprise Fleet Controls & Button Playbook</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          In an enterprise organization, governance requires granular management over personnel names, corporate designations, weekly bandwidth capacity, financial budget allocations, and cryptographic department isolation. This section provides an exact, button-by-button operating manual for your executive and PMO workflows.
        </p>
      </div>

      {/* DETAILED BUTTON GUIDE 1: EDIT EMPLOYEE NAMES, DESIGNATIONS & CAPACITY */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"Edit" Button & Pencil Icon (`Edit2`)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  Team Workload & Capacity
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Enterprise View</strong> in left sidebar &rarr; <strong>Team Workload & Capacity</strong> card (right column)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
            Enterprise Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Enterprise Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Enterprise PMOs and leadership constantly experience staffing re-allocations, promotions, title shifts, and contractor bandwidth adjustments. Rather than filing database tickets or contacting IT, executives can directly update staff records with immediate client-side IndexedDB persistence.
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Step-by-Step How-To: Editing Employee Names, Titles & Bandwidth
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>
                Click <strong>Enterprise</strong> in the left sidebar to enter the enterprise operations dashboard.
              </li>
              <li>
                In the right-hand panel titled <strong>"Team Workload & Capacity"</strong>, find the employee you wish to modify (e.g. <em>Elena Rostova</em> or <em>Marcus Chen</em>).
              </li>
              <li>
                Click either the <strong>pencil icon</strong> next to their name or the <strong>"Edit" button</strong> on their card.
              </li>
              <li>
                The <strong>"Edit Member"</strong> modal opens with the following fields:
                <ul className="pl-4 mt-1 space-y-1 list-disc text-[11px]">
                  <li><strong>Full Name:</strong> Edit the employee's name to correct typos or reassign the seat to a new staff member.</li>
                  <li><strong>Designation / Role Title:</strong> Update their official corporate role (e.g. <em>Head of Product</em>, <em>Principal Architect</em>, <em>Senior Security Auditor</em>).</li>
                  <li><strong>Department Dropdown:</strong> Reassign the employee to Engineering, Product, Marketing, or Operations.</li>
                  <li><strong>Capacity (Hours/Week):</strong> Adjust weekly committed hours (e.g. 40h standard, 20h part-time, or 45h crunch). The capacity meter automatically updates.</li>
                  <li><strong>Internal Corporate Email:</strong> Set or update their internal corporate contact address.</li>
                </ul>
              </li>
              <li>
                Click <strong>"Save Changes"</strong>. The employee's card, designation badge, and workload bar update instantly across the entire application.
              </li>
              <li>
                <em>Optional:</em> If an employee has departed, click the red <strong>"Delete"</strong> button inside the modal to permanently remove them from the enterprise roster.
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* DETAILED BUTTON GUIDE 2: ADD NEW TEAM MEMBERS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"+ Add" Team Member Button (`UserPlus`)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  Headcount Scaling
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Enterprise View</strong> &rarr; Top-right corner of <strong>Team Workload & Capacity</strong> card
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
            Enterprise Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Enterprise Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              When scaling new agile squads or onboarding enterprise contractors, directors need to add personnel to departmental chambers immediately. Creating a team member auto-provisions a cryptographic SHA-256 room access key specifically bounded to their designated department.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Step-by-Step How-To: Adding New Staff Members
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>Click <strong>+ Add</strong> in the header of the Team Workload & Capacity card.</li>
              <li>Input the candidate's <strong>Full Name</strong> and official <strong>Designation</strong>.</li>
              <li>Select their parent <strong>Department</strong> (Engineering, Product, Marketing, or Operations).</li>
              <li>Set their allocated <strong>Weekly Capacity Hours</strong> (e.g. 40h).</li>
              <li>Click <strong>"Add Member"</strong>. The new hire is immediately registered, their capacity meter is wired into enterprise stats, and their cryptographic access key is generated.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* DETAILED BUTTON GUIDE 3: SETTING PROJECT BUDGETS & FINANCIAL AMOUNTS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"New Project Initiative" & Budget Allocated Amount ($)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300">
                  Fiscal Governance
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Projects View</strong> in left sidebar &rarr; Blue <strong>"New Project Initiative"</strong> button (top right)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
            Enterprise Significance: Critical
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Enterprise Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Every enterprise project requires explicit capital allocation, sprint deadlines, and burn-down governance. Setting the exact dollar amount allows PMOs and finance controllers to monitor live expenditure burn rates across all strategic initiatives in real-time.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Step-by-Step How-To: Setting Project Budgets & Financial Allocations
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>Click <strong>Projects</strong> in the left navigation sidebar.</li>
              <li>Click the blue <strong>"New Project Initiative" (`+`)</strong> button in the top right corner.</li>
              <li>In the project configuration form:
                <ul className="pl-4 mt-1 space-y-1 list-disc text-[11px]">
                  <li>Enter <strong>Project Name</strong> (e.g. <em>NextGen Zero-Trust Core Architecture</em>).</li>
                  <li>Enter <strong>Project Key</strong> (e.g. <em>ZTRUST</em> or <em>CORE-Q3</em>).</li>
                  <li>Assign the <strong>Department</strong> responsible for this initiative.</li>
                  <li>In the <strong>"Budget Allocated ($)"</strong> input field, type the exact monetary allocation (e.g. <strong>$75,000</strong>, <strong>$150,000</strong>, or <strong>$500,000</strong>).</li>
                  <li>Set the active <strong>Sprint</strong> name and <strong>Target Completion Date</strong>.</li>
                </ul>
              </li>
              <li>Click <strong>"Create Project"</strong>.</li>
              <li>
                The created project card will immediately calculate and display:
                <span className="block mt-1 font-mono text-[10px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                  Budget: $0 spent / $75,000 allocated (0% burn) • Linear progress tracking
                </span>
              </li>
              <li>
                Return to the <strong>Enterprise View</strong> to observe how this project rolls up into the department's total <strong>Quarterly Budget Burn</strong> ($k spent / $k allocated).
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* DETAILED BUTTON GUIDE 4: DEPARTMENT CHAMBERS & ACCESS KEYS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"Room Access Keys" & Department Chamber Tabs</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  Zero-Trust Isolation
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Top Navigation Bar</strong> (`Key` icon) and <strong>Enterprise View</strong> header
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
            Enterprise Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Enterprise Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Enterprise Fleet partitions company state into distinct chambers (Engineering, Product, Marketing, Operations). Each chamber has its own SHA-256 room key. Clicking the department tab lets you switch focus and check OKRs, while the Access Keys modal allows security officers to copy and distribute chamber credentials.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Step-by-Step How-To: Access Keys & Chamber Status
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>In the <strong>Enterprise View</strong>, click between the 4 department cards (ENG, PROD, MKT, OPS) to switch active department context.</li>
              <li>Observe the <strong>"Room Active"</strong> or <strong>"Key Required"</strong> badge on each card.</li>
              <li>Click the <strong>"Room Access Keys"</strong> button in the top navbar (or in the enterprise header).</li>
              <li>In the modal, review the SHA-256 cryptographic keys generated for each department and each team member.</li>
              <li>Click the <strong>Copy icon</strong> next to any key to distribute it to authorized personnel.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};

/**
 * Startup Core Detailed Button-by-Button Guide & How-To Manual
 */
export const StartupPlaybookGuide: React.FC<RolePlaybookProps> = ({
  onOpenAccessKeysModal
}) => {
  return (
    <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
      
      {/* Overview Card */}
      <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
          <Rocket className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Startup Core Controls & Button Playbook</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          High-velocity startup squads must eliminate administrative friction. This playbook details every critical button for automated day scheduling, sprint Kanban task sizing, velocity tracking, and zero-login squad sync.
        </p>
      </div>

      {/* DETAILED BUTTON GUIDE 1: AI SCHEDULE PLANNER */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"Day Planner" Navigation & Time-Blocking</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  Capacity & Time-Blocking
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Left Sidebar</strong> and <strong>Day Planner</strong> view header
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
            Startup Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Startup Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Startups suffer from constant interruptions: unplanned standups, customer demos, and code reviews. Day planning lets you slot sprint backlog tasks into uninterrupted blocks around your fixed schedule with clear capacity meters.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Step-by-Step How-To: Setting Up Daily Time Blocks
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>Click <strong>Day Planner</strong> in the sidebar.</li>
              <li>Review the pending backlog tasks list and priority flags (Urgent, High, Medium).</li>
              <li>Add time blocks for your peak deep work windows with realistic buffer times.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* DETAILED BUTTON GUIDE 2: NEW SPRINT TASK & SIZING */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"+ New Task / Issue" & Kanban Board Buttons</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  Sprint Backlog
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Tasks & Issues</strong> in left sidebar &rarr; Blue <strong>"+ New Task"</strong> button
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
            Startup Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Startup Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides lightweight Linear-style issue tracking. Engineers can capture bug reports, feature requests, or technical debt without heavy JIRA overhead.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Step-by-Step How-To: Sizing & Moving Sprint Tasks
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>Click <strong>Tasks</strong> in the left sidebar.</li>
              <li>Click <strong>"+ New Task"</strong>.</li>
              <li>Enter Title, select Priority (Urgent, High, Medium, Low), set Estimated Duration (e.g. 45m, 90m), assign a squad member, and tag with project keys.</li>
              <li>During daily standup, drag cards or click status tags to transition items between <strong>Backlog &rarr; Todo &rarr; In Progress &rarr; Review &rarr; Done</strong>.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};

/**
 * Personal Flow Detailed Button-by-Button Guide & How-To Manual
 */
export const PersonalPlaybookGuide: React.FC<RolePlaybookProps> = () => {
  return (
    <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
      
      {/* Overview Card */}
      <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
          <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Personal Flow Controls & Button Playbook</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          For solo developers, students, and deep-work practitioners, productivity is about flow state and cognitive endurance. This guide explains every button for custom attention calibration, offline audio soundscapes, atomic habit tracking, and evening reflections.
        </p>
      </div>

      {/* DETAILED BUTTON GUIDE 1: ATTENTION SPAN CALIBRATOR & FOCUS TIMER */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"Start Focus" & Attention Span Calibrator (-5m / +5m)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                  Biological Flow
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Focus Studio</strong> in left sidebar & top navbar <strong>"Focus Mode"</strong> button
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
            Personal Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Personal Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard 25-minute Pomodoro timers are arbitrary and break flow when you are in the zone. The Attention Span Calibrator lets you calibrate focus intervals to your biological attention span (e.g. 35m, 45m, 50m) and save it as your personal profile.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Step-by-Step How-To: Calibrating Your Attention Span
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>Click <strong>Focus Mode</strong> in the top navbar or <strong>Focus Studio</strong> in the sidebar.</li>
              <li>Under <strong>"Attention Span Calibrator"</strong>, click <strong>-5m</strong> or <strong>+5m</strong>, or type an exact duration (e.g. 35 minutes).</li>
              <li>Click <strong>"Save as Default"</strong> to store your cognitive stamina setting in IndexedDB.</li>
              <li>Select a task to anchor your focus session.</li>
              <li>Click <strong>"Start Focus Session" (`Play`)</strong>. The top navbar button immediately converts into a live ticking countdown pill visible from any page.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* DETAILED BUTTON GUIDE 2: AMBIENT SOUNDSCAPE SYNTHESIZERS */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>Ambient Soundscape Chips (`White`, `Pink`, `Theta`, `Rain`)</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  Offline Audio Engine
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Focus Studio</strong> &rarr; <strong>Ambient Audio Synthesizer</strong> panel
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
            Personal Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Personal Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides acoustic shielding from noisy environments without opening third-party music streaming apps or requiring internet. Synthesized locally via the browser's Web Audio API.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Step-by-Step How-To: Synthesizing Soundscapes
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>In Focus Studio, click on any soundscape chip: <strong>White Noise</strong>, <strong>Pink Noise</strong>, <strong>Deep Theta (Binaural Beats)</strong>, or <strong>Rain</strong>.</li>
              <li>Adjust the volume slider to your desired decibel level.</li>
              <li>Click <strong>Mute / Stop</strong> anytime to silence the synthesizer.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* DETAILED BUTTON GUIDE 3: ATOMIC HABITS & DAILY REFLECTION */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <span>"+ Add Habit", Checkoff Circles & "Save Reflection"</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  Atomic Growth
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Location: <strong>Personal Growth</strong> view in left sidebar
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
            Personal Significance: High
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold block text-xs mb-1">
              Significance in Personal Level:
            </strong>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Builds consistent daily momentum with streak tracking (Deep Work, Reading, Health) and provides a secure, private end-of-day cognitive debrief (energy, stress, wins) that stays 100% on your device.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Step-by-Step How-To: Tracking Habits & Daily Reflections
            </span>
            <ol className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-decimal">
              <li>Click <strong>Personal Growth</strong> in the left sidebar.</li>
              <li>Click <strong>+ Add Habit</strong> to define a new routine (e.g. <em>2 Hours Deep Coding</em>, <em>Hydration</em>).</li>
              <li>Click the <strong>circular checkoff button</strong> on any habit to mark today complete. The flame streak icon increments immediately!</li>
              <li>At the end of your day, scroll down to the <strong>Daily Reflection</strong> card.</li>
              <li>Set your <strong>Energy Score</strong> (1-10) and <strong>Stress Score</strong> (1-10) using the interactive sliders.</li>
              <li>Type today's #1 win and tomorrow's top priority, then click <strong>"Save Daily Reflection"</strong>.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};

/**
 * Filterable Button Directory for What to Find Where tab
 */
export const RoleButtonsDirectory: React.FC<{
  currentRole: WorkspaceMode;
  onSelectRoleTab: (tier: 'enterprise' | 'startup' | 'personal') => void;
}> = ({ currentRole, onSelectRoleTab }) => {
  const [filter, setFilter] = useState<'all' | 'enterprise' | 'startup' | 'personal'>('all');

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 shrink-0">
          Filter By Role Level:
        </span>
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          All Buttons
        </button>
        <button
          onClick={() => setFilter('enterprise')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
            filter === 'enterprise'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>Enterprise Fleet Level</span>
        </button>
        <button
          onClick={() => setFilter('startup')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
            filter === 'startup'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
          }`}
        >
          <Rocket className="w-3 h-3" />
          <span>Startup Core Level</span>
        </button>
        <button
          onClick={() => setFilter('personal')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
            filter === 'personal'
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100'
          }`}
        >
          <User className="w-3 h-3" />
          <span>Personal Flow Level</span>
        </button>
      </div>

      {/* Directory Grid */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 text-xs">
        
        {/* ENTERPRISE: Edit Team Member */}
        {(filter === 'all' || filter === 'enterprise') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Edit2 className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">Edit Employee (`Edit2` / "Edit" Button)</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Enterprise Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Enterprise View &rarr; Team Workload & Capacity roster (right card).
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Lets executives edit employee names, designation title (e.g. VP, Architect), department assignment, weekly capacity hours (5-80h), and internal corporate email with zero IT wait.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('enterprise')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ENTERPRISE: + Add Team Member */}
        {(filter === 'all' || filter === 'enterprise') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <UserPlus className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">+ Add Member Button (`UserPlus`)</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Enterprise Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Enterprise View &rarr; Header of Team Workload & Capacity card.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Immediately provisions a new employee into the enterprise roster and auto-generates their departmental cryptographic access key.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('enterprise')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ENTERPRISE: New Project Initiative & Set Budget Amount */}
        {(filter === 'all' || filter === 'enterprise') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">New Project Initiative & Set Budget Amount ($)</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Enterprise Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Projects View &rarr; Top-right blue "New Project Initiative" button.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Enables PMOs to establish new initiatives, configure Project Keys (e.g. `CORE`), and define the exact <strong>Budget Allocated Amount ($)</strong> (e.g. $50,000 to $500,000) with live burn-down tracking.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('enterprise')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ENTERPRISE: Room Access Keys */}
        {(filter === 'all' || filter === 'enterprise') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Key className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">Room Access Keys Button (`Key` / `Shield`)</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Enterprise Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Top Navigation Bar and Enterprise View header.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Audits and copies SHA-256 room tokens to unlock specific departmental chambers (ENG, PROD, MKT, OPS) under zero-trust RBAC principles.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('enterprise')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* STARTUP: Day Planner */}
        {(filter === 'all' || filter === 'startup') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">Day Planner & Time Blocks</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Startup Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Sidebar navigation & Day Planner header.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Organizes daily capacity and arranges sprint backlog items into focused time slots with customized buffer times.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('startup')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* STARTUP: + New Task & Kanban */}
        {(filter === 'all' || filter === 'startup') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">+ New Task & Kanban Transition Handles</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Startup Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Tasks & Issues view in left sidebar.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Captures sprint stories with estimated duration, urgency tags, and moves items across 5 agile Kanban columns during daily standups.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('startup')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* PERSONAL: Focus Mode Start */}
        {(filter === 'all' || filter === 'personal') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Play className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">Start Focus & Live Pill (`Play` Button)</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Personal Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Top Navigation Bar and Focus Studio.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Starts the deep-work timer, anchoring your focus on a single task and displaying a live countdown ticking pill visible anywhere in the app.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('personal')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* PERSONAL: Attention Span Calibrator */}
        {(filter === 'all' || filter === 'personal') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Sliders className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">Attention Span Calibrator (-5m / +5m & Save as Default)</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Personal Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Focus Studio view.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Replaces rigid 25m Pomodoro timers with personalized intervals matching your biological cognitive stamina (e.g. 35m, 45m).
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('personal')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* PERSONAL: Soundscape Chips */}
        {(filter === 'all' || filter === 'personal') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Volume2 className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">Ambient Soundscape Chips (`White`, `Pink`, `Theta`, `Rain`)</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Personal Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Focus Studio &rarr; Ambient Audio Synthesizer.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Synthesizes real-time acoustic isolation audio offline in browser Web Audio without opening YouTube or Spotify.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('personal')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* PERSONAL: Habits & Reflection */}
        {(filter === 'all' || filter === 'personal') && (
          <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <CheckSquare className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 dark:text-white font-semibold">+ Add Habit, Checkoff Circles & Save Reflection</strong>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    Personal Level
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Location:</strong> Personal Growth view in left sidebar.
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  <strong>Significance & How-To:</strong> Tracks atomic habit completion with flame streak counters, and saves private daily mood/energy reflection logs locally.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectRoleTab('personal')}
              className="shrink-0 flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              <span>View Full Guide</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
