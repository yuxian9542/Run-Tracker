/**
 * Territory Runner - Timer Hook
 * 计时器钩子：提供开始、暂停、恢复、重置功能
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { UseTimerReturn } from '../types';

export function useTimer(): UseTimerReturn {
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused'>('idle');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  /**
   * 清除定时器
   */
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * 开始计时
   */
  const start = useCallback(() => {
    if (status === 'running') return;

    startTimeRef.current = Date.now();
    setStatus('running');

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor(
        accumulatedTimeRef.current + (now - startTimeRef.current) / 1000
      );
      setElapsedSec(elapsed);
    }, 1000);
  }, [status]);

  /**
   * 暂停计时
   */
  const pause = useCallback(() => {
    if (status !== 'running') return;

    clearTimer();
    
    // 累积已经过的时间
    const now = Date.now();
    accumulatedTimeRef.current += (now - startTimeRef.current) / 1000;
    
    setStatus('paused');
  }, [status, clearTimer]);

  /**
   * 恢复计时
   */
  const resume = useCallback(() => {
    if (status !== 'paused') return;
    
    startTimeRef.current = Date.now();
    setStatus('running');

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor(
        accumulatedTimeRef.current + (now - startTimeRef.current) / 1000
      );
      setElapsedSec(elapsed);
    }, 1000);
  }, [status]);

  /**
   * 重置计时器
   */
  const reset = useCallback(() => {
    clearTimer();
    setElapsedSec(0);
    setStatus('idle');
    accumulatedTimeRef.current = 0;
    startTimeRef.current = 0;
  }, [clearTimer]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    elapsedSec,
    status,
    start,
    pause,
    resume,
    reset,
  };
}

/**
 * 使用示例：
 * 
 * const { elapsedSec, status, start, pause, resume, reset } = useTimer();
 * 
 * // 开始计时
 * start();
 * 
 * // 暂停
 * pause();
 * 
 * // 恢复
 * resume();
 * 
 * // 重置
 * reset();
 * 
 * console.log(`已用时：${elapsedSec} 秒，状态：${status}`);
 */

