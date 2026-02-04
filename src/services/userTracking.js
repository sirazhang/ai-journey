import { db } from '../config/firebase'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

/**
 * 用户数据结构：
 * {
 *   userId: string,              // 用户ID
 *   email: string,               // 用户邮箱
 *   
 *   // 用户画像
 *   userProfile: {
 *     aiType: string,            // AI类型: 'high-p-high-j' | 'low-p-high-j' | 'low-p-low-j' | 'high-p-low-j'
 *     pScore: number,            // P分数 (0-100)
 *     jScore: number,            // J分数 (0-100)
 *     completedAt: timestamp     // 完成Glacier step4的时间
 *   },
 *   
 *   // 能力水平
 *   abilityLevel: {
 *     replayCount: number,       // 重玩次数
 *     wrongClicks: number,       // 错误点击项
 *     aiImageAttempts: number,   // AI识图尝试次数
 *   },
 *   
 *   // 偏好/兴趣
 *   preferences: {
 *     npcQuestionKeywords: [],   // NPC答疑关键词数组
 *     totalTime: number,         // 总游戏时间（秒）
 *   },
 *   
 *   // 元数据
 *   createdAt: timestamp,
 *   lastUpdatedAt: timestamp,
 *   lastLoginAt: timestamp
 * }
 */

// 创建或获取用户文档
export const createOrGetUser = async (userId, email) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (!userSnap.exists()) {
      // 创建新用户
      const newUser = {
        userId,
        email,
        userProfile: {
          aiType: null,
          pScore: null,
          jScore: null,
          completedAt: null
        },
        abilityLevel: {
          replayCount: 0,
          wrongClicks: 0,
          aiImageAttempts: 0
        },
        preferences: {
          npcQuestionKeywords: [],
          totalTime: 0
        },
        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      }
      
      await setDoc(userRef, newUser)
      console.log('New user created:', userId)
      return newUser
    } else {
      // 更新最后登录时间
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      })
      console.log('User exists:', userId)
      return userSnap.data()
    }
  } catch (error) {
    console.error('Error creating/getting user:', error)
    throw error
  }
}

// 更新用户AI类型（Glacier step4完成后）
export const updateUserAIType = async (userId, pScore, jScore) => {
  try {
    const userRef = doc(db, 'users', userId)
    
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
    
    await updateDoc(userRef, {
      'userProfile.aiType': aiType,
      'userProfile.pScore': pScore,
      'userProfile.jScore': jScore,
      'userProfile.completedAt': serverTimestamp(),
      lastUpdatedAt: serverTimestamp()
    })
    
    console.log('User AI type updated:', aiType)
    return aiType
  } catch (error) {
    console.error('Error updating AI type:', error)
    throw error
  }
}

// 增加重玩次数
export const incrementReplayCount = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const currentCount = userSnap.data().abilityLevel.replayCount || 0
      await updateDoc(userRef, {
        'abilityLevel.replayCount': currentCount + 1,
        lastUpdatedAt: serverTimestamp()
      })
      console.log('Replay count incremented')
    }
  } catch (error) {
    console.error('Error incrementing replay count:', error)
    throw error
  }
}

// 增加错误点击次数
export const incrementWrongClicks = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const currentCount = userSnap.data().abilityLevel.wrongClicks || 0
      await updateDoc(userRef, {
        'abilityLevel.wrongClicks': currentCount + 1,
        lastUpdatedAt: serverTimestamp()
      })
      console.log('Wrong clicks incremented')
    }
  } catch (error) {
    console.error('Error incrementing wrong clicks:', error)
    throw error
  }
}

// 增加AI识图尝试次数
export const incrementAIImageAttempts = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const currentCount = userSnap.data().abilityLevel.aiImageAttempts || 0
      await updateDoc(userRef, {
        'abilityLevel.aiImageAttempts': currentCount + 1,
        lastUpdatedAt: serverTimestamp()
      })
      console.log('AI image attempts incremented')
    }
  } catch (error) {
    console.error('Error incrementing AI image attempts:', error)
    throw error
  }
}

// 添加NPC问题关键词
export const addNPCQuestionKeyword = async (userId, keyword) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const currentKeywords = userSnap.data().preferences.npcQuestionKeywords || []
      if (!currentKeywords.includes(keyword)) {
        currentKeywords.push(keyword)
        await updateDoc(userRef, {
          'preferences.npcQuestionKeywords': currentKeywords,
          lastUpdatedAt: serverTimestamp()
        })
        console.log('NPC keyword added:', keyword)
      }
    }
  } catch (error) {
    console.error('Error adding NPC keyword:', error)
    throw error
  }
}

// 更新总游戏时间
export const updateTotalTime = async (userId, additionalSeconds) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const currentTime = userSnap.data().preferences.totalTime || 0
      await updateDoc(userRef, {
        'preferences.totalTime': currentTime + additionalSeconds,
        lastUpdatedAt: serverTimestamp()
      })
      console.log('Total time updated:', currentTime + additionalSeconds)
    }
  } catch (error) {
    console.error('Error updating total time:', error)
    throw error
  }
}

// 获取用户数据
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      console.log('User not found')
      return null
    }
  } catch (error) {
    console.error('Error getting user data:', error)
    throw error
  }
}
