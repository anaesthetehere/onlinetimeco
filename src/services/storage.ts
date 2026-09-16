import { AppState, Department, Project, Task, TeamMember, TimeBlock, Habit, RiskItem, FocusSession } from '../types';
import { getInitialRoomKeys } from './accessKeyService';

const DB_NAME = 'time_co_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_state';
const LOCAL_STORAGE_FALLBACK_KEY = 'time_co_state_v1';

// Helper to format dates relative to today
export const getTodayString = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const getInitialData = (): AppState => {
  const today = getTodayString(0);
  const tomorrow = getTodayString(1);
  const dayAfter = getTodayString(2);
  const yesterday = getTodayString(-1);
  const twoDaysAgo = getTodayString(-2);

  const departments: Department[] = [
    {
      id: 'dept-eng',
      name: 'Engineering & Infrastructure',
      code: 'ENG',
      leadName: 'Alex Rivera (VP Eng)',
      color: '#3b82f6', // blue
      headcount: 34,
      quarterlyBudget: 480000,
      quarterlySpent: 312000,
      activeProjectsCount: 4,
      okrs: [
        {
          id: 'okr-eng-1',
          objective: 'Scale core distributed scheduling engine to 99.99% uptime',
          progress: 82,
          keyResults: [
            { id: 'kr-1', title: 'Reduce scheduler queue latency under 45ms', current: 38, target: 45, unit: 'ms' },
            { id: 'kr-2', title: 'Complete multi-region failover tests', current: 3, target: 4, unit: 'tests' }
          ]
        },
        {
          id: 'okr-eng-2',
          objective: 'Pass SOC2 Type II certification with zero critical findings',
          progress: 90,
          keyResults: [
            { id: 'kr-3', title: 'Remediate IAM privilege escalation items', current: 14, target: 14, unit: 'items' }
          ]
        }
      ]
    },
    {
      id: 'dept-prod',
      name: 'Product & Design',
      code: 'PROD',
      leadName: 'Elena Rostova (Head of Product)',
      color: '#8b5cf6', // purple
      headcount: 14,
      quarterlyBudget: 210000,
      quarterlySpent: 145000,
      activeProjectsCount: 3,
      okrs: [
        {
          id: 'okr-prod-1',
          objective: 'Launch AI Autopilot Calendar V2 for enterprise fleets',
          progress: 75,
          keyResults: [
            { id: 'kr-4', title: 'Beta test with 50 pilot enterprise accounts', current: 38, target: 50, unit: 'orgs' },
            { id: 'kr-5', title: 'Increase weekly active time-blockers by 40%', current: 28, target: 40, unit: '%' }
          ]
        }
      ]
    },
    {
      id: 'dept-mkt',
      name: 'Growth & Marketing',
      code: 'MKT',
      leadName: 'Marcus Vance (CMO)',
      color: '#ec4899', // pink
      headcount: 18,
      quarterlyBudget: 340000,
      quarterlySpent: 280000,
      activeProjectsCount: 2,
      okrs: [
        {
          id: 'okr-mkt-1',
          objective: 'Drive organic pipeline expansion for AI Productivity suite',
          progress: 68,
          keyResults: [
            { id: 'kr-6', title: 'Publish 8 high-intent technical case studies', current: 6, target: 8, unit: 'studies' },
            { id: 'kr-7', title: 'Achieve 150,000 monthly active demo runs', current: 112000, target: 150000, unit: 'users' }
          ]
        }
      ]
    },
    {
      id: 'dept-ops',
      name: 'Operations & Strategy',
      code: 'OPS',
      leadName: 'Sarah Jenkins (COO)',
      color: '#10b981', // emerald
      headcount: 9,
      quarterlyBudget: 150000,
      quarterlySpent: 89000,
      activeProjectsCount: 2,
      okrs: [
        {
          id: 'okr-ops-1',
          objective: 'Optimize inter-departmental deep work allocation',
          progress: 88,
          keyResults: [
            { id: 'kr-8', title: 'Enforce No-Meeting Focus Wednesdays company-wide', current: 92, target: 95, unit: '%' }
          ]
        }
      ]
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: 'tm-1',
      name: 'Elena Rostova',
      role: 'Head of Product & Strategy',
      email: 'elena@time-co.internal',
      departmentId: 'dept-prod',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      capacityHoursPerWeek: 40,
      currentWorkloadHours: 34,
      isOnline: true,
      accessKey: 'TIME-ROOM-ProdHub-7w3n8r1x-4f5e-P8L2'
    },
    {
      id: 'tm-2',
      name: 'Alex Rivera',
      role: 'Principal Systems Architect',
      email: 'alex@time-co.internal',
      departmentId: 'dept-eng',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      capacityHoursPerWeek: 40,
      currentWorkloadHours: 42, // high workload / alert
      isOnline: true,
      accessKey: 'TIME-ROOM-EngCore-4m9p2v8k-8c2d-E3W1'
    },
    {
      id: 'tm-3',
      name: 'Maya Lin',
      role: 'Staff ML & Optimization Engineer',
      email: 'maya@time-co.internal',
      departmentId: 'dept-eng',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      capacityHoursPerWeek: 40,
      currentWorkloadHours: 29,
      isOnline: true,
      accessKey: 'TIME-ROOM-EngCore-9k1x4w8m-2d7f-E9X4'
    },
    {
      id: 'tm-4',
      name: 'Marcus Vance',
      role: 'Growth Lead',
      email: 'marcus@time-co.internal',
      departmentId: 'dept-mkt',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      capacityHoursPerWeek: 35,
      currentWorkloadHours: 24,
      isOnline: false,
      accessKey: 'TIME-ROOM-GrowthHQ-2y5t9q6b-1a9c-M6K7'
    }
  ];

  const projects: Project[] = [
    {
      id: 'proj-1',
      name: 'Next-Gen Autonomous Time Engine',
      key: 'AUTO',
      description: 'Dynamic calendar solver using constraint satisfaction heuristics to auto-resolve meeting overlaps.',
      departmentId: 'dept-eng',
      color: '#6366f1',
      progress: 74,
      targetDate: dayAfter,
      status: 'active',
      leadId: 'tm-2',
      budgetAllocated: 120000,
      budgetSpent: 84000,
      sprint: 'Sprint 28'
    },
    {
      id: 'proj-2',
      name: 'Enterprise SOC2 Compliance Audit',
      key: 'SEC',
      description: 'Security controls, audit logs retention, encryption at rest and role-based policy enforcement.',
      departmentId: 'dept-eng',
      color: '#f59e0b',
      progress: 89,
      targetDate: tomorrow,
      status: 'active',
      leadId: 'tm-1',
      budgetAllocated: 45000,
      budgetSpent: 41000,
      sprint: 'Sprint 28'
    },
    {
      id: 'proj-3',
      name: 'Q3 Enterprise Product Launch',
      key: 'LAUNCH',
      description: 'Product marketing collaterals, press announcement, webinar series, and onboarding templates.',
      departmentId: 'dept-mkt',
      color: '#ec4899',
      progress: 55,
      targetDate: getTodayString(12),
      status: 'active',
      leadId: 'tm-4',
      budgetAllocated: 95000,
      budgetSpent: 52000,
      sprint: 'Sprint 29'
    }
  ];

  const tasks: Task[] = [
    {
      id: 'task-101',
      title: 'Finalize constraint matrix for time-blocking heuristics',
      description: 'Specify priority weightings, deep work buffer minimums, and lunch protection parameters.',
      status: 'in_progress',
      priority: 'urgent',
      quadrant: 'q1_do_first',
      estimatedMinutes: 90,
      actualMinutes: 45,
      dueDate: today,
      dueTime: '15:00',
      projectId: 'proj-1',
      departmentId: 'dept-eng',
      assignedTo: 'tm-2',
      tags: ['Algorithm', 'Heuristics', 'Critical'],
      subtasks: [
        { id: 'sub-1', title: 'Define buffer rules between consecutive meetings', completed: true },
        { id: 'sub-2', title: 'Integrate user circadian energy curve into time slots', completed: true },
        { id: 'sub-3', title: 'Benchmark solver latency under 100 concurrent tasks', completed: false }
      ],
      scheduledDate: today,
      scheduledStartTime: '10:00',
      scheduledEndTime: '11:30',
      energyLevelRequired: 'high',
      createdAt: yesterday,
      updatedAt: today
    },
    {
      id: 'task-102',
      title: 'Review and sign off SOC2 automated log retention policy',
      description: 'Ensure IndexedDB and cloud audit event pipelines conform to SOC2 Type II criteria.',
      status: 'todo',
      priority: 'high',
      quadrant: 'q1_do_first',
      estimatedMinutes: 60,
      dueDate: today,
      dueTime: '17:00',
      projectId: 'proj-2',
      departmentId: 'dept-eng',
      assignedTo: 'tm-1',
      tags: ['Security', 'Compliance'],
      subtasks: [
        { id: 'sub-4', title: 'Review hash validation for transaction logs', completed: false },
        { id: 'sub-5', title: 'Sign auditor approval manifest', completed: false }
      ],
      scheduledDate: today,
      scheduledStartTime: '14:00',
      scheduledEndTime: '15:00',
      energyLevelRequired: 'medium',
      createdAt: twoDaysAgo,
      updatedAt: today
    },
    {
      id: 'task-103',
      title: 'Draft Product Roadmap presentation for Enterprise Board',
      description: 'Highlight autonomous rescheduling ROI, focus time recovery metrics, and team collaboration.',
      status: 'in_progress',
      priority: 'high',
      quadrant: 'q2_schedule',
      estimatedMinutes: 120,
      dueDate: tomorrow,
      projectId: 'proj-1',
      departmentId: 'dept-prod',
      assignedTo: 'tm-1',
      tags: ['Strategy', 'Executive'],
      subtasks: [
        { id: 'sub-6', title: 'Extract time-saved metrics from beta cohort', completed: true },
        { id: 'sub-7', title: 'Create architecture diagram comparing Linear vs TIME-CO', completed: false }
      ],
      scheduledDate: today,
      scheduledStartTime: '15:30',
      scheduledEndTime: '17:00',
      energyLevelRequired: 'high',
      createdAt: yesterday,
      updatedAt: today
    },
    {
      id: 'task-104',
      title: 'Calibrate Pomodoro audio synthesizer waveforms',
      description: 'Implement pure Web Audio API synthesis for rain, pink noise, and delta focus waves.',
      status: 'done',
      priority: 'medium',
      quadrant: 'q2_schedule',
      estimatedMinutes: 75,
      actualMinutes: 70,
      dueDate: yesterday,
      completedAt: yesterday,
      projectId: 'proj-1',
      departmentId: 'dept-eng',
      assignedTo: 'tm-3',
      tags: ['Audio', 'UX', 'Focus'],
      subtasks: [
        { id: 'sub-8', title: 'Synthesize brownian noise buffer', completed: true },
        { id: 'sub-9', title: 'Create low-pass filter for binaural harmonics', completed: true }
      ],
      createdAt: twoDaysAgo,
      updatedAt: yesterday
    },
    {
      id: 'task-105',
      title: 'Analyze customer churn in low-focus team tier',
      description: 'Examine if teams with >15 hours of meetings weekly have higher task slippage rates.',
      status: 'backlog',
      priority: 'medium',
      quadrant: 'q2_schedule',
      estimatedMinutes: 90,
      dueDate: getTodayString(4),
      projectId: 'proj-3',
      departmentId: 'dept-mkt',
      assignedTo: 'tm-4',
      tags: ['Analytics', 'Growth'],
      subtasks: [],
      energyLevelRequired: 'medium',
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo
    },
    {
      id: 'task-106',
      title: 'Mitigate API rate limit fallback in offline mode',
      description: 'Provide heuristic local planner when network or AI API credentials are unconfigured.',
      status: 'in_progress',
      priority: 'urgent',
      quadrant: 'q1_do_first',
      estimatedMinutes: 60,
      dueDate: today,
      projectId: 'proj-1',
      departmentId: 'dept-eng',
      assignedTo: 'tm-3',
      tags: ['Offline', 'Resilience'],
      dependencies: ['task-101'],
      subtasks: [
        { id: 'sub-10', title: 'Build greedy interval-packing local algorithm', completed: true },
        { id: 'sub-11', title: 'Store schedules locally in IndexedDB', completed: true }
      ],
      scheduledDate: today,
      scheduledStartTime: '11:30',
      scheduledEndTime: '12:30',
      energyLevelRequired: 'high',
      createdAt: yesterday,
      updatedAt: today
    }
  ];

  const timeBlocks: TimeBlock[] = [
    {
      id: 'tb-1',
      title: 'Deep Work: Constraint Matrix & Heuristics',
      taskId: 'task-101',
      date: today,
      startTime: '10:00',
      endTime: '11:30',
      category: 'deep_work',
      color: '#6366f1',
      isAiScheduled: true,
      notes: 'Peak morning cognitive energy slot.'
    },
    {
      id: 'tb-2',
      title: 'Offline Resiliency Solver Architecture',
      taskId: 'task-106',
      date: today,
      startTime: '11:30',
      endTime: '12:30',
      category: 'deep_work',
      color: '#3b82f6',
      isAiScheduled: true
    },
    {
      id: 'tb-lunch',
      title: 'Mindful Lunch & Recovery Walk',
      date: today,
      startTime: '12:30',
      endTime: '13:30',
      category: 'break',
      color: '#10b981',
      notes: 'Protected buffer block.'
    },
    {
      id: 'tb-3',
      title: 'Security & SOC2 Audit Policy Review',
      taskId: 'task-102',
      date: today,
      startTime: '14:00',
      endTime: '15:00',
      category: 'review',
      color: '#f59e0b',
      isAiScheduled: true
    },
    {
      id: 'tb-4',
      title: 'Executive Board Deck Synthesis',
      taskId: 'task-103',
      date: today,
      startTime: '15:30',
      endTime: '17:00',
      category: 'deep_work',
      color: '#8b5cf6',
      isAiScheduled: true
    },
    {
      id: 'tb-tm-1',
      title: 'Sprint Planning & Dependency Alignment',
      date: tomorrow,
      startTime: '09:30',
      endTime: '10:30',
      category: 'meeting',
      color: '#ec4899',
      notes: 'Bi-weekly cross-functional sync.'
    }
  ];

  const focusSessions: FocusSession[] = [
    {
      id: 'fs-1',
      taskId: 'task-104',
      taskTitle: 'Calibrate Pomodoro audio synthesizer waveforms',
      durationMinutes: 25,
      type: 'pomodoro',
      timestamp: `${yesterday}T14:30:00Z`,
      rating: 5,
      notes: 'Clean flow state achieved with pink noise.'
    },
    {
      id: 'fs-2',
      durationMinutes: 5,
      type: 'short_break',
      timestamp: `${yesterday}T14:55:00Z`
    },
    {
      id: 'fs-3',
      taskId: 'task-101',
      taskTitle: 'Finalize constraint matrix for time-blocking heuristics',
      durationMinutes: 25,
      type: 'pomodoro',
      timestamp: `${today}T10:05:00Z`,
      rating: 4
    }
  ];

  const risks: RiskItem[] = [
    {
      id: 'risk-1',
      title: 'Scheduler constraint solver latency spike at peak hours',
      description: 'If hundreds of enterprise users trigger re-schedules simultaneously, serverless/local worker might experience throttling.',
      projectId: 'proj-1',
      departmentId: 'dept-eng',
      likelihood: 3,
      impact: 4,
      mitigationPlan: 'Implement debounced interval batching and client-side web-worker computation.',
      ownerId: 'tm-2',
      status: 'mitigating'
    },
    {
      id: 'risk-2',
      title: 'Departmental meeting creep eroding deep work bandwidth',
      description: 'Average engineer meeting load currently stands at 14.2 hours/week, 30% above healthy threshold.',
      projectId: 'proj-1',
      departmentId: 'dept-ops',
      likelihood: 4,
      impact: 4,
      mitigationPlan: 'Institute mandatory AI calendar audits and automated meeting duration truncations (45m -> 25m).',
      ownerId: 'tm-1',
      status: 'identified'
    },
    {
      id: 'risk-3',
      title: 'Third-party calendar token invalidation during multi-day offline mode',
      description: 'Tokens might expire while user is working disconnected, causing sync friction upon re-connection.',
      projectId: 'proj-1',
      departmentId: 'dept-eng',
      likelihood: 2,
      impact: 3,
      mitigationPlan: 'Store refresh queue in IndexedDB with optimistic lock and automated re-auth prompt.',
      ownerId: 'tm-3',
      status: 'resolved'
    }
  ];

  const habits: Habit[] = [
    {
      id: 'hab-1',
      title: 'Morning 90-min High Energy Deep Work Block',
      category: 'deep_work',
      frequency: 'weekdays',
      streak: 14,
      completedDates: [twoDaysAgo, yesterday, today]
    },
    {
      id: 'hab-2',
      title: 'Inbox Zero & Slack Triage Batch (Max 2x/day)',
      category: 'mindset',
      frequency: 'daily',
      streak: 9,
      completedDates: [twoDaysAgo, yesterday, today]
    },
    {
      id: 'hab-3',
      title: 'Post-lunch Physical Mobility / Eye Rest',
      category: 'health',
      frequency: 'daily',
      streak: 6,
      completedDates: [twoDaysAgo, yesterday]
    },
    {
      id: 'hab-4',
      title: 'Evening Daily Reflection & Next-Day Time Block Prep',
      category: 'deep_work',
      frequency: 'weekdays',
      streak: 11,
      completedDates: [twoDaysAgo, yesterday]
    }
  ];

  const reflections = [
    {
      date: yesterday,
      energyScore: 8,
      stressScore: 3,
      highlight: 'Successfully verified offline IndexedDB resilience and drafted sprint roadmap with team.',
      blockers: 'Slight meeting overrun in the early afternoon interrupted the deep work flow block.',
      tomorrowFocus: 'Finalize scheduling heuristics and conduct focus sprint on SOC2 compliance items.'
    }
  ];

  const auditLogs = [
    {
      id: 'audit-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      action: 'AI_SCHEDULE_OPTIMIZATION',
      entityType: 'schedule' as const,
      details: 'AI Autonomous Scheduler packed 4 tasks into open calendar gaps, saving an estimated 42 minutes of context switching.'
    },
    {
      id: 'audit-2',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      action: 'TASK_COMPLETED',
      entityType: 'task' as const,
      details: 'Task "Calibrate Pomodoro audio synthesizer waveforms" completed by Maya Lin.'
    },
    {
      id: 'audit-3',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      action: 'WORKSPACE_INITIALIZED',
      entityType: 'project' as const,
      details: 'TIME-CO local enterprise workspace established with full client-side persistence.'
    }
  ];

  return {
    tasks,
    projects,
    departments,
    teamMembers,
    timeBlocks,
    focusSessions,
    risks,
    habits,
    reflections,
    auditLogs,
    workspaceMode: 'enterprise',
    roomAccessKeys: getInitialRoomKeys(),
    unlockedRoomIds: ['dept-eng', 'dept-prod', 'dept-mkt', 'dept-ops'],
    activeAccessKey: 'TIME-ENT-RootAdm-9x8f2k4m-7a1b-X9Q4',
    customCategories: ['Strategy', 'Deep Architecture', 'Customer Discovery', 'Design System', 'Operations'],
    userProfile: {
      name: 'Alex Rivera',
      role: 'Principal Systems Architect & Lead',
      workStartHour: 9,
      workEndHour: 18,
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      customAttentionSpanMinutes: 25
    }
  };
};

