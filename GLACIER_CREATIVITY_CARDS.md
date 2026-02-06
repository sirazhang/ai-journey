# Glacier Creativity Cards Feature Specification

## 功能概述

在Glacier完成任务进入彩色地图后，用户点击NPC除了现有对话外，会在左下角或右上角随机弹出创意激发提问卡片。

---

## 卡片类型

### 1. WHY卡片（蓝色）
- **颜色主题**: 蓝色 (#3b82f6)
- **图标**: `/glacier/icon/ask.png`
- **标题**: "WHY?" + "DARE WHY"
- **问题示例**:
  - Why do straws have a sharp end and a flat end?
  - Why do water bottles have bumpy lines on them?
  - Why are umbrella ribs curved not straight?
  - Why is there a small paper on one end of an eraser?
  - Why do doorknobs have a round shape?
  - Why do light switches have a little bump?

### 2. WHAT IF卡片（橙色）
- **颜色主题**: 橙色 (#f97316)
- **图标**: `/glacier/icon/ask.png`
- **标题**: "What if?"
- **问题示例**:
  - What if clouds could talk?
  - What if animals could read?
  - What if clocks ran backward?
  - What if stones could float?
  - What if wind had a voice?
  - What if fruits could change taste?

---

## UI设计

### 卡片结构
```
┌─────────────────────────────────────┐
│ 🗨️ WHY? / What if?            [X]  │
│ ─────────────────────────────────── │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Why do water bottles have     │ │ ← 问题（加粗+波浪下划线）
│  │ bumpy lines on them?          │ │
│  └───────────────────────────────┘ │
│                                     │
│  YOUR THOUGHT                       │
│  ┌───────────────────────────────┐ │
│  │ Type your answer here...      │ │ ← 输入框
│  │ don't be afraid to guess!     │ │
│  │ Curiosity has no wrong        │ │
│  │ answers.                      │ │
│  └───────────────────────────────┘ │
│                                     │
│  [🔄 Get Feedback]  Thinking is... │
│                     Skip to answer→ │
└─────────────────────────────────────┘
```

### 答案显示
```
┌─────────────────────────────────────┐
│  ANSWER                             │
│  ┌───────────────────────────────┐ │
│  │ The bumpy lines on water      │ │
│  │ bottles help with grip and... │ │
│  └───────────────────────────────┘ │
│                                     │
│  [💾 Save]                          │
└─────────────────────────────────────┘
```

---

## 交互流程

### 1. 触发条件
- ✅ Glacier任务完成，进入彩色地图
- ✅ 用户点击NPC
- ✅ 显示现有对话后
- ✅ 随机在左下角或右上角弹出卡片

### 2. 获取问题
- 调用Gemini API生成问题
- Prompt模板：
  ```
  Generate a creative "Why" question about everyday objects.
  The question should be simple, curious, and encourage creative thinking.
  Format: "Why do [object] have/do [feature]?"
  Example: "Why do water bottles have bumpy lines on them?"
  ```

### 3. 用户输入
- 用户在输入框输入想法
- 提示文字：
  ```
  Type your answer here... don't be afraid to guess!
  Curiosity has no wrong answers.
  ```

### 4. 获取反馈
- 点击 "Get Feedback" 按钮
- 图标：`/glacier/icon/feedback.png`
- 调用Gemini API获取简短反馈
- Prompt模板：
  ```
  User's answer: [user input]
  Question: [question]
  
  Provide a brief, encouraging feedback (2-3 sentences) that:
  1. Acknowledges their thinking
  2. Adds an interesting insight
  3. Encourages further curiosity
  ```

### 5. 跳过到答案
- 点击 "Skip to answer" 按钮
- 图标：`/glacier/icon/skip.png`
- 文字："Thinking is the best way to learn! | Skip to answer →"
- 调用Gemini API获取标准答案
- Prompt模板：
  ```
  Question: [question]
  
  Provide a clear, educational answer (3-4 sentences) that explains:
  1. The practical reason
  2. The design principle
  3. An interesting fact
  ```

### 6. 保存记录
- 点击 "Save" 按钮
- 图标：`/desert/icon/save.svg`
- 保存内容：
  - 问题类型（Why/What if）
  - 问题内容
  - 用户答案
  - AI反馈/答案
  - 时间戳
- 同步到 User Log → Report

---

## 数据结构

### localStorage存储
```javascript
{
  aiJourneyUser: {
    creativityRecords: [
      {
        id: timestamp,
        type: 'why' | 'whatif',
        question: 'Why do water bottles...',
        userAnswer: 'I think it helps...',
        aiFeedback: 'Great thinking! The bumpy...',
        aiAnswer: 'The bumpy lines serve...',
        timestamp: 1738742400000,
        region: 'Glacier',
        saved: true
      }
    ]
  }
}
```

### Report显示格式
```
Subject: Creativity - Why Question
Preview: Why do water bottles have bumpy lines...
Content:
  Question: Why do water bottles have bumpy lines on them?
  
  Your Thought: I think it helps with grip...
  
  AI Feedback: Great thinking! The bumpy lines...
  
  Answer: The bumpy lines serve multiple purposes...
```

---

## Gemini API集成

### API调用
```javascript
import { sendMessageToGemini } from '../services/geminiService'

// 生成问题
const generateQuestion = async (type) => {
  const prompt = type === 'why' 
    ? 'Generate a creative "Why" question about everyday objects...'
    : 'Generate a creative "What if" question...'
  
  const question = await sendMessageToGemini(prompt, [], systemInstruction)
  return question
}

// 获取反馈
const getFeedback = async (question, userAnswer) => {
  const prompt = `User's answer: ${userAnswer}\nQuestion: ${question}\n\nProvide brief feedback...`
  const feedback = await sendMessageToGemini(prompt, [], systemInstruction)
  return feedback
}

// 获取答案
const getAnswer = async (question) => {
  const prompt = `Question: ${question}\n\nProvide a clear answer...`
  const answer = await sendMessageToGemini(prompt, [], systemInstruction)
  return answer
}
```

---

## 样式规范

### WHY卡片（蓝色）
```css
background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)
border: 3px dashed #3b82f6
title-color: #1e40af
question-background: white
question-border: 2px dashed #3b82f6
question-underline: wavy #3b82f6
button-color: #3b82f6
```

### WHAT IF卡片（橙色）
```css
background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)
border: 3px dashed #f97316
title-color: #c2410c
question-background: white
question-border: 2px dashed #f97316
question-underline: wavy #f97316
button-color: #f97316
```

### 卡片定位
```css
/* 左下角 */
position: absolute
bottom: 100px
left: 50px
z-index: 100

