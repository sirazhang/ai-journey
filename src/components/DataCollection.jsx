import React, { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'
import { useLanguage } from '../contexts/LanguageContext'

// Map positions: bottom-left (0), bottom-right (1), top-left (2), top-right (3)
const POSITIONS = {
  BOTTOM_LEFT: 0,
  BOTTOM_RIGHT: 1,
  TOP_LEFT: 2,
  TOP_RIGHT: 3,
}

// Navigation directions available from each position
const navigationMap = {
  [POSITIONS.BOTTOM_LEFT]: { up: POSITIONS.TOP_LEFT, right: POSITIONS.BOTTOM_RIGHT },
  [POSITIONS.BOTTOM_RIGHT]: { up: POSITIONS.TOP_RIGHT, left: POSITIONS.BOTTOM_LEFT },
  [POSITIONS.TOP_LEFT]: { down: POSITIONS.BOTTOM_LEFT, right: POSITIONS.TOP_RIGHT },
  [POSITIONS.TOP_RIGHT]: { down: POSITIONS.BOTTOM_RIGHT, left: POSITIONS.TOP_LEFT },
}

// CSS transform values for each position
const positionTransforms = {
  [POSITIONS.BOTTOM_LEFT]: 'translate(0%, -50%)',
  [POSITIONS.BOTTOM_RIGHT]: 'translate(-50%, -50%)',
  [POSITIONS.TOP_LEFT]: 'translate(0%, 0%)',
  [POSITIONS.TOP_RIGHT]: 'translate(-50%, 0%)',
}

// Mushroom positions in each quadrant (based on design images)
const mushroomPositions = {
  [POSITIONS.TOP_LEFT]: [
    { id: '02', size: 250, right: '35%', bottom: '25%' },
    { id: '04', size: 320, left: '0%', top: '50%' },
    { id: '05', size: 240, right: '0%', top: 'calc(25% + 200px)' }, // Moved down 200px
    { id: '10', size: 200, left: '40%', top: '5%' },
  ],
  [POSITIONS.BOTTOM_LEFT]: [
    { id: '01', size: 330, right: '0%', bottom: '15%' },
    { id: '07', size: 200, left: '0%', top: '5%' },
    { id: '08', size: 310, left: '0%', bottom: '10%' },
    { id: '11', size: 300, left: '50%', bottom: '15%' },
  ],
  [POSITIONS.BOTTOM_RIGHT]: [
    { id: '06', size: 400, right: '20%', bottom: '0%' },
    { id: '03', size: 200, right: '25%', top: '0%' },
    { id: '09', size: 220, left: '10%', top: '5%' },
    { id: '12', size: 150, right: '5%', bottom: '35%' },
  ],
  [POSITIONS.TOP_RIGHT]: [], // Ranger Moss area - no mushrooms
}

// NPC positions
const npcPositions = {
  [POSITIONS.BOTTOM_LEFT]: { 
    npc: 'npc_a', 
    image: '/jungle/npc_a.png', 
    top: '5%',
    right: '50%',
    width: 'auto',
    height: '25vh',
    dialogueTop: '33.33%',
    dialogueLeft: '80px',
  },
  [POSITIONS.BOTTOM_RIGHT]: { 
    npc: 'npc_b', 
    image: '/jungle/npc_b.gif', 
    left: '0%', 
    bottom: '0%',
    width: 'auto',
    height: '25vh',
    dialogueTop: '33.33%',
    dialogueRight: '80px',
  },
  [POSITIONS.TOP_RIGHT]: { 
    npc: 'npc_c', 
    image: '/jungle/npc_c.png', 
    bottom: '10%', 
    right: '15%',
    width: 'auto',
    height: '66.67vh',
    dialogueTop: '25%',
    dialogueLeft: '80px',
  },
}

// Mushroom data from object_info.json
const mushroomData = {
  '01': { name: 'Candy Blob', color: 'Pink / Purple / Yellow', colorTone: 'Mixed warm and cool', shape: 'Irregular / Curved', texture: 'Glossy / Dripping', spikes: false },
  '02': { name: 'Flame Bloom', color: 'Red / Green / Beige', colorTone: 'Warm dominant', shape: 'Flame-like / Circular', texture: 'Smooth / Slightly Wavy', spikes: true },
  '03': { name: 'Velvet Star', color: 'Cyan / Blue', colorTone: 'Cool', shape: 'Star-shaped / Pointed', texture: 'Fuzzy / Velvet-like', spikes: true },
  '04': { name: 'Polka Cluster', color: 'Green / Purple', colorTone: 'Mixed cool and warm', shape: 'Clustered / Round', texture: 'Smooth / Polka-dotted', spikes: false },
  '05': { name: 'Speckled Bell', color: 'Purple / Yellow', colorTone: 'Mixed cool and warm', shape: 'Bell-shaped / Drooping', texture: 'Matte / Speckled', spikes: false },
  '06': { name: 'Glowing Shroom', color: 'Blue / Purple / Pink', colorTone: 'Cool dominant', shape: 'Mushroom-like / Flowing', texture: 'Glowing / Translucent', spikes: false },
  '07': { name: 'Floral Bouquet', color: 'Purple / Pink / Lavender', shape: 'Round / Radial Petals with Central Stamen', texture: 'Smooth, Soft Gradient, Delicate Shading', spikes: false },
  '08': { name: 'Drip Orb', color: 'Yellow / White', colorTone: 'Warm', shape: 'Round / Bulbous', texture: 'Glossy / Dripping', spikes: false },
  '09': { name: 'Frostfire Cap', color: 'Pink / Cyan / White', colorTone: 'Mixed warm and cool', shape: 'Mushroom-like / Flame-shaped', texture: 'Glossy / Glowing', spikes: false },
  '10': { name: 'Classic Toadstool', color: 'Red / White / Blue', colorTone: 'Warm dominant', shape: 'Round / Smooth', texture: 'Matte / Polka-dotted', spikes: false },
  '11': { name: 'Rainbow Drip', color: 'Pastel Rainbow / Teal / Purple', colorTone: 'Soft mixed', shape: 'Tapered / Drooping', texture: 'Glossy / Dripping', spikes: false },
  '12': { name: 'Starlight Shroom', color: 'Pink / Purple / Orange', colorTone: 'Warm and cool mixed', shape: 'Star-shaped / Pointed', texture: 'Glowing / Sticky / Veined', spikes: true },
}

const DataCollection = ({ onComplete, onExit }) => {
  const { t } = useLanguage()
  const [currentPosition, setCurrentPosition] = useState(POSITIONS.TOP_LEFT)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [collectedIds, setCollectedIds] = useState([])
  const [showCard, setShowCard] = useState(false)
  const [selectedMushroom, setSelectedMushroom] = useState(null)
  const [showTaskHint, setShowTaskHint] = useState(false)
  const [showNpcDialogue, setShowNpcDialogue] = useState(false)
  const [npcDialogueText, setNpcDialogueText] = useState('')
  const [allCollected, setAllCollected] = useState(false)
  const [hoveredNpc, setHoveredNpc] = useState(null) // Track which NPC is hovered ('npc_a', 'npc_b', 'npc_c', 'glitch')
  const [showGlitchDialogue, setShowGlitchDialogue] = useState(false) // Modern Glitch dialogue
  const [glitchInput, setGlitchInput] = useState('') // Glitch input field
  
  // Custom cursor position
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCursor, setShowCursor] = useState(false)
  
  // Track mouse movement for custom cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
      setShowCursor(true)
    }
    
    const handleMouseLeave = () => {
      setShowCursor(false)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Sound effects
  const { playCameraSound } = useSoundEffects()
  const [pencilSound] = useState(new Audio('/sound/pencil.wav'))
  const [clickSound] = useState(new Audio('/sound/click.mp3'))

  // Set pencil sound volume
  useEffect(() => {
    pencilSound.volume = 0.5
    clickSound.volume = 0.5
  }, [pencilSound, clickSound])

  // Load saved progress on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const dataCollectionProgress = userData.dataCollectionProgress
      if (dataCollectionProgress) {
        setCurrentPosition(dataCollectionProgress.currentPosition || POSITIONS.TOP_LEFT)
        setCollectedIds(dataCollectionProgress.collectedIds || [])
        console.log('Loaded Data Collection progress:', dataCollectionProgress)
      }
    }
  }, [])

  // Save progress when position or collected items change
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.dataCollectionProgress = {
        currentPosition,
        collectedIds,
        lastSaved: Date.now()
      }
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      console.log('Saved Data Collection progress:', userData.dataCollectionProgress)
    }
  }, [currentPosition, collectedIds])

  const handleNavigate = (direction) => {
    const nextPosition = navigationMap[currentPosition]?.[direction]
    if (nextPosition !== undefined && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPosition(nextPosition)
        setIsTransitioning(false)
      }, 500)
    }
  }

  const handleMushroomClick = (id) => {
    if (!collectedIds.includes(id)) {
      // Play pencil sound
      pencilSound.currentTime = 0
      pencilSound.play().catch(err => console.log('Pencil sound error:', err))
      
      setSelectedMushroom(id)
      setShowCard(true)
    }
  }

  const handleCollectData = () => {
    if (selectedMushroom && !collectedIds.includes(selectedMushroom)) {
      // Play click sound
      clickSound.currentTime = 0
      clickSound.play().catch(err => console.log('Click sound error:', err))
      
      const newCollected = [...collectedIds, selectedMushroom]
      setCollectedIds(newCollected)
      setShowCard(false)
      setSelectedMushroom(null)
      
      // Check if all 12 collected
      if (newCollected.length === 12) {
        setAllCollected(true)
      }
    }
  }

  const handleNpcClick = (npcType) => {
    if (npcType === 'npc_c' && collectedIds.length === 12) {
      // Ranger Moss - proceed to data cleaning
      onComplete(collectedIds)
    }
  }

  const handleNpcHover = (npcType, isEntering) => {
    if (isEntering) {
      setHoveredNpc(npcType)
      if (collectedIds.length < 12) {
        setNpcDialogueText("Not finished yet! You're still missing some data!")
        setShowNpcDialogue(true)
      } else {
        setNpcDialogueText("Give ALL these to Ranger Moss!")
        setShowNpcDialogue(true)
      }
    } else {
      setHoveredNpc(null)
      setShowNpcDialogue(false)
    }
  }

  const handleGlitchClick = () => {
    setShowGlitchDialogue(true)
  }
  
  const handleGlitchSend = () => {
    if (glitchInput.trim()) {
      // Handle Glitch input (can be extended later)
      console.log('Glitch input:', glitchInput)
      setGlitchInput('')
    }
  }
  
  const handleGlitchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGlitchSend()
    }
  }

  const availableDirections = navigationMap[currentPosition] || {}
  const currentMushrooms = mushroomPositions[currentPosition] || []
  const currentNpc = npcPositions[currentPosition]

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'none', // Hide default cursor
    },
    mapContainer: {
      width: '200%',
      height: '200%',
      position: 'absolute',
      top: 0,
      left: 0,
      transition: 'transform 0.5s ease-in-out',
      transform: positionTransforms[currentPosition],
    },
    mapImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: 'grayscale(80%)',
    },
    exitButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#666',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      border: '2px solid rgba(81, 112, 255, 0.4)',
      padding: '12px 30px',
      borderRadius: '8px',
      cursor: 'pointer',
      zIndex: 100,
      transition: 'all 0.2s',
    },
    glitchNpc: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '120px',
      height: '120px',
      zIndex: 100,
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    glitchImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    navArrow: {
      position: 'absolute',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
      background: 'none',
      border: 'none',
    },
    arrowImage: {
      width: '80px',
      height: '80px',
      objectFit: 'contain',
      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))',
    },
    upArrow: { top: '15px', left: '50%', transform: 'translateX(-50%)' },
    downArrow: { bottom: '120px', left: '50%', transform: 'translateX(-50%)' },
    leftArrow: { left: '15px', top: '50%', transform: 'translateY(-50%)' },
    rightArrow: { right: '15px', top: '50%', transform: 'translateY(-50%)' },
    mushroomItem: {
      position: 'absolute',
      cursor: 'pointer',
      transition: 'transform 0.2s, filter 0.2s',
      zIndex: 20,
    },
    mushroomImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))',
    },
    mushroomCollected: {
      opacity: 0.3,
      pointerEvents: 'none',
    },
    npcCharacter: {
      position: 'absolute',
      width: '180px',
      height: 'auto',
      cursor: 'pointer',
      zIndex: 25,
      transition: 'transform 0.2s',
    },
    // NPC dialogue next to NPC (not centered)
    npcDialogueContainer: {
      position: 'absolute',
      zIndex: 150,
      maxWidth: '400px',
    },
    npcDialogueBoxInline: {
      padding: '25px 30px',
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', // Irregular organic shape
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid #8B4513',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.5)',
      position: 'relative',
      minHeight: '100px',
    },
    npcSpeakerName: {
      position: 'absolute',
      top: '-15px',
      right: '20px',
      fontFamily: "'Patrick Hand', cursive",
      fontSize: '20px',
      fontWeight: 700,
      color: '#8B4513',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '5px 15px',
      borderRadius: '15px',
      border: '2px solid #8B4513',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
    dialogueText: {
      fontFamily: "'Patrick Hand', cursive",
      fontSize: '18px',
      color: '#333',
      lineHeight: 1.6,
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    },
    // Progress container and slots (desert-style)
    progressContainer: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      zIndex: 100,
    },
    progressText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#fff',
      backgroundColor: '#8FCCAE',
      padding: '10px 25px',
      borderRadius: '10px',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      letterSpacing: '1px',
      boxShadow: '0 4px 12px rgba(143, 204, 174, 0.4)',
    },
    slotsContainer: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'nowrap',
      justifyContent: 'center',
    },
    slot: {
      width: '65px',
      height: '65px',
      border: '3px dashed #8FCCAE',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3px',
      borderRadius: '8px',
      transition: 'all 0.3s',
    },
    slotFilled: {
      border: '3px solid #8FCCAE',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 12px rgba(143, 204, 174, 0.4)',
    },
    slotImage: {
      width: '40px',
      height: '40px',
      objectFit: 'contain',
    },
    slotLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '10px',
      fontWeight: 600,
      color: '#8FCCAE',
    },
    // Glitch dialogue bubble (modern design with input)
    glitchDialogue: {
      position: 'absolute',
      top: '20px',
      right: '150px',
      width: '350px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(143, 204, 174, 0.3)',
      zIndex: 150,
    },
    glitchDialogueHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
    },
    glitchDialogueAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8FCCAE, #6FB896)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    glitchDialogueAvatarIcon: {
      fontSize: '24px',
    },
    glitchDialogueName: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      margin: 0,
    },
    glitchDialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#666',
      lineHeight: 1.6,
      margin: '0 0 15px 0',
    },
    glitchDialogueInputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      border: '2px solid #e0e0e0',
      borderRadius: '25px',
      transition: 'border-color 0.2s',
    },
    glitchDialogueInput: {
      flex: 1,
      padding: '10px 15px',
      border: 'none',
      background: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      outline: 'none',
    },
    glitchDialogueDivider: {
      width: '2px',
      height: '24px',
      background: '#e0e0e0',
      borderRadius: '1px',
      flexShrink: 0,
    },
    glitchDialogueSendButton: {
      background: 'none',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
      flexShrink: 0,
    },
    glitchDialogueSendIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
    },
    glitchDialogueCloseButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: '#999',
      cursor: 'pointer',
      padding: '0',
      lineHeight: 1,
      transition: 'color 0.2s',
    },
    // Card Modal
    cardOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardBox: {
      width: '420px',
      padding: '30px 35px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      textAlign: 'center',
    },
    cardTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '24px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '8px',
    },
    cardObjectId: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#555',
      marginBottom: '20px',
    },
    cardInfo: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#444',
      lineHeight: 1.8,
      textAlign: 'center',
      marginBottom: '25px',
    },
    collectButton: {
      width: '100%',
      padding: '16px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 700,
      color: '#fff',
      background: '#1a1a2e',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
    // Task Hint Modal
    taskHintBox: {
      width: '380px',
      padding: '25px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #7B68EE, #87CEEB)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    taskTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '22px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '15px',
    },
    hintImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '12px',
      marginBottom: '15px',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      fontSize: '28px',
      color: '#999',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
    },
    // NPC Dialogue
    npcDialogueBox: {
      width: '400px',
      padding: '25px 30px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      textAlign: 'center',
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      color: '#333',
      lineHeight: 1.6,
    },
    okButton: {
      marginTop: '20px',
      padding: '12px 40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#5170FF',
      background: 'transparent',
      border: '2px solid #5170FF',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Custom pencil cursor
    customCursor: {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 9999,
      width: '32px',
      height: '32px',
      transform: 'translate(-8px, -24px)', // Offset to position tip at cursor point
    },
  }

  return (
    <div style={styles.container}>
      {/* Custom Pencil Cursor */}
      {showCursor && (
        <img 
          src="/jungle/icon/pencil.png"
          alt="Cursor"
          style={{
            ...styles.customCursor,
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
          }}
        />
      )}
      
      {/* Map Background */}
      <div style={styles.mapContainer}>
        <img 
          src="/jungle/map_full.png"
          alt="Fungi Jungle Map"
          style={styles.mapImage}
        />
      </div>

      {/* Exit Button */}
      <button 
        style={styles.exitButton}
        onClick={onExit}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)'
          e.target.style.borderColor = '#5170FF'
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.85)'
          e.target.style.borderColor = 'rgba(81, 112, 255, 0.4)'
        }}
      >
        {t('exit')}
      </button>

      {/* Glitch NPC (top right corner) */}
      <div 
        style={styles.glitchNpc}
        onClick={handleGlitchClick}
      >
        <img src="/npc/npc_jungle.png" alt="Glitch" style={styles.glitchImage} />
      </div>
      
      {/* Glitch Dialogue - Modern Design with Input (Top Right) */}
      {showGlitchDialogue && (
        <div style={styles.glitchDialogue}>
          {/* Close button */}
          <button
            style={styles.glitchDialogueCloseButton}
            onClick={() => setShowGlitchDialogue(false)}
            onMouseOver={(e) => {
              e.target.style.color = '#333'
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#999'
            }}
          >
            ×
          </button>
          
          {/* Header with avatar and name */}
          <div style={styles.glitchDialogueHeader}>
            <div style={styles.glitchDialogueAvatar}>
              <span style={styles.glitchDialogueAvatarIcon}>👾</span>
            </div>
            <h4 style={styles.glitchDialogueName}>Glitch</h4>
          </div>
          
          {/* Message content */}
          <p style={styles.glitchDialogueText}>
            {collectedIds.length < 12 
              ? "Not finished yet! You're still missing some data!"
              : "Give ALL these to Ranger Moss!"}
          </p>
          
          {/* Input container */}
          <div 
            style={styles.glitchDialogueInputContainer}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#8FCCAE'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
            }}
          >
            <input 
              type="text" 
              placeholder="Ask Glitch anything..."
              value={glitchInput}
              onChange={(e) => setGlitchInput(e.target.value)}
              onKeyPress={handleGlitchInputKeyPress}
              style={styles.glitchDialogueInput}
            />
            <div style={styles.glitchDialogueDivider}></div>
            <button
              onClick={handleGlitchSend}
              style={styles.glitchDialogueSendButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <img 
                src="/icon/send.png" 
                alt="Send" 
                style={styles.glitchDialogueSendIcon}
              />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {availableDirections.up !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.upArrow }}
          onClick={() => handleNavigate('up')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <img 
            src="/jungle/icon/up.png" 
            alt="Up" 
            style={styles.arrowImage}
          />
        </button>
      )}
      {availableDirections.down !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.downArrow }}
          onClick={() => handleNavigate('down')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <img 
            src="/jungle/icon/down.png" 
            alt="Down" 
            style={styles.arrowImage}
          />
        </button>
      )}
      {availableDirections.left !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.leftArrow }}
          onClick={() => handleNavigate('left')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <img 
            src="/jungle/icon/left.png" 
            alt="Left" 
            style={styles.arrowImage}
          />
        </button>
      )}
      {availableDirections.right !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.rightArrow }}
          onClick={() => handleNavigate('right')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <img 
            src="/jungle/icon/right.png" 
            alt="Right" 
            style={styles.arrowImage}
          />
        </button>
      )}

      {/* Mushrooms in current quadrant */}
      {currentMushrooms.map((mushroom) => {
        const mushroomSize = mushroom.size || 120
        return (
          <div
            key={mushroom.id}
            style={{
              ...styles.mushroomItem,
              width: `${mushroomSize}px`,
              height: `${mushroomSize}px`,
              top: mushroom.top,
              bottom: mushroom.bottom,
              left: mushroom.left,
              right: mushroom.right,
              ...(collectedIds.includes(mushroom.id) ? styles.mushroomCollected : {}),
            }}
            onClick={() => handleMushroomClick(mushroom.id)}
            onMouseOver={(e) => {
              if (!collectedIds.includes(mushroom.id)) {
                e.currentTarget.style.transform = 'scale(1.15)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <img 
              src={`/jungle/object/${mushroom.id}.png`}
              alt={mushroomData[mushroom.id]?.name}
              style={styles.mushroomImage}
            />
          </div>
        )
      })}

      {/* NPC in current quadrant */}
      {currentNpc && (
        <img
          src={currentNpc.image}
          alt={currentNpc.npc}
          style={{
            ...styles.npcCharacter,
            top: currentNpc.top,
            bottom: currentNpc.bottom,
            left: currentNpc.left,
            right: currentNpc.right,
            width: currentNpc.width === 'auto' ? 'auto' : `${currentNpc.width}px`,
            height: currentNpc.height ? (typeof currentNpc.height === 'string' ? currentNpc.height : `${currentNpc.height}px`) : 'auto',
          }}
          onClick={() => handleNpcClick(currentNpc.npc)}
          onMouseEnter={() => handleNpcHover(currentNpc.npc, true)}
          onMouseLeave={() => handleNpcHover(currentNpc.npc, false)}
        />
      )}

      {/* NPC Dialogue - Next to NPC or Glitch */}
      {showNpcDialogue && hoveredNpc !== 'glitch' && (
        <div 
          style={{
            ...styles.npcDialogueContainer,
            ...(currentNpc ? {
              top: currentNpc.dialogueTop,
              left: currentNpc.dialogueLeft,
              right: currentNpc.dialogueRight,
            } : {}),
          }}
        >
          <div 
            style={{
              ...styles.npcDialogueBoxInline,
              cursor: 'pointer',
            }}
            onClick={() => setShowNpcDialogue(false)}
          >
            <div style={styles.npcSpeakerName}>
              {hoveredNpc === 'npc_a' ? 'NPC 01' :
               hoveredNpc === 'npc_b' ? 'NPC 02' :
               hoveredNpc === 'npc_c' ? 'Ranger Moss' : ''}
            </div>
            <p style={styles.dialogueText}>{npcDialogueText}</p>
          </div>
        </div>
      )}

      {/* Collection Progress and Slots at Bottom */}
      <div style={styles.progressContainer}>
        <div style={styles.progressText}>
          Progress: {collectedIds.length}/12 found
        </div>
        <div style={styles.slotsContainer}>
          {Array.from({ length: 12 }, (_, i) => {
            const collectedId = collectedIds[i]
            return (
              <div
                key={i}
                style={{
                  ...styles.slot,
                  ...(collectedId ? styles.slotFilled : {}),
                }}
              >
                {collectedId ? (
                  <>
                    <img 
                      src={`/jungle/object/${collectedId}.png`}
                      alt={`Object ${collectedId}`}
                      style={styles.slotImage}
                    />
                    <div style={styles.slotLabel}>Object{collectedId}</div>
                  </>
                ) : (
                  <div style={{ fontSize: '24px', color: '#ccc' }}>?</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mushroom Card Modal */}
      {showCard && selectedMushroom && (
        <div style={styles.cardOverlay} onClick={() => setShowCard(false)}>
          <div style={styles.cardBox} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.cardTitle}>You Found</h2>
            <p style={styles.cardObjectId}>
              Object ID: #{selectedMushroom} – {mushroomData[selectedMushroom]?.name}
            </p>
            <div style={styles.cardInfo}>
              <p>· Color: {mushroomData[selectedMushroom]?.color}</p>
              <p>· Shape: {mushroomData[selectedMushroom]?.shape}</p>
              <p>· Texture: {mushroomData[selectedMushroom]?.texture}</p>
              <p>· Spikes: {mushroomData[selectedMushroom]?.spikes ? 'Yes' : 'None'}</p>
            </div>
            <button
              style={styles.collectButton}
              onClick={handleCollectData}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.02)'
                e.target.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = 'none'
              }}
            >
              COLLECT DATA
            </button>
          </div>
        </div>
      )}

      {/* Task Hint Modal */}
      {showTaskHint && (
        <div style={styles.cardOverlay} onClick={() => setShowTaskHint(false)}>
          <div style={{ ...styles.taskHintBox, position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeButton} onClick={() => setShowTaskHint(false)}>×</button>
            <h2 style={styles.taskTitle}>Task 1: Find the data</h2>
            <img src="/jungle/hint.gif" alt="Hint" style={styles.hintImage} />
          </div>
        </div>
      )}


    </div>
  )
}

export default DataCollection