// Open IndexedDB
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Upgrade helper to ensure backward compatibility with earlier saves
function ensureUpgrades(state: AppState): AppState {
  const initial = getInitialData();
  const roomAccessKeys = state.roomAccessKeys && state.roomAccessKeys.length > 0 
    ? state.roomAccessKeys 
    : getInitialRoomKeys();
  const customCategories = state.customCategories && state.customCategories.length > 0 
    ? state.customCategories 
    : ['Strategy', 'Deep Architecture', 'Customer Discovery', 'Design System', 'Operations'];
  const unlockedRoomIds = state.unlockedRoomIds || ['dept-eng', 'dept-prod', 'dept-mkt', 'dept-ops'];
  
  // Ensure team members have access keys
  const teamMembers = state.teamMembers.map(tm => {
    if (!tm.accessKey) {
      const match = initial.teamMembers.find(m => m.id === tm.id);
      return { ...tm, accessKey: match?.accessKey || `TIME-ROOM-${tm.name.replace(/\s+/g, '')}-7a2b-8c9d` };
    }
    return tm;
  });

  return {
    ...state,
    roomAccessKeys,
    customCategories,
    unlockedRoomIds,
    teamMembers,
    userProfile: {
      ...state.userProfile,
      customAttentionSpanMinutes: state.userProfile?.customAttentionSpanMinutes || 25
    }
  };
}

