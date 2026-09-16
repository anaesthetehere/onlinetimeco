export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled';

export type EisenhowerQuadrant = 'q1_do_first' | 'q2_schedule' | 'q3_delegate' | 'q4_eliminate';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  quadrant: EisenhowerQuadrant;
  estimatedMinutes: number;
  actualMinutes?: number;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  projectId?: string;
  departmentId?: string;
  assignedTo?: string; // TeamMember id
  dependencies?: string[]; // Task IDs that this task depends on
  tags: string[];
  subtasks: Subtask[];
  scheduledDate?: string; // YYYY-MM-DD
  scheduledStartTime?: string; // HH:mm
  scheduledEndTime?: string; // HH:mm
  energyLevelRequired?: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  key: string; // e.g. "ENG-1"
  description: string;
  departmentId: string;
  color: string;
  progress: number; // 0-100
  targetDate: string;
  status: 'planning' | 'active' | 'at_risk' | 'completed';
  leadId: string;
  budgetAllocated: number;
  budgetSpent: number;
  sprint?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  leadName: string;
  color: string;
  headcount: number;
  quarterlyBudget: number;
  quarterlySpent: number;
  activeProjectsCount: number;
  okrs: OKR[];
}

export interface OKR {
  id: string;
  objective: string;
  keyResults: {
    id: string;
    title: string;
    current: number;
    target: number;
    unit: string;
  }[];
  progress: number; // 0-100
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  departmentId: string;
  avatar: string;
  capacityHoursPerWeek: number;
  currentWorkloadHours: number;
  isOnline: boolean;
}

export interface TimeBlock {
  id: string;
  title: string;
  taskId?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: 'deep_work' | 'meeting' | 'review' | 'admin' | 'break';
  color: string;
  isAiScheduled?: boolean;
  notes?: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  type: 'pomodoro' | 'short_break' | 'long_break';
  timestamp: string;
  notes?: string;
  rating?: number; // 1-5 rating of focus
}

export interface RiskItem {
  id: string;
  title: string;
  description: string;
  projectId: string;
  departmentId: string;
  likelihood: 1 | 2 | 3 | 4 | 5; // 1 lowest, 5 highest
  impact: 1 | 2 | 3 | 4 | 5;     // 1 lowest, 5 highest
  mitigationPlan: string;
  ownerId: string;
  status: 'identified' | 'mitigating' | 'resolved';
}

export interface Habit {
  id: string;
  title: string;
  category: 'deep_work' | 'health' | 'learning' | 'mindset';
  frequency: 'daily' | 'weekdays';
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  energyScore: number; // 1-10
  stressScore: number; // 1-10
  highlight: string;
  blockers: string;
  tomorrowFocus: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entityType: 'task' | 'project' | 'schedule' | 'focus' | 'risk';
  details: string;
  userId?: string;
}

export type WorkspaceMode = 'enterprise' | 'startup' | 'personal';

export interface AppState {
  tasks: Task[];
  projects: Project[];
  departments: Department[];
  teamMembers: TeamMember[];
  timeBlocks: TimeBlock[];
  focusSessions: FocusSession[];
  risks: RiskItem[];
  habits: Habit[];
  reflections: DailyReflection[];
  auditLogs: AuditLog[];
  workspaceMode: WorkspaceMode;
  userProfile: {
    name: string;
    role: string;
    workStartHour: number; // e.g. 9 for 9:00 AM
    workEndHour: number;   // e.g. 18 for 6:00 PM
    pomodoroLength: number; // 25
    shortBreakLength: number; // 5
    longBreakLength: number; // 15
  };
}
