# 存储迁移指南：从本地存储切换到云端存储

本文档详细说明如何将 Territory Runner 的存储从本地 AsyncStorage 切换到云端存储（以 Firebase Firestore 为例）。

## 概览

Territory Runner 使用存储适配器模式，可以轻松在不同存储实现之间切换：

- **本地存储** (`local.ts`): 使用 AsyncStorage，数据存储在设备本地
- **云端存储** (`cloud.ts`): 可接入 Firebase、Supabase 等云服务

## 方案 1: Firebase Firestore

### 1. 安装依赖

```bash
npm install firebase
# 或
yarn add firebase
```

### 2. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目或选择现有项目
3. 添加 Web 应用
4. 复制 Firebase 配置信息

### 3. 实现云端存储

编辑 `src/services/storage/cloud.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { RunRecord, StorageService } from '../../types';

// Firebase 配置
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 云端存储服务实现
export const cloudStorageService: StorageService = {
  async saveRun(record: RunRecord): Promise<void> {
    try {
      await setDoc(doc(db, 'runs', record.id), {
        ...record,
        // 可选：添加用户 ID（如果有认证）
        // userId: auth.currentUser?.uid,
      });
    } catch (error) {
      console.error('Failed to save run to cloud:', error);
      throw new Error('保存到云端失败');
    }
  },

  async getAllRuns(): Promise<RunRecord[]> {
    try {
      // 如果有用户认证，添加 where 过滤
      // const q = query(
      //   collection(db, 'runs'),
      //   where('userId', '==', auth.currentUser?.uid),
      //   orderBy('startedAt', 'desc')
      // );
      
      const q = query(
        collection(db, 'runs'),
        orderBy('startedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as RunRecord);
    } catch (error) {
      console.error('Failed to get runs from cloud:', error);
      return [];
    }
  },

  async getRunById(id: string): Promise<RunRecord | null> {
    try {
      const docRef = doc(db, 'runs', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as RunRecord : null;
    } catch (error) {
      console.error('Failed to get run from cloud:', error);
      return null;
    }
  },

  async deleteRun(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'runs', id));
    } catch (error) {
      console.error('Failed to delete run from cloud:', error);
      throw new Error('从云端删除失败');
    }
  },

  async clearAll(): Promise<void> {
    // 注意：批量删除需要谨慎处理
    throw new Error('批量清空功能需谨慎实现');
  },
};
```

### 4. 配置 Firestore 安全规则

在 Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 允许所有读写（仅测试用）
    match /runs/{runId} {
      allow read, write: if true;
    }
    
    // 推荐：添加用户认证后的规则
    // match /runs/{runId} {
    //   allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    // }
  }
}
```

### 5. 切换存储服务

编辑 `src/services/storage/index.ts`:

```typescript
import { localStorageService } from './local';
import { cloudStorageService } from './cloud';
import { StorageService } from '../../types';

// 切换到云端存储
export const storageService: StorageService = cloudStorageService;

// 如果需要动态切换，可以使用环境变量
// const USE_CLOUD = process.env.EXPO_PUBLIC_USE_CLOUD === 'true';
// export const storageService = USE_CLOUD ? cloudStorageService : localStorageService;
```

### 6. （可选）添加用户认证

```typescript
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth(app);

// 匿名登录
export const signInAnonymous = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error('Anonymous sign in failed:', error);
  }
};

