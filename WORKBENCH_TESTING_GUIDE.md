# Workbench Testing Guide

## Quick Start
1. **Dev Server**: Running at http://localhost:5174/
2. **Navigate**: Go to City page in the game
3. **Open Workbench**: Click the "COMPANY" button (purple glowing card on the right)

## Test Scenarios

### Test 1: Basic Interface
**Steps:**
1. Click "COMPANY" button in City page
2. Verify MacBook interface opens with purple gradient background
3. Check menu bar shows current time
4. Verify 4 desktop icons appear on the right:
   - Workbench (red)
   - Safari (blue)
   - Maps (green)
   - Calendar (orange)
5. Verify dock at bottom shows all 4 apps
6. Click X button in menu bar to close

**Expected Result:** ✅ Interface opens smoothly, all elements visible, closes properly

---

### Test 2: Workbench App - Common Sense
**Steps:**
1. Open MacBook interface
2. Workbench app should auto-open
3. Read the statement displayed
4. Note the category (e.g., "Common Sense")
5. Note the search hint
6. Click TRUE or FALSE
7. Read the feedback and explanation
8. Check score increased if correct
9. Click "Next Case"

**Expected Result:** ✅ Statement loads, feedback shows, score updates, new statement loads

---

### Test 3: Browser App - Web Search
**Steps:**
1. Open MacBook interface
2. Click Safari icon (blue) from desktop or dock
3. Type a search query (e.g., "is the great wall visible from moon")
4. Press Enter or click "Go"
5. Wait for loading animation
6. Read the search results

**Expected Result:** ✅ Search executes, results display in 2-3 paragraphs

**Test Queries:**
- "is california in usa"
- "distance from new york to los angeles"
- "does atlantis exist"
- "highest mountain in the world"

---

### Test 4: Maps App - Location Search
**Steps:**
1. Open MacBook interface
2. Click Maps icon (green) from desktop or dock
3. Type a location query (e.g., "California USA")
4. Click "Search"
5. Wait for loading animation
6. Read the location information

**Expected Result:** ✅ Location info displays with details

**Test Queries:**
- "California USA"
- "Atlantis Atlantic Ocean"
- "distance from Beijing to Shanghai"
- "route from New York to Los Angeles"
- "coffee shops near me"

---

### Test 5: Calendar App - Tasks
**Steps:**
1. Open MacBook interface
2. Click Calendar icon (orange) from desktop or dock
3. Verify current month displays
4. Check today's date is highlighted
5. Scroll down to see "Today's Tasks"
6. Verify 4 tasks are listed:
   - Complete 5 Information Verifications (HIGH)
   - Use Safari for Uncertain Information (MEDIUM)
   - Check Location Accuracy (MEDIUM)
   - Verify Distance Claims (LOW)
7. Check "Task Guidelines" section at bottom

**Expected Result:** ✅ Calendar displays correctly, all tasks visible, guidelines show

---

### Test 6: Multi-Window Management
**Steps:**
1. Open MacBook interface
2. Open Workbench (should be auto-open)
3. Click Safari icon to open Browser
4. Click Maps icon to open Maps
5. Click Calendar icon to open Calendar
6. Click on Workbench window - verify it comes to front
7. Click on Safari window - verify it comes to front
8. Check dock shows white dots under all open apps
9. Click red button on Safari window to close it
10. Verify Safari closes and dock indicator disappears

**Expected Result:** ✅ All windows open, z-index works, close works, dock indicators update

---

