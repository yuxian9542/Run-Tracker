/**
 * Territory Runner - Run Saver Hook
 * 跑步记录保存钩子：生成并保存 RunRecord
 */

import { useCallback, useState } from 'react';
import { RunRecord, Coordinate } from '../types';
import { calculatePace } from '../utils/calculations';
import { storageService } from '../services/storage';

interface SaveRunParams {
  startedAt: number;
  elapsedSec: number;
  distance: number;
  path: Coordinate[];
  pausedDuration?: number;
}

export function useRunSaver() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 保存跑步记录
   */
  const saveRun = useCallback(async (params: SaveRunParams): Promise<RunRecord | null> => {
    try {
      setIsSaving(true);
      setError(null);

      const { startedAt, elapsedSec, distance, path, pausedDuration = 0 } = params;

      // 生成 RunRecord
      const record: RunRecord = {
        id: generateId(),
        startedAt,
        endedAt: Date.now(),
        distance,
        elapsedSec,
        pace: calculatePace(distance, elapsedSec),
        path,
        pausedDuration,
      };

      // 保存到存储服务
      await storageService.saveRun(record);

      setIsSaving(false);
      return record;
    } catch (err) {
      console.error('Failed to save run:', err);
      setError('保存失败');
      setIsSaving(false);
      return null;
    }
  }, []);

  return {
    saveRun,
    isSaving,
    error,
  };
}

/**
 * 生成唯一 ID（简单的 UUID v4 实现）
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 使用示例：
 * 
 * const { saveRun, isSaving, error } = useRunSaver();
 * 
 * // 在停止跑步时保存
 * const record = await saveRun({
 *   startedAt: runStartTime,
 *   elapsedSec: timer.elapsedSec,
 *   distance: gps.distanceMeters,
 *   path: gps.path,
 *   pausedDuration: totalPausedSec,
 * });
 * 
 * if (record) {
 *   console.log('保存成功:', record.id);
 * }
 */

