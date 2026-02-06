# Main Island NPC1 Dialogue Fix

## Issue
NPC1 dialogue was appearing on Main Island during Phase 2 and after Phase 2 completion (color map), even though it shouldn't.

## Root Cause
Multiple places in the code were only checking `phase2Active` but not `phase2Completed`:
1. The auto-trigger useEffect was triggering NPC dialogues without checking `phase2Completed`
2. The `handleNpcClick` function only checked `phase2Active`
3. The `getCurrentNpc` function only checked `phase2Active` for all islands

When Phase 2 is completed (`phase2Completed = true`), `phase2Active` remains `true`, but the color map is shown. The code wasn't preventing initial dialogues from appearing in this state.

## Solution
Added `phase2Completed` checks to all relevant places:

### 1. Auto-trigger useEffect (lines 1464-1497)
```javascript
// Don't auto-trigger dialogues during phase2 or after phase2 completion (color map)
if (phase2Active || phase2Completed) {
  setShowDialogue(false)
  return
}
```

### 2. handleNpcClick function (lines 1565-1582)
```javascript
const handleNpcClick = (island) => {
  // Don't show initial dialogues in phase2 or after phase2 completion (color map)
  if (phase2Active || phase2Completed) {
    return
  }
  // ... rest of function
}
```

### 3. getCurrentNpc function - All islands (lines 2970-3050)
```javascript
// Island 1
if (phase2Active || phase2Completed) {
  return []
}

// Island 2
if (phase2Active || phase2Completed) {
  return []
}

// Island 3
if (phase2Active || phase2Completed) {
  return []
}

// Main Island
if (phase2Active || phase2Completed) {
  return []
}
```

## Expected Behavior
- **Phase 1**: NPC dialogues auto-trigger normally on Island 1, 2, 3
- **Phase 2 (during missions)**: No initial dialogues appear on any island
- **Phase 2 Completed (color map)**: No initial dialogues appear on any island
- **Restored Island**: iPad co-creation opens when clicking NPCs (handled separately)

## Files Modified
- `src/components/IslandMap.jsx`:
  - Lines 1464-1497: Auto-trigger useEffect
  - Lines 1565-1582: handleNpcClick function
  - Lines 2970-3050: getCurrentNpc function (all island cases)

## Testing
To verify the fix:
1. Complete Phase 1 missions (9 GenAI items)
2. Complete Sparky debrief to activate Phase 2
3. Complete Phase 2 missions (5 spies)
4. Navigate to Main Island on color map
5. Verify that NPC1 dialogue does NOT appear
6. Navigate to Island 1, 2, 3 on color map
7. Verify that no initial dialogues appear on any island
8. Click Sparky on Main Island
9. Verify that Sparky's final dialogue appears correctly
