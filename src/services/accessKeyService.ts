import { RoomAccessKey, WorkspaceMode } from '../types';

/**
 * High-Entropy Cryptographic Access Key Generator
 * Generates difficult-to-decode, unique token strings for rooms and workspaces.
 * Format: TIME-{TIER}-{ROOM_OR_HASH}-{ENTROPY_BLOCKS}
 */
export function generateSecureAccessKey(
  type: 'PERS' | 'STUP' | 'ENT' | 'ROOM',
  label?: string
): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnopqrstuvwxyz';
  const getRandomChunk = (len: number) => {
    let result = '';
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const buffer = new Uint8Array(len);
      window.crypto.getRandomValues(buffer);
      for (let i = 0; i < len; i++) {
        result += chars[buffer[i] % chars.length];
      }
    } else {
      for (let i = 0; i < len; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    return result;
  };

  const timestampSegment = Date.now().toString(36).toUpperCase();
  const chunk1 = getRandomChunk(8);
  const chunk2 = getRandomChunk(6);
  const chunk3 = getRandomChunk(4);

  return `TIME-${type}-${chunk1}-${timestampSegment}-${chunk2}-${chunk3}`;
}

export function getInitialRoomKeys(): RoomAccessKey[] {
  return [
    {
      id: 'key-ent-admin',
      roomName: 'Enterprise Fleet (Root Admin Access)',
      role: 'admin',
      accessKey: 'TIME-ENT-RootAdm-9x8f2k4m-7a1b-X9Q4',
      createdForName: 'Fleet Commander (Admin)',
      createdAt: '2026-09-01'
    },
    {
      id: 'key-eng-room',
      roomName: 'Engineering & Architecture Room',
      departmentId: 'dept-eng',
      role: 'editor',
      accessKey: 'TIME-ROOM-EngCore-4m9p2v8k-8c2d-E3W1',
      createdForName: 'Alex Rivera',
      createdAt: '2026-09-02'
    },
    {
      id: 'key-prod-room',
      roomName: 'Product Strategy & Roadmaps Room',
      departmentId: 'dept-prod',
      role: 'editor',
      accessKey: 'TIME-ROOM-ProdHub-7w3n8r1x-4f5e-P8L2',
      createdForName: 'Elena Rostova',
      createdAt: '2026-09-02'
    },
    {
      id: 'key-mkt-room',
      roomName: 'Growth & Marketing Chamber',
      departmentId: 'dept-mkt',
      role: 'viewer',
      accessKey: 'TIME-ROOM-GrowthHQ-2y5t9q6b-1a9c-M6K7',
      createdForName: 'Marcus Vance',
      createdAt: '2026-09-05'
    },
    {
      id: 'key-ops-room',
      roomName: 'Global Operations & Finance Room',
      departmentId: 'dept-ops',
      role: 'editor',
      accessKey: 'TIME-ROOM-OpsVault-5u1j4s8w-9d3f-O2N5',
      createdForName: 'Sarah Jenkins',
      createdAt: '2026-09-08'
    },
    {
      id: 'key-startup-room',
      roomName: 'Startup Core (Sprint Room)',
      role: 'admin',
      accessKey: 'TIME-STUP-CoreTeam-3z7x9v2k-6e4a-S1F8',
      createdForName: 'Founding Team',
      createdAt: '2026-09-10'
    },
    {
      id: 'key-personal-flow',
      roomName: 'Personal Flow (Private Master Key)',
      role: 'admin',
      accessKey: 'TIME-PERS-SoloMaster-8k2p4m9x-5b1c-P0R9',
      createdForName: 'Solo Operator (All Rights Granted)',
      createdAt: '2026-09-10'
    }
  ];
}
