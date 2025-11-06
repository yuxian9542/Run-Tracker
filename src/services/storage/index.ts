/**
 * Territory Runner - Storage Service Adapter
 * 存储服务适配器：通过修改导出切换 local/cloud 实现
 */

import { localStorageService } from './local';
import { cloudStorageService } from './cloud';
import { StorageService } from '../../types';

/**
 * 当前使用的存储服务
 * 
 * 切换方式：
 * - 使用本地存储：export const storageService = localStorageService;
 * - 使用云端存储：export const storageService = cloudStorageService;
 * 
 * 也可以通过环境变量或配置文件动态切换：
 * const USE_CLOUD = process.env.EXPO_PUBLIC_USE_CLOUD === 'true';
 * export const storageService = USE_CLOUD ? cloudStorageService : localStorageService;
 */
export const storageService: StorageService = localStorageService;

// 导出两个实现供测试或特殊场景使用
export { localStorageService, cloudStorageService };

