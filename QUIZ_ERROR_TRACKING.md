# Quiz Error Tracking Implementation

## 实施日期: 2026-02-05

## 问题描述

手机界面的Review（Notes App）没有显示用户在quiz中选择错误的情况。

## 解决方案

### 1. 保存Quiz错误记录

在 `IslandMap.jsx` 的 `handleQuizChoice` 函数中，当用户选择错误答案时，自动保存到 `errorRecords`：

```javascript
if (!isCorrect) {
  playWrongSound()
  
  // Save wrong answer to errorRecords
  const savedUser = localStorage.getItem('aiJourneyUser')
  if (savedUser) {
    const userData = JSON.parse(savedUser)
    if (!userData.errorRecords) {
      userData.errorRecords = []
    }
    
    userData.errorRecords.push({
      timestamp: Date.now(),
      region: 'Island',
      question: currentItem?.quiz?.question,
      userAnswer: choiceText,
      correctAnswer: correctChoice?.text,
      subject: `Island Quiz - Wrong Answer`,
      preview: `You selected: ${choiceText.substring(0, 50)}...`,
      content: `Question: ...\n\nYour Answer: ...\n\nCorrect Answer: ...`
    })
    
    localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
  }
}
```

### 2. 修改Review App显示错误记录

在 `YourProgress.jsx` 的 `NotesApp` 组件中：

**修改前**:
- 显示 `userData.congratulations`（祝贺消息）
- 空状态: "Complete missions to receive congratulations!"

**修改后**:
- 显示 `userData.errorRecords`（错误记录）
- 空状态: "No quiz errors yet. Keep learning!"

## 数据结构

### errorRecords 格式

```javascript
{
  timestamp: 1738742400000,
  region: 'Island',
  question: 'If you receive a strange email...',
  userAnswer: 'It has a few spelling mistakes...',
  correctAnswer: 'It is extremely polite...',
  subject: 'Island Quiz - Wrong Answer',
  preview: 'You selected: It has a few spelling mistakes...',
  content: 'Question: ...\n\nYour Answer: ...\n\nCorrect Answer: ...\n\nFeedback: ...'
}
```

## 功能特性

### 自动记录
- ✅ 用户选择错误答案时自动保存
- ✅ 包含完整的问题、用户答案、正确答案
- ✅ 记录时间戳和区域信息
- ✅ 包含反馈信息

### Review App显示
- ✅ 列表显示所有错误记录
- ✅ 显示标题和预览
- ✅ 点击查看完整内容
- ✅ 显示时间戳
- ✅ 按时间倒序排列（最新的在前）

### Badge计数
Review app的badge数字会显示错误记录的数量，帮助用户知道有多少需要复习的内容。

## 用户体验

### 错误答案视觉反馈
1. **即时反馈**: 错误答案显示红色边框和红色叉号 (✗)
2. **保存记录**: 自动保存到Review app
3. **复习提醒**: Badge显示错误数量
4. **详细信息**: 可以查看完整的问题、答案和反馈

### Review App界面
```
┌─────────────────────────────┐
│ Review                      │
├─────────────────────────────┤
│ Island Quiz - Wrong Answer  │
│ You selected: It has a...   │
│ Jan 5, 7:30 PM             │
├─────────────────────────────┤
│ Island Quiz - Wrong Answer  │
│ You selected: It expresses..│
│ Jan 5, 7:25 PM             │
└─────────────────────────────┘
```

## 修改的文件

1. **src/components/IslandMap.jsx**
   - 修改 `handleQuizChoice` 函数
   - 添加错误记录保存逻辑

2. **src/components/YourProgress.jsx**
   - 修改 `NotesApp` 组件
   - 从显示congratulations改为显示errorRecords
   - 更新空状态提示文字

## 测试建议

1. 在Island地图完成quiz
2. 故意选择错误答案
3. 打开手机界面
4. 查看Review app
5. 验证错误记录是否显示
6. 点击记录查看详细内容
7. 验证badge数字是否正确

## 未来扩展

### 可以添加的功能
- [ ] 按区域筛选错误记录
- [ ] 删除单个错误记录
- [ ] 清空所有错误记录
- [ ] 错误统计（按区域、按类型）
- [ ] 重新测试功能（直接从Review跳转到quiz）
- [ ] 错误记录导出功能

### 其他区域支持
目前只在Island实现，可以扩展到：
- [ ] Desert quiz错误记录
- [ ] Jungle quiz错误记录
- [ ] Glacier quiz错误记录

## 总结

现在用户在Island的quiz中选择错误答案时：
1. ✅ 答案显示红色边框和红色叉号
2. ✅ 错误自动保存到errorRecords
3. ✅ 可以在Review app中查看所有错误
4. ✅ Badge显示错误数量
5. ✅ 可以复习错误的问题和正确答案

这个功能帮助用户追踪和复习他们的错误，提高学习效果。