/* 右上角 */
position: absolute
top: 100px
right: 50px
z-index: 100
```

---

## 图标资源

- `/glacier/icon/ask.png` - 提问图标
- `/glacier/icon/feedback.png` - 反馈图标
- `/glacier/icon/skip.png` - 跳过图标
- `/desert/icon/save.svg` - 保存图标

---

## 实现步骤

### Phase 1: 基础卡片组件
- [ ] 创建CreativityCard组件
- [ ] 实现WHY和WHAT IF两种样式
- [ ] 添加关闭按钮
- [ ] 随机位置显示

### Phase 2: 问题生成
- [ ] 集成Gemini API
- [ ] 实现问题生成逻辑
- [ ] 添加加载状态
- [ ] 错误处理

### Phase 3: 用户交互
- [ ] 实现输入框
- [ ] Get Feedback功能
- [ ] Skip to Answer功能
- [ ] 答案显示

### Phase 4: 数据保存
- [ ] 保存到localStorage
- [ ] 同步到Report
- [ ] 更新badge计数

### Phase 5: 集成到Glacier
- [ ] 在彩色地图模式下触发
- [ ] NPC对话后显示
- [ ] 随机选择卡片类型
- [ ] 随机选择显示位置

---

## 用户体验

### 鼓励探索
- 无错误答案的理念
- 积极的反馈语气
- 激发好奇心

### 学习价值
- 培养批判性思维
- 鼓励创造性思考
- 提供教育性答案

### 游戏化
- 收集问题和答案
- 在Report中回顾
- 分享有趣的思考

---

## 测试场景

1. ✅ 完成Glacier任务进入彩色地图
2. ✅ 点击NPC触发卡片
3. ✅ 卡片随机显示在左下或右上
4. ✅ 问题正确生成
5. ✅ 用户可以输入答案
6. ✅ Get Feedback返回有用反馈
7. ✅ Skip to Answer显示完整答案
8. ✅ Save功能正常工作
9. ✅ Report中正确显示
10. ✅ Badge计数更新

---

## 注意事项

- Gemini API调用需要错误处理
- 加载状态需要友好提示
- 保存前验证用户输入
- 卡片不应遮挡重要UI元素
- 移动端适配

---

**状态**: 📝 规格完成，准备实现
**优先级**: 高
**预计工作量**: 4-6小时