// Load state from IndexedDB or fallback to localStorage
export async function loadAppState(): Promise<AppState> {
  try {
    const db = await openDatabase();
    const result = await new Promise<AppState | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('current');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });

    if (result && result.tasks && result.projects) {
      return ensureUpgrades(result);
    }
  } catch (err) {
    console.warn('IndexedDB read failed, trying localStorage fallback:', err);
  }

  // Check localStorage fallback
  try {
    const local = localStorage.getItem(LOCAL_STORAGE_FALLBACK_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.tasks) return ensureUpgrades(parsed);
    }
  } catch (err) {
    console.warn('LocalStorage read failed:', err);
  }

  // First time load: initialize seed data
  const initial = getInitialData();
  await saveAppState(initial);
  return initial;
}

// Save state to IndexedDB and backup to localStorage
export async function saveAppState(state: AppState): Promise<void> {
  // Always mirror in localStorage for immediate sync
  try {
    localStorage.setItem(LOCAL_STORAGE_FALLBACK_KEY, JSON.stringify(state));
  } catch {
    // localStorage quota exceeded or disabled
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(state, 'current');
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB write failed:', err);
  }
}

// Export database to JSON file
export function exportStateAsJSON(state: AppState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `TIME-CO_backup_${getTodayString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Export tasks to CSV
export function exportTasksAsCSV(tasks: Task[]): void {
  const headers = ['ID', 'Title', 'Status', 'Priority', 'Quadrant', 'Estimate(m)', 'DueDate', 'Project', 'Tags'];
  const rows = tasks.map(t => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    t.status,
    t.priority,
    t.quadrant,
    t.estimatedMinutes,
    t.dueDate || '',
    t.projectId || '',
    `"${t.tags.join(', ')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `TIME-CO_tasks_${getTodayString()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}
