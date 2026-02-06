# Central City Button Redesign

## 更新日期: 2026-02-05

## 设计变更

### 之前的设计
- 圆形按钮（borderRadius: 50%）
- 紫色半透明背景
- 白色边框
- 发光动画效果
- 无文字标签

### 新设计
- **玻璃拟态卡片**（Glassmorphism）
- 圆角矩形（borderRadius: 24px）
- 浅紫色半透明背景
- 毛玻璃模糊效果
- 文字标签（HOME / COMPANY）

---

## 设计细节

### 玻璃拟态效果

```css
background: rgba(186, 135, 255, 0.25)  /* 浅紫色半透明 */
backdropFilter: blur(12px)              /* 背景模糊 */
border: 2px solid rgba(255, 255, 255, 0.3)  /* 半透明白边 */
```

### 阴影效果

多层阴影营造深度感：
```css
box-shadow: 
  0 8px 32px rgba(138, 43, 226, 0.3),      /* 外部紫色阴影 */
  0 0 20px rgba(186, 135, 255, 0.4),       /* 紫色光晕 */
  inset 0 0 20px rgba(255, 255, 255, 0.1)  /* 内部高光 */
```

### 文字标签

```css
color: #fff
fontSize: 14px
fontWeight: 700
letterSpacing: 1.5px
textShadow: 
  0 2px 8px rgba(0, 0, 0, 0.5),           /* 文字阴影 */
  0 0 20px rgba(186, 135, 255, 0.6)       /* 紫色光晕 */
```

---

## 结构变化

### 之前
```jsx
<div style={buttonCard + homeButton}>
  <img src="home.png" />
</div>
```

### 现在
```jsx
<div style={buttonContainer + homeButton}>
  <div style={buttonCard}>
    <img src="home.png" />
  </div>
  <div style={buttonLabel}>HOME</div>
</div>
```

---

## 样式定义

### buttonContainer
- 容器：包含卡片和标签
- 布局：垂直排列（flexDirection: column）
- 间距：12px gap
- 定位：absolute

### buttonCard
- 尺寸：120px × 120px
- 圆角：24px（圆角矩形）
- 背景：浅紫色玻璃拟态
- 模糊：12px backdrop blur
- 边框：半透明白色
- 阴影：多层紫色阴影

### buttonLabel
- 文字：全大写
- 字体：Inter/Roboto，14px，粗体
- 颜色：白色
- 字间距：1.5px
- 阴影：黑色+紫色双重阴影

---

## 交互效果

### Hover状态
```javascript
onMouseOver: card.style.transform = 'scale(1.05)'
onMouseOut: card.style.transform = 'scale(1)'
```

- 卡片放大5%
- 平滑过渡（0.3s ease）
- 保持标签位置不变

---

## 视觉效果

### HOME按钮
```
┌─────────────────────┐
│                     │
│    🏠 (图标)        │  ← 玻璃拟态卡片
│                     │     浅紫色半透明
└─────────────────────┘     毛玻璃模糊
       HOME                 ← 白色文字标签
                              紫色光晕
```

### COMPANY按钮
```
┌─────────────────────┐
│                     │
│    🏢 (图标)        │  ← 玻璃拟态卡片
│                     │
└─────────────────────┘
     COMPANY              ← 白色文字标签
```

---

## 颜色方案

| 元素 | 颜色 | 说明 |
|------|------|------|
| 卡片背景 | `rgba(186, 135, 255, 0.25)` | 浅紫色，25%透明度 |
| 卡片边框 | `rgba(255, 255, 255, 0.3)` | 白色，30%透明度 |
| 外阴影 | `rgba(138, 43, 226, 0.3)` | 深紫色 |
| 光晕 | `rgba(186, 135, 255, 0.4)` | 浅紫色 |
| 内高光 | `rgba(255, 255, 255, 0.1)` | 白色，10%透明度 |
| 文字 | `#fff` | 纯白色 |
| 文字阴影 | `rgba(0, 0, 0, 0.5)` | 黑色，50%透明度 |
| 文字光晕 | `rgba(186, 135, 255, 0.6)` | 浅紫色，60%透明度 |

---

## 技术实现

### 玻璃拟态关键属性
```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);  /* Safari支持 */
```

### 多层阴影
```css
box-shadow: 
  外阴影,
  光晕,
  inset 内高光;
```

### 文字发光效果
```css
text-shadow: 
  阴影层,
  光晕层;
```

---

## 浏览器兼容性

- ✅ Chrome/Edge: 完全支持
- ✅ Firefox: 完全支持
- ✅ Safari: 需要 -webkit-backdrop-filter
- ⚠️ 旧版浏览器: 降级为普通半透明背景

---

## 修改的文件

- `src/components/CentralCity.jsx`
  - 更新按钮结构
  - 添加buttonContainer样式
  - 修改buttonCard样式
  - 添加buttonLabel样式
  - 更新hover交互逻辑

---

## 设计理念

### 玻璃拟态（Glassmorphism）
- 现代、优雅的设计风格
- 半透明背景 + 模糊效果
- 营造层次感和深度
- 与紫色主题完美融合

### 视觉层次
1. **背景**: 城市场景
2. **卡片**: 玻璃拟态效果，浮在背景上
3. **图标**: 清晰可见
4. **标签**: 发光文字，最突出

### 用户体验
- ✅ 清晰的视觉反馈
- ✅ 明确的功能标识
- ✅ 优雅的hover效果
- ✅ 现代化的设计语言

---

## 总结

新设计采用玻璃拟态风格，提供：
- 更现代的视觉效果
- 更清晰的功能标识（文字标签）
- 更好的视觉层次
- 更优雅的交互体验

完美融入Central City的紫色科技主题。
