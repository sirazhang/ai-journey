# Island iPad Co-Creation Feature - Requirements

## Overview
Integrate an iPad-style co-creation interface into the Island color map (phase2) where users can collaborate with AI to create stories and artwork. The completed works will be saved to the Vision Log in the User Log.

## User Stories

### US-1: iPad Interface Trigger
**As a** user who has completed Island tasks and entered the color map  
**I want to** click on NPCs to open an iPad co-creation interface  
**So that** I can create collaborative stories and artwork with AI

**Acceptance Criteria:**
- AC-1.1: In Island phase2 (color map), clicking on any NPC opens the iPad interface
- AC-1.2: The iPad interface appears as a modal overlay with device frame styling
- AC-1.3: The interface includes iOS-style status bar and home indicator
- AC-1.4: Users can close the iPad interface to return to the map

### US-2: Story Co-Creation
**As a** user in the iPad interface  
**I want to** receive a story starter and shape prompt from AI  
**So that** I can continue the story and draw related artwork

**Acceptance Criteria:**
- AC-2.1: On iPad open, Gemini API generates a random story starter
- AC-2.2: A shape (circle, heart, square, triangle, star) is provided as drawing inspiration
- AC-2.3: User can type to continue the story in a text area
- AC-2.4: The story starter is pre-filled and user adds their continuation
- AC-2.5: Story text area supports multi-line input with line guides

### US-3: Drawing Canvas
**As a** user creating artwork  
**I want to** draw on a canvas with various tools  
**So that** I can illustrate my story

**Acceptance Criteria:**
- AC-3.1: Canvas displays the provided shape as a starting point
- AC-3.2: User can select from 8 colors: black, red, green, blue, orange, purple, pink, yellow
- AC-3.3: Brush size is adjustable from 2-20px
- AC-3.4: User can add stickers: star, heart, cloud, moon, flower, diamond
- AC-3.5: User can clear the canvas to start over
- AC-3.6: Drawing tools are organized in tabs: Colors and Shapes

### US-4: AI Magic Enhancement
**As a** user who has completed my story and drawing  
**I want to** click "MAKE IT REAL!" to have AI enhance my work  
**So that** I can see a polished version of my creation

**Acceptance Criteria:**
- AC-4.1: "MAKE IT REAL!" button is prominently displayed (green, large)
- AC-4.2: User can optionally add text instructions for AI (e.g., "Add a blue dinosaur")
- AC-4.3: Clicking the button triggers two parallel AI operations:
  - Generate enhanced image based on drawing + story + optional instructions
  - Polish the story text for better flow and grammar
- AC-4.4: Loading state shows "Making Magic..." with spinner
- AC-4.5: Result displays the AI-generated image and polished story

### US-5: Save to Vision Log
**As a** user who has created a story with AI  
**I want to** save my completed work to Vision Log  
**So that** I can review it later in the User Log

**Acceptance Criteria:**
- AC-5.1: After AI generation, a "Save Story Card" button appears
- AC-5.2: Clicking save creates a composite image with:
  - AI-generated artwork on top
  - Polished story text below with decorative styling
- AC-5.3: The composite is saved to localStorage in Vision Log format:
  ```javascript
  {
    photo: "data:image/png;base64,...",  // Composite image
    item: "Story: [First 30 chars of story]",
    type: "creative",  // New type for co-creation works
    timestamp: Date.now(),
    description: "[Full polished story text]",
    tags: ["island", "cocreation", "ai-story"],
    region: "Island"
  }
  ```
- AC-5.4: Success feedback is shown after save
- AC-5.5: User can start a new story after saving

### US-6: Vision Log Display
**As a** user viewing my Vision Log  
**I want to** see my co-created stories with proper formatting  
**So that** I can appreciate my creative works

**Acceptance Criteria:**
- AC-6.1: Co-creation entries show in Vision Log grid with thumbnail
- AC-6.2: Detail view displays:
  - Item: "Story: [story preview]"
  - Classification: "Creative" badge (purple color)
  - Description: Full polished story text
  - Tags: #island #cocreation #ai-story
  - Location: "Island"
