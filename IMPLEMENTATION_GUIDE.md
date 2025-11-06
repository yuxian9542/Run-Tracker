# Territory Runner - 实现指南

## 核心功能实现说明

本文档详细说明了各个模块的实现细节和使用方法。

---

## 1. 类型定义 (`src/types/index.ts`)

### 核心类型

#### `Coordinate` - 坐标点
```typescript
interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp: number; // Unix timestamp (ms)
  accuracy?: number; // GPS 精度（米）
}
```

#### `RunRecord` - 跑步记录
```typescript
interface RunRecord {
  id: string;              // UUID
  startedAt: number;       // 开始时间戳
  endedAt: number;         // 结束时间戳
  distance: number;        // 距离（米）
  elapsedSec: number;      // 有效跑步时长（秒）
  pace: number;            // 配速（秒/公里）
  path: Coordinate[];      // 路径点数组
  pausedDuration?: number; // 暂停总时长（秒）
}
```

---

## 2. GPS 跟踪 (`src/hooks/useGPS.ts`)

### 核心功能

- **位置跟踪**: 使用 expo-location 实时获取位置
- **距离累计**: Haversine 公式计算累计距离
- **噪点过滤**: 忽略小于 5 米的移动

### API

```typescript
const {
  path,           // Coordinate[] - 路径点数组
  distanceMeters, // number - 累计距离（米）
  lastPosition,   // Coordinate | null - 最新位置
  isTracking,     // boolean - 是否正在跟踪
  error,          // string | null - 错误信息
  start,          // () => Promise<void> - 开始跟踪
  stop,           // () => void - 停止跟踪
  clear,          // () => void - 清除数据
} = useGPS();
```

### 使用示例

```typescript
function MyComponent() {
  const gps = useGPS();

  const handleStart = async () => {
    await gps.start();
  };

  const handleStop = () => {
    gps.stop();
  };

  return (
    <View>
      <Text>距离: {gps.distanceMeters} 米</Text>
      <Text>路径点: {gps.path.length}</Text>
      <Button title="开始" onPress={handleStart} />
      <Button title="停止" onPress={handleStop} />
    </View>
  );
}
```

### 配置选项

在 `useGPS.ts` 中可调整：

```typescript
Location.watchPositionAsync({
  accuracy: Location.Accuracy.BestForNavigation, // GPS 精度
  distanceInterval: 5,  // 移动 5 米更新一次
  timeInterval: 1000,   // 或每秒更新一次
}, callback);
```

---

## 3. 计时器 (`src/hooks/useTimer.ts`)

### 核心功能

- **精确计时**: 基于 Date.now() 和 setInterval
- **暂停/恢复**: 支持暂停后继续计时
- **累积时间**: 暂停期间不计入有效时间

### API

```typescript
const {
  elapsedSec, // number - 已用时（秒）
  status,     // 'idle' | 'running' | 'paused'
  start,      // () => void - 开始计时
  pause,      // () => void - 暂停
  resume,     // () => void - 恢复
  reset,      // () => void - 重置
} = useTimer();
```

### 使用示例

```typescript
function TimerDisplay() {
  const timer = useTimer();

  return (
    <View>
      <Text>{formatDuration(timer.elapsedSec)}</Text>
      
      {timer.status === 'idle' && (
        <Button title="开始" onPress={timer.start} />
      )}
      
      {timer.status === 'running' && (
        <Button title="暂停" onPress={timer.pause} />
      )}
      
      {timer.status === 'paused' && (
        <>
          <Button title="继续" onPress={timer.resume} />
          <Button title="重置" onPress={timer.reset} />
        </>
      )}
    </View>
  );
}
```

---

## 4. 跑步记录保存 (`src/hooks/useRunSaver.ts`)

### 核心功能

- **生成记录**: 自动生成 UUID 和计算配速
- **异步保存**: 使用存储服务保存数据
- **错误处理**: 捕获并返回错误信息

### API

```typescript
const {
  saveRun,  // (params: SaveRunParams) => Promise<RunRecord | null>
  isSaving, // boolean - 是否正在保存
  error,    // string | null - 错误信息
} = useRunSaver();
```

### 使用示例

