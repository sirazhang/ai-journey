# Island Hand Stamp Position Fix

## 修正日期: 2026-02-08

## 问题描述

由于对话卡片的宽度从60%增加到85%，位置也从left: 20%调整到left: 7.5%，导致hand.png的盖章动画位置不再对准NPC profile卡片的中央。

## 布局分析

### 对话卡片布局
```javascript
conversationTestCard: {
  top: '8%',
  left: '7.5%',
  width: '85%',
  height: 'calc(84%)'
}
```

### 右侧区域布局
```javascript
conversationTestRight: {
  width: '280px',
  padding: '20px'
}
```

### Profile卡片布局
```javascript
conversationTestProfile: {
  padding: '20px',
  // Profile图片: 120px × 120px
  // 居中显示
}
```

## 位置计算（理论值）

### 假设屏幕宽度: 1920px

1. **卡片位置**:
   - 左边距: 1920 × 7.5% = 144px
   - 卡片宽度: 1920 × 85% = 1632px
   - 右边距: 1920 × 7.5% = 144px

2. **右侧区域**:
   - 宽度: 280px
   - 位置: 卡片内右侧

3. **Profile卡片中心**:
   - 从卡片右边缘: 280px / 2 = 140px
   - 从屏幕右边缘: 144px + 140px = 284px
   - 百分比: 284 / 1920 ≈ **14.8% ≈ 15%**

4. **垂直位置**:
   - 卡片顶部: 8%
   - Header高度: ~60px (约3%)
   - Profile卡片开始: ~11%
   - Profile图片中心: ~11% + 120px/2 ≈ **25%**

## 调整后的位置

```javascript
// 目标位置 (stamping phase)
top: '25%',   // 垂直中心
right: '15%'  // 水平中心
```

## 位置对比

| 属性 | 原始值 (60%卡片) | 第一次调整 | 当前值 (85%卡片) | 说明 |
|------|-----------------|-----------|-----------------|------|
| top | 15% | 22% | **25%** | 对准profile垂直中心 |
| right | 3% | 10% | **15%** | 对准profile水平中心 |

## ⚠️ 重要提示

**这些是理论计算值，需要实际测试来验证和微调！**

影响因素：
1. 实际屏幕分辨率可能不同
2. 浏览器缩放比例
3. Header实际高度
4. Profile卡片内部padding和margin
5. Hand.png图片的实际尺寸和锚点位置

## 建议的测试步骤

1. **视觉检查**:
   - [ ] 运行游戏，触发盖章动画
   - [ ] 观察hand.png是否对准profile卡片中心
   - [ ] 检查是否覆盖在avatar图片上

2. **微调方法**:
   如果位置不准确，可以调整：
   ```javascript
   // 如果手印偏上，增加top值
   top: '26%' 或 '27%'
   
   // 如果手印偏下，减少top值
   top: '24%' 或 '23%'
   
   // 如果手印偏左，增加right值
   right: '16%' 或 '17%'
   
   // 如果手印偏右，减少right值
   right: '14%' 或 '13%'
   ```

3. **不同分辨率测试**:
   - [ ] 1920×1080 (Full HD)
   - [ ] 2560×1440 (2K)
   - [ ] 3840×2160 (4K)
   - [ ] 1366×768 (笔记本)

## 代码实现

```javascript
{showHandStamp && (() => {
  return (
    <img 
      src="/island/icon/hand.png"
      alt="Stamping Hand"
      style={{
        position: 'fixed',
        width: '600px',
        height: 'auto',
        zIndex: 200,
        pointerEvents: 'none',
        
        // 起始位置 (moving phase)
        bottom: handStampPhase === 'moving' ? '5%' : 'auto',
        left: handStampPhase === 'moving' ? '30%' : 'auto',
        
        // 目标位置 (stamping phase) - 需要实际测试验证
        top: handStampPhase !== 'moving' ? '25%' : 'auto',
        right: handStampPhase !== 'moving' ? '15%' : 'auto',
        
        // 透明度
        opacity: handStampPhase === 'fadeout' ? 0 : 1,
        
        // 过渡动画
        transition: handStampPhase === 'fadeout' 
          ? 'all 0.5s ease-out' 
          : 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        
        // 淡出时向右移动
        ...(handStampPhase === 'fadeout' && {
          right: '-25%',
        }),
      }}
    />
  )
})()}
```

## 视觉示意图

```
屏幕布局 (1920px width)
┌────────────────────────────────────────────────────────┐
│ 144px │←──────── 1632px (85%) ────────→│ 144px        │
│       ┌──────────────────────────────────┐             │
│       │ Header (~60px)                   │             │
│       ├──────────────────────────────────┤             │
│       │ Body                             │             │
│       │ ┌──────────┬──────────────────┐ │             │
│       │ │Conver-   │ Right (280px)    │ │             │
│       │ │sation    │ ┌──────────────┐ │ │             │
│       │ │          │ │ Profile      │ │ │             │
│       │ │          │ │ ┌──────────┐ │ │ │             │
│       │ │          │ │ │ Avatar   │ │ │ │             │
│       │ │          │ │ │ 120×120  │ │ │ │ ← 25% top   │
│       │ │          │ │ │    ★     │ │ │ │             │
│       │ │          │ │ │  手印目标 │ │ │ │             │
│       │ │          │ │ └──────────┘ │ │ │             │
│       │ │          │ │              │ │ │             │
│       │ │          │ └──────────────┘ │ │             │
│       │ │          │ [Buttons]        │ │             │
│       │ └──────────┴──────────────────┘ │             │
│       └──────────────────────────────────┘             │
│                                          ↑              │
│                                    284px from right     │
│                                    (15% of 1920px)      │
└────────────────────────────────────────────────────────┘
```

## 总结

✅ 已根据新的85%卡片布局调整hand.png位置：
- **垂直**: `top: 25%` (理论计算值)
- **水平**: `right: 15%` (理论计算值)

⚠️ **需要实际测试验证**，并根据视觉效果进行微调！

建议在实际游戏中测试，观察手印是否准确对准profile卡片中心，然后根据需要调整±1-2%。

