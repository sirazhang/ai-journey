# AI Journey 后端系统 - 阿里云版本

## 🎯 概述

已为你创建了完整的自有后端系统，使用 **Node.js + Express + MongoDB**，可以部署在你的阿里云服务器上。

## 📁 项目结构

```
ai-journey/
├── backend/                    # 后端代码
│   ├── server.js              # Express 服务器
│   ├── package.json           # 后端依赖
│   ├── .env                   # 后端环境变量
│   └── .env.example           # 环境变量示例
├── src/
│   ├── config/
│   │   └── api.js             # API 配置（包含后端URL）
│   ├── services/
│   │   └── userTracking.js    # 用户追踪服务（已更新为REST API）
│   └── components/
│       └── AdminDashboard.jsx # 管理员面板（已更新）
└── ALIYUN_DEPLOYMENT.md       # 详细部署指南
```

## 🚀 快速开始

### 1. 本地开发测试

#### 启动后端

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 启动服务器
npm start

# 或使用开发模式（自动重启）
npm run dev
```

后端将运行在 `http://localhost:3001`

#### 启动前端

```bash
# 在项目根目录
npm run dev
```

前端将运行在 `http://localhost:5173`

### 2. 测试 API

```bash
# 健康检查
curl http://localhost:3001/api/health

# 创建用户
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"userId":"test@example.com","email":"test@example.com"}'

# 获取用户
curl http://localhost:3001/api/users/test@example.com
```

## 📊 追踪的数据

### 1. 基本信息
- ✅ 用户邮箱/ID
- ✅ 创建时间、最后更新时间、最后登录时间

### 2. 用户画像（Glacier Step4）
- ✅ AI类型：high-p-high-j, low-p-high-j, low-p-low-j, high-p-low-j
- ✅ P分数 (0-100)
- ✅ J分数 (0-100)

### 3. 能力水平
- ✅ 重玩次数
- ✅ 错误点击项
- ✅ AI识图尝试次数

### 4. 偏好/兴趣
- ✅ NPC答疑关键词数组
- ✅ 总游戏时间（秒）

## 🔌 API 端点

### 用户管理
- `POST /api/users` - 创建或获取用户
- `GET /api/users/:userId` - 获取用户数据

### 数据追踪
- `PUT /api/users/:userId/ai-type` - 更新AI类型
- `POST /api/users/:userId/replay` - 增加重玩次数
- `POST /api/users/:userId/wrong-click` - 增加错误点击
- `POST /api/users/:userId/ai-attempt` - 增加AI尝试
- `POST /api/users/:userId/keyword` - 添加关键词
- `POST /api/users/:userId/time` - 更新游戏时间

### 管理员
- `GET /api/admin/users` - 获取所有用户和统计数据

## 🔧 前端集成

### 使用示例

```javascript
import { 
  createOrGetUser, 
  updateUserAIType,
  incrementReplayCount,
  incrementWrongClicks,
  incrementAIImageAttempts,
  addNPCQuestionKeyword,
  updateTotalTime
} from '../services/userTracking'

// 用户登录
await createOrGetUser('user@example.com', 'user@example.com')

// Glacier Step4 完成
await updateUserAIType('user@example.com', 75, 80)

// 重玩关卡
await incrementReplayCount('user@example.com')

// 错误点击
await incrementWrongClicks('user@example.com')

// AI识图
await incrementAIImageAttempts('user@example.com')

// NPC问题
await addNPCQuestionKeyword('user@example.com', 'AI ethics')

// 更新时间
await updateTotalTime('user@example.com', 60)
```

详细集成示例见 `INTEGRATION_EXAMPLE.md`

## 🌐 部署到阿里云

详细步骤请查看 `ALIYUN_DEPLOYMENT.md`

### 简要步骤

1. **准备服务器**
   - ECS 服务器（已有）
   - 安装 Node.js、MongoDB、Nginx

2. **部署后端**
   - 上传代码到服务器
   - 配置环境变量
   - 使用 PM2 管理进程
   - 配置 Nginx 反向代理

3. **部署前端**
   - 构建: `npm run build`
   - 上传 dist 目录
   - 配置 Nginx 或使用 OSS

4. **配置域名**
   - 前端: `your-domain.com`
   - 后端: `api.your-domain.com`

## 💾 数据库

### MongoDB 连接

```env
# 本地 MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-journey

# 阿里云 MongoDB
MONGODB_URI=mongodb://username:password@dds-xxxxx.mongodb.rds.aliyuncs.com:3717/ai-journey
```

### 数据结构

```javascript
{
  userId: "user@example.com",
  email: "user@example.com",
  userProfile: {
    aiType: "high-p-high-j",
    pScore: 75,
    jScore: 80,
    completedAt: "2024-01-15T10:30:00Z"
  },
  abilityLevel: {
    replayCount: 3,
    wrongClicks: 12,
    aiImageAttempts: 8
  },
  preferences: {
    npcQuestionKeywords: ["AI", "ethics", "privacy"],
    totalTime: 3600
  },
  createdAt: "2024-01-10T08:00:00Z",
  lastUpdatedAt: "2024-01-15T10:30:00Z",
  lastLoginAt: "2024-01-15T09:00:00Z"
}
```

## 📊 管理员面板

访问 AdminDashboard 组件查看：
- 总用户数
- AI类型分布
- 平均能力指标
- 详细用户列表

## 🔒 安全性

- ✅ CORS 配置
- ✅ 环境变量保护
- ✅ MongoDB 认证
- ✅ HTTPS（生产环境）
- ⚠️ 建议添加 API 认证（JWT）

## 🐛 调试

### 后端日志
```bash
# PM2 日志
pm2 logs ai-journey-api

# 直接运行查看日志
cd backend
npm start
```

### 前端调试
- 打开浏览器控制台
- 查看 Network 标签
- 所有 API 调用都有日志输出

## 📈 性能

- MongoDB 索引已配置
- 支持并发请求
- 可扩展架构

## 💰 成本

- ✅ 使用已有阿里云服务器
- ✅ MongoDB 可选择最小规格
- ✅ 无第三方服务费用
- ✅ 完全自主控制

## 🆚 对比 Firebase

| 特性 | 自有后端 | Firebase |
|------|---------|----------|
| 成本 | 已有服务器，无额外费用 | 免费额度有限 |
| 控制 | 完全控制 | 受限于 Firebase |
| 数据 | 存储在自己服务器 | 存储在 Google |
| 扩展 | 完全自定义 | 受限于 Firebase API |
| 部署 | 需要自己部署 | 无需部署 |

## ✅ 下一步

1. [ ] 本地测试后端 API
2. [ ] 本地测试前端集成
3. [ ] 部署后端到阿里云
4. [ ] 部署前端到阿里云
5. [ ] 配置域名和 HTTPS
6. [ ] 在代码中集成追踪调用
7. [ ] 测试完整流程

## 📞 支持

- 部署指南: `ALIYUN_DEPLOYMENT.md`
- 集成示例: `INTEGRATION_EXAMPLE.md`
- API 文档: 见 `backend/server.js` 注释

## 🎉 优势

- ✅ **完全自主** - 数据在你的服务器
- ✅ **成本低** - 使用已有资源
- ✅ **灵活** - 可以随时修改
- ✅ **安全** - 完全控制
- ✅ **简单** - REST API 易于理解

祝使用愉快！🚀
