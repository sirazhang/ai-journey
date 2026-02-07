# Gemini API 调用总结

## 概述
项目中使用了 **4 个不同的 Gemini 模型**，在 **9 个组件/服务** 中进行调用。

## 使用的 Gemini 模型

### 1. gemini-2.0-flash-exp (实验版)
- **用途**: 对话生成、创意问答
- **特点**: 实验性功能，可能不稳定
- **调用次数**: 11 次

### 2. gemini-2.5-flash (稳定版)
- **用途**: 对话生成、图片描述、故事生成
- **特点**: 稳定可靠
- **调用次数**: 9 次

### 3. gemini-2.5-flash-image (图片生成)
- **用途**: 图片生成和优化
- **特点**: 专门用于图像处理
- **调用次数**: 1 次

### 4. gemini-3-pro-preview (高级推理)
- **用途**: 复杂推理、搜索、地图查询
- **特点**: 支持 Google Search 和 Google Maps 工具
- **调用次数**: 3 次

---

## 详细调用场景

### 🏝️ Island (岛屿地图) - 2 次调用

#### 1. Sparky NPC 对话 (gemini-2.5-flash)
- **文件**: `src/components/IslandMap.jsx`
- **功能**: Sparky 与用户的智能对话
- **触发**: 用户点击 Sparky NPC
- **提示词**: 扮演 Sparky，友好的 AI 助手

#### 2. iPad 共创 - 故事生成 (gemini-2.5-flash)
- **文件**: `src/components/IslandMap.jsx`
- **功能**: 基于用户绘画生成故事
- **触发**: 用户完成绘画后点击"生成故事"
- **提示词**: 根据图片描述生成儿童友好的故事

---

### 🏔️ Glacier (冰川地图) - 8 次调用

#### 1. Momo NPC 对话 (gemini-2.0-flash-exp)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: Momo 与用户的对话
- **触发**: 用户点击 Momo NPC
- **提示词**: 扮演 Momo，帮助用户理解隐私和数据安全

#### 2. 创意问题生成 (gemini-2.0-flash-exp)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: 生成"What if"创意问题
- **触发**: 用户点击"创意卡片"
- **提示词**: 生成挑战常规思维的创意问题

#### 3. 创意答案反馈 (gemini-2.0-flash-exp)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: 对用户的创意答案提供反馈
- **触发**: 用户提交创意答案
- **提示词**: 提供鼓励性反馈和见解

#### 4. 创意问题答案 (gemini-2.0-flash-exp)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: 提供创意问题的标准答案
- **触发**: 用户点击"查看答案"
- **提示词**: 解释实际原因和设计原则

#### 5. 隐私场景对话 - 场景1 (gemini-2.5-flash)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: 社交媒体隐私场景对话
- **触发**: 用户进入场景1
- **提示词**: 扮演 Momo，讨论社交媒体隐私

#### 6. 隐私场景对话 - 场景2 (gemini-2.5-flash)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: 在线购物隐私场景对话
- **触发**: 用户进入场景2
- **提示词**: 扮演 Momo，讨论在线购物隐私

#### 7. 隐私场景对话 - 场景3 (gemini-2.5-flash)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: 健康应用隐私场景对话
- **触发**: 用户进入场景3
- **提示词**: 扮演 Momo，讨论健康应用隐私

#### 8. 隐私场景对话 - 场景4 (gemini-2.5-flash)
- **文件**: `src/components/GlacierMap.jsx`
- **功能**: 学校项目隐私场景对话
- **触发**: 用户进入场景4
- **提示词**: 扮演 Momo，讨论学校项目隐私

---

### 🏜️ Desert (沙漠地图) - 2 次调用

#### 1. NPC 对话 (gemini-2.0-flash-exp)
- **文件**: `src/components/DesertMap.jsx`
- **功能**: 沙漠 NPC 与用户对话
- **触发**: 用户点击 NPC
- **提示词**: 扮演沙漠向导，帮助用户理解 AI 偏见

#### 2. 图片描述生成 (gemini-2.5-flash)
- **文件**: `src/components/DesertMap.jsx`
- **功能**: 为用户拍摄的照片生成描述
- **触发**: 用户拍照后
- **提示词**: 描述图片中的物体和场景

