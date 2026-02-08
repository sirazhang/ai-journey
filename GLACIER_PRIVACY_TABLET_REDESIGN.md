# Glacier Privacy Identification Tablet Interface Redesign

## 设计概念
将 Privacy Identification 任务改为平板电脑界面风格，参考提供的设计图。

## 设计要素

### 1. 平板外壳
- **外观**: 类似 iPad 的黑色边框
- **屏幕**: 圆角矩形，带摄像头凹槽
- **尺寸**: 宽度约 1200px，16:10 比例
- **阴影**: 深色阴影，增加立体感

### 2. 系统状态栏（顶部）
- **左侧**: 
  - Station OS 图标
  - "Privacy_Data_Identification.exe" 文件名
- **中间**: "SYSTEM: ONLINE" 状态
- **右侧**: 
  - WiFi 图标
  - 电池图标
  - 时间 (14:02)

### 3. 应用窗口
- **标题栏**: 
  - macOS 风格的红黄绿三个按钮
  - 文件名显示
  - "CONFIDENTIAL" 标签（黄色背景）
- **内容区**: 白色背景，显示学生档案信息

### 4. 左侧：文档内容区
- **标题**: "Student Profile Card"
- **副标题**: 说明文字
- **警告条**: 黄色背景，显示 "⚠️ Requires Privacy Review"
- **内容**: 
  - Full Name: Alex Chen
  - Age: 13
  - Pronouns: They/Them
  - School: Maplewood Middle School
  - Grade: 8th Grade
  - Homeroom Teacher: Ms. Rivera
  - Favorite Subject: Robotics & Space Science
  - Recent Project: Built a solar-powered rover...
  - Test Average: 92% (Math), 89% (Science)
  - Home Address: 456 Pine Street, Apartment 3B, New Haven, CT 06511
  - Phone Number: (203) 555-0142

### 5. 右侧：进度面板
- **Items Found 卡片**:
  - Total Progress: 0/3
  - 进度条（蓝色）
  - 复选框列表:
    - ☐ Personal Name
    - ☐ Home Address
    - ☐ Phone Number
  - 说明文字
  - "Submit Review →" 按钮（深色）

- **Task Navigation 卡片**:
  - 三个圆形按钮: 1, 2, 3
  - 当前任务高亮（蓝色）
  - 已完成显示 ✓

### 6. 交互设计
- **圈选功能**: 鼠标拖动圈选私密信息
- **标记效果**: 圈选后文字变黑色遮盖
- **进度更新**: 实时更新右侧进度
- **提交按钮**: 找到所有项目后才能点击

## 颜色方案
- **平板边框**: `#1a1a1a` (深黑)
- **屏幕背景**: `#f5f5f5` (浅灰)
- **窗口背景**: `#ffffff` (白色)
- **主色调**: `#004aad` (深蓝)
- **警告色**: `#fbbf24` (黄色)
- **成功色**: `#4f7f30` (绿色)
- **文字**: `#333333` (深灰)

## 实现步骤

### Phase 1: 创建平板外壳
1. 添加平板边框容器
2. 添加屏幕圆角和摄像头凹槽
3. 添加阴影效果

### Phase 2: 创建系统状态栏
1. 左侧：OS 图标 + 文件名
2. 中间：系统状态
3. 右侧：WiFi + 电池 + 时间

### Phase 3: 创建应用窗口
1. macOS 风格标题栏
2. CONFIDENTIAL 标签
3. 内容区域布局

### Phase 4: 重构内容布局
1. 左侧文档内容（60%）
2. 右侧进度面板（40%）
3. 响应式调整

### Phase 5: 优化交互
1. 保持原有圈选功能
2. 优化标记效果
3. 添加动画过渡

## 文件修改
- `src/components/GlacierMap.jsx` - 主要修改文件
  - 添加平板容器样式
  - 添加系统状态栏
  - 重构内容布局
  - 优化进度面板

## 响应式设计
- 大屏幕: 完整平板界面
- 中屏幕: 缩小平板尺寸
- 小屏幕: 简化为移动端布局

## 状态
📋 **待实现** - 设计方案已完成，等待用户确认后开始实现
