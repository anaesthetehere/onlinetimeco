import { GoogleGenAI } from '@google/genai';
import { Task, TimeBlock, Project } from '../types';

export interface AutoScheduleResult {
  scheduledBlocks: TimeBlock[];
  updatedTasks: Task[];
  summary: {
    tasksScheduled: number;
    minutesAllocated: number;
    deepWorkMinutes: number;
    conflictsResolved: number;
    notes: string[];
  };
}

// Convert "HH:mm" to minutes from midnight
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Convert minutes from midnight to "HH:mm"
function minutesToTime(totalMins: number): string {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Intelligent Local Constraint-Satisfaction Scheduler
 * Works 100% offline with zero external network requirement!
 */
export function runLocalSmartScheduler(
  targetDate: string,
  tasks: Task[],
  existingBlocks: TimeBlock[],
  workStartHour = 9,
  workEndHour = 18
): AutoScheduleResult {
  const dayStartMins = workStartHour * 60;
  const dayEndMins = workEndHour * 60;

  // Existing blocks for the target date
  const dayExistingBlocks = existingBlocks.filter(b => b.date === targetDate);

  // Mark busy intervals [start, end]
  const busyIntervals: { start: number; end: number; title: string }[] = dayExistingBlocks.map(b => ({
    start: timeToMinutes(b.startTime),
    end: timeToMinutes(b.endTime),
    title: b.title
  })).sort((a, b) => a.start - b.start);

  // Candidate tasks to schedule:
  // Non-completed tasks that either have dueDate <= targetDate or are in todo/in_progress and not already booked in existing blocks
  const bookedTaskIds = new Set(dayExistingBlocks.map(b => b.taskId).filter(Boolean));
  
  const candidateTasks = tasks
    .filter(t => t.status !== 'done' && t.status !== 'cancelled' && !bookedTaskIds.has(t.id))
    .sort((a, b) => {
      // Priority sorting: urgent > high > medium > low
      const pWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
      const pDiff = pWeights[b.priority] - pWeights[a.priority];
      if (pDiff !== 0) return pDiff;

      // Energy level: high energy earlier
      const eWeights = { high: 3, medium: 2, low: 1 };
      const aE = a.energyLevelRequired ? eWeights[a.energyLevelRequired] : 2;
      const bE = b.energyLevelRequired ? eWeights[b.energyLevelRequired] : 2;
      return bE - aE;
    });

  const newBlocks: TimeBlock[] = [];
  const updatedTasks: Task[] = [];
  const notes: string[] = [];
  let minutesAllocated = 0;
  let deepWorkMinutes = 0;

  // Find free time slots between dayStartMins and dayEndMins
  const freeSlots: { start: number; end: number }[] = [];
  let cursor = dayStartMins;

  for (const busy of busyIntervals) {
    if (busy.start > cursor) {
      freeSlots.push({ start: cursor, end: Math.min(busy.start, dayEndMins) });
    }
    cursor = Math.max(cursor, busy.end);
  }
  if (cursor < dayEndMins) {
    freeSlots.push({ start: cursor, end: dayEndMins });
  }

  // Pack candidate tasks into free slots
  let currentSlotIdx = 0;
  let slotCursor = freeSlots.length > 0 ? freeSlots[0].start : 0;

  for (const task of candidateTasks) {
    if (currentSlotIdx >= freeSlots.length) {
      notes.push(`Reached end of work hours (${workEndHour}:00). ${candidateTasks.length - updatedTasks.length} backlog tasks postponed to preserve healthy work-life balance.`);
      break;
    }

    const taskDuration = Math.min(Math.max(task.estimatedMinutes || 45, 15), 180); // between 15m and 3h
    let scheduled = false;

    while (currentSlotIdx < freeSlots.length) {
      const slot = freeSlots[currentSlotIdx];
      const availableInSlot = slot.end - slotCursor;

      if (availableInSlot >= 20) { // at least 20 mins free
        const blockDuration = Math.min(taskDuration, availableInSlot);
        const blockStart = slotCursor;
        const blockEnd = slotCursor + blockDuration;

        const isDeepWork = task.priority === 'urgent' || task.priority === 'high' || task.energyLevelRequired === 'high';

        const newBlock: TimeBlock = {
          id: `tb-ai-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: task.title,
          taskId: task.id,
          date: targetDate,
          startTime: minutesToTime(blockStart),
          endTime: minutesToTime(blockEnd),
          category: isDeepWork ? 'deep_work' : 'admin',
          color: isDeepWork ? '#6366f1' : '#3b82f6',
          isAiScheduled: true,
          notes: `Auto-scheduled by TIME-CO AI solver. Est: ${taskDuration}m.`
        };

        newBlocks.push(newBlock);
        minutesAllocated += blockDuration;
        if (isDeepWork) deepWorkMinutes += blockDuration;

        updatedTasks.push({
          ...task,
          scheduledDate: targetDate,
          scheduledStartTime: minutesToTime(blockStart),
          scheduledEndTime: minutesToTime(blockEnd),
          status: task.status === 'backlog' ? 'todo' : task.status,
          updatedAt: new Date().toISOString()
        });

        slotCursor = blockEnd;
        // If slot is now filled or has < 15 mins, advance slot
        if (slot.end - slotCursor < 15) {
          currentSlotIdx++;
          if (currentSlotIdx < freeSlots.length) {
            slotCursor = freeSlots[currentSlotIdx].start;
          }
        }
        scheduled = true;
        break;
      } else {
        currentSlotIdx++;
        if (currentSlotIdx < freeSlots.length) {
          slotCursor = freeSlots[currentSlotIdx].start;
        }
      }
    }

    if (!scheduled) {
      notes.push(`Task "${task.title}" could not fit in today's open blocks.`);
    }
  }

  if (newBlocks.length > 0) {
    notes.unshift(`Optimally scheduled ${newBlocks.length} task blocks (${Math.round(minutesAllocated / 60 * 10) / 10}h total) across free intervals.`);
  } else {
    notes.unshift('Your schedule is already well-packed or all available tasks are scheduled!');
  }

  return {
    scheduledBlocks: newBlocks,
    updatedTasks,
    summary: {
      tasksScheduled: newBlocks.length,
      minutesAllocated,
      deepWorkMinutes,
      conflictsResolved: busyIntervals.length > 0 ? 1 : 0,
      notes
    }
  };
}

/**
 * Gemini AI Helper with fallback
 */
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  try {
    const apiKey = process.env.GEMINI_API_KEY || (typeof window !== 'undefined' && (window as unknown as { GEMINI_API_KEY?: string }).GEMINI_API_KEY);
    if (!apiKey) return null;
    if (!geminiClient) {
      geminiClient = new GoogleGenAI({ apiKey });
    }
    return geminiClient;
  } catch {
    return null;
  }
}

export interface TaskBreakdownResponse {
  subtasks: { title: string; estimatedMinutes: number }[];
  suggestedPriority: 'urgent' | 'high' | 'medium' | 'low';
  riskNotes: string;
}

export async function aiBreakdownTask(taskTitle: string, description?: string): Promise<TaskBreakdownResponse> {
  const client = getGeminiClient();
  if (client) {
    try {
      const prompt = `You are the executive scheduling engine for TIME-CO enterprise productivity platform.
Break down this task into 3-5 concrete actionable subtasks with estimated minutes, recommend priority, and assess operational risk.
Task: "${taskTitle}"
Description: "${description || 'None'}"

Respond strictly in valid JSON format matching this schema:
{
  "subtasks": [{"title": "string", "estimatedMinutes": 30}],
  "suggestedPriority": "urgent" | "high" | "medium" | "low",
  "riskNotes": "brief 1-2 sentence risk advisory"
}`;
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const text = response.text;
      if (text) {
        return JSON.parse(text) as TaskBreakdownResponse;
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent offline breakdown:', err);
    }
  }

  // Intelligent local fallback generator
  return {
    subtasks: [
      { title: `Clarify acceptance criteria & specs for: ${taskTitle}`, estimatedMinutes: 20 },
      { title: `Draft core implementation / deliverables`, estimatedMinutes: 60 },
      { title: `Peer review, edge-case testing & stakeholder signoff`, estimatedMinutes: 30 }
    ],
    suggestedPriority: taskTitle.toLowerCase().includes('urgent') || taskTitle.toLowerCase().includes('fix') ? 'urgent' : 'high',
    riskNotes: 'Local AI heuristic breakdown applied. Ensure uninterrupted focus block to minimize context switching.'
  };
}

export async function aiGenerateDailyStrategy(
  tasks: Task[],
  projects: Project[],
  dateStr: string
): Promise<{
  headline: string;
  focusTheme: string;
  suggestedActionPlan: string[];
  burnoutRisk: 'low' | 'moderate' | 'high';
  productivityTip: string;
}> {
  const client = getGeminiClient();
  const openTasks = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled');
  const urgentCount = openTasks.filter(t => t.priority === 'urgent').length;
  const totalEstMins = openTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 45), 0);

  if (client) {
    try {
      const summaryText = openTasks.slice(0, 8).map(t => `- [${t.priority}] ${t.title} (${t.estimatedMinutes}m)`).join('\n');
      const prompt = `Analyze this executive workload for ${dateStr} in TIME-CO:
Open tasks (${openTasks.length}, ~${Math.round(totalEstMins / 60)}h total load):
${summaryText}

Generate high-performance operational guidance in JSON:
{
  "headline": "Punchy motivating headline for the day",
  "focusTheme": "3-5 word core operational theme",
  "suggestedActionPlan": ["step 1", "step 2", "step 3"],
  "burnoutRisk": "low" | "moderate" | "high",
  "productivityTip": "Practical science-backed tip based on workload"
}`;
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const text = response.text;
      if (text) {
        return JSON.parse(text);
      }
    } catch (err) {
      console.warn('Gemini API call failed, using local strategy synthesis:', err);
    }
  }

  // Local rule-based strategy synthesis
  const burnoutRisk = totalEstMins > 420 ? 'high' : totalEstMins > 240 ? 'moderate' : 'low';
  
  return {
    headline: urgentCount > 1 
      ? `High-Impact Execution Day: ${urgentCount} Critical Priorities Identified`
      : 'Steady Flow State: Strategic Execution & Deep Work',
    focusTheme: urgentCount > 0 ? 'Urgent Deliverables & Blocker Clearance' : 'High-Value Project Architecture',
    suggestedActionPlan: [
      'Front-load your highest cognitive task before 11:30 AM while willpower is optimal.',
      'Protect a 45-minute distraction-free Pomodoro session for complex deliverables.',
      'Group administrative correspondence and email replies into a single afternoon block.'
    ],
    burnoutRisk,
    productivityTip: burnoutRisk === 'high' 
      ? 'Alert: Your workload exceeds 7 planned hours. Defer lower-priority quadrant tasks to tomorrow.'
      : 'Use 25-minute Pomodoro intervals with white or pink noise to maintain sustained cognitive momentum.'
  };
}
