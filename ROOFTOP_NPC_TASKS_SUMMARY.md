# Glacier Rooftop - NPC Tasks Summary

## Date: February 8, 2026

## Rooftop NPCs Overview

The Glacier rooftop has **3 NPCs**, each with **3 tasks** to complete.

---

## NPC 5 - Master Librarian 📚

**Character**: Former Master Librarian who relied too much on GenAI, lost critical thinking ability

### Tasks (3):

1. **Talk to Librarian** (Dialogue)
   - Task ID: `npc5_dialogue`
   - Type: Conversation
   - Description: Listen to their story about losing critical thinking skills
   - Icon: 💬 MessageSquare

2. **Logic Puzzles Test** (Puzzle)
   - Task ID: `npc5_puzzle`
   - Type: Logic puzzles
   - Description: Help review competency test with 2 puzzles:
     - Puzzle 1: Dictionary Dilemma
     - Puzzle 2: Box Logic
   - Icon: 🧠 Brain

3. **Mark Information Errors** (Exercise)
   - Task ID: `npc5_exercise`
   - Type: Text analysis
   - Description: Identify and underline logical errors in text passages
   - Icon: 📄 FileText

---

## NPC 6 - Concept Artist 🎨

**Character**: Concept artist who became lazy using AI, lost creative voice

### Tasks (3):

1. **Talk to Artist** (Dialogue)
   - Task ID: `npc6_dialogue`
   - Type: Conversation
   - Description: Hear about their creative struggle and portfolio issues
   - Icon: 💬 MessageSquare

2. **Creativity Test** (Creativity)
   - Task ID: `npc6_creativity`
   - Type: Creative thinking
   - Description: Complete creative thinking exercises (Why/What If questions)
   - Icon: 🧠 Brain

3. **Co-Creation Exercise** (Co-creation)
   - Task ID: `npc6_cocreation`
   - Type: Collaborative task
   - Description: Work together on creative formula task (iPad interface)
   - Icon: 🎨 Palette

---

## NPC 9 - Super Worker ⚡

**Character**: Former super worker with attention span issues from AI over-reliance

### Tasks (3):

1. **Memory Blocks** (Memory Game 1)
   - Task ID: `npc9_memory_blocks`
   - Type: Memory game
   - Description: Remember and recall block patterns
   - Icon: 🧠 Brain

2. **Memory Footprints** (Memory Game 2)
   - Task ID: `npc9_memory_footprint`
   - Type: Memory game
   - Description: Remember and trace footprint paths
   - Icon: ⚡ Zap

3. **Talk to Worker** (Dialogue)
   - Task ID: `npc9_dialogue`
   - Type: Conversation
   - Description: Complete conversation about recovery and brain reboot
   - Icon: 💬 MessageSquare

---

## Task Completion Flow

### NPC 5 Flow:
1. Click NPC 5 → Desktop opens
2. Complete "Talk to Librarian" → Dialogue system
3. Complete "Logic Puzzles Test" → Puzzle interface
4. Complete "Mark Information Errors" → Exercise interface
5. All 3 tasks done → NPC 5 complete ✓

### NPC 6 Flow:
1. Click NPC 6 → Desktop opens
2. Complete "Talk to Artist" → Dialogue system
3. Complete "Creativity Test" → Why/What If cards
4. Complete "Co-Creation Exercise" → iPad co-creation
5. All 3 tasks done → NPC 6 complete ✓

### NPC 9 Flow:
1. Click NPC 9 → Desktop opens
2. Complete "Memory Blocks" → Memory game 1
3. Complete "Memory Footprints" → Memory game 2
4. Complete "Talk to Worker" → Dialogue system
5. All 3 tasks done → NPC 9 complete ✓

---

## Desktop Interface Features

### Visual Elements:
- **Left Panel**: NPC avatar + name + progress (X/3 tasks)
- **Right Panel**: Daily Quests list with 3 tasks
- **Task Cards**: Icon + title + description + checkbox
- **Completed Tasks**: Green background + checkmark ✓
- **Active Task**: Blue border highlight

### Interaction:
- Click task → Opens task interface
- Complete task → Checkmark appears
- All tasks done → "All Tasks Complete" status

### Task Types:
- **Dialogue**: Conversation interface with NPC
- **Puzzle**: Logic puzzle interface
- **Exercise**: Text marking interface
- **Creativity**: Creative thinking cards
- **Co-creation**: iPad collaborative interface
- **Memory**: Memory game interface

---

## Progress Tracking

### State Management:
```javascript
const [rooftopCompletedTasks, setRooftopCompletedTasks] = useState([])
```

### Task IDs Array:
```javascript
[
  'npc5_dialogue',
  'npc5_puzzle', 
  'npc5_exercise',
  'npc6_dialogue',
  'npc6_creativity',
  'npc6_cocreation',
  'npc9_memory_blocks',
  'npc9_memory_footprint',
  'npc9_dialogue'
]
```

### Completion Check:
- **NPC 5 Complete**: All 3 tasks in array
- **NPC 6 Complete**: All 3 tasks in array
- **NPC 9 Complete**: All 3 tasks in array
- **Rooftop Complete**: All 9 tasks in array

---

## Integration Points

### Existing Systems to Connect:
1. **NPC 5 Dialogue** → `npc5DialogueSequence`
2. **NPC 5 Puzzles** → `npc5Puzzles`
3. **NPC 5 Exercise** → `exerciseTexts`
4. **NPC 6 Dialogue** → `npc6DialogueSequence`
5. **NPC 6 Creativity** → Creativity card system
6. **NPC 6 Co-creation** → iPad co-creation modal
7. **NPC 9 Memory** → Memory game systems
8. **NPC 9 Dialogue** → `npc9DialogueSequence`

---

## Visual Design

### Color Scheme:
- **Desktop Background**: Purple gradient (#667eea → #764ba2 → #f093fb)
- **Cards**: White (95% opacity)
- **Primary**: #667eea (Purple)
- **Success**: #22c55e (Green)
- **Active**: #3b82f6 (Blue)

### Typography:
- **Headers**: 24px, bold
- **Task Titles**: 16px, semi-bold
- **Descriptions**: 13px, regular
- **Status**: 13px, semi-bold

---

## Status

✅ Component created with 3 NPCs
✅ Each NPC has 3 tasks defined
✅ Task types properly categorized
✅ Desktop interface designed
⏳ Ready for integration into GlacierMap.jsx

## Next Steps

1. Integrate RooftopDesktopInterface into GlacierMap
2. Connect existing task systems
3. Update task completion handlers
4. Test all 9 tasks
5. Add sound effects