```typescript
function SaveRunButton() {
  const { saveRun, isSaving } = useRunSaver();
  const gps = useGPS();
  const timer = useTimer();

  const handleSave = async () => {
    const record = await saveRun({
      startedAt: Date.now() - timer.elapsedSec * 1000,
      elapsedSec: timer.elapsedSec,
      distance: gps.distanceMeters,
      path: gps.path,
      pausedDuration: 0,
    });

    if (record) {
      Alert.alert('成功', '记录已保存');
    }
  };

  return (
    <Button 
      title="保存" 
      onPress={handleSave} 
      disabled={isSaving}
    />
  );
}
```

---

## 5. 历史记录 (`src/hooks/useRunHistory.ts`)

### 核心功能

- **自动加载**: 初始化时自动加载所有记录
- **倒序排列**: 最新记录在前
- **增删改查**: 完整的 CRUD 操作

### API

```typescript
const {
  runs,       // RunRecord[] - 所有记录
  isLoading,  // boolean - 是否加载中
  error,      // string | null - 错误信息
  getLastRun, // () => RunRecord | null - 获取最新记录
  deleteRun,  // (id: string) => Promise<void> - 删除记录
  clearAll,   // () => Promise<void> - 清空所有
  refresh,    // () => Promise<void> - 刷新列表
} = useRunHistory();
```

### 使用示例

```typescript
function HistoryList() {
  const { runs, isLoading, deleteRun, refresh } = useRunHistory();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={runs}
      keyExtractor={item => item.id}
      onRefresh={refresh}
      refreshing={isLoading}
      renderItem={({ item }) => (
        <View>
          <Text>{formatDistance(item.distance)}</Text>
          <Text>{formatDuration(item.elapsedSec)}</Text>
          <Button 
            title="删除" 
            onPress={() => deleteRun(item.id)} 
          />
        </View>
      )}
    />
  );
}
```

---

## 6. 计算工具 (`src/utils/calculations.ts`)

### 主要函数

#### `calculateDistance(coord1, coord2)` - Haversine 距离
```typescript
const distance = calculateDistance(
  { latitude: 39.9042, longitude: 116.4074, timestamp: 0 },
  { latitude: 39.9043, longitude: 116.4075, timestamp: 0 }
);
// 返回: 距离（米）
```

#### `calculateTotalDistance(path)` - 路径总距离
```typescript
const totalDistance = calculateTotalDistance([
  { latitude: 39.9042, longitude: 116.4074, timestamp: 0 },
  { latitude: 39.9043, longitude: 116.4075, timestamp: 0 },
  { latitude: 39.9044, longitude: 116.4076, timestamp: 0 },
]);
// 返回: 总距离（米）
```

#### `calculatePace(distanceMeters, durationSec)` - 配速
```typescript
const pace = calculatePace(5000, 1800); // 5km, 30分钟
// 返回: 360 (秒/公里，即 6:00/km)
```

#### `isSignificantMove(coord1, coord2, minDistance)` - 判断有效移动
```typescript
const isValid = isSignificantMove(coord1, coord2, 5);
// 返回: true/false（是否移动超过 5 米）
```

---

## 7. 格式化工具 (`src/utils/formatters.ts`)

### 主要函数

#### `formatDistance(meters, decimals)` - 格式化距离
```typescript
formatDistance(520);      // "520 m"
formatDistance(3500);     // "3.50 km"
formatDistance(3500, 1);  // "3.5 km"
```

#### `formatDuration(seconds)` - 格式化时长
```typescript
formatDuration(65);      // "1:05"
formatDuration(3665);    // "1:01:05"
```

#### `formatPace(secPerKm)` - 格式化配速
```typescript
formatPace(360);   // "6:00/km"
formatPace(330);   // "5:30/km"
formatPace(0);     // "--"
```

#### `formatDateTime(timestamp)` - 格式化日期时间
```typescript
formatDateTime(1699000000000);  // "2024-11-03 10:20"
```

#### `formatRelativeTime(timestamp)` - 相对时间
```typescript
formatRelativeTime(Date.now() - 3600000);  // "1 小时前"
formatRelativeTime(Date.now() - 86400000); // "昨天"
```

---

## 8. 存储服务 (`src/services/storage/`)

### 架构

```
storage/
├── index.ts      # 适配器（选择使用哪个实现）
├── local.ts      # 本地存储实现（AsyncStorage）
└── cloud.ts      # 云端存储占位（待实现）
```

### 使用方式

