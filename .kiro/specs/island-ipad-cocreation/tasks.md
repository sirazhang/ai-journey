# Island iPad Co-Creation Feature - Tasks

## Phase 1: Canvas Component Setup

- [x] 1.1 Create CanvasBoard.jsx component
  - [x] 1.1.1 Convert TypeScript to JavaScript
  - [x] 1.1.2 Implement drawing functionality (brush mode)
  - [x] 1.1.3 Implement sticker placement
  - [x] 1.1.4 Add shape rendering (circle, heart, square, triangle, star)
  - [x] 1.1.5 Expose getCanvasData() and clearCanvas() methods via ref
  - [x] 1.1.6 Test drawing on canvas

## Phase 2: Gemini Service Integration

- [x] 2.1 Add iPad-specific functions to geminiService.js
  - [x] 2.1.1 Implement generateIdea() function
  - [x] 2.1.2 Implement polishStory() function
  - [x] 2.1.3 Implement generateMagicImage() function (or use existing image gen)
  - [x] 2.1.4 Add error handling for all functions
  - [x] 2.1.5 Test API calls independently

## Phase 3: iPad Modal Component

- [x] 3.1 Create iPadCoCreationModal.jsx
  - [ ] 3.1.1 Create modal overlay and device frame
  - [ ] 3.1.2 Add iOS-style status bar
  - [ ] 3.1.3 Add app header with title and reset button
  - [ ] 3.1.4 Create left sidebar layout (story + tools)
  - [ ] 3.1.5 Create right main area layout (canvas + actions)
  - [ ] 3.1.6 Add home indicator at bottom
  - [ ] 3.1.7 Add close functionality (X button or click outside)

- [ ] 3.2 Implement Story Panel
  - [ ] 3.2.1 Create story text area with line guides
  - [ ] 3.2.2 Pre-fill with story starter
  - [ ] 3.2.3 Allow user editing
  - [ ] 3.2.4 Show polished story in result stage

- [ ] 3.3 Implement Tools Panel
  - [ ] 3.3.1 Create tab system (Colors / Shapes)
  - [ ] 3.3.2 Add color picker (8 colors)
  - [ ] 3.3.3 Add brush size slider
  - [ ] 3.3.4 Add sticker picker (6 stickers)
  - [ ] 3.3.5 Add clear canvas button
  - [ ] 3.3.6 Update drawing tool state on selection

- [ ] 3.4 Implement Canvas Panel
  - [ ] 3.4.1 Integrate CanvasBoard component
  - [ ] 3.4.2 Pass shape and tool props
  - [ ] 3.4.3 Handle canvas ref
  - [ ] 3.4.4 Show loading overlay during generation

- [ ] 3.5 Implement Action Buttons
  - [ ] 3.5.1 Create "MAKE IT REAL!" button
  - [ ] 3.5.2 Add magic input field for additional elements
  - [ ] 3.5.3 Create "Save Story Card" button
  - [ ] 3.5.4 Handle button states (disabled, loading)

## Phase 4: State Management & Logic

- [ ] 4.1 Initialize component state
  - [ ] 4.1.1 Set up stage state (START, DRAWING, GENERATING, RESULT)
  - [ ] 4.1.2 Set up idea state
  - [ ] 4.1.3 Set up story states (user, magic, polished)
  - [ ] 4.1.4 Set up image state
  - [ ] 4.1.5 Set up loading and error states
  - [ ] 4.1.6 Set up drawing tool state

- [ ] 4.2 Implement idea generation flow
  - [ ] 4.2.1 Auto-generate idea on modal open
  - [ ] 4.2.2 Show loading state during generation
  - [ ] 4.2.3 Display story starter and shape
  - [ ] 4.2.4 Handle generation errors with fallback

- [ ] 4.3 Implement AI enhancement flow
  - [ ] 4.3.1 Collect canvas data, story, and magic input
  - [ ] 4.3.2 Trigger parallel API calls (image + story)
  - [ ] 4.3.3 Show "Making Magic..." loading state
  - [ ] 4.3.4 Display results (AI image + polished story)
  - [ ] 4.3.5 Handle API errors gracefully

- [ ] 4.4 Implement reset functionality
  - [ ] 4.4.1 Clear all states
  - [ ] 4.4.2 Generate new idea
  - [ ] 4.4.3 Reset canvas
  - [ ] 4.4.4 Return to DRAWING stage

## Phase 5: Composite Image Generation

- [ ] 5.1 Create createCompositeImage() function
  - [ ] 5.1.1 Load AI-generated image
  - [ ] 5.1.2 Create canvas with extra space for text
  - [ ] 5.1.3 Draw background color
  - [ ] 5.1.4 Draw AI image on top
  - [ ] 5.1.5 Draw separator line
  - [ ] 5.1.6 Implement text wrapping logic
  - [ ] 5.1.7 Draw story text with proper formatting
  - [ ] 5.1.8 Return composite as base64 data URL

- [ ] 5.2 Implement save functionality
  - [ ] 5.2.1 Call createCompositeImage()
  - [ ] 5.2.2 Generate story preview (first 30 chars)
  - [ ] 5.2.3 Create Vision Log entry object
  - [ ] 5.2.4 Save to localStorage
  - [ ] 5.2.5 Show success feedback
  - [ ] 5.2.6 Handle save errors

## Phase 6: IslandMap Integration

- [ ] 6.1 Add iPad modal state to IslandMap
  - [ ] 6.1.1 Add showIPadModal state
  - [ ] 6.1.2 Add selectedNpcForIPad state

