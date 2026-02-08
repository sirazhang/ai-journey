# Glacier Court Terminal Redesign

## 设计概念
将法院场景的案例展示从传统卡片改为终端显示器风格，参考 `public/terminal` 的设计。

## 已实现功能

### 1. 显示器 (Monitor) ✅
- **外观**: 深色边框 (#1c1c1e)，类似真实显示器
- **屏幕区域**: 16:9 比例，带深黑背景 (#050505)
- **顶部信息**: 
  - REC 录制指示灯（红色脉冲动画）
  - 时间码显示（使用 caseTimer）
  - 系统警报标签（SYS. ALERT）
- **底部信息**: 
  - 坐标 (COORD: 45.22.91)
  - 温度 (TEMP: -104°C)
  - 状态 (STATUS: CRITICAL)
  - AI-OS SYSTEMS 标签
- **显示器支架**: 底部深灰色支架

### 2. 遥控器 (Remote) ✅
- **位置**: 显示器右侧，向下偏移 80px
- **尺寸**: 192px × 320px
- **主按钮**: 
  - 红色电源按钮（56px 圆形）
  - 闪电图标 (SVG)
  - "STOP FEED" 标签（红色，脉冲动画）
- **装饰元素**:
  - "CONTROL" 顶部标签
  - 3×1 静态导航按钮网格
  - 信号锁定进度条
  - 底部状态指示点
- **交互**: 
  - 悬停效果（发光）
  - 点击触发 handleNextStep()
  - Step 2 时自动隐藏（淡出动画）

### 3. Step 1: 传输内容 ✅
- **背景**: 
  - 渐变动画背景（蓝→黑→红）
  - 案例 GIF 叠加（80% 透明度）
- **文字叠加**: 
  - "EMERGENCY PRIORITY" 标签（红色，带脉冲点）
  - 事件描述文字（白色，18px）
  - 左侧红色边框
  - 半透明黑色背景 (rgba(10, 10, 12, 0.7))
  - 模糊效果 (backdrop-filter: blur(8px))
- **底部**: 
  - 蓝色进度条动画（10秒循环）
  - "LIVE TRANSMISSION // SECTOR 07" 标签

### 4. Step 2: Statement 卡片 ✅
- **触发**: 点击遥控器 "STOP FEED" 按钮
- **内容**: 保持原有的 NPC Statement 设计
  - Case Header
  - NPC 图像 + Play 按钮
  - Statement 文字逐行显示
  - Verdict Pending
  - Claim Quote
  - Approved/Rejected 按钮
- **变化**: 
  - 遥控器淡出隐藏
  - 显示器扩展到全宽
  - 添加关闭按钮（×）

### 5. 全屏背景 ✅
- **背景色**: #0a0a0c（深黑）
- **氛围光效**: 
  - 左上角蓝色光晕
  - 右下角紫色光晕
  - 模糊效果 (blur: 120px)
  - 20% 透明度
- **UI 装饰**:
  - 左上角: "CHRONOS-OS // TERMINAL_SESSION_ACTIVE"
  - 底部: "Terminal v2.4.0-Stable // Unauthorized Access Prohibited"

### 6. 动画效果 ✅
- **pulse**: REC 指示灯、STOP FEED 标签（2s 循环）
- **ping**: Emergency Priority 点（1s 循环）
- **progress**: 进度条滑动（10s 循环）
- **transition**: 场景切换（1s ease）
- **hover**: 遥控器按钮发光效果

## 技术实现

### 颜色方案
- **背景**: `#0a0a0c` (深黑)
- **显示器边框**: `#1c1c1e` (深灰)
- **屏幕**: `#050505` (纯黑)
- **遥控器**: `#1a1f2e` (深蓝灰)
- **红色警报**: `#ef4444` (亮红)
- **蓝色信息**: `#3b82f6` (蓝)
- **橙色状态**: `#fb923c` (橙)

### 布局
- **Flexbox**: 主容器使用 flex-row 布局
- **响应式**: 
  - Step 1: 显示器 + 遥控器并排（gap: 64px）
  - Step 2: 显示器全宽，遥控器隐藏
- **最大宽度**: 
  - Step 1: 1400px
  - Step 2: 1200px

### 状态管理
- `caseStep`: 1 (显示器+遥控器) → 2 (Statement 卡片)
- `selectedNpc`: 当前选中的案例
- `caseTimer`: 计时器显示在屏幕右上角

## 文件修改
- ✅ `src/components/GlacierMap.jsx` - 完全重构 Case Modal
  - 添加全屏容器和背景
  - 添加 Monitor 组件样式
  - 添加 Remote 组件样式
  - 重构 Step 1 为传输内容
  - 保持 Step 2 原有设计
  - 添加 CSS 动画

## 用户体验流程
1. 用户点击法院场景的 NPC
2. 全屏显示终端界面（深黑背景）
3. 显示器播放案例 GIF + 事件描述
4. 右侧显示遥控器（STOP FEED 按钮）
5. 用户点击遥控器按钮
6. 遥控器淡出，显示器扩展
7. 显示 NPC Statement 卡片
8. 用户做出判决（Approved/Rejected）
9. 显示印章动画
10. 返回法院场景

## 状态
✅ **完成** - 所有功能已实现并测试