```typescript
import { storageService } from '../services/storage';

// 保存
await storageService.saveRun(record);

// 读取全部
const runs = await storageService.getAllRuns();

// 读取单个
const run = await storageService.getRunById(id);

// 删除
await storageService.deleteRun(id);

// 清空
await storageService.clearAll();
```

### 切换存储实现

在 `src/services/storage/index.ts` 中：

```typescript
// 本地存储（默认）
export const storageService = localStorageService;

// 云端存储
export const storageService = cloudStorageService;

// 动态切换
const USE_CLOUD = process.env.EXPO_PUBLIC_USE_CLOUD === 'true';
export const storageService = USE_CLOUD ? cloudStorageService : localStorageService;
```

---

## 9. Zustand Store (`src/store/useRunStore.ts`)

### 说明

Zustand Store 是**可选的**。本项目的 Hooks 已足够简单，不需要全局状态管理。

如果需要跨组件共享状态，可以使用 Zustand：

```typescript
const { status, elapsedSec, setStatus } = useRunStore();

// 更新状态
setStatus('running');

// 重置所有状态
reset();
```

---

## 10. 界面组件

### HomeScreen - 首页

**功能**:
- 显示"开始跑步"按钮
- 显示最近一次跑步摘要
- 显示统计概览（总次数/总距离/总时长）

**关键代码**:
```typescript
const { runs, getLastRun } = useRunHistory();
const lastRun = getLastRun();

// 跳转到跑步页面
navigation.navigate('LiveRun');
```

### LiveRunScreen - 实时跑步

**功能**:
- 实时显示距离/时间/配速
- 开始/暂停/继续/停止按钮
- 保存或放弃跑步记录

**关键逻辑**:
```typescript
const gps = useGPS();
const timer = useTimer();
const { saveRun } = useRunSaver();

// 开始跑步
const handleStart = async () => {
  await gps.start();
  timer.start();
  setStartedAt(Date.now());
};

// 停止并保存
const handleStop = async () => {
  gps.stop();
  timer.pause();
  
  const record = await saveRun({
    startedAt,
    elapsedSec: timer.elapsedSec,
    distance: gps.distanceMeters,
    path: gps.path,
  });
};
```

### HistoryScreen - 历史记录

**功能**:
- 列表显示所有跑步记录
- 点击查看详情（模态框）
- 删除记录
- 下拉刷新

**关键代码**:
```typescript
const { runs, isLoading, deleteRun, refresh } = useRunHistory();

<FlatList
  data={runs}
  onRefresh={refresh}
  refreshing={isLoading}
  renderItem={({ item }) => <RunCard run={item} />}
/>
```

---

## 11. 导航结构

```typescript
RootNavigator
├── Home          # 首页
├── LiveRun       # 实时跑步（禁用手势返回）
└── History       # 历史记录
```

### 导航示例

```typescript
// 从首页跳转到跑步页
navigation.navigate('LiveRun');

// 返回首页
navigation.navigate('Home');

// 跳转到历史记录
navigation.navigate('History');
```

---

## 12. 权限配置

### iOS (`app.json`)

```json
{
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "Territory Runner 需要访问您的位置来记录跑步轨迹和计算距离。",
    "NSLocationAlwaysAndWhenInUseUsageDescription": "Territory Runner 需要持续访问您的位置来准确记录跑步数据。",
    "UIBackgroundModes": ["location"]
  }
}
```

### Android (`app.json`)

```json
{
  "permissions": [
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "ACCESS_BACKGROUND_LOCATION"
  ]
}
```

### 运行时请求权限

在 `useGPS.ts` 中已实现：

```typescript
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== 'granted') {
  setError('位置权限被拒绝');
  return;
}
```

---

## 13. 开发流程

### 初始化项目

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm start

# 3. 在模拟器或真机上运行
npm run ios     # iOS
npm run android # Android
```

### 调试技巧

```typescript
// 1. 打印 GPS 数据
console.log('GPS Path:', gps.path);
console.log('Distance:', gps.distanceMeters);

// 2. 打印存储数据
const runs = await storageService.getAllRuns();
console.log('All Runs:', runs);

