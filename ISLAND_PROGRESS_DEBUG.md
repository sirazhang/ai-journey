# Island Progress Debug - 调试日志

## 添加日期: 2026-02-05

## 问题描述

用户完成Island任务到彩色地图后，点击Exit返回主界面，重新进入Island时进度丢失，从头开始。

## Console日志分析

```
Rendering NPC: undefined on island: main_island phase2Active: true  // 退出前
Rendering NPC: undefined on island: island1 phase2Active: false     // 重新进入后
```

说明：
- 退出前：`phase2Active: true` (正确)
- 重新进入后：`phase2Active: false` (错误，进度丢失)

## 添加的调试日志

### 1. 保存进度时

```javascript
console.log('IslandMap - Saving progress:', progress)
```

**输出内容**:
- missionActive
- missionCompleted
- phase2Active
- phase2Completed
- completedMissions
- completedNpcs
- phase2CompletedMissions
- islandRestored
- showSparkyDialogue
- currentSparkyStep
- showSparkyDebrief
- debriefStep
- showFinalSparkyDialogue
- finalDialogueStep
- finalDialogueTriggered

### 2. 加载进度时

```javascript
console.log('IslandMap - Loading progress from localStorage:', savedProgress)
console.log('IslandMap - Parsed progress:', progress)
console.log('IslandMap - Loading progress states:', {
  missionActive: progress.missionActive,
  missionCompleted: progress.missionCompleted,
  phase2Active: progress.phase2Active,
  phase2Completed: progress.phase2Completed,
  islandRestored: progress.islandRestored
})
```

## 调试步骤

### 1. 完成任务到彩色地图
- 观察console中的保存日志
- 确认 `phase2Active: true` 被保存

### 2. 点击Exit
- 检查localStorage中的数据
- 在浏览器DevTools中运行：
  ```javascript
  JSON.parse(localStorage.getItem('islandProgress'))
  ```

### 3. 重新进入Island
- 观察console中的加载日志
- 确认是否读取到正确的进度
- 检查状态是否被正确设置

## 可能的问题原因

### 1. localStorage被清除
- Exit时可能有代码清除了islandProgress
- 检查 `handleIslandMapExit` 函数

### 2. 加载条件不满足
```javascript
if (progress.missionActive || progress.missionCompleted || 
    progress.phase2Active || progress.phase2Completed || 
    progress.islandRestored)
```
- 如果所有条件都是false，进度不会被加载

### 3. 状态初始化时机
- useEffect可能在状态设置前就渲染了
- 需要检查依赖数组

### 4. 组件重新挂载
- 每次进入Island都会重新挂载组件
- 初始状态会覆盖加载的状态

## 修复的NPC id问题

已为以下NPC添加id：
- ✅ `sparky_restored` - restored状态的Sparky
- ✅ `sparky_main` - 非restored状态的Sparky

这解决了 "Rendering NPC: undefined" 的警告。

## 下一步行动

### 使用调试日志
1. 运行游戏并完成Island任务
2. 观察console中的保存日志
3. 点击Exit
4. 检查localStorage
5. 重新进入Island
6. 观察console中的加载日志
7. 对比保存和加载的数据

### 如果数据正确保存但未加载
- 检查加载条件
- 检查useEffect的依赖
- 检查是否有其他代码重置状态

### 如果数据未正确保存
- 检查Exit时是否清除了localStorage
- 检查保存的触发时机
- 检查状态值是否正确

## 临时解决方案

如果问题持续，可以考虑：
1. 将进度保存到 `aiJourneyUser` 对象中
2. 使用更可靠的存储机制
3. 添加进度恢复按钮

## 测试命令

在浏览器console中运行：

```javascript
// 查看当前保存的进度
JSON.parse(localStorage.getItem('islandProgress'))

// 手动设置进度（测试用）
localStorage.setItem('islandProgress', JSON.stringify({
  missionActive: true,
  missionCompleted: true,
  phase2Active: true,
  phase2Completed: true,
  islandRestored: true
}))

// 清除进度（测试用）
localStorage.removeItem('islandProgress')
```

## 预期日志输出

### 正常情况
```
IslandMap - Saving progress: {
  missionActive: true,
  phase2Active: true,
  phase2Completed: true,
  islandRestored: true,
  ...
}

// 退出后重新进入

IslandMap - Loading progress from localStorage: "{...}"
IslandMap - Parsed progress: {
  missionActive: true,
  phase2Active: true,
  ...
}
IslandMap - Loading progress states: {
  missionActive: true,
  phase2Active: true,
  ...
}
```

### 异常情况
```
IslandMap - Loading progress from localStorage: null
// 或
IslandMap - Parsed progress: {
  missionActive: false,
  phase2Active: false,
  ...
}
```

---

**状态**: 🔍 调试中
**下一步**: 运行游戏并观察console日志
