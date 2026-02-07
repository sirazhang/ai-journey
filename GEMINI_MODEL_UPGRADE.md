# Gemini 模型升级说明

## 更新日期
2026-02-06

## 更新内容

### 1. 统一使用 Gemini 3 Flash
将所有 `gemini-2.0-flash-exp` 和 `gemini-2.5-flash` 调用统一替换为 **`gemini-3-flash`**

### 2. Island 图像优化策略升级
iPad 共创的图像生成功能采用**双重降级策略**：
1. **优先**: `gemini-3-pro-preview` (最高质量)
2. **降级**: `gemini-2.5-flash-image` (备用)
3. **最终降级**: 返回原始绘画

---

## 模型对比

### 更新前
| 模型 | 用途 | 调用次数 |
|------|------|---------|
| gemini-2.0-flash-exp | NPC 对话、创意问答 | 11 |
| gemini-2.5-flash | 故事生成、图片描述 | 9 |
| gemini-2.5-flash-image | 图片生成 | 1 |
| gemini-3-pro-preview | 工作台验证、搜索 | 3 |

### 更新后
| 模型 | 用途 | 调用次数 |
|------|------|---------|
| **gemini-3-flash** | NPC 对话、创意问答、故事生成 | 20 |
| gemini-2.5-flash-image | 图片生成（降级） | 1 |
| gemini-3-pro-preview | 工作台验证、搜索、图片生成（优先） | 4 |

---

## 详细更新

### API 配置 (src/config/api.js)

#### 更新前
```javascript
export const GEMINI_API_ENDPOINTS = {
  'gemini-2.0-flash-exp': '...',
  'gemini-2.5-flash': '...',
  'gemini-2.5-flash-image': '...',
  'gemini-3-pro-preview': '...'
}

export const getGeminiUrl = (model = 'gemini-2.0-flash-exp') => {
  return `${GEMINI_API_ENDPOINTS[model]}?key=${GEMINI_API_KEY}`
}
```

#### 更新后
```javascript
export const GEMINI_API_ENDPOINTS = {
  'gemini-3-flash': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent',
  'gemini-2.5-flash-image': '...',
  'gemini-3-pro-preview': '...'
}

export const getGeminiUrl = (model = 'gemini-3-flash') => {
  return `${GEMINI_API_ENDPOINTS[model]}?key=${GEMINI_API_KEY}`
}
```

**变化**:
- ✅ 移除 `gemini-2.0-flash-exp`
- ✅ 移除 `gemini-2.5-flash`
- ✅ 添加 `gemini-3-flash`
- ✅ 默认模型改为 `gemini-3-flash`

---

### 图像生成升级 (src/services/geminiService.js)

#### 更新前
```javascript
export const generateMagicImage = async (drawingBase64, story, additionalPrompt = '') => {
  // 直接使用 gemini-2.5-flash-image
  const response = await fetch(
    getGeminiUrl('gemini-2.5-flash-image'),
    {...}
  )
  // ...
}
```

#### 更新后
```javascript
export const generateMagicImage = async (drawingBase64, story, additionalPrompt = '') => {
  // 1. 优先尝试 gemini-3-pro-preview
  try {
    console.log('Attempting image generation with gemini-3-pro-preview...')
    const response = await fetch(
      getGeminiUrl('gemini-3-pro-preview'),
      {...}
    )
    
    if (response.ok) {
      // 成功返回
      console.log('Image generated successfully with gemini-3-pro-preview')
      return enhancedImage
    }
  } catch (error) {
    console.warn('gemini-3-pro-preview error, trying fallback:', error.message)
  }
  
  // 2. 降级到 gemini-2.5-flash-image
  console.log('Attempting image generation with gemini-2.5-flash-image (fallback)...')
  const response = await fetch(
    getGeminiUrl('gemini-2.5-flash-image'),
    {...}
  )
  
  // 3. 最终降级：返回原始绘画
  if (!response.ok) {
    return drawingBase64
  }
}
```

**优势**:
- ✅ 优先使用最高质量模型 (gemini-3-pro-preview)
- ✅ 自动降级到备用模型
- ✅ 最终保证返回结果（原始绘画）
- ✅ 详细的日志记录

---

## 受影响的文件

### 核心文件
1. ✅ `src/config/api.js` - API 配置
2. ✅ `src/services/geminiService.js` - Gemini 服务

### 组件文件 (所有 gemini-2.x 替换为 gemini-3-flash)
3. ✅ `src/components/IslandMap.jsx`
4. ✅ `src/components/GlacierMap.jsx`
5. ✅ `src/components/DesertMap.jsx`
6. ✅ `src/components/FungiJungleMap.jsx`
7. ✅ `src/components/DataCollection.jsx`
8. ✅ `src/components/DataCleaning.jsx`
9. ✅ `src/components/MapView.jsx`