// 3. 清空数据（测试用）
await storageService.clearAll();
```

### 类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

---

## 14. 常见问题排查

### GPS 定位不准确

**原因**:
- 室内 GPS 信号弱
- 精度配置过低
- 设备定位服务未开启

**解决方案**:
1. 在室外测试
2. 调整精度配置：
   ```typescript
   accuracy: Location.Accuracy.BestForNavigation
   ```
3. 检查设备设置 → 隐私 → 定位服务

### 数据未保存

**排查步骤**:
1. 检查 `saveRun` 是否返回错误
2. 查看控制台日志
3. 验证 AsyncStorage 权限
4. 测试存储服务：
   ```typescript
   const test = await storageService.getAllRuns();
   console.log(test);
   ```

### 计时器不准确

**原因**: 应用进入后台时 JavaScript 线程暂停

**解决方案**:
- 使用 `Date.now()` 而非累积时间（已实现）
- 实现后台任务（高级功能）

---

## 15. 性能优化建议

### GPS 路径点优化

```typescript
// 在 useGPS.ts 中增加距离阈值
if (isSignificantMove(lastCoord, newCoord, 10)) {
  // 10 米才记录一个点
}
```

### 存储优化

```typescript
// 只存储最近 N 条记录
const MAX_RUNS = 100;
if (runs.length > MAX_RUNS) {
  runs = runs.slice(0, MAX_RUNS);
}
```

### 列表渲染优化

```typescript
// 使用 FlatList 的性能优化属性
<FlatList
  data={runs}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
/>
```

---

## 16. 后续功能扩展

### 添加地图显示

```bash
npm install react-native-maps
```

```typescript
import MapView, { Polyline } from 'react-native-maps';

<MapView>
  <Polyline coordinates={gps.path} />
</MapView>
```

### 添加后台跟踪

```bash
expo install expo-task-manager expo-location
```

### 添加数据导出（GPX）

```typescript
function exportToGPX(run: RunRecord) {
  const gpx = `
    <?xml version="1.0"?>
    <gpx version="1.1">
      <trk>
        <trkseg>
          ${run.path.map(p => `
            <trkpt lat="${p.latitude}" lon="${p.longitude}">
              <time>${new Date(p.timestamp).toISOString()}</time>
            </trkpt>
          `).join('')}
        </trkseg>
      </trk>
    </gpx>
  `;
  return gpx;
}
```

---

## 17. 项目结构速查

```
Territory_Runner/
├── App.tsx                           # 入口文件
├── app.json                          # Expo 配置
├── package.json                      # 依赖管理
├── tsconfig.json                     # TS 配置
├── .eslintrc.js                      # ESLint 配置
├── .gitignore                        # Git 忽略
├── README.md                         # 项目说明
├── IMPLEMENTATION_GUIDE.md           # 本文档
├── STORAGE_MIGRATION_GUIDE.md        # 存储迁移指南
└── src/
    ├── types/
    │   └── index.ts                  # 类型定义
    ├── utils/
    │   ├── calculations.ts           # 计算工具
    │   └── formatters.ts             # 格式化工具
    ├── services/
    │   └── storage/
    │       ├── index.ts              # 存储适配器
    │       ├── local.ts              # 本地存储
    │       └── cloud.ts              # 云端存储
    ├── hooks/
    │   ├── useGPS.ts                 # GPS 钩子
    │   ├── useTimer.ts               # 计时器钩子
    │   ├── useRunSaver.ts            # 保存钩子
    │   └── useRunHistory.ts          # 历史钩子
    ├── store/
    │   └── useRunStore.ts            # Zustand Store
    ├── screens/
    │   ├── HomeScreen.tsx            # 首页
    │   ├── LiveRunScreen.tsx         # 实时跑步
    │   └── HistoryScreen.tsx         # 历史记录
    └── navigation/
        └── RootNavigator.tsx         # 导航配置
```

---

## 总结

Territory Runner MVP-0 是一个结构清晰、功能完整的跑步应用骨架：

✅ **模块化设计**: Hooks + Services + Utils  
✅ **类型安全**: 完整的 TypeScript 类型定义  
✅ **可扩展性**: 存储适配器模式，易于切换实现  
✅ **最佳实践**: React Hooks、函数式编程、关注点分离  

现在你可以：
1. 运行项目并测试基础功能
2. 根据需求定制 UI 样式
3. 接入云端存储（Firebase/Supabase）
4. 添加地图、后台跟踪等高级功能

祝开发顺利！🏃‍♂️

