/**
 * Territory Runner - GPS Tracking Hook
 * GPS 跟踪钩子：提供位置跟踪、路径记录、距离计算
 */

import { useState, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { Coordinate, UseGPSReturn } from '../types';
import { calculateDistance, isSignificantMove } from '../utils/calculations';

export function useGPS(): UseGPSReturn {
  const [path, setPath] = useState<Coordinate[]>([]);
  const [distanceMeters, setDistanceMeters] = useState<number>(0);
  const [lastPosition, setLastPosition] = useState<Coordinate | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const watchSubscription = useRef<Location.LocationSubscription | null>(null);

  /**
   * 开始 GPS 跟踪
   */
  const start = useCallback(async () => {
    try {
      setError(null);

      // 请求前台位置权限
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        setError('位置权限被拒绝');
        return;
      }

      // 请求后台位置权限（iOS 需要）
      // 如果后台权限被拒绝，仍然允许前台跟踪
      try {
        await Location.requestBackgroundPermissionsAsync();
      } catch (bgError) {
        // 后台权限被拒绝不影响前台跟踪
        console.log('Background location permission not granted, continuing with foreground tracking');
      }

      // 开始监听位置变化
      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 5, // 每移动 5 米更新一次
          timeInterval: 1000, // 或每秒更新一次
        },
        (location) => {
          const newCoord: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
            accuracy: location.coords.accuracy || undefined,
          };

          setLastPosition(newCoord);

          // 判断是否是有效移动（过滤 GPS 漂移）
          setPath((prevPath) => {
            if (prevPath.length === 0) {
              // 第一个点，直接添加
              return [newCoord];
            }

            const lastCoord = prevPath[prevPath.length - 1];
            
            // 只有移动足够远才记录（避免噪点）
            if (isSignificantMove(lastCoord, newCoord, 5)) {
              const distance = calculateDistance(lastCoord, newCoord);
              setDistanceMeters((prev) => prev + distance);
              return [...prevPath, newCoord];
            }

            return prevPath;
          });
        }
      );

      setIsTracking(true);
    } catch (err) {
      console.error('GPS start error:', err);
      setError('GPS 启动失败');
    }
  }, []);

  /**
   * 停止 GPS 跟踪
   */
  const stop = useCallback(() => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }
    setIsTracking(false);
  }, []);

  /**
   * 清除路径和距离数据
   */
  const clear = useCallback(() => {
    setPath([]);
    setDistanceMeters(0);
    setLastPosition(null);
    setError(null);
  }, []);

  return {
    path,
    distanceMeters,
    lastPosition,
    isTracking,
    error,
    start,
    stop,
    clear,
  };
}

/**
 * 使用示例：
 * 
 * const { path, distanceMeters, start, stop, clear } = useGPS();
 * 
 * // 开始跟踪
 * await start();
 * 
 * // 停止跟踪
 * stop();
 * 
 * // 清除数据
 * clear();
 * 
 * console.log(`当前距离：${distanceMeters} 米`);
 * console.log(`路径点数量：${path.length}`);
 */

