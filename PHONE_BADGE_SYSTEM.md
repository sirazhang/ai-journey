# Phone Badge System - Dynamic Progress Tracking

## Overview
The Your Progress phone interface now has a dynamic badge system that reflects the user's actual progress in the game.

## Badge Logic

### 1. NPC Link Badge (Green Chat Icon)
**Shows:** Number of available NPCs to chat with

**Logic:**
- **Glitch** (Central City): Always available (minimum badge = 1)
- **Alpha** (Desert): Available when `desertProgress > 0`
- **Ranger Moss** (Jungle): Available when `jungleProgress > 0`
- **Sparky** (Island): Available when `islandProgress > 0`
- **Momo** (Glacier): Available when `glacierProgress > 0`

**Example:**
- New user: Badge shows `1` (only Glitch)
- After starting Desert: Badge shows `2` (Glitch + Alpha)
- After completing all regions: Badge shows `5` (all NPCs)

### 2. Report Badge (Yellow Mail Icon)
**Shows:** Number of regions with 100% completion

**Logic:**
- Counts regions where progress === 100
- Checks: `desertProgress`, `jungleProgress`, `islandProgress`, `glacierProgress`

**Example:**
- No completed regions: No badge shown
- 1 completed region: Badge shows `1`
- All regions completed: Badge shows `4`

### 3. Review Badge (Orange Notes Icon)
**Shows:** Number of wrong answers/errors

**Logic:**
- Counts total items in `errorRecords` array
- Each wrong quiz answer or mistake adds to this count

**Example:**
- No errors: No badge shown
- 3 wrong answers: Badge shows `3`
- 10+ errors: Badge shows actual count

## Data Structure in localStorage

```javascript
{
  "aiJourneyUser": {
    // Region Progress (0-100)
    "desertProgress": 50,
    "jungleProgress": 100,
    "islandProgress": 25,
    "glacierProgress": 0,
    
    // Error Records
    "errorRecords": [
      {
        "subject": "Quiz Error",
        "content": "Wrong answer details",
        "preview": "Short preview",
        "timestamp": 1234567890
      }
    ],
    
    // Other data
    "explorerJournal": [...],
    "congratulations": [...]
  }
}
```

## Testing the Badge System

### Test 1: New User (No Progress)
```javascript
// Clear localStorage
localStorage.removeItem('aiJourneyUser')

// Expected Results:
// - NPC Link: Badge = 1 (only Glitch available)
// - Report: No badge
// - Review: No badge
```

### Test 2: Started Desert
```javascript
localStorage.setItem('aiJourneyUser', JSON.stringify({
  desertProgress: 30
}))

// Expected Results:
// - NPC Link: Badge = 2 (Glitch + Alpha)
// - Report: No badge
// - Review: No badge
```

### Test 3: Completed Jungle
```javascript
localStorage.setItem('aiJourneyUser', JSON.stringify({
  desertProgress: 50,
  jungleProgress: 100
}))

// Expected Results:
// - NPC Link: Badge = 3 (Glitch + Alpha + Moss)
// - Report: Badge = 1 (Jungle completed)
// - Review: No badge
```

### Test 4: Multiple Errors
```javascript
localStorage.setItem('aiJourneyUser', JSON.stringify({
  desertProgress: 50,
  jungleProgress: 100,
  errorRecords: [
    { subject: "Error 1", content: "...", timestamp: Date.now() },
    { subject: "Error 2", content: "...", timestamp: Date.now() },
    { subject: "Error 3", content: "...", timestamp: Date.now() }
  ]
}))

// Expected Results:
// - NPC Link: Badge = 3
// - Report: Badge = 1
// - Review: Badge = 3
```

### Test 5: All Regions Completed
```javascript
localStorage.setItem('aiJourneyUser', JSON.stringify({
  desertProgress: 100,
  jungleProgress: 100,
  islandProgress: 100,
  glacierProgress: 100,
  errorRecords: []
}))

// Expected Results:
// - NPC Link: Badge = 5 (all NPCs)
// - Report: Badge = 4 (all regions)
// - Review: No badge (no errors)
```

## NPC Availability in Chat