// 在 App.tsx 中初始化
useEffect(() => {
  signInAnonymous();
  
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user?.uid);
  });
  
  return unsubscribe;
}, []);
```

## 方案 2: Supabase

### 1. 安装依赖

```bash
npm install @supabase/supabase-js
```

### 2. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com/)
2. 创建新项目
3. 获取项目 URL 和 API Key

### 3. 实现云端存储

```typescript
import { createClient } from '@supabase/supabase-js';
import { RunRecord, StorageService } from '../../types';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export const cloudStorageService: StorageService = {
  async saveRun(record: RunRecord): Promise<void> {
    const { error } = await supabase
      .from('runs')
      .upsert([record]);
    
    if (error) throw new Error('保存失败');
  },

  async getAllRuns(): Promise<RunRecord[]> {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .order('startedAt', { ascending: false });
    
    return data || [];
  },

  async getRunById(id: string): Promise<RunRecord | null> {
    const { data } = await supabase
      .from('runs')
      .select('*')
      .eq('id', id)
      .single();
    
    return data;
  },

  async deleteRun(id: string): Promise<void> {
    await supabase
      .from('runs')
      .delete()
      .eq('id', id);
  },

  async clearAll(): Promise<void> {
    await supabase.from('runs').delete().neq('id', '');
  },
};
```

### 4. 创建数据库表

在 Supabase SQL Editor 执行：

```sql
CREATE TABLE runs (
  id UUID PRIMARY KEY,
  "startedAt" BIGINT NOT NULL,
  "endedAt" BIGINT NOT NULL,
  distance DOUBLE PRECISION NOT NULL,
  "elapsedSec" INTEGER NOT NULL,
  pace DOUBLE PRECISION NOT NULL,
  path JSONB NOT NULL,
  "pausedDuration" INTEGER,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_runs_started_at ON runs ("startedAt" DESC);
```

## 方案 3: 自建后端 API

### 1. 创建 API 客户端

```typescript
import axios from 'axios';

const API_BASE_URL = 'https://your-api.com/api';

export const cloudStorageService: StorageService = {
  async saveRun(record: RunRecord): Promise<void> {
    await axios.post(`${API_BASE_URL}/runs`, record);
  },

  async getAllRuns(): Promise<RunRecord[]> {
    const response = await axios.get(`${API_BASE_URL}/runs`);
    return response.data;
  },

  async getRunById(id: string): Promise<RunRecord | null> {
    const response = await axios.get(`${API_BASE_URL}/runs/${id}`);
    return response.data;
  },

  async deleteRun(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/runs/${id}`);
  },

  async clearAll(): Promise<void> {
    await axios.delete(`${API_BASE_URL}/runs`);
  },
};
```

## 数据迁移

如果已有本地数据需要迁移到云端：

```typescript
import { localStorageService } from './local';
import { cloudStorageService } from './cloud';

export async function migrateLocalToCloud() {
  try {
    // 1. 获取本地所有数据
    const localRuns = await localStorageService.getAllRuns();
    
    // 2. 上传到云端
    for (const run of localRuns) {
      await cloudStorageService.saveRun(run);
    }
    
    console.log(`Successfully migrated ${localRuns.length} runs to cloud`);
    
    // 3. 可选：清空本地数据
    // await localStorageService.clearAll();
  } catch (error) {
    console.error('Migration failed:', error);
  }
}
```

在应用中调用：

```typescript
// 在 App.tsx 或设置页面
<Button title="迁移数据到云端" onPress={migrateLocalToCloud} />
```

## 混合模式：本地缓存 + 云端同步

```typescript
export const hybridStorageService: StorageService = {
  async saveRun(record: RunRecord): Promise<void> {
    // 先保存到本地（快速）
    await localStorageService.saveRun(record);
    
    // 后台同步到云端
    cloudStorageService.saveRun(record).catch(err => {
      console.warn('Cloud sync failed:', err);
    });
  },

  async getAllRuns(): Promise<RunRecord[]> {
    // 优先从本地读取
    const localData = await localStorageService.getAllRuns();
    
    // 后台从云端获取最新数据
    cloudStorageService.getAllRuns().then(cloudData => {
      // 合并和去重逻辑
    });
    
    return localData;
  },

  // ... 其他方法类似实现
};
```

## 环境变量配置

创建 `.env` 文件：

```bash
# 存储模式
EXPO_PUBLIC_STORAGE_MODE=cloud  # 或 local

# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ...
```

在 `index.ts` 中使用：

```typescript
const storageMode = process.env.EXPO_PUBLIC_STORAGE_MODE || 'local';

export const storageService: StorageService = 
  storageMode === 'cloud' ? cloudStorageService : localStorageService;
```

## 测试

```typescript
// 测试云端存储
import { storageService } from './services/storage';

async function testCloudStorage() {
  const testRun: RunRecord = {
    id: 'test-' + Date.now(),
    startedAt: Date.now(),
    endedAt: Date.now() + 60000,
    distance: 1000,
    elapsedSec: 600,
    pace: 600,
    path: [],
  };

  // 保存
  await storageService.saveRun(testRun);
  
  // 读取
  const runs = await storageService.getAllRuns();
  console.log('Runs:', runs);
  
  // 删除
  await storageService.deleteRun(testRun.id);
}
```

## 注意事项

1. **安全性**: 生产环境务必配置安全规则和用户认证
2. **网络错误处理**: 添加重试机制和离线缓存
3. **成本**: 了解云服务的计费方式
4. **数据隐私**: 遵守用户数据保护法规
5. **性能**: 考虑数据分页和增量同步

---

完成以上步骤后，你的 Territory Runner 应用就可以使用云端存储了！🎉

