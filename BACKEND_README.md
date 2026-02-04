# AI Journey 后端数据追踪系统

## 📋 概述

已为你的项目添加了完整的后端数据追踪系统，使用 **Firebase Firestore** 作为数据库。

## 🎯 追踪的数据

### 1. 基本信息
- ✅ 用户邮箱/ID
- ✅ 创建时间
- ✅ 最后登录时间

### 2. 用户画像
- ✅ AI类型（Glacier Step4完成后）
  - `high-p-high-j` (高P高J)
  - `low-p-high-j` (低P高J)
  - `low-p-low-j` (低P低J)
  - `high-p-low-j` (高P低J)
- ✅ P分数 (0-100)
- ✅ J分数 (0-100)
- ✅ 完成时间

### 3. 能力水平
- ✅ 重玩次数
- ✅ 错误点击项
- ✅ AI识图尝试次数

### 4. 偏好/兴趣
- ✅ NPC答疑关键词数组
- ✅ 总游戏时间（秒）

## 📁 新增文件

```
src/
├── config/
│   └── firebase.js              # Firebase配置
├── services/
│   └── userTracking.js          # 用户追踪服务（核心功能）
└── components/
    └── AdminDashboard.jsx       # 管理员仪表板

文档/
├── FIREBASE_SETUP.md            # Firebase设置指南
├── INTEGRATION_EXAMPLE.md       # 集成示例代码
└── BACKEND_README.md            # 本文件
```

## 🚀 快速开始

### 步骤 1: 安装依赖

```bash
npm install firebase
```

✅ 已完成

### 步骤 2: 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目
3. 启用 Firestore Database（测试模式）
4. 获取 Web 应用配置

详细步骤见 `FIREBASE_SETUP.md`

### 步骤 3: 配置环境变量

在 `.env` 文件中添加：

```env
VITE_FIREBASE_API_KEY=你的API密钥
VITE_FIREBASE_AUTH_DOMAIN=你的项目.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=你的项目ID
VITE_FIREBASE_STORAGE_BUCKET=你的项目.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=你的发送者ID
VITE_FIREBASE_APP_ID=你的应用ID
```

### 步骤 4: 在代码中集成

参考 `INTEGRATION_EXAMPLE.md` 中的示例代码。

## 🔧 核心API

### 创建/获取用户
```javascript
import { createOrGetUser } from '../services/userTracking'

await createOrGetUser(userId, email)
```

### 更新AI类型（Glacier Step4）
```javascript
import { updateUserAIType } from '../services/userTracking'

const aiType = await updateUserAIType(userId, pScore, jScore)
// 返回: 'high-p-high-j' | 'low-p-high-j' | 'low-p-low-j' | 'high-p-low-j'
```

### 增加重玩次数
```javascript
import { incrementReplayCount } from '../services/userTracking'

await incrementReplayCount(userId)
```

### 增加错误点击
```javascript
import { incrementWrongClicks } from '../services/userTracking'

await incrementWrongClicks(userId)
```

### 增加AI识图尝试
```javascript
import { incrementAIImageAttempts } from '../services/userTracking'

await incrementAIImageAttempts(userId)
```

### 添加NPC问题关键词
```javascript
import { addNPCQuestionKeyword } from '../services/userTracking'

await addNPCQuestionKeyword(userId, keyword)
```

### 更新游戏时间
```javascript
import { updateTotalTime } from '../services/userTracking'

await updateTotalTime(userId, seconds)
```

### 获取用户数据
```javascript
import { getUserData } from '../services/userTracking'

const userData = await getUserData(userId)
```

## 📊 管理员仪表板

已创建 `AdminDashboard.jsx` 组件，可以查看：

- 📈 总用户数
- 🎯 各AI类型分布
- 📊 平均重玩次数
- ❌ 平均错误点击
- 🤖 平均AI尝试次数
- ⏱️ 平均游戏时间
- 📋 详细用户列表
- 🔍 按AI类型筛选

### 使用方法

在 `App.jsx` 中添加路由（可选）：

```javascript
import AdminDashboard from './components/AdminDashboard'

// 在某个条件下显示（例如URL参数）
{window.location.pathname === '/admin' && <AdminDashboard />}
```

或者创建一个独立的管理页面。

## 🔐 安全性

### 开发阶段（当前）
- 使用测试模式
- 任何人都可以读写数据
- ⚠️ 仅用于开发测试

### 生产环境
在 Firebase Console 设置安全规则：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 💰 Firebase 免费额度

- 存储: 1 GB
- 读取: 50,000 次/天
- 写入: 20,000 次/天
- 删除: 20,000 次/天

对于中小型项目完全够用！

## 📝 数据结构示例

```json
{
  "userId": "user@example.com",
  "email": "user@example.com",
  "userProfile": {
    "aiType": "high-p-high-j",
    "pScore": 75,
    "jScore": 80,
    "completedAt": "2024-01-15T10:30:00Z"
  },
  "abilityLevel": {
    "replayCount": 3,
    "wrongClicks": 12,
    "aiImageAttempts": 8
  },
  "preferences": {
    "npcQuestionKeywords": ["AI", "ethics", "privacy", "data"],
    "totalTime": 3600
  },
  "createdAt": "2024-01-10T08:00:00Z",
  "lastUpdatedAt": "2024-01-15T10:30:00Z",
  "lastLoginAt": "2024-01-15T09:00:00Z"
}
```

## 🎯 集成建议

### 优先级 1: 必须集成
1. ✅ 用户登录时创建记录 (`SignInModal.jsx`)
2. ✅ Glacier Step4 完成后记录AI类型 (`GlacierMap.jsx`)

### 优先级 2: 重要功能
3. ✅ 记录重玩次数 (`App.jsx` - handleStartOver)
4. ✅ 记录错误点击 (各个任务组件)
5. ✅ 记录AI识图尝试 (`IslandMap.jsx`, `DesertMap.jsx`)

### 优先级 3: 增强功能
6. ✅ 记录NPC问题关键词 (Glitch对话)
7. ✅ 记录游戏时间 (各个地图组件)

## 🐛 调试

所有操作都会在浏览器控制台输出日志：

```javascript
console.log('User created:', userId)
console.log('AI type updated:', aiType)
console.log('Replay count incremented')
```

在 Firebase Console 可以实时查看数据变化。

## 📤 数据导出

在 Firebase Console 可以：
1. 导出为 JSON 格式
2. 使用 Firebase Admin SDK 批量导出
3. 连接到 BigQuery 进行高级分析

## ❓ 常见问题

### Q: 如果用户没有网络怎么办？
A: Firebase 会自动缓存数据，网络恢复后自动同步。

### Q: 如何删除用户数据？
A: 在 Firebase Console 手动删除，或使用 Admin SDK。

### Q: 数据会丢失吗？
A: Firebase 有自动备份，数据非常安全。

### Q: 可以迁移到其他数据库吗？
A: 可以，导出 JSON 后迁移到 MongoDB、PostgreSQL 等。

## 📞 支持

如有问题，请查看：
- `FIREBASE_SETUP.md` - 详细设置指南
- `INTEGRATION_EXAMPLE.md` - 代码集成示例
- [Firebase 文档](https://firebase.google.com/docs/firestore)

## ✅ 下一步

1. [ ] 在 Firebase Console 创建项目
2. [ ] 配置 `.env` 文件
3. [ ] 在 `SignInModal.jsx` 中集成用户创建
4. [ ] 在 `GlacierMap.jsx` 中集成AI类型记录
5. [ ] 测试数据是否正确保存
6. [ ] 查看 AdminDashboard 确认数据

祝你使用愉快！🎉
