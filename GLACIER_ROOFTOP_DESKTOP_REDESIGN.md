# Glacier Rooftop Desktop Interface Redesign

## Date: February 8, 2026

## Overview

Created a new MacBook-style desktop interface for Glacier rooftop NPCs. The rooftop has **3 NPCs** (NPC 5, NPC 6, NPC 9), and each NPC has their own computer screen with a "Daily Quests" system showing **3 tasks** that need to be completed.

## New Component

**File**: `src/components/RooftopDesktopInterface.jsx`

### Features

1. **MacBook-Style Interface**
   - Gradient purple desktop background
   - Top menu bar with time and close button
   - Professional window design

2. **NPC Profile Card** (Left Panel)
   - NPC avatar (120px circular)
   - NPC name
   - Task completion status (X/3 tasks done)

3. **Daily Quests System** (Right Panel)
   - Shows 3 tasks per NPC
   - Task icons and descriptions
   - Checkmark when completed
   - Click to start task

4. **Dialogue Window** (For NPC 5 & NPC 9)
   - Embedded conversation interface
   - Appears below Daily Quests
   - Continue/Close buttons

5. **Task Content Window**
   - Shows task-specific content (puzzles, exercises, memory games)
   - Appears below Daily Quests when task is active

## NPC Task Definitions

### NPC 5 - Master Librarian (3 Tasks)
**Tasks:**
1. Talk to Librarian (Dialogue) - Listen to story about critical thinking
2. Logic Puzzles Test (Puzzle) - Review logic puzzles and provide feedback
3. Mark Information Errors (Exercise) - Identify and underline logical errors in text

### NPC 6 - Concept Artist (3 Tasks)
**Tasks:**
1. Talk to Artist (Dialogue) - Hear about creative struggle
2. Creativity Test (Creativity) - Complete creative thinking exercises
3. Co-Creation Exercise (Co-creation) - Work together on creative formula task

### NPC 9 - Super Worker (3 Tasks)
**Tasks:**
1. Memory Blocks (Memory) - Remember and recall block patterns
2. Memory Footprints (Memory) - Remember and trace footprint paths
3. Talk to Worker (Dialogue) - Complete conversation about recovery

## Integration Steps

### 1. Import Component in GlacierMap.jsx

```javascript
import RooftopDesktopInterface from './RooftopDesktopInterface'
```

### 2. Add State for Desktop Interface

```javascript
const [showRooftopDesktop, setShowRooftopDesktop] = useState(false)
const [selectedRooftopNpc, setSelectedRooftopNpc] = useState(null)
```

### 3. Modify NPC Click Handlers

Replace existing rooftop NPC click handlers with:

```javascript
const handleRooftopNpcClick = (npcId) => {
  setSelectedRooftopNpc(npcId)
  setShowRooftopDesktop(true)
}
```

### 4. Add Desktop Interface Rendering

```javascript
{showRooftopDesktop && selectedRooftopNpc && (
  <RooftopDesktopInterface
    npcId={selectedRooftopNpc}
    npcData={{
      onTaskStart: (task) => {
        // Handle task start based on task type
        if (task.type === 'dialogue') {
          if (selectedRooftopNpc === 'npc5') {
            setShowNpc5Dialogue(true)
          } else if (selectedRooftopNpc === 'npc9') {
            setShowNpc9Dialogue(true)
          }
        } else if (task.type === 'puzzle') {
          setShowPuzzle(true)
        } else if (task.type === 'cocreation') {
          setShowCoCreation(true)
        } else if (task.type === 'court') {
          setSelectedNpc(selectedRooftopNpc)
          setCaseStep(1)
        }
      },
      dialogueContent: selectedRooftopNpc === 'npc5' ? (
        // Render NPC5 dialogue here
        <div>NPC5 Dialogue Content</div>
      ) : selectedRooftopNpc === 'npc9' ? (
        // Render NPC9 dialogue here
        <div>NPC9 Dialogue Content</div>
      ) : null
    }}
    completedTasks={rooftopCompletedTasks}
    onTaskComplete={(taskId) => {
      setRooftopCompletedTasks(prev => [...prev, taskId])
    }}
    onClose={() => {
      setShowRooftopDesktop(false)
      setSelectedRooftopNpc(null)
    }}
  />
)}
```

### 5. Update Task Completion Logic

Modify existing task completion handlers to update the new task IDs:

```javascript
// NPC5 - Dialogue completion
setRooftopCompletedTasks(prev => [...prev, 'npc5_dialogue'])

// NPC5 - Puzzle completion
if (allCorrect) {
  setRooftopCompletedTasks(prev => [...prev, 'npc5_puzzle'])
}

// NPC5 - Exercise completion
setRooftopCompletedTasks(prev => [...prev, 'npc5_exercise'])

// NPC6 - Dialogue completion
setRooftopCompletedTasks(prev => [...prev, 'npc6_dialogue'])

// NPC6 - Creativity test completion
setRooftopCompletedTasks(prev => [...prev, 'npc6_creativity'])

// NPC6 - Co-creation completion
setRooftopCompletedTasks(prev => [...prev, 'npc6_cocreation'])

// NPC9 - Memory blocks completion
setRooftopCompletedTasks(prev => [...prev, 'npc9_memory_blocks'])

// NPC9 - Memory footprint completion
setRooftopCompletedTasks(prev => [...prev, 'npc9_memory_footprint'])

// NPC9 - Dialogue completion
setRooftopCompletedTasks(prev => [...prev, 'npc9_dialogue'])
```

## Task ID Mapping

### NPC Task IDs

**NPC 5 (3 tasks):**
- `npc5_dialogue` - Initial conversation
- `npc5_puzzle` - Logic puzzles test
- `npc5_exercise` - Mark information errors

**NPC 6 (3 tasks):**
- `npc6_dialogue` - Initial conversation
- `npc6_creativity` - Creativity test
- `npc6_cocreation` - Co-creation exercise

**NPC 9 (3 tasks):**
- `npc9_memory_blocks` - Memory blocks game
- `npc9_memory_footprint` - Memory footprints game
- `npc9_dialogue` - Final conversation

## Visual Design

### Color Scheme
- **Background**: Purple gradient (#667eea → #764ba2 → #f093fb)
- **Cards**: White with 95% opacity
- **Primary Color**: #667eea (Purple)
- **Success Color**: #22c55e (Green)
- **Text**: #1f2937 (Dark gray)

### Layout
- **Left Panel**: 350px fixed width
- **Right Panel**: Flexible width
- **Gap**: 30px between panels
- **Padding**: 40px around content

### Interactive Elements
- Hover effects on quest items
- Smooth transitions (0.2s)
- Click feedback
- Completed tasks have green background

## Benefits

1. **Better Organization**: Clear task structure with 3 tasks per NPC
2. **Visual Feedback**: Checkmarks show progress clearly (X/3 completed)
3. **Professional Look**: MacBook-style interface matches game aesthetic
4. **Embedded Content**: All tasks happen within the desktop interface
5. **Scalable**: Easy to add more tasks or modify existing ones
6. **Focused Experience**: Only 3 NPCs on rooftop, each with distinct tasks

## Next Steps

1. Integrate component into GlacierMap.jsx
2. Connect existing dialogue/puzzle/court systems
3. Update task completion tracking
4. Test all NPC interactions
5. Add sound effects for task completion

## Files Created

- `src/components/RooftopDesktopInterface.jsx` - Main desktop interface component

## Files to Modify

- `src/components/GlacierMap.jsx` - Add desktop interface integration

## Status

✅ Component created and ready for integration
⏳ Awaiting integration into GlacierMap.jsx
