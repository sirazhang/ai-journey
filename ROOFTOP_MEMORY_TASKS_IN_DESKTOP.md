# Rooftop Memory Tasks - Desktop Window Integration

## 完成时间
2026-02-08

## 问题
Memory Blocks和Memory Path任务点击后，原有的Memory Challenge界面显示在desktop外面，而不是在desktop窗口中。

## 解决方案
将Memory Challenge的内容**嵌入到desktop窗口中**，而不是显示在外面。

## 实现细节

### 1. Memory Blocks (Snow Path) ✅
**窗口标题**: Memory Game  
**窗口内容**:
- 倒计时器（00:XX格式，最后5秒变红色）
- 说明文字："Memorize the footprints, then tap the correct tiles when they disappear."
- 4×4格子网格
- 记忆阶段：显示footprint图标
- 回忆阶段：点击正确格子变绿，错误变红
- 底部进度圆点（3个round）

### 2. Memory Path (Footstep Recall) ✅
**窗口标题**: Path Tracer  
**窗口内容**:
- 说明文字："Footprints light up in red one by one—after the sequence ends, tap them back in the same order."
- 2×6交错网格（staggered pattern）
- 足迹图标（高亮时显示红色）
- 用户点击后变暗
- 底部进度圆点（3个round）

### 3. macOS风格窗口 ✅
每个任务窗口都有：
- **红黄绿按钮**（左上角）
  - 红色：关闭窗口
  - 黄色：装饰（hover效果）
  - 绿色：装饰（hover效果）
- **窗口标题**（居中显示）
- **白色背景**
- **圆角边框**
- **阴影效果**

## 技术实现

### RooftopDesktopInterface.jsx
- 在窗口内容部分添加条件渲染
- 检查`task.type === 'memory_blocks'`和`npcData.showMemoryChallenge`
- 检查`task.type === 'memory_footprint'`和`npcData.memoryPhase`
- 直接在窗口中渲染Memory Challenge的UI
- 使用传递的状态数据（snowPathFootprints, snowPathTimer等）

### GlacierMap.jsx
- 传递memory challenge的所有状态给desktop：
  - `showMemoryChallenge`
  - `memoryPhase`
  - `snowPathRound`, `snowPathFootprints`, `snowPathUserSelections`, `snowPathMemorizing`, `snowPathTimer`
  - `footstepRound`, `footstepCurrentHighlight`, `footstepUserSequence`
- 修改Memory Challenge显示条件：只在**非desktop模式**下显示原有界面
- 在desktop模式下，Memory Challenge内容显示在窗口中

## 用户体验

1. 点击NPC9 → 打开desktop
2. 查看Notes和To Do List
3. 点击Dock中的"Memory Game"图标
4. Desktop窗口打开，显示"Memory Game"标题和红黄绿按钮
5. 窗口内显示Snow Path游戏（4×4格子）
6. 完成游戏 → 任务标记完成
7. 点击"Path Tracer"图标 → 显示Footstep Recall游戏
8. 所有任务完成 → 进度圆圈变绿

## 视觉效果
- Memory Challenge现在完全集成在desktop环境中
- 用户在macOS风格的窗口中完成记忆游戏
- 窗口可以通过红色按钮关闭
- 保持desktop背景渐变色（绿青色for NPC9）

## 文件路径
- `src/components/RooftopDesktopInterface.jsx` (lines 400-550)
- `src/components/GlacierMap.jsx` (lines 7439, 9720-9880)
