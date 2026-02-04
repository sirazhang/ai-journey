import { API_BASE_URL } from '../config/api'

/**
 * 用户数据追踪服务 - 使用自有后端API
 * 
 * 用户数据结构：
 * {
 *   userId: string,              // 用户ID
 *   email: string,               // 用户邮箱
 *   
 *   userProfile: {
 *     aiType: string,            // AI类型: 'high-p-high-j' | 'low-p-high-j' | 'low-p-low-j' | 'high-p-low-j'
 *     pScore: number,            // P分数 (0-100)
 *     jScore: number,            // J分数 (0-100)
 *     completedAt: timestamp     // 完成Glacier step4的时间
 *   },
 *   
 *   abilityLevel: {
 *     replayCount: number,       // 重玩次数
 *     wrongClicks: number,       // 错误点击项
 *     aiImageAttempts: number,   // AI识图尝试次数
 *   },
 *   
 *   preferences: {
 *     npcQuestionKeywords: [],   // NPC答疑关键词数组
 *     totalTime: number,         // 总游戏时间（秒）
 *   },
 *   
 *   createdAt: timestamp,
 *   lastUpdatedAt: timestamp,
 *   lastLoginAt: timestamp
 * }
 */

// 创建或获取用户
export const createOrGetUser = async (userId, email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create/get user')
    }
    
    console.log('User created/retrieved:', userId)
    return data.user
  } catch (error) {
    console.error('Error creating/getting user:', error)
    throw error
  }
}

// 更新用户AI类型（Glacier step4完成后）
export const updateUserAIType = async (userId, pScore, jScore) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/ai-type`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pScore, jScore })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update AI type')
    }
    
    console.log('User AI type updated:', data.aiType)
    return data.aiType
  } catch (error) {
    console.error('Error updating AI type:', error)
    throw error
  }
}

// 增加重玩次数
export const incrementReplayCount = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/replay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to increment replay count')
    }
    
    console.log('Replay count incremented:', data.replayCount)
    return data.replayCount
  } catch (error) {
    console.error('Error incrementing replay count:', error)
    throw error
  }
}

// 增加错误点击次数
export const incrementWrongClicks = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/wrong-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to increment wrong clicks')
    }
    
    console.log('Wrong clicks incremented:', data.wrongClicks)
    return data.wrongClicks
  } catch (error) {
    console.error('Error incrementing wrong clicks:', error)
    throw error
  }
}

// 增加AI识图尝试次数
export const incrementAIImageAttempts = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/ai-attempt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to increment AI attempts')
    }
    
    console.log('AI attempts incremented:', data.aiImageAttempts)
    return data.aiImageAttempts
  } catch (error) {
    console.error('Error incrementing AI attempts:', error)
    throw error
  }
}

// 添加NPC问题关键词
export const addNPCQuestionKeyword = async (userId, keyword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/keyword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add keyword')
    }
    
    console.log('Keyword added:', keyword)
    return data.keywords
  } catch (error) {
    console.error('Error adding keyword:', error)
    throw error
  }
}

// 更新总游戏时间
export const updateTotalTime = async (userId, additionalSeconds) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seconds: additionalSeconds })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update time')
    }
    
    console.log('Total time updated:', data.totalTime)
    return data.totalTime
  } catch (error) {
    console.error('Error updating time:', error)
    throw error
  }
}

// 获取用户数据
export const getUserData = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`)
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user data')
    }
    
    return data.user
  } catch (error) {
    console.error('Error getting user data:', error)
    throw error
  }
}

// 获取所有用户数据（管理员）
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`)
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get all users')
    }
    
    return data
  } catch (error) {
    console.error('Error getting all users:', error)
    throw error
  }
}
