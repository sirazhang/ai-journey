# Jungle Dialogue Duplicate Fix

## 问题描述
在 Jungle 的 Data Cleaning 阶段，Ranger Moss 的对话出现重复显示：
- "In the world of AI, there is a golden rule: 'Garbage In, Garbage Out'. If we train the model with messy data, it will learn the wrong lessons."
- "We must enter the Data Cleaning Phase."

这两段信息被分成了两条独立的对话，导致用户需要点击两次才能继续。

## 根本原因
在 `src/components/DataCleaning.jsx` 文件中，`rangerDialogues` 数组将这两段信息分成了3条对话：

```javascript
// 错误的版本
const rangerDialogues = [
  "Outstanding work, Human! You've gathered enough raw data. But... we can't feed this directly to the <strong>AI</strong>. Not yet.",
  "In the world of AI, there is a golden rule: <strong>'Garbage In, Garbage Out'</strong>. If we train the model with messy data, it will learn the wrong lessons.",
  "We must enter the <strong>Data Cleaning Phase</strong>.",
]
```

## 解决方案
将第二条和第三条对话合并为一条：

```javascript
// 修复后的版本
const rangerDialogues = [
  "Outstanding work, Human! You've gathered enough raw data. But... we can't feed this directly to the <strong>AI</strong>. Not yet.",
  "In the world of AI, there is a golden rule: <strong>'Garbage In, Garbage Out'</strong>. If we train the model with messy data, it will learn the wrong lessons. We must enter the <strong>Data Cleaning Phase</strong>.",
]
```

## 修改内容
- **文件**: `src/components/DataCleaning.jsx`
- **行数**: 449-453
- **修改**: 将3条对话合并为2条对话

## 效果
✅ 用户现在只需要点击一次就能看到完整的 "Garbage In, Garbage Out" 和 "Data Cleaning Phase" 信息
✅ 对话流程更加流畅
✅ 减少了不必要的点击次数

## 测试方法
1. 进入 Jungle 地图
2. 完成数据收集任务（收集12个蘑菇样本）
3. 进入 Data Cleaning 阶段
4. 查看 Ranger Moss 的对话
5. 验证 "Garbage In, Garbage Out" 和 "Data Cleaning Phase" 在同一条对话中显示

## 状态
✅ 已修复
✅ 无诊断错误
✅ 准备测试
