/**
 * Territory Runner - Local Storage Service
 * 使用 AsyncStorage 的本地存储实现
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RunRecord, StorageService } from '../../types';

const STORAGE_KEY = '@territory_runner:runs';

/**
 * 本地存储服务实现
 */
export const localStorageService: StorageService = {
  /**
   * 保存一条跑步记录
   */
  async saveRun(record: RunRecord): Promise<void> {
    try {
      const existing = await this.getAllRuns();
      const updated = [record, ...existing];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save run:', error);
      throw new Error('保存跑步记录失败');
    }
  },

  /**
   * 获取所有跑步记录（倒序：最新的在前）
   */
  async getAllRuns(): Promise<RunRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const runs: RunRecord[] = JSON.parse(data);
      // 确保倒序排列
      return runs.sort((a, b) => b.startedAt - a.startedAt);
    } catch (error) {
      console.error('Failed to get runs:', error);
      return [];
    }
  },

  /**
   * 根据 ID 获取单条记录
   */
  async getRunById(id: string): Promise<RunRecord | null> {
    try {
      const runs = await this.getAllRuns();
      return runs.find((run) => run.id === id) || null;
    } catch (error) {
      console.error('Failed to get run by id:', error);
      return null;
    }
  },

  /**
   * 删除一条记录
   */
  async deleteRun(id: string): Promise<void> {
    try {
      const runs = await this.getAllRuns();
      const filtered = runs.filter((run) => run.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete run:', error);
      throw new Error('删除跑步记录失败');
    }
  },

  /**
   * 清空所有记录
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear all runs:', error);
      throw new Error('清空记录失败');
    }
  },
};

