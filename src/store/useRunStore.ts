/**
 * Territory Runner - Zustand Store (Optional)
 * 全局状态管理：使用 Zustand
 * 
 * 注意：本项目 Hooks 已足够简单，Zustand 为可选项
 * 如果不需要全局状态，可以直接在各组件中使用 Hooks
 */

import { create } from 'zustand';
import { RunStatus, Coordinate } from '../types';

interface RunState {
  // 跑步状态
  status: RunStatus;
  
  // 时间相关
  elapsedSec: number;
  startedAt: number | null;
  pausedDuration: number;
  
  // GPS 相关
  path: Coordinate[];
  distanceMeters: number;
  lastPosition: Coordinate | null;
  
  // UI 状态
  isGPSReady: boolean;
  error: string | null;
  
  // Actions
  setStatus: (status: RunStatus) => void;
  setElapsedSec: (sec: number) => void;
  setStartedAt: (timestamp: number | null) => void;
  setPausedDuration: (duration: number) => void;
  setPath: (path: Coordinate[]) => void;
  setDistanceMeters: (distance: number) => void;
  setLastPosition: (position: Coordinate | null) => void;
  setIsGPSReady: (ready: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  status: 'idle' as RunStatus,
  elapsedSec: 0,
  startedAt: null,
  pausedDuration: 0,
  path: [],
  distanceMeters: 0,
  lastPosition: null,
  isGPSReady: false,
  error: null,
};

export const useRunStore = create<RunState>((set) => ({
  ...initialState,

  setStatus: (status) => set({ status }),
  setElapsedSec: (elapsedSec) => set({ elapsedSec }),
  setStartedAt: (startedAt) => set({ startedAt }),
  setPausedDuration: (pausedDuration) => set({ pausedDuration }),
  setPath: (path) => set({ path }),
  setDistanceMeters: (distanceMeters) => set({ distanceMeters }),
  setLastPosition: (lastPosition) => set({ lastPosition }),
  setIsGPSReady: (isGPSReady) => set({ isGPSReady }),
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}));

/**
 * 使用示例：
 * 
 * // 在组件中
 * const { status, elapsedSec, setStatus, setElapsedSec } = useRunStore();
 * 
 * // 开始跑步
 * setStatus('running');
 * setStartedAt(Date.now());
 * 
 * // 更新时间
 * setElapsedSec(120);
 * 
 * // 重置状态
 * reset();
 * 
 * 
 * 注意：
 * 本项目由于逻辑较简单，使用独立 Hooks（useGPS、useTimer 等）已足够。
 * Zustand 适合以下场景：
 * - 需要跨多个组件共享状态
 * - 需要持久化状态
 * - 状态更新逻辑复杂
 * 
 * 如果不需要，可以完全移除此文件。
 */