---

### 🌴 Jungle (丛林地图) - 3 次调用

#### 1. Glitch NPC 对话 (gemini-2.0-flash-exp)
- **文件**: `src/components/FungiJungleMap.jsx`
- **功能**: Glitch 与用户的智能对话
- **触发**: 用户点击 Glitch NPC
- **提示词**: 扮演 Glitch，帮助理解数据收集和模型训练

#### 2. Glitch NPC 对话 (gemini-2.0-flash-exp)
- **文件**: `src/components/DataCollection.jsx`
- **功能**: 数据收集阶段的 Glitch 对话
- **触发**: 用户在数据收集界面点击 Glitch
- **提示词**: 扮演 Glitch，解释数据收集概念

#### 3. Glitch NPC 对话 (gemini-2.0-flash-exp)
- **文件**: `src/components/DataCleaning.jsx`
- **功能**: 数据清洗阶段的 Glitch 对话
- **触发**: 用户在数据清洗界面点击 Glitch
- **提示词**: 扮演 Glitch，解释数据清洗概念

---

### 🗺️ Map View (地图总览) - 1 次调用

#### 1. 地图 NPC 对话 (gemini-2.0-flash-exp)
- **文件**: `src/components/MapView.jsx`
- **功能**: 地图总览页面的 NPC 对话
- **触发**: 用户点击地图上的 NPC
- **提示词**: 扮演 AI 向导，介绍各个地图区域

---

### 🏙️ City Workbench (城市工作台) - 3 次调用

#### 1. 生成验证陈述 (gemini-3-pro-preview)
- **文件**: `src/services/workbenchService.js`
- **功能**: 生成需要验证的事实陈述
- **触发**: 用户打开 Workbench 或点击"下一题"
- **类别**:
  - 常识事实核查
  - 新闻可信度核查
  - 地点存在性验证
  - 位置准确性验证
  - 距离/可达性验证
- **提示词**: 生成真假陈述，包含解释和搜索提示

#### 2. 网页搜索 (gemini-3-pro-preview + Google Search)
- **文件**: `src/services/workbenchService.js`
- **功能**: Safari 浏览器搜索功能
- **触发**: 用户在 Safari 中输入搜索查询
- **工具**: Google Search
- **提示词**: 提供直接、全面的答案

#### 3. 地图搜索 (gemini-2.5-flash + Google Maps)
- **文件**: `src/services/workbenchService.js`
- **功能**: Maps 应用的位置和路线查询
- **触发**: 用户在 Maps 中搜索位置或路线
- **工具**: Google Maps
- **提示词**: 提供位置信息、距离和时间

---

### 🎨 iPad Co-Creation (iPad 共创) - 2 次调用

#### 1. 故事创意生成 (gemini-2.5-flash)
- **文件**: `src/services/geminiService.js` → `generateIdea()`
- **功能**: 基于主题生成故事创意
- **触发**: 用户选择主题后
- **提示词**: 生成儿童友好的故事开头

#### 2. 故事润色 (gemini-2.5-flash)
- **文件**: `src/services/geminiService.js` → `polishStory()`
- **功能**: 润色用户的故事
- **触发**: 用户完成故事后点击"润色"
- **提示词**: 改进语法和流畅度，保持原意

#### 3. 图片生成/优化 (gemini-2.5-flash-image)
- **文件**: `src/services/geminiService.js` → `generateMagicImage()`
- **功能**: 将用户绘画转换为精美图片
- **触发**: 用户完成绘画后点击"魔法生成"
- **提示词**: 保持手绘风格，增强视觉效果

---

## API 调用统计

### 按模型分类
| 模型 | 调用次数 | 用途 |
|------|---------|------|
| gemini-2.0-flash-exp | 11 | NPC 对话、创意问答 |
| gemini-2.5-flash | 9 | 故事生成、图片描述、隐私对话 |
| gemini-3-pro-preview | 3 | 工作台验证、搜索、地图 |
| gemini-2.5-flash-image | 1 | 图片生成 |
| **总计** | **24** | |

### 按功能分类
| 功能类型 | 调用次数 | 占比 |
|---------|---------|------|
| NPC 对话 | 13 | 54% |
| 创意/故事生成 | 4 | 17% |
| 图片处理 | 2 | 8% |
| 信息验证 | 3 | 13% |
| 隐私场景对话 | 4 | 17% |

