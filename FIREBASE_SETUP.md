# Firebase 后端设置指南

## 1. 创建 Firebase 项目

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击 "添加项目" 或 "Create a project"
3. 输入项目名称（例如：ai-journey）
4. 选择是否启用 Google Analytics（可选）
5. 创建项目

## 2. 设置 Firestore 数据库

1. 在 Firebase 控制台左侧菜单，点击 "Firestore Database"
2. 点击 "创建数据库"
3. 选择 "以测试模式启动"（开发阶段）
4. 选择数据库位置（建议选择离用户最近的区域）

## 3. 获取 Firebase 配置

1. 在 Firebase 控制台，点击项目设置（齿轮图标）
2. 滚动到 "您的应用" 部分
3. 点击 Web 图标 (</>)
4. 注册应用（输入应用昵称）
5. 复制 firebaseConfig 对象中的值

## 4. 配置环境变量

将获取的配置值添加到 `.env` 文件：

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 5. 使用示例

### 在组件中使用用户追踪

```javascript
import { 
  createOrGetUser, 
  updateUserAIType, 
  incrementReplayCount,
  incrementWrongClicks,
  incrementAIImageAttempts,
  addNPCQuestionKeyword,
  updateTotalTime,
  getUserData
} from '../services/userTracking'

// 示例1: 用户登录时创建或获取用户
const handleUserLogin = async (userId, email) => {
  try {
    const userData = await createOrGetUser(userId, email)
    console.log('User data:', userData)
  } catch (error) {
    console.error('Login error:', error)
  }
}

// 示例2: Glacier Step4 完成后更新AI类型
const handleGlacierStep4Complete = async (userId, pScore, jScore) => {
  try {
    const aiType = await updateUserAIType(userId, pScore, jScore)
    console.log('User AI type:', aiType)
    // aiType 可能的值: 'high-p-high-j', 'low-p-high-j', 'low-p-low-j', 'high-p-low-j'
  } catch (error) {
    console.error('Update AI type error:', error)
  }
}

// 示例3: 用户重玩关卡
const handleReplay = async (userId) => {
  try {
    await incrementReplayCount(userId)
  } catch (error) {
    console.error('Increment replay error:', error)
  }
}

// 示例4: 用户点击错误选项
const handleWrongClick = async (userId) => {
  try {
    await incrementWrongClicks(userId)
  } catch (error) {
    console.error('Increment wrong clicks error:', error)
  }
}

// 示例5: 用户使用AI识图
const handleAIImageRecognition = async (userId) => {
  try {
    await incrementAIImageAttempts(userId)
  } catch (error) {
    console.error('Increment AI attempts error:', error)
  }
}

// 示例6: 用户向NPC提问
const handleNPCQuestion = async (userId, question) => {
  try {
    // 提取关键词（可以使用简单的分词或关键词提取）
    const keyword = extractKeyword(question)
    await addNPCQuestionKeyword(userId, keyword)
  } catch (error) {
    console.error('Add keyword error:', error)
  }
}

// 示例7: 更新游戏时间（每分钟或退出时）
const handleUpdateGameTime = async (userId, seconds) => {
  try {
    await updateTotalTime(userId, seconds)
  } catch (error) {
    console.error('Update time error:', error)
  }
}

// 示例8: 获取用户完整数据
const handleGetUserData = async (userId) => {
  try {
    const userData = await getUserData(userId)
    console.log('Complete user data:', userData)
  } catch (error) {
    console.error('Get user data error:', error)
  }
}
```

## 6. 数据结构

### Users Collection

```
users/
  {userId}/
    - userId: string
    - email: string
    - userProfile:
        - aiType: string ('high-p-high-j' | 'low-p-high-j' | 'low-p-low-j' | 'high-p-low-j')
        - pScore: number (0-100)
        - jScore: number (0-100)
        - completedAt: timestamp
    - abilityLevel:
        - replayCount: number
        - wrongClicks: number
        - aiImageAttempts: number
    - preferences:
        - npcQuestionKeywords: array
        - totalTime: number (seconds)
    - createdAt: timestamp
    - lastUpdatedAt: timestamp
    - lastLoginAt: timestamp
```

## 7. 安全规则（生产环境）

在 Firestore 规则中设置：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 用户只能读写自己的数据
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 8. 注意事项

1. **测试模式**: 开发阶段使用测试模式，任何人都可以读写数据
2. **生产模式**: 上线前务必设置安全规则
3. **免费额度**: 
   - 存储: 1 GB
   - 读取: 50,000 次/天
   - 写入: 20,000 次/天
   - 删除: 20,000 次/天
4. **性能优化**: 批量操作使用 batch writes
5. **离线支持**: Firestore 支持离线缓存

## 9. 调试

在浏览器控制台查看 Firebase 操作日志：

```javascript
// 所有操作都会在控制台输出日志
console.log('User created:', userId)
console.log('AI type updated:', aiType)
```

## 10. 数据导出

在 Firebase Console 可以导出数据为 JSON 格式进行分析。
