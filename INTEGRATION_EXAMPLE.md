# 用户追踪集成示例

## 在 GlacierMap.jsx 中集成

### 1. 导入追踪服务

```javascript
import { updateUserAIType, incrementWrongClicks } from '../services/userTracking'
```

### 2. 在 Glacier Step4 完成后记录AI类型

在 `handleDataCenterComplete` 函数中添加：

```javascript
const handleDataCenterComplete = async () => {
  // 现有代码...
  
  // 计算P和J分数
  const pScore = calculatePScore() // 根据你的逻辑计算
  const jScore = calculateJScore() // 根据你的逻辑计算
  
  // 获取用户ID（从localStorage或其他地方）
  const savedUser = localStorage.getItem('aiJourneyUser')
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    const userId = userData.email || userData.userId
    
    try {
      // 记录用户AI类型
      const aiType = await updateUserAIType(userId, pScore, jScore)
      console.log('User AI type recorded:', aiType)
    } catch (error) {
      console.error('Failed to record AI type:', error)
    }
  }
  
  // 继续现有逻辑...
}
```

### 3. 记录错误点击

在法院任务中，当用户选择错误答案时：

```javascript
const handleCourtAnswer = async (isCorrect) => {
  if (!isCorrect) {
    // 记录错误点击
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const userId = userData.email || userData.userId
      
      try {
        await incrementWrongClicks(userId)
      } catch (error) {
        console.error('Failed to record wrong click:', error)
      }
    }
  }
  
  // 继续现有逻辑...
}
```

## 在 IslandMap.jsx 中集成

### 记录AI识图尝试次数

```javascript
import { incrementAIImageAttempts } from '../services/userTracking'

const handleGlitchSend = async () => {
  // 现有代码...
  
  // 记录AI识图尝试
  const savedUser = localStorage.getItem('aiJourneyUser')
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    const userId = userData.email || userData.userId
    
    try {
      await incrementAIImageAttempts(userId)
    } catch (error) {
      console.error('Failed to record AI attempt:', error)
    }
  }
  
  // 继续API调用...
}
```

## 在 App.jsx 中集成

### 1. 用户登录时创建记录

```javascript
import { createOrGetUser } from './services/userTracking'

const handleSignUpComplete = async (userData) => {
  setIsFirstVisit(false)
  setUserLoggedIn(true)
  
  // 创建或获取用户记录
  try {
    await createOrGetUser(userData.email, userData.email)
    console.log('User tracking initialized')
  } catch (error) {
    console.error('Failed to initialize user tracking:', error)
  }
}
```

### 2. 记录重玩次数

```javascript
import { incrementReplayCount } from './services/userTracking'

const handleStartOver = async () => {
  // 现有代码...
  
  // 记录重玩
  const savedUser = localStorage.getItem('aiJourneyUser')
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    const userId = userData.email || userData.userId
    
    try {
      await incrementReplayCount(userId)
    } catch (error) {
      console.error('Failed to record replay:', error)
    }
  }
  
  // 继续现有逻辑...
}
```

### 3. 记录游戏时间

```javascript
import { updateTotalTime } from './services/userTracking'

// 在组件中添加计时器
useEffect(() => {
  const startTime = Date.now()
  
  return () => {
    // 组件卸载时记录时间
    const endTime = Date.now()
    const seconds = Math.floor((endTime - startTime) / 1000)
    
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const userId = userData.email || userData.userId
      
      updateTotalTime(userId, seconds).catch(error => {
        console.error('Failed to update time:', error)
      })
    }
  }
}, [])
```

## 在 Glitch 对话中记录关键词

```javascript
import { addNPCQuestionKeyword } from '../services/userTracking'

const handleGlitchSend = async () => {
  const userMessage = glitchInput.trim()
  
  // 提取关键词（简单示例）
  const keywords = userMessage.toLowerCase().split(' ')
  const savedUser = localStorage.getItem('aiJourneyUser')
  
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    const userId = userData.email || userData.userId
    
    // 记录每个关键词
    for (const keyword of keywords) {
      if (keyword.length > 3) { // 只记录长度大于3的词
        try {
          await addNPCQuestionKeyword(userId, keyword)
        } catch (error) {
          console.error('Failed to record keyword:', error)
        }
      }
    }
  }
  
  // 继续现有逻辑...
}
```

## 完整的用户ID管理

建议在 SignInModal 中生成唯一的用户ID：

```javascript
const handleSignUpComplete = async (userData) => {
  // 使用邮箱作为用户ID，或生成唯一ID
  const userId = userData.email
  
  // 保存到localStorage
  const userInfo = {
    ...userData,
    userId: userId,
    hasStarted: false
  }
  localStorage.setItem('aiJourneyUser', JSON.stringify(userInfo))
  
  // 初始化Firebase用户记录
  try {
    await createOrGetUser(userId, userData.email)
    console.log('User initialized in Firebase')
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
  
  setIsFirstVisit(false)
  setUserLoggedIn(true)
  onSignUpComplete(userData)
}
```

## 数据查看

在 Firebase Console 中可以实时查看所有用户数据：

1. 打开 Firebase Console
2. 选择你的项目
3. 点击 Firestore Database
4. 查看 `users` collection
5. 点击任意用户ID查看详细数据

## 注意事项

1. **错误处理**: 所有Firebase操作都应该用 try-catch 包裹
2. **离线支持**: Firebase会自动缓存数据，网络恢复后同步
3. **性能**: 避免频繁写入，可以批量更新
4. **隐私**: 确保遵守数据隐私法规（GDPR等）