- [ ] 6.2 Update NPC click handlers for phase2
  - [ ] 6.2.1 Modify phase2 NPC onClick to open iPad modal
  - [ ] 6.2.2 Pass NPC info to modal (optional)
  - [ ] 6.2.3 Test NPC click triggers modal

- [ ] 6.3 Render iPad modal
  - [ ] 6.3.1 Conditionally render iPadCoCreationModal
  - [ ] 6.3.2 Pass close handler
  - [ ] 6.3.3 Test modal open/close

## Phase 7: Vision Log Integration

- [ ] 7.1 Update PhotosApp for 'creative' type
  - [ ] 7.1.1 Add 'creative' to classification badge logic
  - [ ] 7.1.2 Use purple color (#c084fc) for creative badge
  - [ ] 7.1.3 Add sparkle icon (✨) for creative
  - [ ] 7.1.4 Test creative entries display correctly

- [ ] 7.2 Test Vision Log display
  - [ ] 7.2.1 Verify composite image shows in grid
  - [ ] 7.2.2 Verify detail view shows all info
  - [ ] 7.2.3 Verify tags display correctly
  - [ ] 7.2.4 Verify story text is readable

## Phase 8: Styling & Polish

- [ ] 8.1 Style iPad device frame
  - [ ] 8.1.1 Add rounded corners and bezels
  - [ ] 8.1.2 Add shadow effects
  - [ ] 8.1.3 Make responsive (90vw, 85vh)
  - [ ] 8.1.4 Add camera notch styling

- [ ] 8.2 Style status bar
  - [ ] 8.2.1 Add glassmorphism effect
  - [ ] 8.2.2 Add time, wifi, battery icons
  - [ ] 8.2.3 Position correctly

- [ ] 8.3 Style content areas
  - [ ] 8.3.1 Style story card with paper texture
  - [ ] 8.3.2 Style tools panel with tabs
  - [ ] 8.3.3 Style canvas area
  - [ ] 8.3.4 Style action buttons with shadows

- [ ] 8.4 Add animations
  - [ ] 8.4.1 Modal fade in/out
  - [ ] 8.4.2 Button hover effects
  - [ ] 8.4.3 Loading spinner
  - [ ] 8.4.4 Success feedback animation

- [ ] 8.5 Add responsive design
  - [ ] 8.5.1 Test on different screen sizes
  - [ ] 8.5.2 Adjust layout for smaller screens
  - [ ] 8.5.3 Ensure canvas is usable

## Phase 9: Error Handling & Edge Cases

- [ ] 9.1 Handle API failures
  - [ ] 9.1.1 Show error messages to user
  - [ ] 9.1.2 Provide retry options
  - [ ] 9.1.3 Use fallback content when needed

- [ ] 9.2 Handle canvas errors
  - [ ] 9.2.1 Validate canvas data before API call
  - [ ] 9.2.2 Handle empty canvas case
  - [ ] 9.2.3 Handle canvas ref not ready

- [ ] 9.3 Handle localStorage errors
  - [ ] 9.3.1 Check quota before saving
  - [ ] 9.3.2 Handle save failures gracefully
  - [ ] 9.3.3 Validate data before saving

- [ ] 9.4 Handle edge cases
  - [ ] 9.4.1 Empty story text
  - [ ] 9.4.2 Very long story text
  - [ ] 9.4.3 Multiple rapid clicks
  - [ ] 9.4.4 Modal close during generation

## Phase 10: Testing & Debugging

- [ ] 10.1 Unit testing
  - [ ] 10.1.1 Test generateIdea() function
  - [ ] 10.1.2 Test polishStory() function
  - [ ] 10.1.3 Test createCompositeImage() function
  - [ ] 10.1.4 Test saveToVisionLog() function

- [ ] 10.2 Integration testing
  - [ ] 10.2.1 Test full flow: open → draw → generate → save
  - [ ] 10.2.2 Test reset and create new story
  - [ ] 10.2.3 Test multiple saves
  - [ ] 10.2.4 Test Vision Log retrieval

- [ ] 10.3 UI/UX testing
  - [ ] 10.3.1 Test all buttons and interactions
  - [ ] 10.3.2 Test drawing with mouse
  - [ ] 10.3.3 Test drawing with touch (if available)
  - [ ] 10.3.4 Test modal close methods

- [ ] 10.4 Browser compatibility
  - [ ] 10.4.1 Test in Chrome
  - [ ] 10.4.2 Test in Firefox
  - [ ] 10.4.3 Test in Safari
  - [ ] 10.4.4 Test in Edge

- [ ] 10.5 Performance testing
  - [ ] 10.5.1 Measure modal load time
  - [ ] 10.5.2 Measure canvas drawing performance
  - [ ] 10.5.3 Measure API response times
  - [ ] 10.5.4 Measure composite image generation time

## Phase 11: Documentation & Cleanup

- [ ] 11.1 Code documentation
  - [ ] 11.1.1 Add JSDoc comments to functions
  - [ ] 11.1.2 Add inline comments for complex logic
  - [ ] 11.1.3 Document component props

- [ ] 11.2 User documentation
  - [ ] 11.2.1 Update README if needed
  - [ ] 11.2.2 Document Vision Log format changes

- [ ] 11.3 Code cleanup
  - [ ] 11.3.1 Remove console.logs
  - [ ] 11.3.2 Remove unused imports
  - [ ] 11.3.3 Format code consistently
  - [ ] 11.3.4 Remove commented code

---

**Total Tasks**: 11 phases, ~100 sub-tasks  
**Estimated Time**: 6-8 hours  
**Priority**: High  
**Status**: Ready to implement
