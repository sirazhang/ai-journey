# Desert Phase 2 NPC Display Fix

## Issue
Phase 1 NPCs (NPC1, NPC2, Gatekeeper) were incorrectly appearing in Desert and Gate views during Phase 2 (after Mission 1 completion). According to the design:

- **Phase 1** (Mission 1 not done): Desert view with NPC1, NPC2, Gatekeeper
- **Phase 2** (Mission 1 done, Mission 4 not done): Castle view for Mission 2-4, Desert/Gate have NO NPCs but keep navigation
- **Phase 3** (Mission 4 done, color mode): Desert view with NPC5, NPC6, NPC7

## Root Cause
The NPC rendering logic was checking `!missionStarted && capturedObjects.length < 11`, which would show NPCs even during Phase 2 when the user returned to Desert/Gate views after completing Mission 1.

## Solution

### 1. Updated NPC Rendering Logic (lines 4579-4611)
Changed the condition from:
```javascript
{!missionStarted && capturedObjects.length < 11 && currentSegment === SEGMENTS.SEGMENT_1 && (
```

To:
```javascript
{capturedObjects.length < 11 && !phase2Completed && currentSegment === SEGMENTS.SEGMENT_1 && (
```

**Key Changes:**
- Removed `!missionStarted` check (not reliable for Phase 2)
- Added `!phase2Completed` check to ensure NPCs only show in Phase 1
- Applied to all three Phase 1 NPCs: NPC1, NPC2, Gatekeeper

### 2. Updated Auto-Show Dialogue Logic (lines 920-990)
Added early return check:
```javascript
// CRITICAL: Don't auto-show if Mission 1 is completed (11 photos collected)
// This prevents showing Phase 1 NPC dialogues during Phase 2
if (capturedObjects.length >= 11) {
  console.log('Auto-show dialogue: BLOCKED (Mission 1 completed, in Phase 2)')
  return
}
```

**Key Changes:**
- Added check for `capturedObjects.length >= 11` before other checks
- Prevents auto-showing Phase 1 NPC dialogues when returning to Desert during Phase 2
- Added `capturedObjects.length` to useEffect dependency array

## Expected Behavior After Fix

### Phase 1 (Before Mission 1 Completion)
- Desert view shows NPC1, NPC2, Gatekeeper
- Auto-show dialogues work for Phase 1 NPCs
- User can navigate to Gate → Castle

### Phase 2 (After Mission 1 Completion, Before Mission 4 Completion)
- User is in Castle view for Mission 2-4
- Desert and Gate views: **NO NPCs visible**
- Navigation arrows and Zoom button remain functional
- No auto-show dialogues in Desert/Gate
- User can freely navigate but main tasks are in Castle

### Phase 3 (After Mission 4 Completion)
- Color mode activates
- Desert view shows new NPCs: NPC5, NPC6, NPC7
- Gate view shows NPC7 completion dialogue

## Testing Checklist
- [ ] Phase 1: NPCs appear in Desert view before Mission 1
- [ ] Phase 2: No NPCs in Desert/Gate after Mission 1 completion
- [ ] Phase 2: Navigation arrows and Zoom button still work
- [ ] Phase 2: No auto-show dialogues in Desert/Gate
- [ ] Phase 3: Color mode NPCs appear after Mission 4
- [ ] Save/load: Progress persists correctly across sessions

## Files Modified
- `src/components/DesertMap.jsx`
  - Lines 4579-4611: NPC rendering conditions
  - Lines 920-990: Auto-show dialogue logic
