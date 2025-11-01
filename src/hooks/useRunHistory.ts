/**
 * Territory Runner - Run History Hook
 * 跑步历史钩子：读取和管理历史记录
 */

import { useState, useCallback, useEffect } from 'react';
import { RunRecord } from '../types';
import { storageService } from '../services/storage';

export function useRunHistory() {
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 加载所有记录
   */
  const loadRuns = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allRuns = await storageService.getAllRuns();
      setRuns(allRuns);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load runs:', err);
      setError('加载失败');
      setIsLoading(false);
    }
  }, []);

  /**
   * 获取最近一次记录
   */
  const getLastRun = useCallback((): RunRecord | null => {
    if (runs.length === 0) return null;
    return runs[0]; // 已经按 startedAt 倒序排列
  }, [runs]);

  /**
   * 删除指定记录
   */
  const deleteRun = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await storageService.deleteRun(id);
      setRuns((prev) => prev.filter((run) => run.id !== id));
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to delete run:', err);
      setError('删除失败');
      setIsLoading(false);
    }
  }, []);

  /**
   * 清空所有记录
   */
  const clearAll = useCallback(async () => {
    try {
      setIsLoading(true);
      await storageService.clearAll();
      setRuns([]);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to clear runs:', err);
      setError('清空失败');
      setIsLoading(false);
    }
  }, []);

  /**
   * 刷新记录列表
   */
  const refresh = useCallback(async () => {
    await loadRuns();
  }, [loadRuns]);

  // 初始加载
  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  return {
    runs,
    isLoading,
    error,
    getLastRun,
    deleteRun,
    clearAll,
    refresh,
  };
}

/**
 * 使用示例：
 * 
 * const { runs, isLoading, getLastRun, deleteRun, refresh } = useRunHistory();
 * 
 * // 获取最近一次跑步
 * const lastRun = getLastRun();
 * 
 * // 删除某条记录
 * await deleteRun(runId);
 * 
 * // 刷新列表
 * await refresh();
 * 
 * // 渲染列表
 * runs.map(run => <RunItem key={run.id} run={run} />);
 */

