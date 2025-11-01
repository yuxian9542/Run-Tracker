/**
 * Territory Runner - Type Definitions
 * 所有核心类型定义
 */

// 坐标点
export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number; // Unix timestamp (ms)
  accuracy?: number; // 精度（米）
}

// 跑步记录
export interface RunRecord {
  id: string; // UUID
  startedAt: number; // Unix timestamp (ms)
  endedAt: number; // Unix timestamp (ms)
  distance: number; // 距离（米）
  elapsedSec: number; // 有效跑步时长（秒）
  pace: number; // 配速（秒/公里）
  path: Coordinate[]; // 路径点数组
  pausedDuration?: number; // 暂停总时长（秒）
}

// 跑步状态
export type RunStatus = 'idle' | 'running' | 'paused';

// GPS 钩子返回类型
export interface UseGPSReturn {
  path: Coordinate[];
  distanceMeters: number;
  lastPosition: Coordinate | null;
  isTracking: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  clear: () => void;
}

// 计时器钩子返回类型
export interface UseTimerReturn {
  elapsedSec: number;
  status: 'idle' | 'running' | 'paused';
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

// 存储服务接口
export interface StorageService {
  saveRun: (record: RunRecord) => Promise<void>;
  getAllRuns: () => Promise<RunRecord[]>;
  getRunById: (id: string) => Promise<RunRecord | null>;
  deleteRun: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

// 统计数据
export interface RunStats {
  totalRuns: number;
  totalDistance: number; // 米
  totalDuration: number; // 秒
  avgPace: number; // 秒/公里
}