- AC-6.3: Composite image shows artwork + story text together

## Technical Requirements

### TR-1: iPad Component Integration
- Use existing iPad app code from `public/ipad/`
- Create React component wrapper for Island integration
- Maintain iPad device frame styling
- Ensure responsive design within modal

### TR-2: Gemini API Integration
- Use existing `geminiService.ts` functions:
  - `generateIdea()` - Story starter + shape
  - `generateMagicImage()` - Image enhancement
  - `polishStory()` - Story text polishing
- Use `gemini-2.0-flash-exp` model
- Handle API errors gracefully with fallback messages

### TR-3: Canvas Implementation
- Use existing `CanvasBoard` component
- Support drawing, colors, brush sizes, stickers
- Export canvas as base64 image data
- Clear canvas functionality

### TR-4: Data Storage
- Save to `localStorage.aiJourneyUser.explorerJournal`
- Use Vision Log data format (see VISION_LOG_DATA_FORMAT.md)
- Add new classification type: "creative"
- Include all metadata: description, tags, region

### TR-5: State Management
- Track iPad open/close state in IslandMap
- Manage story text, drawing data, AI results
- Handle loading states for API calls
- Reset state when starting new story

## UI/UX Requirements

### UX-1: iPad Modal
- Full-screen modal overlay with semi-transparent backdrop
- iPad device frame with rounded corners and bezels
- iOS-style status bar (time, wifi, battery)
- Home indicator at bottom
- Close button or click outside to dismiss

### UX-2: Layout
- Left sidebar: Story text area + Tools panel
- Right main area: Canvas + Action buttons
- Tools organized in tabs (Colors/Shapes)
- Responsive to different screen sizes

### UX-3: Visual Feedback
- Loading spinners during AI generation
- Success animations after save
- Error messages for API failures
- Hover effects on buttons and tools

### UX-4: Typography & Colors
- Font: Fredoka for playful feel
- Primary color: #FF7043 (orange-red)
- Success color: #10B981 (green)
- Background: #F0F4F8 (light blue-gray)
- Consistent with existing game design

## Non-Functional Requirements

### NFR-1: Performance
- iPad interface loads within 1 second
- Canvas drawing is smooth (60fps)
- AI generation completes within 10 seconds
- Image composite generation is instant

### NFR-2: Compatibility
- Works in Chrome, Firefox, Safari, Edge
- Responsive on desktop (1280px+ recommended)
- Touch support for drawing (if available)

### NFR-3: Error Handling
- Graceful degradation if Gemini API fails
- Clear error messages for users
- Retry options for failed operations
- Fallback story starters if API unavailable

### NFR-4: Data Integrity
- Validate all data before saving
- Ensure base64 images are valid
- Prevent duplicate saves
- Handle localStorage quota limits

## Dependencies

### External
- Gemini API (gemini-2.0-flash-exp model)
- React 18+
- TypeScript
- Lucide React (icons)

### Internal
- IslandMap component
- Vision Log (PhotosApp)
- localStorage user data structure
- Gemini service integration

## Out of Scope

- Multi-user collaboration (single user only)
- Real-time drawing with others
- Video/audio recording
- Social sharing features
- Advanced image editing tools
- Story templates library
- AI voice narration

## Success Metrics

- Users can successfully open iPad interface from Island NPCs
- 90%+ of AI generation requests complete successfully
- Users can save at least one co-created story
- Saved stories appear correctly in Vision Log
- No critical bugs in drawing or saving functionality

## Future Enhancements

- Multiple story templates/themes
- More drawing tools (shapes, text, gradients)
- Gallery of community creations
- Export as PDF or shareable link
- AI-generated background music
- Animated story playback

---

**Status**: 📝 Requirements Complete  
**Next Step**: Design Document  
**Priority**: High  
**Estimated Effort**: 6-8 hours