### 服务文件
10. ✅ `src/services/workbenchService.js` - 保持使用 gemini-3-pro-preview

---

## 功能验证

### 需要测试的功能

#### 1. Island (岛屿)
- [ ] Sparky NPC 对话 (gemini-3-flash)
- [ ] iPad 共创 - 故事生成 (gemini-3-flash)
- [ ] iPad 共创 - 图片生成 (gemini-3-pro-preview → gemini-2.5-flash-image)

#### 2. Glacier (冰川)
- [ ] Momo NPC 对话 (gemini-3-flash)
- [ ] 创意卡片问题生成 (gemini-3-flash)
- [ ] 创意答案反馈 (gemini-3-flash)
- [ ] 隐私场景对话 (gemini-3-flash)

#### 3. Desert (沙漠)
- [ ] NPC 对话 (gemini-3-flash)
- [ ] 图片描述生成 (gemini-3-flash)

#### 4. Jungle (丛林)
- [ ] Glitch NPC 对话 (gemini-3-flash)
- [ ] 数据收集阶段对话 (gemini-3-flash)
- [ ] 数据清洗阶段对话 (gemini-3-flash)

#### 5. City (城市)
- [ ] Workbench 验证 (gemini-3-pro-preview)
- [ ] Safari 搜索 (gemini-3-pro-preview)
- [ ] Maps 查询 (gemini-3-flash)

#### 6. Map View (地图总览)
- [ ] 地图 NPC 对话 (gemini-3-flash)

---

## 性能影响

### 预期改进
1. **更快的响应速度**: Gemini 3 Flash 比 2.x 版本更快
2. **更高的质量**: 更好的对话理解和生成
3. **更稳定**: 正式版本比实验版更稳定

### 成本影响
- Gemini 3 Flash 定价与 2.5 Flash 相似
- 图片生成优先使用 3 Pro 可能略增成本，但提供更好质量
- 整体成本预计保持在 $5-15/月

---

## 降级策略

### 图片生成降级流程
```
用户点击"魔法生成"
    ↓
尝试 gemini-3-pro-preview
    ↓
成功? → 返回高质量图片 ✅
    ↓ 失败
尝试 gemini-2.5-flash-image
    ↓
成功? → 返回标准质量图片 ✅
    ↓ 失败
返回原始绘画 ✅
```

### 其他 API 调用降级
- 所有 NPC 对话和文本生成使用 gemini-3-flash
- 如遇 429 错误，返回预设的降级内容
- 用户始终能看到友好的错误提示

---

## 回滚方案

如果需要回滚到旧版本：

```bash
# 1. 恢复 API 配置
git checkout HEAD~1 src/config/api.js

# 2. 恢复服务文件
git checkout HEAD~1 src/services/geminiService.js

# 3. 恢复组件文件
git checkout HEAD~1 src/components/

# 4. 重新构建
npm run build
```

---

## 监控建议

### 需要监控的指标
1. **API 调用成功率**
   - gemini-3-flash 成功率
   - gemini-3-pro-preview 图片生成成功率
   - 降级到 gemini-2.5-flash-image 的频率

2. **响应时间**
   - 平均响应时间
   - 95th 百分位响应时间

3. **错误率**
   - 429 速率限制错误
   - 其他 API 错误

4. **用户体验**
   - 图片生成质量反馈
   - 对话质量反馈

---

## 优势总结

### ✅ 技术优势
1. **统一模型**: 减少模型种类，简化维护
2. **更好性能**: Gemini 3 Flash 更快更稳定
3. **智能降级**: 图片生成有双重保障
4. **详细日志**: 便于调试和监控

### ✅ 用户体验
1. **更快响应**: 减少等待时间
2. **更高质量**: 更好的对话和图片
3. **更稳定**: 减少错误和失败

### ✅ 成本效益
1. **成本可控**: 整体成本保持合理
2. **质量提升**: 在相似成本下获得更好质量
3. **灵活降级**: 避免完全失败

---

## 下一步

1. **测试所有功能** - 确保所有 API 调用正常工作
2. **监控性能** - 观察响应时间和成功率
3. **收集反馈** - 了解用户对新模型的体验
4. **优化提示词** - 根据 Gemini 3 的特性优化提示词

---

**更新完成时间**: 2026-02-06
**影响范围**: 全部 Gemini API 调用
**测试状态**: 待测试
**部署状态**: 待部署