When opening NPC Link app:
- Only shows NPCs that are unlocked
- Glitch always appears first
- Other NPCs appear in order: Alpha, Moss, Sparky, Momo
- Empty state message if no NPCs available (shouldn't happen since Glitch is always there)

## Badge Update Timing

Badges are calculated when:
1. Phone interface opens (`isOpen` changes to true)
2. `calculateBadges()` function runs
3. Reads from `localStorage.aiJourneyUser`
4. Updates `badges` state
5. Apps array uses badge values

## Implementation Details

### Badge Calculation Function
```javascript
const calculateBadges = () => {
  const savedUser = localStorage.getItem('aiJourneyUser')
  if (!savedUser) {
    setBadges({ npcLink: 1, report: 0, review: 0 })
    return
  }

  const userData = JSON.parse(savedUser)
  
  // Count available NPCs
  let availableNPCs = 1 // Glitch always available
  if ((userData.desertProgress || 0) > 0) availableNPCs++
  if ((userData.jungleProgress || 0) > 0) availableNPCs++
  if ((userData.islandProgress || 0) > 0) availableNPCs++
  if ((userData.glacierProgress || 0) > 0) availableNPCs++
  
  // Count completed regions
  let completedRegions = 0
  if (userData.desertProgress === 100) completedRegions++
  if (userData.jungleProgress === 100) completedRegions++
  if (userData.islandProgress === 100) completedRegions++
  if (userData.glacierProgress === 100) completedRegions++
  
  // Count errors
  const wrongAnswersCount = (userData.errorRecords || []).length
  
  setBadges({
    npcLink: availableNPCs,
    report: completedRegions,
    review: wrongAnswersCount
  })
}
```

### Badge Display Logic
```javascript
const apps = [
  { id: 'photos', name: 'Vision Log', icon: Aperture, color: '...' },
  { 
    id: 'assistant', 
    name: 'NPC Link', 
    icon: MessageCircle, 
    color: '#10b981', 
    badge: badges.npcLink > 0 ? badges.npcLink : undefined 
  },
  { 
    id: 'mail', 
    name: 'Report', 
    icon: MailIcon, 
    color: '#fbbf24', 
    badge: badges.report > 0 ? badges.report : undefined 
  },
  { 
    id: 'notes', 
    name: 'Review', 
    icon: StickyNote, 
    color: '#f97316', 
    badge: badges.review > 0 ? badges.review : undefined 
  },
]
```

## Visual Design

### Badge Appearance
- Position: Top-right corner of app icon
- Size: 22px height, min-width 22px
- Background: Red (#ef4444)
- Text: White, 11px, bold
- Border: None
- Shadow: Subtle drop shadow
- Max display: Shows actual number (no "99+" limit currently)

### Badge States
- **No badge**: `undefined` or `0` - nothing shown
- **Single digit**: Circular badge (e.g., "3")
- **Double digit**: Oval badge (e.g., "12")
- **Large numbers**: Shows full number (e.g., "156")

## Integration Points

### Where Progress is Updated
You need to update these values in your game components:

1. **Desert Map**: Update `desertProgress` when missions complete
2. **Jungle Map**: Update `jungleProgress` when missions complete
3. **Island Map**: Update `islandProgress` when missions complete
4. **Glacier Map**: Update `glacierProgress` when missions complete
5. **Quiz Components**: Add to `errorRecords` when user answers incorrectly

### Example Progress Update
```javascript
// In your mission completion handler
const updateProgress = (region, progress) => {
  const savedUser = localStorage.getItem('aiJourneyUser')
  const userData = savedUser ? JSON.parse(savedUser) : {}
  
  userData[`${region}Progress`] = progress
  
  localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
}

// Usage
updateProgress('desert', 100) // Desert completed
updateProgress('jungle', 50)  // Jungle 50% done
```

### Example Error Recording
```javascript
// In your quiz error handler
const recordError = (subject, content) => {
  const savedUser = localStorage.getItem('aiJourneyUser')
  const userData = savedUser ? JSON.parse(savedUser) : {}
  
  if (!userData.errorRecords) {
    userData.errorRecords = []
  }
  
  userData.errorRecords.push({
    subject: subject,
    content: content,
    preview: content.substring(0, 50) + '...',
    timestamp: Date.now()
  })
  
  localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
}

// Usage
recordError('Quiz Error', 'You selected the wrong answer for question 3')
```

## Future Enhancements

1. **Badge Animations**: Pulse effect when badge number increases
2. **Badge Colors**: Different colors for different badge types
3. **Max Display**: Show "99+" for numbers over 99
4. **Clear Errors**: Button to clear error records
5. **Progress Tracking**: More granular progress tracking per mission
6. **Achievement Badges**: Special badges for milestones
7. **Notification System**: Toast notifications when badges update

## Troubleshooting

### Badge Not Updating
1. Check localStorage has correct data structure
2. Verify progress values are numbers (not strings)
3. Ensure phone is closed and reopened to trigger recalculation
4. Check browser console for errors

### Wrong Badge Count
1. Verify progress values in localStorage
2. Check if progress is exactly 100 for completion (not 99 or 101)
3. Ensure errorRecords is an array
4. Clear localStorage and test with known values

### NPC Not Appearing
1. Check region progress is > 0 (not === 0)
2. Verify region name matches: 'desert', 'jungle', 'island', 'glacier'
3. Check localStorage key format: `${region}Progress`
4. Glitch should always appear regardless of progress
