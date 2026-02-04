import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-journey'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  
  // 用户画像
  userProfile: {
    aiType: { 
      type: String, 
      enum: ['high-p-high-j', 'low-p-high-j', 'low-p-low-j', 'high-p-low-j'],
      default: null 
    },
    pScore: { type: Number, default: null },
    jScore: { type: Number, default: null },
    completedAt: { type: Date, default: null }
  },
  
  // 能力水平
  abilityLevel: {
    replayCount: { type: Number, default: 0 },
    wrongClicks: { type: Number, default: 0 },
    aiImageAttempts: { type: Number, default: 0 }
  },
  
  // 偏好/兴趣
  preferences: {
    npcQuestionKeywords: { type: [String], default: [] },
    totalTime: { type: Number, default: 0 } // 秒
  },
  
  // 元数据
  createdAt: { type: Date, default: Date.now },
  lastUpdatedAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// ==================== API Routes ====================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Journey API is running' })
})

// 创建或获取用户
app.post('/api/users', async (req, res) => {
  try {
    const { userId, email } = req.body
    
    if (!userId || !email) {
      return res.status(400).json({ error: 'userId and email are required' })
    }
    
    let user = await User.findOne({ userId })
    
    if (!user) {
      // 创建新用户
      user = new User({ userId, email })
      await user.save()
      console.log('✅ New user created:', userId)
    } else {
      // 更新最后登录时间
      user.lastLoginAt = new Date()
      await user.save()
      console.log('✅ User login:', userId)
    }
    
    res.json({ success: true, user })
  } catch (error) {
    console.error('Error creating/getting user:', error)
    res.status(500).json({ error: error.message })
  }
})

// 获取用户数据
app.get('/api/users/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json({ success: true, user })
  } catch (error) {
    console.error('Error getting user:', error)
    res.status(500).json({ error: error.message })
  }
})

// 更新用户AI类型（Glacier Step4）
app.put('/api/users/:userId/ai-type', async (req, res) => {
  try {
    const { pScore, jScore } = req.body
    
    if (pScore === undefined || jScore === undefined) {
      return res.status(400).json({ error: 'pScore and jScore are required' })
    }
    
    // 判断AI类型
    let aiType
    if (pScore >= 50 && jScore >= 50) {
      aiType = 'high-p-high-j'
    } else if (pScore < 50 && jScore >= 50) {
      aiType = 'low-p-high-j'
    } else if (pScore < 50 && jScore < 50) {
      aiType = 'low-p-low-j'
    } else {
      aiType = 'high-p-low-j'
    }
    
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      {
        'userProfile.aiType': aiType,
        'userProfile.pScore': pScore,
        'userProfile.jScore': jScore,
        'userProfile.completedAt': new Date(),
        lastUpdatedAt: new Date()
      },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('✅ AI type updated:', aiType)
    res.json({ success: true, aiType, user })
  } catch (error) {
    console.error('Error updating AI type:', error)
    res.status(500).json({ error: error.message })
  }
})

// 增加重玩次数
app.post('/api/users/:userId/replay', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $inc: { 'abilityLevel.replayCount': 1 },
        lastUpdatedAt: new Date()
      },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('✅ Replay count incremented')
    res.json({ success: true, replayCount: user.abilityLevel.replayCount })
  } catch (error) {
    console.error('Error incrementing replay:', error)
    res.status(500).json({ error: error.message })
  }
})

// 增加错误点击次数
app.post('/api/users/:userId/wrong-click', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $inc: { 'abilityLevel.wrongClicks': 1 },
        lastUpdatedAt: new Date()
      },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('✅ Wrong clicks incremented')
    res.json({ success: true, wrongClicks: user.abilityLevel.wrongClicks })
  } catch (error) {
    console.error('Error incrementing wrong clicks:', error)
    res.status(500).json({ error: error.message })
  }
})

// 增加AI识图尝试次数
app.post('/api/users/:userId/ai-attempt', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $inc: { 'abilityLevel.aiImageAttempts': 1 },
        lastUpdatedAt: new Date()
      },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('✅ AI attempts incremented')
    res.json({ success: true, aiImageAttempts: user.abilityLevel.aiImageAttempts })
  } catch (error) {
    console.error('Error incrementing AI attempts:', error)
    res.status(500).json({ error: error.message })
  }
})

// 添加NPC问题关键词
app.post('/api/users/:userId/keyword', async (req, res) => {
  try {
    const { keyword } = req.body
    
    if (!keyword) {
      return res.status(400).json({ error: 'keyword is required' })
    }
    
    const user = await User.findOne({ userId: req.params.userId })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // 只添加不重复的关键词
    if (!user.preferences.npcQuestionKeywords.includes(keyword)) {
      user.preferences.npcQuestionKeywords.push(keyword)
      user.lastUpdatedAt = new Date()
      await user.save()
      console.log('✅ Keyword added:', keyword)
    }
    
    res.json({ success: true, keywords: user.preferences.npcQuestionKeywords })
  } catch (error) {
    console.error('Error adding keyword:', error)
    res.status(500).json({ error: error.message })
  }
})

// 更新总游戏时间
app.post('/api/users/:userId/time', async (req, res) => {
  try {
    const { seconds } = req.body
    
    if (seconds === undefined) {
      return res.status(400).json({ error: 'seconds is required' })
    }
    
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $inc: { 'preferences.totalTime': seconds },
        lastUpdatedAt: new Date()
      },
      { new: true }
    )
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    console.log('✅ Total time updated:', user.preferences.totalTime)
    res.json({ success: true, totalTime: user.preferences.totalTime })
  } catch (error) {
    console.error('Error updating time:', error)
    res.status(500).json({ error: error.message })
  }
})

// 获取所有用户（管理员）
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    
    // 统计数据
    const stats = {
      total: users.length,
      highPHighJ: users.filter(u => u.userProfile.aiType === 'high-p-high-j').length,
      lowPHighJ: users.filter(u => u.userProfile.aiType === 'low-p-high-j').length,
      lowPLowJ: users.filter(u => u.userProfile.aiType === 'low-p-low-j').length,
      highPLowJ: users.filter(u => u.userProfile.aiType === 'high-p-low-j').length,
      avgReplayCount: users.reduce((sum, u) => sum + u.abilityLevel.replayCount, 0) / users.length || 0,
      avgWrongClicks: users.reduce((sum, u) => sum + u.abilityLevel.wrongClicks, 0) / users.length || 0,
      avgAIAttempts: users.reduce((sum, u) => sum + u.abilityLevel.aiImageAttempts, 0) / users.length || 0,
      avgTotalTime: users.reduce((sum, u) => sum + u.preferences.totalTime, 0) / users.length || 0
    }
    
    res.json({ success: true, users, stats })
  } catch (error) {
    console.error('Error getting all users:', error)
    res.status(500).json({ error: error.message })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 API: http://localhost:${PORT}/api`)
  console.log(`💚 Health: http://localhost:${PORT}/api/health`)
})
