# Island iPad Co-Creation Feature - Design Document

## Architecture Overview

### Component Structure
```
IslandMap.jsx
  └── iPadCoCreationModal (new)
      ├── iPadDeviceFrame
      ├── iPadStatusBar
      ├── iPadHeader
      ├── iPadContent
      │   ├── StoryPanel (left sidebar)
      │   │   ├── StoryTextArea
      │   │   └── ToolsPanel
      │   │       ├── ColorPicker
      │   │       ├── StickerPicker
      │   │       └── ClearButton
      │   └── CanvasPanel (right main)
      │       ├── CanvasBoard (from public/ipad)
      │       ├── MagicInputField
      │       └── ActionButtons
      │           ├── MakeItRealButton
      │           └── SaveButton
      └── iPadHomeIndicator
```

## Data Flow

### 1. Opening iPad Interface
```
User clicks NPC in phase2 color map
  ↓
IslandMap sets showIPadModal = true
  ↓
iPadCoCreationModal renders
  ↓
Auto-call Gemini API to generate idea
  ↓
Display story starter + shape on canvas
```

### 2. Creating Story & Drawing
```
User types story continuation
  ↓
User draws on canvas with tools
  ↓
User optionally adds magic input text
  ↓
User clicks "MAKE IT REAL!"
```

### 3. AI Enhancement
```
Collect canvas data + story + magic input
  ↓
Parallel API calls:
  - generateMagicImage(canvas, story, magicInput)
  - polishStory(userStory)
  ↓
Display AI-generated image + polished story
```

### 4. Saving to Vision Log
```
User clicks "Save Story Card"
  ↓
Create composite image:
  - AI image on top
  - Story text below with styling
  ↓
Save to localStorage.aiJourneyUser.explorerJournal
  ↓
Show success feedback
```

## State Management

### IslandMap States
```javascript
const [showIPadModal, setShowIPadModal] = useState(false)
const [selectedNpcForIPad, setSelectedNpcForIPad] = useState(null)
```

### iPadCoCreationModal States
```javascript
const [stage, setStage] = useState('START') // START, DRAWING, GENERATING, RESULT
const [idea, setIdea] = useState(null) // { shape, storyStarter }
const [userStory, setUserStory] = useState('')
const [magicInput, setMagicInput] = useState('')
const [magicStory, setMagicStory] = useState('')
const [generatedImage, setGeneratedImage] = useState(null)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)
const [drawingTool, setDrawingTool] = useState({ mode: 'brush', color: '#1e293b', size: 5 })
const [activeTab, setActiveTab] = useState('colors') // 'colors' | 'shapes'
```

## API Integration

### Gemini Service Functions

#### 1. generateIdea()
```javascript
// Generate random story starter + shape
const generateIdea = async () => {
  const shapes = ['circle', 'heart', 'square', 'triangle', 'star']
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
  
  const prompt = `Generate a creative story starter (1-2 sentences) for a child's drawing activity. 
  The story should be imaginative and open-ended. 
  Only return the story starter text, nothing else.`
  
  const response = await fetch(getGeminiUrl('gemini-2.0-flash-exp'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })
  
  const data = await response.json()
  const storyStarter = data.candidates[0].content.parts[0].text.trim()
  
  return { shape: randomShape, storyStarter }
}
```

#### 2. generateMagicImage()
```javascript
// Generate enhanced image from canvas drawing
const generateMagicImage = async (canvasDataUrl, story, additionalElements) => {
  const prompt = `Based on this child's drawing and story, create an enhanced, colorful illustration.
  
  Story: ${story}
  ${additionalElements ? `Additional elements to add: ${additionalElements}` : ''}
  
  Make it vibrant, imaginative, and child-friendly.`
  
  // Use Gemini's image generation capability
  // Return base64 image data
}
```

#### 3. polishStory()
```javascript
// Polish user's story text
const polishStory = async (userStory) => {
  const prompt = `Polish this child's story to improve grammar and flow, 
  but keep the original ideas and creativity intact. 
  Keep it short (2-3 sentences).
  
  Original story: ${userStory}
  
  Only return the polished story, nothing else.`
  
  const response = await fetch(getGeminiUrl('gemini-2.0-flash-exp'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  })
  
  const data = await response.json()
  return data.candidates[0].content.parts[0].text.trim()
}
```

## Canvas Implementation

### CanvasBoard Component
```javascript
// Reuse from public/ipad/components/CanvasBoard.tsx
// Convert to .jsx and adapt for React (not TypeScript)

const CanvasBoard = forwardRef(({ shape, tool }, ref) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  
  // Drawing logic
  const startDrawing = (e) => { /* ... */ }
  const draw = (e) => { /* ... */ }
  const stopDrawing = () => { /* ... */ }
  
  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getCanvasData: () => canvasRef.current.toDataURL('image/png'),
    clearCanvas: () => { /* ... */ }
  }))
  
  return <canvas ref={canvasRef} />
})
```

## Composite Image Generation

### createCompositeImage()
```javascript
const createCompositeImage = async (aiImageUrl, storyText) => {
  // Load AI image
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.src = aiImageUrl
  await new Promise(resolve => img.onload = resolve)
  
  // Create canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  const textAreaHeight = 200
  const padding = 40
  canvas.width = img.width
  canvas.height = img.height + textAreaHeight
  
  // Draw background
  ctx.fillStyle = '#FFF8E1'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw AI image
  ctx.drawImage(img, 0, 0)
  
  // Draw separator line
  ctx.strokeStyle = '#D7CCC8'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(padding, img.height + 10)
  ctx.lineTo(canvas.width - padding, img.height + 10)
  ctx.stroke()
  
  // Draw story text (wrapped)
  ctx.fillStyle = '#5D4037'
  ctx.font = 'bold 32px "Fredoka", sans-serif'
  ctx.textAlign = 'center'
  
  const maxWidth = canvas.width - (padding * 2)
  const lines = wrapText(ctx, storyText, maxWidth)
  const lineHeight = 40
  const startY = img.height + (textAreaHeight / 2)
  
  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, startY + (i * lineHeight))
  })
  
  return canvas.toDataURL('image/png')
}
```

