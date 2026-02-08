# Rooftop Desktop - macOS Style Redesign

## Date: February 8, 2026

## Overview

Completely redesigned the Rooftop Desktop Interface to mimic a real macOS desktop experience with proper app windows, dock, and widgets.

## New Design Features

### 1. Notes App (Bottom Left) 📝
- **Purpose**: Displays NPC's opening dialogue
- **Style**: Yellow note paper aesthetic (like macOS Notes)
- **Position**: Bottom left corner
- **Content**: NPC's story/background text
- **Design**: 
  - Yellow header (#f9e79f)
  - Cream paper background (#fef9e7)
  - Handwriting-style font (Marker Felt)
  - Fixed width: 320px
  - Max height: 400px

### 2. To Do List Widget (Top Right) ✅
- **Purpose**: Shows task completion status
- **Style**: Clean white widget with blur effect
- **Position**: Top right corner
- **Content**: List of 2 tasks per NPC
- **Features**:
  - Checkmarks for completed tasks
  - Strike-through for done items
  - Faded appearance when complete
  - Width: 280px

### 3. Dock (Bottom Center) 🎯
- **Purpose**: Launch task applications
- **Style**: macOS-style translucent dock
- **Position**: Bottom center
- **Content**: 2 app icons per NPC
- **Features**:
  - Colored app icons (each task has unique color)
  - Hover scale effect (1.15x)
  - White dot indicator when app is open
  - Green checkmark badge when task complete
  - Disabled state (50% opacity) when complete
  - Icon size: 52x52px

### 4. Task Windows (macOS Style) 🪟
- **Purpose**: Display task content
- **Style**: Full macOS window with traffic lights
- **Features**:
  - **Traffic Light Buttons**: Red (close), Yellow (minimize), Green (maximize)
  - **Window Title**: Shows app name in center
  - **Close Functionality**: Red button closes window
  - **Window Positioning**: Auto-positioned to avoid overlap
  - **Active State**: Higher z-index and stronger shadow
  - **Size**: 45% width, 70% height
  - **Background**: White with rounded corners

## NPC Configuration

### NPC 5 - Master Librarian
**Dialogue Note**: "P-please... help me... I used to be a Master Librarian..."

**Tasks**:
1. **Logic Puzzles** (Blue #3b82f6)
   - App Name: "Logic Test"
   - Icon: Brain
   
2. **Error Marking** (Purple #8b5cf6)
   - App Name: "Text Analyzer"
   - Icon: FileText

### NPC 6 - Concept Artist
**Dialogue Note**: "It's gone. It's all gone. The spark... the vision..."

**Tasks**:
1. **Creativity Test** (Orange #f59e0b)
   - App Name: "Creative Mind"
   - Icon: Brain
   
2. **Co-Creation** (Pink #ec4899)
   - App Name: "Art Studio"
   - Icon: Palette

### NPC 9 - Super Worker
**Dialogue Note**: "Hi there! I'm… I used to be a super worker..."

**Tasks**:
1. **Memory Blocks** (Green #10b981)
   - App Name: "Memory Game"
   - Icon: Brain
   
2. **Memory Path** (Cyan #06b6d4)
   - App Name: "Path Tracer"
   - Icon: Zap

## Interaction Flow

### Opening Desktop:
1. Click NPC on rooftop
2. Desktop opens with purple gradient background
3. Notes app shows NPC dialogue (bottom left)
4. To Do List shows 2 tasks (top right)
5. Dock shows 2 app icons (bottom center)

### Launching Task:
1. Click app icon in dock
2. Window opens with macOS style
3. Task content displays inside window
4. Window can be closed with red button
5. Multiple windows can be open simultaneously

### Completing Task:
1. Complete task inside window
2. Window closes automatically
3. To Do List updates with checkmark
4. Dock icon shows green checkmark badge
5. Icon becomes semi-transparent (disabled)

### Closing Desktop:
1. Click X in menu bar
2. Or click outside desktop area
3. Returns to rooftop scene

## Visual Design

### Color Scheme:
- **Desktop Background**: Purple gradient (#667eea → #764ba2 → #f093fb)
- **Menu Bar**: Dark translucent (rgba(0, 0, 0, 0.4))
- **Notes**: Yellow/Cream (#fef9e7, #f9e79f)
- **To Do Widget**: White with blur (rgba(255, 255, 255, 0.95))
- **Dock**: Translucent white (rgba(255, 255, 255, 0.2))
- **Windows**: White (#fff)

### Typography:
- **Menu Bar**: Inter, 13px, 600
- **Notes**: Marker Felt, 13px (handwriting style)
- **To Do**: System font, 13-18px
- **Window Title**: 13px, 600

### Effects:
- **Backdrop Blur**: 20-40px on dock and widgets
- **Shadows**: Multiple layers for depth
- **Transitions**: 0.2s for hover effects
- **Border Radius**: 12-16px for modern look

## Technical Implementation

### State Management:
```javascript
const [openWindows, setOpenWindows] = useState([]) // Track open windows
const [activeWindow, setActiveWindow] = useState(null) // Track focused window
```

### Window Positioning:
```javascript
const getWindowPosition = (index) => {
  const positions = [
    { top: '10%', left: '10%', width: '45%', height: '70%' },
    { top: '15%', right: '10%', width: '45%', height: '70%' },
  ]
  return positions[index]
}
```

### Task Structure:
```javascript
{
  id: 'npc5_puzzle',
  title: 'Logic Puzzles',
  appName: 'Logic Test',
  description: 'Review logic puzzles',
  icon: Brain,
  color: '#3b82f6',
  type: 'puzzle'
}
```

## Removed Features

- ❌ NPC avatar card (left panel)
- ❌ Daily Quests card (right panel)
- ❌ Task list with descriptions
- ❌ Dialogue task (moved to Notes app)
- ❌ 3-task system (now 2 tasks per NPC)

## New Features

- ✅ Notes app with NPC dialogue
- ✅ To Do List widget
- ✅ macOS-style dock
- ✅ Multiple window support
- ✅ Traffic light window controls
- ✅ Window focus management
- ✅ App launch from dock
- ✅ Visual task completion feedback

## Benefits

1. **More Realistic**: Mimics actual macOS desktop
2. **Better Organization**: Clear separation of dialogue and tasks
3. **Professional Look**: macOS UI is familiar and polished
4. **Multiple Windows**: Can have multiple tasks open
5. **Visual Feedback**: Dock badges and To Do checkmarks
6. **Cleaner Layout**: Less cluttered than previous design

## Files Modified

- `src/components/RooftopDesktopInterface.jsx` - Complete redesign

## Status

✅ **REDESIGN COMPLETE** - macOS-style desktop with Notes app, To Do List, Dock, and task windows.

## Next Steps

1. Test window opening/closing
2. Test task completion flow
3. Integrate actual task content
4. Add window drag functionality (optional)
5. Add sound effects for window actions
