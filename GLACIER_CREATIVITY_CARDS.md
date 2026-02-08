# Glacier Creativity Card Optimization

## Changes Implemented

### 1. Title Update
- **Changed**: "WHY? DARE WHY" → "DAILY WHY"
- **Location**: Line 8641 in GlacierMap.jsx
- **Reason**: User requested to match reference design

### 2. Card Dimensions
- **Width**: Changed from `400px` (fixed) to `30%` (responsive)
- **Height**: Added `height: '65%'` (previously no explicit height)
- **Location**: Lines 8599-8608 in GlacierMap.jsx
- **Benefit**: Card now scales with viewport size and has consistent proportions

### 3. Background Color
- **Status**: Already light blue ✅
- **Current**: `linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)`
- **No change needed**: Matches user's reference design requirement

### 4. Question Section Styling (NEW)
- **Removed**: Dashed border around question box
- **Changed**: Line height from default to `1.8` for better readability
- **Kept**: White background, rounded corners, wavy underline on text
- **Reason**: Match reference design - cleaner look without border

### 5. Input Textarea Border (NEW)
- **Changed**: Border thickness from `2px` to `1px`
- **Reason**: Match reference design - thinner, more subtle border
- **Color**: Kept blue (#3b82f6) for consistency

## Card Styling Details

### Current Design Features:
- **Position**: Absolute positioning with two variants:
  - Bottom-left: `bottom: 100px, left: 50px`
  - Top-right: `top: 100px, right: 50px`
- **Border**: 3px dashed blue (#3b82f6)
- **Border Radius**: 20px
- **Padding**: 24px
- **Shadow**: `0 8px 32px rgba(0, 0, 0, 0.3)`
- **Z-index**: 200

### Card Components:
1. **Header**: Icon + Title + Close button
2. **Question Section**: Generated question with wavy underline (no border)
3. **Input Section**: Textarea with thin 1px border
4. **Feedback Section**: AI-generated feedback display
5. **Action Buttons**: Get Feedback / Skip to Answer / Save

## Testing Notes

### Responsive Behavior:
- Card width now scales with viewport (30% of parent container)
- Card height is fixed at 65% of viewport height
- May need to test on different screen sizes to ensure content fits properly

### Potential Adjustments:
- If content overflows at 65% height, consider:
  - Adding `overflow-y: auto` to enable scrolling
  - Adjusting padding to maximize content space
  - Using `max-height` instead of fixed `height`

## Files Modified
- `src/components/GlacierMap.jsx` (Lines 8596-8920)

## Status
✅ **COMPLETE** - All requested changes implemented:
- Title changed to "DAILY WHY"
- Width changed to 30%
- Height set to 65%
- Light blue background confirmed
- Question box border removed
- Question text line height increased to 1.8
- Input textarea border thinned to 1px
