import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Music, 
  Star,
  Zap,
  Coffee,
  CloudRain,
  Radio,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppState, Task, FocusSession } from '../types';
import { ambientSoundEngine, AmbientSoundType } from '../services/audioSynthesizer';

interface FocusViewProps {
  appState: AppState;
  onSaveSession: (session: FocusSession) => void;
  onUpdateTasks: (tasks: Task[]) => void;
  initialTaskId?: string;
}

export const FocusView: React.FC<FocusViewProps> = ({
  appState,
  onSaveSession,
  onUpdateTasks,
  initialTaskId
}) => {
  const [sessionType, setSessionType] = useState<'pomodoro' | 'short_break' | 'long_break'>('pomodoro');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId || '');
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('rain');
  const [volume, setVolume] = useState(0.35);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [sessionRating, setSessionRating] = useState(5);
  const [sessionNotes, setSessionNotes] = useState('');

  // Switch durations when session type changes
  useEffect(() => {
    let mins = 25;
    if (sessionType === 'short_break') mins = 5;
    if (sessionType === 'long_break') mins = 15;
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsRunning(false);
  }, [sessionType]);

  // Timer Tick Interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      // Completed!
      handleSessionComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  // Ambient Sound Sync
  useEffect(() => {
    if (soundEnabled && isRunning) {
      ambientSoundEngine.playAmbient(ambientSound, volume);
    } else {
      ambientSoundEngine.stopAmbient();
    }
    return () => {
      ambientSoundEngine.stopAmbient();
    };
  }, [soundEnabled, ambientSound, isRunning]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    ambientSoundEngine.playChime();

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const linkedTask = appState.tasks.find(t => t.id === selectedTaskId);

    const newSession: FocusSession = {
      id: `fs-${Date.now()}`,
      taskId: selectedTaskId || undefined,
      taskTitle: linkedTask?.title,
      durationMinutes,
      type: sessionType,
      timestamp: new Date().toISOString(),
      rating: sessionRating,
      notes: sessionNotes || undefined
    };

    onSaveSession(newSession);

    // Update task actual minutes
    if (linkedTask) {
      onUpdateTasks(appState.tasks.map(t => {
        if (t.id === linkedTask.id) {
          return {
            ...t,
            actualMinutes: (t.actualMinutes || 0) + durationMinutes,
            updatedAt: new Date().toISOString().split('T')[0]
          };
        }
        return t;
      }));
    }
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientSoundEngine.setVolume(newVol);
  };

  const formatTime = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100;
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  const activeTask = appState.tasks.find(t => t.id === selectedTaskId);
  const openTasks = appState.tasks.filter(t => t.status !== 'done');

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-slate-950 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Pomodoro Focus Studio</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Web Audio Synthesizer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-distraction flow state chamber with generative ambient frequencies
          </p>
        </div>

        {/* Interval Mode Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setSessionType('pomodoro')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sessionType === 'pomodoro' ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => setSessionType('short_break')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sessionType === 'short_break' ? 'bg-emerald-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            5m Break
          </button>
          <button
            onClick={() => setSessionType('long_break')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sessionType === 'long_break' ? 'bg-cyan-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            15m Reset
          </button>
        </div>
      </div>

      {/* Main Center Studio */}
      <div className="max-w-4xl mx-auto w-full py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Circular Timer */}
        <div className="md:col-span-7 flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-2xl relative overflow-hidden">
          {/* Circular Countdown SVG */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background track */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Active progress */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className={sessionType === 'pomodoro' ? 'stroke-indigo-500' : 'stroke-emerald-400'}
                strokeWidth="8"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>

            {/* Centered Time readout */}
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-mono font-extrabold text-white tracking-tighter">
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 mt-1">
                {sessionType.replace('_', ' ')}
              </span>
              {isRunning && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> In Flow
                </span>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'Pause Flow' : 'Start Focus'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Sound Synthesizer & Linked Task */}
        <div className="md:col-span-5 space-y-4">
          {/* Linked Task Selector */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Focusing On Task</span>
              </span>
            </div>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Standalone Focus (No Task Linked) --</option>
              {openTasks.map(t => (
                <option key={t.id} value={t.id}>[{t.priority.toUpperCase()}] {t.title}</option>
              ))}
            </select>
            {activeTask && (
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300">
                <div className="font-semibold text-white truncate">{activeTask.title}</div>
                <div className="flex items-center gap-2 text-slate-400 mt-1 font-mono">
                  <span>Logged: {activeTask.actualMinutes || 0}m</span>
                  <span>/</span>
                  <span>Target: {activeTask.estimatedMinutes}m</span>
                </div>
              </div>
            )}
          </div>

          {/* Web Audio Synthesizer Controls */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">Ambient Sound Synthesizer</span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold flex items-center gap-1 ${
                  soundEnabled
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span>{soundEnabled ? 'ACTIVE' : 'MUTED'}</span>
              </button>
            </div>

            {/* Sound Profile Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'rain', label: 'Deep Rain', icon: CloudRain },
                { id: 'pink_noise', label: 'Pink Noise', icon: Radio },
                { id: 'binaural_alpha', label: 'Alpha Waves', icon: Zap },
                { id: 'deep_cafe', label: 'Cafe Ambience', icon: Coffee }
              ].map(item => {
                const Icon = item.icon;
                const isCurrent = ambientSound === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setAmbientSound(item.id as AmbientSoundType);
                      setSoundEnabled(true);
                    }}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      isCurrent && soundEnabled
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Volume slider */}
            <div className="pt-2 flex items-center gap-3">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 accent-indigo-500 bg-slate-800 rounded-lg h-1.5"
              />
              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Sessions Section */}
      <div className="max-w-4xl mx-auto w-full pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Completed Focus Logs ({appState.focusSessions.length})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {appState.focusSessions.slice(-6).reverse().map(s => (
            <div key={s.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white truncate">{s.taskTitle || 'Open Focus Block'}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{s.durationMinutes}m</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>{new Date(s.timestamp).toLocaleDateString()} {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="capitalize">{s.type.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
