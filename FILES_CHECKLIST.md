# Territory Runner MVP-0 - 文件清单

## ✅ 所有文件清单

### 根目录配置文件 (7 个)
- [x] `App.tsx` - 应用入口
- [x] `package.json` - NPM 依赖和脚本
- [x] `tsconfig.json` - TypeScript 配置
- [x] `app.json` - Expo 配置（包含权限）
- [x] `.eslintrc.js` - ESLint 配置
- [x] `.gitignore` - Git 忽略文件
- [x] `README.md` - 项目说明文档

### 文档文件 (3 个)
- [x] `README.md` - 项目概览和快速开始
- [x] `IMPLEMENTATION_GUIDE.md` - 详细实现指南
- [x] `STORAGE_MIGRATION_GUIDE.md` - 存储迁移指南

### 源代码文件

#### 类型定义 (1 个)
- [x] `src/types/index.ts` - 所有 TypeScript 类型定义

#### 工具函数 (2 个)
- [x] `src/utils/calculations.ts` - 距离和配速计算（Haversine）
- [x] `src/utils/formatters.ts` - 数据格式化工具

#### 存储服务 (3 个)
- [x] `src/services/storage/index.ts` - 存储适配器
- [x] `src/services/storage/local.ts` - AsyncStorage 本地存储实现
- [x] `src/services/storage/cloud.ts` - 云端存储占位（含 Firebase 模板）

#### Hooks (4 个)
- [x] `src/hooks/useGPS.ts` - GPS 跟踪（expo-location）
- [x] `src/hooks/useTimer.ts` - 计时器（开始/暂停/重置）
- [x] `src/hooks/useRunSaver.ts` - 跑步记录保存
- [x] `src/hooks/useRunHistory.ts` - 历史记录管理

#### 状态管理 (1 个，可选)
- [x] `src/store/useRunStore.ts` - Zustand 全局状态（可选使用）

#### 界面组件 (3 个)
- [x] `src/screens/HomeScreen.tsx` - 首页
- [x] `src/screens/LiveRunScreen.tsx` - 实时跑步界面
- [x] `src/screens/HistoryScreen.tsx` - 历史记录列表

#### 导航 (1 个)
- [x] `src/navigation/RootNavigator.tsx` - React Navigation 配置

---

**总计**: 21 个核心文件

---

## 📦 依赖项清单

### 核心依赖
```json
{
  "expo": "~50.0.0",
  "react": "18.2.0",
  "react-native": "0.73.0"
}
```

### 导航
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17",
  "react-native-safe-area-context": "4.8.0",
  "react-native-screens": "~3.29.0"
}
```

### 功能依赖
```json
{
  "expo-location": "~16.5.0",
  "expo-status-bar": "~1.11.0",
  "@react-native-async-storage/async-storage": "1.21.0",
  "zustand": "^4.4.7"
}
```

### 开发依赖
```json
{
  "@babel/core": "^7.23.5",
  "@types/react": "~18.2.45",
  "@types/react-native": "~0.73.0",
  "typescript": "^5.3.3",
  "@typescript-eslint/eslint-plugin": "^6.15.0",
  "@typescript-eslint/parser": "^6.15.0",
  "eslint": "^8.56.0",
  "eslint-config-expo": "^7.0.0"
}
```

---

## 🚀 快速启动步骤

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

#### iOS 模拟器
```bash
npm run ios
```

#### Android 模拟器
```bash
npm run android
```

#### 真机测试
1. 安装 Expo Go App
2. 扫描终端显示的二维码

---

## 🔍 代码检查

### TypeScript 类型检查
```bash
npm run type-check
```

### ESLint 代码检查
```bash
npm run lint
```

---

## 📝 核心功能验证清单

### HomeScreen 首页
- [ ] 显示"开始跑步"按钮
- [ ] 显示最近一次跑步摘要
- [ ] 显示统计概览（总次数/总距离/总时长）
- [ ] 点击"开始跑步"跳转到 LiveRunScreen
- [ ] 点击"查看全部"跳转到 HistoryScreen

### LiveRunScreen 实时跑步
- [ ] 请求 GPS 权限
- [ ] 点击"开始跑步"启动 GPS 和计时器
- [ ] 实时显示距离
- [ ] 实时显示时长
- [ ] 实时显示配速
- [ ] 显示 GPS 跟踪状态
- [ ] 显示路径点数量
- [ ] 点击"暂停"暂停计时和 GPS
- [ ] 点击"继续"恢复计时和 GPS
- [ ] 点击"停止并保存"保存记录
- [ ] 点击"放弃"清空数据返回首页

### HistoryScreen 历史记录
- [ ] 显示所有跑步记录列表（倒序）
- [ ] 每条记录显示日期/距离/时长/配速
- [ ] 点击记录弹出详情模态框
- [ ] 详情显示完整信息
- [ ] 点击"删除"删除记录
- [ ] 下拉刷新列表
- [ ] 空状态提示

---

## 📊 项目结构

```
Territory_Runner/
├── App.tsx                         # 应用入口
├── app.json                        # Expo 配置
├── package.json                    # 依赖管理
├── tsconfig.json                   # TypeScript 配置
├── README.md                       # 项目说明
├── IMPLEMENTATION_GUIDE.md         # 实现指南
├── STORAGE_MIGRATION_GUIDE.md      # 存储迁移指南
└── src/
    ├── types/
    │   └── index.ts               # 类型定义
    ├── utils/
    │   ├── calculations.ts        # 计算工具
    │   └── formatters.ts          # 格式化工具
    ├── services/
    │   └── storage/
    │       ├── index.ts           # 存储适配器
    │       ├── local.ts           # 本地存储
    │       └── cloud.ts           # 云端存储占位
    ├── hooks/
    │   ├── useGPS.ts              # GPS 钩子
    │   ├── useTimer.ts            # 计时器钩子
    │   ├── useRunSaver.ts         # 保存钩子
    │   └── useRunHistory.ts       # 历史钩子
    ├── store/
    │   └── useRunStore.ts         # 全局状态（可选）
    ├── screens/
    │   ├── HomeScreen.tsx         # 首页
    │   ├── LiveRunScreen.tsx      # 实时跑步
    │   └── HistoryScreen.tsx      # 历史记录
    └── navigation/
        └── RootNavigator.tsx      # 导航配置
```

---

## 🐛 常见问题

### Q: GPS 定位不准确？
**A**: 在室外测试，确保设备定位服务已开启

### Q: GPS 权限被拒绝？
**A**: 
- iOS: 设置 → 隐私 → 定位服务 → Territory Runner → 始终
- Android: 设置 → 应用 → Territory Runner → 权限 → 位置 → 始终允许

### Q: 数据未保存？
**A**: 检查 AsyncStorage 权限，查看控制台日志

---

## 📚 相关文档

1. **README.md** - 项目概览和快速开始
2. **IMPLEMENTATION_GUIDE.md** - 详细实现说明和 API 文档
3. **STORAGE_MIGRATION_GUIDE.md** - 如何切换到云端存储

---

## ✨ MVP-0 特色

- ✅ **极简设计**: 只包含核心功能，无冗余代码
- ✅ **零配置运行**: 安装依赖即可运行
- ✅ **类型安全**: 100% TypeScript 覆盖
- ✅ **模块化设计**: 清晰的代码结构
- ✅ **易于扩展**: 适配器模式支持多种存储
- ✅ **完整文档**: 详细文档覆盖所有场景

---

**Territory Runner MVP-0** - 简单、纯粹、可运行的跑步应用骨架 🏃‍♂️

版本: 0.1.0  
状态: ✅ MVP 就绪
