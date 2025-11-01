/**
 * Territory Runner - Cloud Storage Service (Placeholder)
 * 云端存储服务占位实现（待对接 Firebase 等）
 */

import { RunRecord, StorageService } from '../../types';

/**
 * 云端存储服务占位实现
 * 
 * 后续可接入：
 * - Firebase Firestore
 * - Supabase
 * - 自建后端 API
 * 
 * 使用示例：
 * 1. 安装依赖：npm install firebase
 * 2. 初始化 Firebase config
 * 3. 实现下方的每个方法
 */
export const cloudStorageService: StorageService = {
  async saveRun(record: RunRecord): Promise<void> {
    console.warn('Cloud storage not implemented yet');
    // TODO: 实现云端保存
    // 示例：await firestore.collection('runs').doc(record.id).set(record);
    throw new Error('Cloud storage not implemented');
  },

  async getAllRuns(): Promise<RunRecord[]> {
    console.warn('Cloud storage not implemented yet');
    // TODO: 实现云端获取
    // 示例：
    // const snapshot = await firestore.collection('runs')
    //   .where('userId', '==', currentUserId)
    //   .orderBy('startedAt', 'desc')
    //   .get();
    // return snapshot.docs.map(doc => doc.data() as RunRecord);
    return [];
  },

  async getRunById(id: string): Promise<RunRecord | null> {
    console.warn('Cloud storage not implemented yet');
    // TODO: 实现根据 ID 获取
    // 示例：
    // const doc = await firestore.collection('runs').doc(id).get();
    // return doc.exists ? doc.data() as RunRecord : null;
    return null;
  },

  async deleteRun(id: string): Promise<void> {
    console.warn('Cloud storage not implemented yet');
    // TODO: 实现云端删除
    // 示例：await firestore.collection('runs').doc(id).delete();
    throw new Error('Cloud storage not implemented');
  },

  async clearAll(): Promise<void> {
    console.warn('Cloud storage not implemented yet');
    // TODO: 实现清空（需谨慎）
    throw new Error('Cloud storage not implemented');
  },
};

/**
 * Firebase 实现参考模板：
 * 
 * import { initializeApp } from 'firebase/app';
 * import { getFirestore, collection, doc, setDoc, getDocs, getDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
 * 
 * const firebaseConfig = {
 *   apiKey: "YOUR_API_KEY",
 *   authDomain: "YOUR_AUTH_DOMAIN",
 *   projectId: "YOUR_PROJECT_ID",
 *   // ...
 * };
 * 
 * const app = initializeApp(firebaseConfig);
 * const db = getFirestore(app);
 * 
 * export const cloudStorageService: StorageService = {
 *   async saveRun(record: RunRecord): Promise<void> {
 *     await setDoc(doc(db, 'runs', record.id), record);
 *   },
 *   // ... 其他实现
 * };
 */

