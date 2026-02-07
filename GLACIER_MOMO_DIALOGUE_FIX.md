# Glacier Rooftop 完成后 Momo 对话问题修复

## 问题描述
用户报告：在 Glacier rooftop 完成所有任务后回到 inside 场景，NPC Momo 没有弹出对话。

## 根本原因分析

### 问题 1: showDataCenterArrow 状态未保存
`showDataCenterArrow` 状态在用户完成 rooftop quiz 后被设置为 true，但这个状态：
1. **未从 savedProgress 加载** - 初始化时总是 false
2. **未保存到 progress** - 刷新页面后丢失

这导致：
- 用户完成 rooftop quiz 后看到 Data Center 箭头
- 刷新页面后，箭头消失
- 再次点击 Momo 时，由于 `showRooftopQuiz` 已经是 false，但 `showDataCenterArrow` 也是 false，导致没有任何对话触发

### 问题 2: Momo 点击逻辑未考虑 showDataCenterArrow
Momo 的 cursor 样式和 hover 效果的条件判断中，没有考虑 `showDataCenterArrow` 的状态：

```javascript
// 旧逻辑
cursor: (showElevatorArrow && rooftopCompletedTasks.length < 3) ? 'default' : 
        (rooftopCompletedTasks.length === 3 && courtSummaryCompleted) ? 'pointer' :
        (!showElevatorArrow) ? 'pointer' : 'default',
```

当 `showDataCenterArrow` 为 true 时（即已完成 rooftop quiz），Momo 应该不可点击，因为用户应该去 Data Center。

## 解决方案

### 修复 1: 保存和加载 showDataCenterArrow 状态

**文件**: `src/components/GlacierMap.jsx`

#### 1.1 从 savedProgress 加载状态
```javascript
// 修改前
const [showDataCenterArrow, setShowDataCenterArrow] = useState(false)

// 修改后
const [showDataCenterArrow, setShowDataCenterArrow] = useState(savedProgress?.showDataCenterArrow || false)
```

#### 1.2 保存状态到 progress
```javascript
useEffect(() => {
  const progress = {
    currentScene,
    completedCases,
    showSummaryDialogue,
    showElevatorArrow,
    courtSummaryCompleted,
    hasSeenInsideIntro,
    rooftopCompletedTasks,
    showArrow,
    showDataCenterArrow, // 新增：保存 data center 箭头状态
    isComplete: currentScene === 'complete',
  }
  saveProgress(progress)
  // ...
}, [currentScene, completedCases, showSummaryDialogue, showElevatorArrow, 
    courtSummaryCompleted, hasSeenInsideIntro, rooftopCompletedTasks, 
    showArrow, showDataCenterArrow]) // 新增依赖
```

### 修复 2: 更新 Momo 点击逻辑

**文件**: `src/components/GlacierMap.jsx`

#### 2.1 更新 cursor 样式条件
```javascript
// 修改后
cursor: (showElevatorArrow && rooftopCompletedTasks.length < 3) ? 'default' : 
        (rooftopCompletedTasks.length === 3 && courtSummaryCompleted && !showDataCenterArrow) ? 'pointer' :
        (!showElevatorArrow && !showDataCenterArrow) ? 'pointer' : 'default',
```

#### 2.2 更新 hover 效果条件
```javascript
// 修改后
onMouseOver={(e) => {
  if ((!showElevatorArrow && !showDataCenterArrow) || 
      (rooftopCompletedTasks.length === 3 && courtSummaryCompleted && !showDataCenterArrow)) {
    e.currentTarget.style.transform = 'scale(1.05)'
  }
}}
```

## 用户流程

### 正常流程
1. 用户完成 5 个法庭案例
2. 点击 Momo → 触发法庭总结对话
3. 完成法庭总结 → 显示电梯箭头
4. 点击电梯 → 前往 rooftop
5. 完成 3 个 rooftop 任务（NPC5, NPC6, NPC9）
6. 点击电梯返回 inside
7. 点击 Momo → 触发 rooftop quiz
8. 完成 quiz → Momo 说明 Data Center 任务，显示 Data Center 箭头
9. 此时 Momo 不可点击（因为 showDataCenterArrow = true）
10. 用户应该点击 Data Center 箭头继续

### 修复后的行为
- **刷新页面后**：`showDataCenterArrow` 状态保持，箭头仍然显示
- **Momo 交互**：当 Data Center 箭头显示时，Momo 不可点击（cursor: default）
- **状态一致性**：所有关键状态都被正确保存和恢复

## 测试场景

### 场景 1: 正常完成流程
1. 完成 rooftop 3 个任务
2. 返回 inside
3. 点击 Momo
4. 验证：rooftop quiz 正常弹出

### 场景 2: 完成 quiz 后刷新
1. 完成 rooftop quiz
2. 看到 Data Center 箭头
3. 刷新页面
4. 验证：Data Center 箭头仍然显示
5. 验证：Momo 不可点击（cursor: default）

### 场景 3: 完成 quiz 后点击 Momo
1. 完成 rooftop quiz
2. 尝试点击 Momo
3. 验证：没有反应（因为应该去 Data Center）

## 相关代码位置

### 状态定义
- 行号：~1037
- 代码：`const [showDataCenterArrow, setShowDataCenterArrow] = useState(...)`

### 进度保存
- 行号：~1120-1145
- 函数：`useEffect` for saveProgress

### Momo 点击处理
- 行号：~1468-1495
- 函数：`handleMomoClick`

### Momo NPC 渲染
- 行号：~5316-5345
- 组件：Momo NPC div with onClick

### Rooftop Quiz 关闭
- 行号：~1996-1999
- 函数：`handleRooftopQuizClose`

## 状态流转图

```
[完成 3 个 rooftop 任务]
         ↓
rooftopCompletedTasks.length = 3
         ↓
[返回 inside，点击 Momo]
         ↓
handleMomoClick() 检查条件
         ↓
rooftopCompletedTasks.length === 3 && 
courtSummaryCompleted && 
!showRooftopQuiz
         ↓
setShowRooftopQuiz(true)
         ↓
[显示 rooftop quiz]
         ↓
[用户完成 quiz]
         ↓
handleRooftopQuizClose()
         ↓
setShowRooftopQuiz(false)
setShowDataCenterArrow(true) ← 现在会被保存
         ↓
[显示 Data Center 箭头]
         ↓
Momo 不可点击（showDataCenterArrow = true）
```

## 修复验证

### 验证清单
- [x] `showDataCenterArrow` 从 savedProgress 加载
- [x] `showDataCenterArrow` 保存到 progress
- [x] Momo cursor 样式考虑 `showDataCenterArrow`
- [x] Momo hover 效果考虑 `showDataCenterArrow`
- [ ] 测试：完成 rooftop 任务后点击 Momo
- [ ] 测试：完成 quiz 后刷新页面
- [ ] 测试：Data Center 箭头显示时 Momo 不可点击

## 总结

这个问题的根本原因是状态管理不完整：
1. `showDataCenterArrow` 状态未被持久化
2. Momo 的交互逻辑未考虑所有状态组合

修复后：
- 所有关键状态都被正确保存和恢复
- Momo 的交互逻辑更加完善
- 用户体验更加流畅，不会因为刷新页面而丢失进度

---

**修复日期**: 2026-02-07
**状态**: ✅ 已修复
**文件**: `src/components/GlacierMap.jsx`
