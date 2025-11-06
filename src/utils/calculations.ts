/**
 * Territory Runner - Calculation Utilities
 * 核心计算函数：Haversine 距离、配速等
 */

import { Coordinate } from '../types';

/**
 * Haversine 公式计算两点间距离（米）
 * @param coord1 第一个坐标点
 * @param coord2 第二个坐标点
 * @returns 距离（米）
 */
export function calculateDistance(
  coord1: Coordinate,
  coord2: Coordinate
): number {
  const R = 6371e3; // 地球半径（米）
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * 计算路径总距离（米）
 * @param path 坐标点数组
 * @returns 总距离（米）
 */
export function calculateTotalDistance(path: Coordinate[]): number {
  if (path.length < 2) return 0;

  let total = 0;
  for (let i = 1; i < path.length; i++) {
    total += calculateDistance(path[i - 1], path[i]);
  }
  return total;
}

/**
 * 计算配速（秒/公里）
 * @param distanceMeters 距离（米）
 * @param durationSec 时长（秒）
 * @returns 配速（秒/公里），如果距离为 0 返回 0
 */
export function calculatePace(
  distanceMeters: number,
  durationSec: number
): number {
  if (distanceMeters <= 0 || durationSec <= 0) return 0;
  const distanceKm = distanceMeters / 1000;
  return durationSec / distanceKm;
}

/**
 * 计算平均速度（米/秒）
 * @param distanceMeters 距离（米）
 * @param durationSec 时长（秒）
 * @returns 速度（米/秒）
 */
export function calculateSpeed(
  distanceMeters: number,
  durationSec: number
): number {
  if (durationSec <= 0) return 0;
  return distanceMeters / durationSec;
}

/**
 * 判断两个坐标是否足够远（用于过滤噪点）
 * @param coord1 第一个坐标点
 * @param coord2 第二个坐标点
 * @param minDistance 最小距离阈值（米），默认 5 米
 * @returns 是否超过最小距离
 */
export function isSignificantMove(
  coord1: Coordinate,
  coord2: Coordinate,
  minDistance: number = 5
): boolean {
  return calculateDistance(coord1, coord2) >= minDistance;
}

