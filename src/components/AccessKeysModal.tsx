import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Plus, 
  Users, 
  UserCheck, 
  X, 
  AlertCircle,
  Building2,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { AppState, WorkspaceMode, RoomAccessKey } from '../types';
import { generateSecureAccessKey } from '../services/accessKeyService';

interface AccessKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  onSelectWorkspaceMode: (mode: WorkspaceMode) => void;
  onUpdateRoomKeys: (keys: RoomAccessKey[]) => void;
  onUnlockRoom: (roomId: string) => void;
  onSetActiveKey: (key: string) => void;
}

export const AccessKeysModal: React.FC<AccessKeysModalProps> = ({
  isOpen,
  onClose,
  appState,
  onSelectWorkspaceMode,
  onUpdateRoomKeys,
  onUnlockRoom,
  onSetActiveKey
}) => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [inputKey, setInputKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDeptId, setNewRoomDeptId] = useState(appState.departments[0]?.id || '');
  const [newRoomRole, setNewRoomRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [newRoomAssignee, setNewRoomAssignee] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const roomKeys = appState.roomAccessKeys || [];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleValidateAndApplyKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (!cleanKey) return;

    // Check if it's a Personal Master Key
    if (cleanKey.startsWith('TIME-PERS')) {
      onSelectWorkspaceMode('personal');
      onSetActiveKey(cleanKey);
      setStatusMessage({ type: 'success', text: 'Personal Flow Master Key verified. All rights granted with full root autonomy.' });
      setInputKey('');
      return;
    }

    // Check if it's a Startup Core Key
    if (cleanKey.startsWith('TIME-STUP')) {
      onSelectWorkspaceMode('startup');
      onSetActiveKey(cleanKey);
      setStatusMessage({ type: 'success', text: 'Startup Sprint Access Key authenticated. Team sprint workspace unlocked.' });
      setInputKey('');
      return;
    }

    // Check against registered room keys or enterprise root
    const matchedKey = roomKeys.find(k => k.accessKey.toLowerCase() === cleanKey.toLowerCase());
    if (matchedKey || cleanKey.startsWith('TIME-ENT') || cleanKey.startsWith('TIME-ROOM')) {
      onSelectWorkspaceMode('enterprise');
      onSetActiveKey(cleanKey);
      if (matchedKey?.departmentId) {
        onUnlockRoom(matchedKey.departmentId);
      }
      setStatusMessage({
        type: 'success',
        text: `Access Key authenticated for "${matchedKey ? matchedKey.roomName : 'Enterprise Fleet'}"! Permissions granted.`
      });
      setInputKey('');
      return;
    }

    setStatusMessage({
      type: 'error',
      text: 'Invalid or unrecognized cryptographic key format. Keys start with TIME-PERS-, TIME-STUP-, or TIME-ROOM-.'
    });
  };

  const handleCreateRoomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    const generatedKey = generateSecureAccessKey('ROOM', newRoomName);
    const newKeyItem: RoomAccessKey = {
      id: `key-${Date.now()}`,
      roomName: newRoomName.trim(),
      departmentId: newRoomDeptId || undefined,
      accessKey: generatedKey,
      role: newRoomRole,
      createdForName: newRoomAssignee.trim() || 'Assigned Room Member',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onUpdateRoomKeys([...roomKeys, newKeyItem]);
    if (newRoomDeptId) {
      onUnlockRoom(newRoomDeptId);
    }
    setNewRoomName('');
    setNewRoomAssignee('');
    setIsGenerating(false);
    setStatusMessage({ type: 'success', text: `Cryptographic Room Key generated for "${newKeyItem.roomName}".` });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Access Control & Room Keys</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                  Passwordless RBAC
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tier-specific privileges governed by unique cryptographic key strings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Status alert if any */}
          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2.5 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* 3 Tier Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Personal Tier */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              appState.workspaceMode === 'personal'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Personal Flow</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                  Full Rights
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                All rights given to the user. Private habits, personal focus, no room locks, solo operator sovereignty.
              </p>
            </div>

            {/* Startup Tier */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              appState.workspaceMode === 'startup'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Startup Core</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                  Sprint Key
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Lean collaboration. Anyone who enters the startup core key gets shared sprint access and milestone planning.
              </p>
            </div>

            {/* Enterprise Tier */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              appState.workspaceMode === 'enterprise'
                ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-500 ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Enterprise Fleet</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                  Room RBAC
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Multi-department security. People only get access to specific rooms when granted a unique room access key by the admin.
              </p>
            </div>
          </div>

          {/* Enter Access Key Form */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Authenticate / Enter Access Key</span>
            </h3>
            <form onSubmit={handleValidateAndApplyKey} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Paste key e.g. TIME-ROOM-EngCore-4m9p2v8k-... or TIME-PERS-..."
                className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Verify & Unlock</span>
              </button>
            </form>
          </div>

          {/* Active Room Keys Table & Generator */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Configured Cryptographic Keys ({roomKeys.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Unique character strings tough to decode, serving as secure passwordless grants
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGenerating(!isGenerating)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Issue New Room Key</span>
              </button>
            </div>

            {/* Create new room key form */}
            {isGenerating && (
              <form onSubmit={handleCreateRoomKey} className="mb-4 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800/60 space-y-3">
                <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Generate Cryptographic Room Key</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Room / Chamber Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mobile Architecture Room"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Assign to Person</label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins or Guest Architect"
                      value={newRoomAssignee}
                      onChange={(e) => setNewRoomAssignee(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Linked Department</label>
                    <select
                      value={newRoomDeptId}
                      onChange={(e) => setNewRoomDeptId(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="">Cross-Departmental / Global</option>
                      {appState.departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">Permission Role</label>
                    <select
                      value={newRoomRole}
                      onChange={(e) => setNewRoomRole(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    >
                      <option value="editor">Editor (Can create & edit tasks)</option>
                      <option value="viewer">Viewer (Read-only access)</option>
                      <option value="admin">Admin (Full room authority)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsGenerating(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Generate & Grant Key
                  </button>
                </div>
              </form>
            )}

            {/* List of Keys */}
            <div className="space-y-2">
              {roomKeys.map(k => {
                const isRevealed = revealedKeys[k.id] || false;
                const isCopied = copiedKeyId === k.id;
                const maskedKey = isRevealed
                  ? k.accessKey
                  : `${k.accessKey.substring(0, 14)}••••••••••••${k.accessKey.substring(k.accessKey.length - 4)}`;

                return (
                  <div
                    key={k.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">{k.roomName}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {k.role}
                        </span>
                        {k.createdForName && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            for {k.createdForName}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <code className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 select-all">
                          {maskedKey}
                        </code>
                        <button
                          type="button"
                          onClick={() => toggleReveal(k.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title={isRevealed ? 'Mask key' : 'Reveal full key'}
                        >
                          {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleCopy(k.id, k.accessKey)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Key</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Zero cloud credential leaks. All keys verified on-device via cryptographic entropy.</span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
