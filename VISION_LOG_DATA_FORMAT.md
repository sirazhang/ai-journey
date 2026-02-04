# Vision Log - Photo Data Format

## 📸 Overview
Vision Log (Photos app) now displays detailed information for each captured photo, including item name, classification, description, tags, and location.

## 💾 Data Structure

### explorerJournal Array Format
```javascript
{
  "aiJourneyUser": {
    "explorerJournal": [
      {
        "photo": "data:image/png;base64,...",  // Base64 image data
        "item": "Cactus",                       // Item name
        "type": "healthy",                      // Classification: healthy/unhealthy/uncertain
        "timestamp": 1234567890,                // Unix timestamp
        "description": "A healthy desert plant with green color",  // Optional
        "tags": ["desert", "plant", "green"],   // Optional array
        "region": "Desert"                      // Optional: Desert/Jungle/Island/Glacier
      }
    ]
  }
}
```

## 🎨 Display Format

### Photo Detail View Components

#### 1. Item Name
- **Label**: "ITEM" (uppercase, small, gray)
- **Value**: Large, bold, white text
- **Example**: "Cactus"

#### 2. Classification Badge
- **Label**: "CLASSIFICATION" (uppercase, small, gray)
- **Display**: Colored badge with icon
- **Types**:
  - ✓ Healthy (Green #4ade80)
  - ✗ Unhealthy (Red #f87171)
  - ? Uncertain (Yellow #fbbf24)

#### 3. Description
- **Label**: "DESCRIPTION" (uppercase, small, gray)
- **Value**: Multi-line text, white, line-height 1.5
- **Example**: "A healthy desert plant with green color and thick leaves"

#### 4. Tags
- **Label**: "TAGS" (uppercase, small, gray)
- **Display**: Purple badges with # prefix
- **Example**: #desert #plant #green
- **Color**: Purple (#c084fc) with transparent background

#### 5. Location/Region
- **Label**: "LOCATION" (uppercase, small, gray)
- **Value**: Region name
- **Example**: "Desert", "Jungle", "Island", "Glacier"

## 📝 Example Data

### Minimal Required Data
```javascript
{
  photo: "data:image/png;base64,iVBORw0KG...",
  item: "Cactus",
  type: "healthy",
  timestamp: Date.now()
}
```

### Full Data with All Fields
```javascript
{
  photo: "data:image/png;base64,iVBORw0KG...",
  item: "Cactus",
  type: "healthy",
  timestamp: Date.now(),
  description: "A healthy desert plant with thick green leaves and spines for protection",
  tags: ["desert", "plant", "succulent", "green"],
  region: "Desert"
}
```

## 🎯 How to Save Photos in Game

### Desert Map Example
```javascript
// When user captures/identifies an object
const saveToJournal = (photoData, itemName, classification, additionalInfo = {}) => {
  const savedUser = localStorage.getItem('aiJourneyUser')
  const userData = savedUser ? JSON.parse(savedUser) : {}
  
  if (!userData.explorerJournal) {
    userData.explorerJournal = []
  }
  
  userData.explorerJournal.push({
    photo: photoData,                    // Base64 image
    item: itemName,                      // "Cactus"
    type: classification,                // "healthy", "unhealthy", "uncertain"
    timestamp: Date.now(),
    description: additionalInfo.description || '',
    tags: additionalInfo.tags || [],
    region: additionalInfo.region || 'Desert'
  })
  
  localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
}

// Usage
saveToJournal(
  capturedImageBase64,
  "Cactus",
  "healthy",
  {
    description: "A healthy desert plant with thick green leaves",
    tags: ["desert", "plant", "succulent"],
    region: "Desert"
  }
)
```

### Jungle Map Example
```javascript
saveToJournal(
  capturedImageBase64,
  "Mushroom",
  "unhealthy",
  {
    description: "A toxic mushroom with red spots, dangerous to consume",
    tags: ["jungle", "fungus", "toxic", "red"],
    region: "Jungle"
  }
)
```

## 🎨 Visual Design

### Info Card Style
- **Background**: Glassmorphism (rgba(255, 255, 255, 0.1) + blur)
- **Border**: 1px solid rgba(255, 255, 255, 0.2)
- **Border Radius**: 16px
- **Padding**: 16px
- **Sections**: Separated by 1px dividers

### Classification Badge Colors
```css
Healthy:
  background: rgba(34, 197, 94, 0.2)
  color: #4ade80
  border: 1px solid rgba(34, 197, 94, 0.3)

Unhealthy:
  background: rgba(239, 68, 68, 0.2)
  color: #f87171
  border: 1px solid rgba(239, 68, 68, 0.3)

Uncertain:
  background: rgba(251, 191, 36, 0.2)
  color: #fbbf24
  border: 1px solid rgba(251, 191, 36, 0.3)
```

### Tag Badge Style
```css
background: rgba(147, 51, 234, 0.2)
color: #c084fc
border: 1px solid rgba(147, 51, 234, 0.3)
padding: 4px 10px
border-radius: 6px
font-size: 12px
```

## 📱 User Experience

### Photo Grid View
- Shows thumbnail images in 3-column grid
- Click to open detail view

### Detail View
1. **Top Bar**: Date/time, back button
2. **Image**: Centered, max 400px height
3. **Info Card**: Scrollable, shows all metadata
4. **Action Bar**: Share, Like, Info, Delete buttons

### Scrolling Behavior
- View is scrollable to see all information
- Top bar is sticky (stays visible while scrolling)
- Bottom action bar is fixed

## 🔄 Data Flow

```
Game Component (Desert/Jungle)
    ↓
Capture/Identify Object
    ↓
Save to localStorage.aiJourneyUser.explorerJournal
    ↓
Vision Log loads data on open
    ↓
Display in grid view
    ↓
Click photo → Show detail view with all info
```

## ✅ Field Validation

### Required Fields
- ✅ `photo` (string, base64)
- ✅ `item` (string)
- ✅ `type` (string: "healthy" | "unhealthy" | "uncertain")
- ✅ `timestamp` (number)

### Optional Fields
- `description` (string) - defaults to empty string
- `tags` (array of strings) - defaults to empty array
- `region` (string) - defaults to empty string

### Type Values
Only these three values are recognized:
- `"healthy"` → Green badge with ✓
- `"unhealthy"` → Red badge with ✗
- `"uncertain"` → Yellow badge with ?

Any other value will be treated as "uncertain"

## 🎯 Best Practices

### 1. Always Include Core Fields
```javascript
{
  photo: imageData,
  item: "Item Name",
  type: "healthy",
  timestamp: Date.now()
}
```

### 2. Add Description for Context
```javascript
description: "Brief description of what was identified and why"
```

### 3. Use Relevant Tags
```javascript
tags: ["region", "category", "color", "status"]
// Example: ["desert", "plant", "green", "healthy"]
```

### 4. Specify Region
```javascript
region: "Desert" // or "Jungle", "Island", "Glacier"
```

### 5. Use Consistent Naming
- Item names: Title case ("Cactus", "Red Mushroom")
- Tags: Lowercase ("desert", "plant", "toxic")
- Regions: Title case ("Desert", "Jungle")

## 🐛 Troubleshooting

### Photo Not Showing
- Check if `photo` field contains valid base64 data
- Verify data starts with "data:image/..."

### Classification Not Colored
- Ensure `type` is exactly "healthy", "unhealthy", or "uncertain"
- Check for typos or extra spaces

### Tags Not Displaying
- Verify `tags` is an array: `["tag1", "tag2"]`
- Not a string: `"tag1, tag2"` ❌

### Description Not Showing
- Check if `description` field exists and is not empty
- Verify it's a string, not an object

## 📊 Example Complete Entry

```javascript
{
  photo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  item: "Desert Cactus",
  type: "healthy",
  timestamp: 1709567890123,
  description: "A tall saguaro cactus with multiple arms, showing healthy green color and no signs of disease. Common in the Sonoran Desert.",
  tags: ["desert", "cactus", "saguaro", "green", "tall"],
  region: "Desert"
}
```

This will display as:
- **Item**: Desert Cactus
- **Classification**: ✓ Healthy (green badge)
- **Description**: Full text shown
- **Tags**: #desert #cactus #saguaro #green #tall
- **Location**: Desert

## 🎉 Summary

The Vision Log now provides a rich, detailed view of captured photos with:
- ✅ Beautiful glassmorphism design
- ✅ Color-coded classifications
- ✅ Flexible tag system
- ✅ Scrollable content
- ✅ Professional iOS-style interface
- ✅ Easy to extend with more fields
