# Territory Runner MVP-0

基于 Expo 和 React Native 的最小功能跑步应用。

## 功能特性

- ✅ 开始/暂停/停止跑步
- ✅ 实时显示时间、距离、配速
- ✅ GPS 轨迹记录
- ✅ 本地存储跑步记录
- ✅ 历史记录查看
- ✅ 存储适配器（支持切换本地/云端存储）

## 技术栈

- **框架**: React Native + Expo
- **语言**: TypeScript
- **导航**: React Navigation (Native Stack)
- **定位**: expo-location
- **本地存储**: @react-native-async-storage/async-storage
- **状态管理**: Zustand (可选)

## 项目结构

```
Territory_Runner/
├── App.tsx                           # 应用入口
├── src/
│   ├── navigation/
│   │   └── RootNavigator.tsx         # 主导航
│   ├── screens/
│   │   ├── HomeScreen.tsx            # 首页
│   │   ├── LiveRunScreen.tsx         # 实时跑步界面
│   │   └── HistoryScreen.tsx         # 历史记录
│   ├── hooks/
│   │   ├── useGPS.ts                 # GPS 跟踪钩子
│   │   ├── useTimer.ts               # 计时器钩子
│   │   ├── useRunSaver.ts            # 记录保存钩子
│   │   └── useRunHistory.ts          # 历史记录钩子
│   ├── services/
│   │   └── storage/
│   │       ├── index.ts              # 存储适配器
│   │       ├── local.ts              # 本地存储实现
│   │       └── cloud.ts              # 云端存储占位
│   ├── utils/
│   │   ├── calculations.ts           # 计算工具（Haversine、配速）
│   │   └── formatters.ts             # 格式化工具
│   ├── types/
│   │   └── index.ts                  # TypeScript 类型定义
│   └── store/
│       └── useRunStore.ts            # Zustand 全局状态（可选）
├── package.json
├── tsconfig.json
├── app.json                          # Expo 配置
└── .eslintrc.js
```

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
```

### 2. 启动开发服务器

```bash
npm start
# 或
expo start
```

### 3. 运行应用

- **iOS**: 按 `i` 或运行 `npm run ios`
- **Android**: 按 `a` 或运行 `npm run android`
- **Web**: 按 `w` 或运行 `npm run web`

## 核心模块说明

### 1. GPS 跟踪 (`useGPS`)

```typescript
const { path, distanceMeters, start, stop, clear } = useGPS();

// 开始跟踪
await start();

// 停止跟踪
stop();

// 清除数据
clear();
```

**特性**:
- 使用 expo-location 获取位置
- 自动过滤 GPS 漂移（移动距离 < 5 米忽略）
- 实时累计距离计算（Haversine 公式）

### 2. 计时器 (`useTimer`)

```typescript
const { elapsedSec, status, start, pause, resume, reset } = useTimer();

// 开始计时
start();

// 暂停
pause();

// 恢复
resume();

// 重置
reset();
```

### 3. 记录保存 (`useRunSaver`)

```typescript
const { saveRun, isSaving } = useRunSaver();

const record = await saveRun({
  startedAt: runStartTime,
  elapsedSec: timer.elapsedSec,
  distance: gps.distanceMeters,
  path: gps.path,
});
```

### 4. 历史记录 (`useRunHistory`)

```typescript
const { runs, getLastRun, deleteRun, refresh } = useRunHistory();

// 获取最近一次
const lastRun = getLastRun();

// 删除记录
await deleteRun(runId);

// 刷新列表
await refresh();
```

### 5. 存储适配器

默认使用本地存储，可在 `src/services/storage/index.ts` 切换：

```typescript
// 本地存储（默认）
export const storageService = localStorageService;

// 云端存储
export const storageService = cloudStorageService;
```

## 权限配置

### iOS

已在 `app.json` 配置定位权限：

```json
{
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "Territory Runner 需要访问您的位置来记录跑步轨迹和计算距离。",
    "NSLocationAlwaysAndWhenInUseUsageDescription": "Territory Runner 需要持续访问您的位置来准确记录跑步数据。"
  }
}
```

### Android

已在 `app.json` 配置定位权限：

```json
{
  "permissions": [
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "ACCESS_BACKGROUND_LOCATION"
  ]
}
```

## 如何切换到云端存储

### 步骤 1: 安装 Firebase（或其他云服务）

```bash
npm install firebase
```

### 步骤 2: 实现 `cloud.ts`

在 `src/services/storage/cloud.ts` 中实现：

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ...
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const cloudStorageService: StorageService = {
  async saveRun(record: RunRecord): Promise<void> {
    await addDoc(collection(db, 'runs'), record);
  },

  async getAllRuns(): Promise<RunRecord[]> {
    const q = query(collection(db, 'runs'), orderBy('startedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RunRecord));
  },

  // ... 其他方法
};
```

### 步骤 3: 切换存储服务

在 `src/services/storage/index.ts` 修改导出：

```typescript
export const storageService = cloudStorageService;
```

### 步骤 4: 添加用户认证（可选）

```typescript
import { getAuth, signInAnonymously } from 'firebase/auth';

const auth = getAuth(app);
await signInAnonymously(auth);
```

## 计算公式

### Haversine 距离计算

```typescript
function calculateDistance(coord1, coord2) {
  const R = 6371e3; // 地球半径（米）
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

### 配速计算

```typescript
function calculatePace(distanceMeters, durationSec) {
  const distanceKm = distanceMeters / 1000;
  return durationSec / distanceKm; // 秒/公里
}
```

## 常见问题

### Q: GPS 定位不准确？

A: 
- 确保在室外测试（室内 GPS 信号弱）
- 检查设备定位服务是否开启
- 调整 `useGPS.ts` 中的 `distanceInterval` 参数

### Q: 如何自定义存储位置？

A: 修改 `src/services/storage/local.ts` 中的 `STORAGE_KEY` 常量。

### Q: 如何添加地图显示？

A: 安装 `react-native-maps`：

```bash
npm install react-native-maps
```

在 `LiveRunScreen.tsx` 或 `HistoryScreen.tsx` 中添加地图组件。

### Q: 如何后台运行？

A: 
- iOS: 已在 `app.json` 配置 `UIBackgroundModes: ["location"]`
- Android: 使用 `expo-task-manager` 配置后台任务

## 待优化项

- [ ] 添加地图显示（react-native-maps）
- [ ] 后台位置跟踪（expo-task-manager）
- [ ] 跑步暂停时间记录
- [ ] 卡路里计算
- [ ] 分段配速分析
- [ ] 数据导出（GPX 格式）
- [ ] 社交分享功能

## 开发工具

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 清除缓存
expo start -c
```

## 许可证

MIT

---

**Territory Runner** - 简单、纯粹的跑步追踪应用 🏃‍♂️