## Vision Log Integration

### Save Format
```javascript
const saveToVisionLog = (compositeImageData, storyText) => {
  const savedUser = localStorage.getItem('aiJourneyUser')
  const userData = savedUser ? JSON.parse(savedUser) : {}
  
  if (!userData.explorerJournal) {
    userData.explorerJournal = []
  }
  
  // Create story preview (first 30 chars)
  const storyPreview = storyText.substring(0, 30) + (storyText.length > 30 ? '...' : '')
  
  userData.explorerJournal.push({
    photo: compositeImageData,
    item: `Story: ${storyPreview}`,
    type: 'creative',
    timestamp: Date.now(),
    description: storyText,
    tags: ['island', 'cocreation', 'ai-story'],
    region: 'Island'
  })
  
  localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
}
```

### PhotosApp Update
```javascript
// Add 'creative' classification badge
const getClassificationBadge = (type) => {
  switch(type) {
    case 'healthy':
      return { color: '#4ade80', icon: '✓', label: 'Healthy' }
    case 'unhealthy':
      return { color: '#f87171', icon: '✗', label: 'Unhealthy' }
    case 'uncertain':
      return { color: '#fbbf24', icon: '?', label: 'Uncertain' }
    case 'creative':
      return { color: '#c084fc', icon: '✨', label: 'Creative' }
    default:
      return { color: '#fbbf24', icon: '?', label: 'Unknown' }
  }
}
```

## Styling

### iPad Device Frame
```css
.ipad-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ipad-device {
  background: #1f2937;
  border-radius: 2.5rem;
  padding: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 4px solid #374151;
  width: 90vw;
  max-width: 1400px;
  height: 85vh;
}

.ipad-screen {
  background: #F0F4F8;
  border-radius: 2rem;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}
```

### Status Bar
```css
.ipad-status-bar {
  height: 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 10px;
  font-weight: bold;
  color: #1e293b;
}
```

### Action Buttons
```css
.make-it-real-button {
  width: 100%;
  padding: 16px;
  background: #10B981;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 16px;
  border: none;
  box-shadow: 0 6px 0 #059669;
  cursor: pointer;
  transition: all 0.2s;
}

.make-it-real-button:hover {
  box-shadow: 0 3px 0 #059669;
  transform: translateY(3px);
}

.make-it-real-button:active {
  transform: translateY(6px);
  box-shadow: none;
}
```

## Error Handling

### API Errors
```javascript
try {
  const idea = await generateIdea()
  setIdea(idea)
} catch (error) {
  console.error('Failed to generate idea:', error)
  setError('Oops! The idea fairy is sleeping. Try again!')
  // Fallback to default idea
  setIdea({
    shape: 'circle',
    storyStarter: 'Once upon a time, there was a magical circle that could...'
  })
}
```

### Canvas Errors
```javascript
const handleGenerateMagic = async () => {
  if (!canvasRef.current) {
    setError('Canvas not ready. Please try again.')
    return
  }
  
  const drawing = canvasRef.current.getCanvasData()
  if (!drawing) {
    setError('Please draw something first!')
    return
  }
  
  // Proceed with generation...
}
```

## Performance Considerations

### 1. Lazy Loading
- Load iPad component only when modal opens
- Preload Gemini API on component mount

### 2. Image Optimization
- Compress canvas data before API call
- Limit canvas size to 800x600px
- Use JPEG for composite (smaller file size)

### 3. API Throttling
- Debounce story text input
- Prevent multiple simultaneous API calls
- Show loading states clearly

## Testing Checklist

- [ ] iPad modal opens on NPC click in phase2
- [ ] Story starter generates successfully
- [ ] Canvas drawing works smoothly
- [ ] Color picker changes brush color
- [ ] Sticker picker adds stickers
- [ ] Clear canvas works
- [ ] "MAKE IT REAL!" triggers AI generation
- [ ] Loading state shows during generation
- [ ] AI image displays correctly
- [ ] Story text is polished
- [ ] "Save Story Card" creates composite
- [ ] Composite saves to Vision Log
- [ ] Vision Log displays creative entries
- [ ] Error handling works for API failures
- [ ] Modal closes properly
- [ ] Can create multiple stories in sequence

## File Structure

```
src/
  components/
    IslandMap.jsx (modified)
    iPadCoCreation/
      iPadCoCreationModal.jsx (new)
      CanvasBoard.jsx (new, adapted from public/ipad)
      iPadStyles.js (new)
  services/
    geminiService.js (modified, add iPad functions)
  phone/
    apps/
      PhotosApp.jsx (modified, add 'creative' type)
```

## Implementation Order

1. ✅ Create requirements.md
2. ✅ Create design.md
3. ⏭️ Create tasks.md
4. ⏭️ Implement CanvasBoard component
5. ⏭️ Implement iPadCoCreationModal
6. ⏭️ Add Gemini service functions
7. ⏭️ Integrate with IslandMap
8. ⏭️ Update PhotosApp for 'creative' type
9. ⏭️ Test and debug
10. ⏭️ Polish UI/UX

---

**Status**: 📐 Design Complete  
**Next Step**: Create tasks.md  
**Estimated Effort**: 6-8 hours