### Test 7: Complete Verification Flow
**Steps:**
1. Open MacBook interface
2. Read Workbench statement (e.g., "The Great Wall is visible from the Moon")
3. Note it's a Common Sense category
4. Open Safari from dock
5. Search "can you see great wall from moon"
6. Read results (should say it's a myth)
7. Click on Workbench window to bring it to front
8. Click FALSE
9. Verify feedback shows "Correct!"
10. Verify score increased by 10 points
11. Click "Next Case"
12. Repeat with different category

**Expected Result:** ✅ Complete flow works, user can verify information using tools

---

### Test 8: Location Verification Flow
**Steps:**
1. Open MacBook interface
2. Wait for a "Place Existence" or "Location Accuracy" statement
   - If not, click "Next Case" until you get one
3. Note the statement (e.g., "Atlantis is in the Atlantic Ocean")
4. Open Maps from dock
5. Search for the location mentioned
6. Check if Maps confirms or denies existence
7. Return to Workbench
8. Make your TRUE/FALSE judgment
9. Check feedback

**Expected Result:** ✅ Maps helps verify location claims

---

### Test 9: Distance Verification Flow
**Steps:**
1. Open MacBook interface
2. Wait for a "Distance/Reachability" statement
   - If not, click "Next Case" until you get one
3. Note the distance claim (e.g., "Walk from NY to LA in 2 days")
4. Open Maps from dock
5. Search "distance from New York to Los Angeles walking"
6. Check the actual distance and time
7. Return to Workbench
8. Make your judgment
9. Check feedback

**Expected Result:** ✅ Maps provides accurate distance/time data

---

### Test 10: Error Handling
**Steps:**
1. Open MacBook interface
2. Disconnect internet (if possible)
3. Try to load new statement in Workbench
4. Verify fallback statement appears
5. Try to search in Safari
6. Verify error message appears
7. Try to search in Maps
8. Verify error message appears
9. Reconnect internet
10. Verify everything works again

**Expected Result:** ✅ Graceful fallbacks, no crashes, clear error messages

---

## API Testing

### Test Gemini 3 Pro (Workbench & Browser)
**Endpoint:** `gemini-3-pro-preview`
**Test:**
1. Open Workbench - verify statements generate
2. Open Safari - verify search works
3. Check console for API responses
4. Verify no 404 errors

### Test Gemini 2.5 Flash (Maps)
**Endpoint:** `gemini-2.5-flash`
**Test:**
1. Open Maps
2. Search for locations
3. Search for routes
4. Check console for API responses
5. Verify Google Maps tool is used

---

## Performance Testing

### Load Time
- MacBook interface should open in < 500ms
- Apps should open instantly (already rendered)
- API calls should complete in < 3 seconds

### Animations
- All hover effects should be smooth (0.2s transition)
- Window z-index changes should be instant
- Loading spinners should rotate smoothly

### Memory
- Check browser DevTools for memory leaks
- Close and reopen interface multiple times
- Verify no memory accumulation

---

## Visual Testing

### Desktop Icons
- [ ] All 4 icons visible on right side
- [ ] Icons have correct colors (red/blue/green/orange)
- [ ] Icons scale on hover (1.1x)
- [ ] Labels display below icons

### Dock
- [ ] Dock centered at bottom
- [ ] Glassmorphism effect visible
- [ ] Icons scale on hover (1.15x)
- [ ] White dots appear under open apps

### Windows
- [ ] Windows centered on screen
- [ ] macOS-style header with 3 buttons
- [ ] Red/yellow/green buttons visible
- [ ] Window title centered
- [ ] Content area scrollable if needed

### Workbench App
- [ ] Category badge shows current category
- [ ] Score badge shows trophy icon and points
- [ ] Statement card has clean white background
- [ ] Hint cards display with icons
- [ ] TRUE button is green
- [ ] FALSE button is red
- [ ] Feedback shows checkmark or X icon
- [ ] Explanation card is readable

### Browser App
- [ ] Search bar has magnifying glass icon
- [ ] Input field is rounded
- [ ] "Go" button is blue
- [ ] Results card has light green background
- [ ] Empty state shows search icon

### Maps App
- [ ] Search bar has map pin icon
- [ ] Input field is rounded
- [ ] "Search" button is green
- [ ] Results card has light green background
- [ ] Places cards show ratings
- [ ] Empty state shows map pin icon

### Calendar App
- [ ] Month/year header is purple gradient
- [ ] Calendar grid displays correctly
- [ ] Today's date has purple background
- [ ] Tasks section has orange header
- [ ] Task cards have checkboxes
- [ ] Priority badges have correct colors
- [ ] Guidelines section has blue background

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Android Chrome

### Screen Sizes
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Laptop)
- [ ] 2560x1440 (2K)
- [ ] 3840x2160 (4K)

---

## Console Checks

### No Errors
- [ ] No red errors in console
- [ ] No 404 errors for API calls
- [ ] No 429 rate limit errors (or handled gracefully)

### Expected Logs
- "Company button clicked" - when opening MacBook
- API responses from Gemini
- Any fallback messages if API fails

---

## Scoring System Test

**Goal:** Verify scoring works correctly

1. Start with score = 0
2. Answer 5 questions correctly
3. Score should be 50
4. Answer 1 question incorrectly
5. Score should still be 50 (no penalty)
6. Continue answering correctly
7. Score should keep increasing by 10

---

## Edge Cases

### Test 1: Rapid Clicking
- Click TRUE/FALSE multiple times rapidly
- Verify only one answer registers
- Verify no duplicate API calls

### Test 2: Window Spam
- Open all 4 apps rapidly
- Verify all open correctly
- Verify no z-index issues

### Test 3: Empty Search
- Try to search with empty input
- Verify nothing happens or shows message

### Test 4: Long Text
- Generate statements with very long text
- Verify text wraps correctly
- Verify no overflow issues

### Test 5: Special Characters
- Search for queries with special characters
- Verify no crashes
- Verify results display correctly

---

## Success Criteria

✅ **PASS** if:
- All 4 apps open and function correctly
- Workbench generates statements and provides feedback
- Browser performs web searches
- Maps provides location information
- Calendar displays tasks and guidelines
- Multi-window management works
- Scoring system works
- No console errors
- Smooth animations
- Graceful error handling

❌ **FAIL** if:
- Apps don't open
- API calls fail without fallbacks
- Windows don't manage z-index
- Scoring doesn't work
- Console shows errors
- Interface crashes
- Animations are janky

---

## Bug Reporting Template

```
**Bug Title:** [Short description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Browser:** [Chrome/Firefox/Safari]
**Screen Size:** [1920x1080]
**Console Errors:** [Any errors]
**Screenshots:** [If applicable]
```

---

## Quick Test Checklist

For rapid testing, verify these core functions:

- [ ] MacBook opens from City page
- [ ] Workbench generates statements
- [ ] TRUE/FALSE buttons work
- [ ] Score increases on correct answers
- [ ] Safari search works
- [ ] Maps search works
- [ ] Calendar displays
- [ ] All windows can open
- [ ] Windows can close
- [ ] Dock indicators work
- [ ] Close button returns to City
- [ ] No console errors

---

## Notes

- **API Key**: Ensure `VITE_GEMINI_API_KEY` is set in `.env`
- **Rate Limits**: Gemini API has limits, fallbacks should handle this
- **Network**: Some tests require internet connection
- **Time**: Full testing takes ~30 minutes

---

## Contact

If you find any issues, document them using the bug reporting template above.

**Happy Testing! 🚀**