### 按地图区域分类
| 区域 | 调用次数 | 主要功能 |
|------|---------|---------|
| Glacier | 8 | 隐私教育、创意问答 |
| City | 3 | 信息验证、搜索 |
| Jungle | 3 | 数据教育 |
| Island | 2 | 共创、对话 |
| Desert | 2 | 偏见教育 |
| Map View | 1 | 总览对话 |

---

## API 配置

### 配置文件
```javascript
// src/config/api.js
export const GEMINI_API_ENDPOINTS = {
  'gemini-2.0-flash-exp': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  'gemini-2.5-flash': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'gemini-2.5-flash-image': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
  'gemini-3-pro-preview': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent'
}
```

### API Key 管理
- 存储位置: `.env` 文件
- 环境变量: `VITE_GEMINI_API_KEY`
- 访问方式: `import.meta.env.VITE_GEMINI_API_KEY`

---

## 错误处理

### 所有 API 调用都包含：
1. ✅ **Try-Catch 错误捕获**
2. ✅ **429 速率限制检测**
3. ✅ **降级方案** (Fallback)
4. ✅ **用户友好的错误消息**

### 示例错误处理
```javascript
try {
  const response = await fetch(getGeminiUrl('gemini-2.5-flash'), {...})
  
  if (response.status === 429) {
    // 速率限制 - 使用降级方案
    return fallbackContent
  }
  
  // 处理响应
} catch (error) {
  console.error('API Error:', error)
  return fallbackContent
}
```

---

## 成本估算

### 假设使用量
- 每天 100 个用户
- 每个用户平均触发 5 次 API 调用
- 每月总调用: 100 × 5 × 30 = **15,000 次**

### Gemini API 定价 (参考)
- gemini-2.0-flash-exp: 免费 (实验版)
- gemini-2.5-flash: $0.075 / 1M tokens (输入)
- gemini-3-pro-preview: $1.25 / 1M tokens (输入)

### 预估月成本
- 假设平均每次调用 500 tokens
- 总 tokens: 15,000 × 500 = 7.5M tokens
- 成本: 约 $5-10 / 月 (取决于模型使用比例)

---

## 优化建议

### 1. 缓存常见响应
- 对于重复的问题，缓存 API 响应
- 减少不必要的 API 调用

### 2. 批量处理
- 将多个请求合并为一个
- 减少 API 调用次数

### 3. 使用更便宜的模型
- 对于简单任务，使用 gemini-2.5-flash
- 只在需要高级推理时使用 gemini-3-pro

### 4. 实现速率限制
- 限制用户的 API 调用频率
- 防止滥用

### 5. 监控使用情况
- 记录 API 调用日志
- 分析使用模式
- 优化高频调用

---

## 安全考虑

### 1. API Key 保护
- ✅ 存储在 `.env` 文件中
- ✅ 不提交到 Git
- ⚠️ 前端暴露 API Key (考虑使用后端代理)

### 2. 建议改进
```javascript
// 当前: 前端直接调用
const response = await fetch(getGeminiUrl('gemini-2.5-flash'), {...})

// 建议: 通过后端代理
const response = await fetch('/api/gemini', {
  method: 'POST',
  body: JSON.stringify({ model: 'gemini-2.5-flash', prompt: '...' })
})
```

### 3. 速率限制
- 实现用户级别的速率限制
- 防止 API 配额耗尽

---

## 总结

### 优点
✅ **功能丰富**: 24 个不同的 AI 功能
✅ **模型多样**: 4 个不同的 Gemini 模型
✅ **错误处理**: 完善的降级方案
✅ **用户体验**: 智能对话和创意生成

### 需要注意
⚠️ **API 成本**: 随用户增长而增加
⚠️ **速率限制**: 可能遇到 429 错误
⚠️ **API Key 安全**: 前端暴露风险

### 建议
1. 监控 API 使用情况
2. 实现后端代理保护 API Key
3. 添加缓存机制减少调用
4. 设置用户速率限制

---

**生成时间**: 2026-02-06
**总调用场景**: 24 个
**使用模型**: 4 个
