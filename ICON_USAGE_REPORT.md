# Icon Usage Report

## 检查日期: 2026-02-05

## 图标使用情况

所有被检查的图标文件都在项目中被使用，**没有未使用的图标**。

---

### ✅ locked.png
**状态**: 使用中  
**位置**: `src/components/MapView.jsx`  
**用途**: 显示在锁定区域的按钮上  
**代码行**: 1180

```javascript
<img src="/icon/locked.png" alt="Locked" style={{ width: '20px', height: '20px' }} />
```

---

### ✅ mute.png
**状态**: 使用中  
**位置**: `src/components/SettingsPanel.jsx`  
**用途**: 静音按钮图标  
**代码行**: 407

```javascript
<img src="/icon/mute.png" alt="Mute" style={styles.muteIcon} />
```

---

### ✅ setting.png
**状态**: 使用中  
**位置**: `src/components/SettingsPanel.jsx`  
**用途**: 设置面板按钮图标  
**代码行**: 333

```javascript
<img src="/icon/setting.png" alt="Settings" style={styles.settingIcon} />
```

---

### ✅ volume.png
**状态**: 使用中  
**位置**: `src/components/SettingsPanel.jsx`  
**用途**: 音量控制图标（使用2次）  
**代码行**: 390, 423

```javascript
// 第一次使用 - 章节标题
<img src="/icon/volume.png" alt="Volume" style={styles.sectionIcon} />

// 第二次使用 - 音量滑块
<img src="/icon/volume.png" alt="Volume" style={styles.volumeIcon} />
```

---

### ✅ backward.png
**状态**: 使用中  
**位置**: `src/components/ExplorerJournal.jsx`  
**用途**: 日志导航 - 下一页按钮  
**代码行**: 159

```javascript
<img src="/icon/backward.png" alt="Next" style={styles.navIcon} />
```

---

### ✅ forward.png
**状态**: 使用中  
**位置**: `src/components/ExplorerJournal.jsx`  
**用途**: 日志导航 - 上一页按钮  
**代码行**: 146

```javascript
<img src="/icon/forward.png" alt="Previous" style={styles.navIcon} />
```

---

### ✅ grid.png
**状态**: 使用中  
**位置**: `src/components/ExplorerJournal.jsx`  
**用途**: 日志卡片的网格背景  
**代码行**: 78

```javascript
<img src="/icon/grid.png" alt="Grid" style={styles.gridBackgroundFull} />
```

---

### ✅ journal.svg
**状态**: 使用中  
**位置**: `src/components/ExplorerJournal.jsx`  
**用途**: Explorer's Journal 标题图标  
**代码行**: 70

```javascript
<img src="/icon/journal.svg" alt="Journal" style={styles.titleIcon} />
```

---

### ✅ language.png
**状态**: 使用中  
**位置**: `src/components/SettingsPanel.jsx`  
**用途**: 语言选择章节图标  
**代码行**: 361

```javascript
<img src="/icon/language.png" alt="Language" style={styles.sectionIcon} />
```

---

### ✅ ring.png
**状态**: 使用中  
**位置**: `src/components/ExplorerJournal.jsx`  
**用途**: 日志本的环形装订图标  
**代码行**: 81

```javascript
<img src="/icon/ring.png" alt="Ring" style={styles.ringBinding} />
```

---

## 总结

| 图标文件 | 状态 | 使用位置 | 用途 |
|---------|------|---------|------|
| locked.png | ✅ 使用中 | MapView.jsx | 锁定区域按钮 |
| mute.png | ✅ 使用中 | SettingsPanel.jsx | 静音按钮 |
| setting.png | ✅ 使用中 | SettingsPanel.jsx | 设置按钮 |
| volume.png | ✅ 使用中 | SettingsPanel.jsx | 音量控制（2处） |
| backward.png | ✅ 使用中 | ExplorerJournal.jsx | 下一页导航 |
| forward.png | ✅ 使用中 | ExplorerJournal.jsx | 上一页导航 |
| grid.png | ✅ 使用中 | ExplorerJournal.jsx | 日志网格背景 |
| journal.svg | ✅ 使用中 | ExplorerJournal.jsx | 日志标题图标 |
| language.png | ✅ 使用中 | SettingsPanel.jsx | 语言选择图标 |
| ring.png | ✅ 使用中 | ExplorerJournal.jsx | 日志装订图标 |

**结论**: 所有10个图标文件都在积极使用中，**不建议删除任何文件**。

---

## 组件使用分布

### MapView.jsx
- locked.png (1次)

### SettingsPanel.jsx
- mute.png (1次)
- setting.png (1次)
- volume.png (2次)
- language.png (1次)

### ExplorerJournal.jsx
- backward.png (1次)
- forward.png (1次)
- grid.png (1次)
- journal.svg (1次)
- ring.png (1次)

---

*注意: SettingsPanel.jsx 虽然还在项目中，但设置功能已经移到手机界面中。如果完全移除 SettingsPanel.jsx，则 mute.png, setting.png, volume.png, language.png 可能会变成未使用状态。*
