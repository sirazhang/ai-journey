# Gemini API 降级策略实现

## 更新日期
2026-02-06

## 降级策略

### 1. 图像生成降级
```
优先: gemini-3-pro-image-preview (最高质量图像模型)
  ↓ 失败
降级: gemini-2.5-flash-image (标准图像模型)
  ↓ 失败
最终: 返回原始绘画
```

### 2. 文本生成降级
```
优先: gemini-3-flash-preview (最新 Flash 模型)
  ↓ 失败
降级: gemini-2.0-flash-exp (稳定实验模型)
  ↓ 失败
最终: 返回预设降级内容
```

## 实现细节

### API 配置更新

**文件**: `src/config/api.js`

```javascript
export const GEMINI_API_ENDPOINTS = {
  // 文本生成模型
  'gemini-3-flash-preview': '...',      // 优先
  'gemini-2.0-flash-exp': '...',        // 降级
  
  // 图像生成模型
  'gemini-3-pro-image-preview': '...',  // 优先
  'gemini-2.5-flash-image': '...',      // 降级
  
  // 工作台专用
  'gemini-3-pro-preview': '...',        // 保持不变
}
```

### 降级助手函数

**文件**: `src/services/geminiService.js`

```javascript
// 通用降级调用函数
const callGeminiWithFallback = async (requestBody) => {
  // 1. 尝试 gemini-3-flash-preview
  try {
    const response = await fetch(getGeminiUrl('gemini-3-flash-preview'), {...})
    if (response.ok) {
      return { success: true, data: await response.json() }
    }
  } catch (error) {
    console.warn('gemini-3-flash-preview failed, trying fallback...')
  }
  
  // 2. 降级到 gemini-2.0-flash-exp
  try {
    const response = await fetch(getGeminiUrl('gemini-2.0-flash-exp'), {...})
    if (response.ok) {
      return { success: true, data: await response.json() }
    }
  } catch (error) {
    console.error('Both API calls failed')
  }
  
  return { success: false, error: 'All models failed' }
}
```

### 图像生成降级

**文件**: `src/services/geminiService.js`
**函数**: `generateMagicImage()`

```javascript
export const generateMagicImage = async (drawingBase64, story, additionalPrompt = '') => {
  // 1. 尝试 gemini-3-pro-image-preview (最高质量)
  try {
    const response = await fetch(getGeminiUrl('gemini-3-pro-image-preview'), {...})
    if (response.ok) {
      // 提取并返回图片
      return enhancedImage
    }
  } catch (error) {
    console.warn('gemini-3-pro-image-preview failed, trying fallback...')
  }
  
  // 2. 降级到 gemini-2.5-flash-image
  try {
    const response = await fetch(getGeminiUrl('gemini-2.5-flash-image'), {...})
    if (response.ok) {
      // 提取并返回图片
      return enhancedImage
    }
  } catch (error) {
    console.warn('gemini-2.5-flash-image failed')
  }
  
  // 3. 最终降级：返回原始绘画
  return drawingBase64
}
```

## 受影响的函数

### 已更新 ✅

1. **callGeminiWithFallback()** - 新增通用降级助手
2. **sendMessageToGemini()** - 使用降级助手
3. **generateMagicImage()** - 图像生成双重降级

### 需要更新的函数

以下函数应该使用 `callGeminiWithFallback()` 助手：

4. **generateIdea()** - 故事创意生成
5. **polishStory()** - 故事润色
6. **所有组件中的 NPC 对话调用**

## 日志格式

### 成功日志
```
🔄 Attempting API call with gemini-3-flash-preview...
✅ API call successful with gemini-3-flash-preview
```

### 降级日志
```
🔄 Attempting API call with gemini-3-flash-preview...
⚠️ gemini-3-flash-preview failed with status 404, trying fallback...
🔄 Attempting API call with gemini-2.0-flash-exp (fallback)...
✅ API call successful with gemini-2.0-flash-exp
```

### 失败日志
```
🔄 Attempting API call with gemini-3-flash-preview...
⚠️ gemini-3-flash-preview error, trying fallback: Model not found
🔄 Attempting API call with gemini-2.0-flash-exp (fallback)...
❌ gemini-2.0-flash-exp also failed with status 500
❌ Both API calls failed: Network error
```

## 优势

### 1. 高可用性
- 单个模型失败不会导致功能完全不可用
- 自动尝试备用模型
- 最终总有降级方案

### 2. 更好的用户体验
- 用户不会看到完全的失败
- 即使 API 有问题，也能得到基本功能
- 透明的错误处理

### 3. 灵活性
- 可以优先使用最新最好的模型
- 出问题时自动降级到稳定模型
- 便于测试新模型

### 4. 成本优化
- 优先使用性价比高的模型
- 只在必要时使用高级模型
- 避免不必要的重试

## 测试场景

### 场景 1: 正常情况
- gemini-3-flash-preview 可用
- 所有调用使用最新模型
- 最佳性能和质量

### 场景 2: 新模型不可用
- gemini-3-flash-preview 返回 404
- 自动降级到 gemini-2.0-flash-exp
- 功能正常，略微降低质量

### 场景 3: 速率限制
- gemini-3-flash-preview 返回 429
- 自动降级到 gemini-2.0-flash-exp
- 避免完全失败

### 场景 4: 网络问题
- 两个模型都失败
- 返回预设降级内容
- 用户看到友好错误消息

## 监控建议

### 需要监控的指标

1. **模型使用率**
   - gemini-3-flash-preview 成功率
   - gemini-2.0-flash-exp 降级频率
   - 完全失败率

2. **响应时间**
   - 主模型平均响应时间
   - 降级模型平均响应时间
   - 总体用户等待时间

3. **错误类型**
   - 404 (模型不存在)
   - 429 (速率限制)
   - 500 (服务器错误)
   - 网络超时

4. **图像生成**
   - gemini-3-pro-image-preview 成功率
   - gemini-2.5-flash-image 降级频率
   - 返回原始图片频率

## 成本影响

### 预期成本
- 大部分调用使用 gemini-3-flash-preview (与 2.0 相似定价)
- 图像生成优先使用 3-pro-image (略高成本，更好质量)
- 降级到 2.0/2.5 时成本相似或更低

### 成本优化
- 如果 3-flash-preview 成本过高，可以调整优先级
- 可以根据用户等级使用不同策略
- 可以在高峰时段优先使用便宜模型

## 部署检查清单

- [x] 更新 API 配置添加所有模型
- [x] 实现 callGeminiWithFallback 助手
- [x] 更新 sendMessageToGemini 使用降级
- [x] 更新 generateMagicImage 使用双重降级
- [ ] 更新 generateIdea 使用降级
- [ ] 更新 polishStory 使用降级
- [ ] 测试所有降级场景
- [ ] 监控日志确认降级工作正常
- [ ] 收集用户反馈

## 回滚方案

如果降级策略有问题，可以快速回滚：

```bash
# 1. 恢复到单一模型
git checkout HEAD~1 src/config/api.js
git checkout HEAD~1 src/services/geminiService.js

# 2. 或者临时禁用降级
# 在代码中注释掉降级逻辑，只保留主模型调用
```

## 总结

✅ **实现完成**:
- API 配置已更新
- 图像生成双重降级已实现
- 文本生成降级助手已创建
- 详细日志已添加

⏳ **待完成**:
- 更新所有文本生成函数使用降级助手
- 全面测试所有降级场景
- 部署到生产环境

🎯 **目标**:
- 99.9% 可用性
- 用户无感知降级
- 最佳性能和质量平衡

---

**更新时间**: 2026-02-06
**状态**: 部分完成
**下一步**: 测试和完善
