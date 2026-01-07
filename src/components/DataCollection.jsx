import React, { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'

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
    { id: '05', size: 240, right: '0%', top: '25%' },
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
  '07': { name: 'Striped Chime', color: 'Orange / White / Red', colorTone: 'Warm dominant', shape: 'Bell-shaped / Curved', texture: 'Smooth / Striped', spikes: false },
  '08': { name: 'Drip Orb', color: 'Yellow / White', colorTone: 'Warm', shape: 'Round / Bulbous', texture: 'Glossy / Dripping', spikes: false },
  '09': { name: 'Frostfire Cap', color: 'Pink / Cyan / White', colorTone: 'Mixed warm and cool', shape: 'Mushroom-like / Flame-shaped', texture: 'Glossy / Glowing', spikes: false },
  '10': { name: 'Classic Toadstool', color: 'Red / White / Blue', colorTone: 'Warm dominant', shape: 'Round / Smooth', texture: 'Matte / Polka-dotted', spikes: false },
  '11': { name: 'Rainbow Drip', color: 'Pastel Rainbow / Teal / Purple', colorTone: 'Soft mixed', shape: 'Tapered / Drooping', texture: 'Glossy / Dripping', spikes: false },
  '12': { name: 'Starlight Shroom', color: 'Pink / Purple / Orange', colorTone: 'Warm and cool mixed', shape: 'Star-shaped / Pointed', texture: 'Glowing / Sticky / Veined', spikes: true },
}

const DataCollection = ({ onComplete, onExit }) => {
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

  // Sound effects
  const { playCameraSound } = useSoundEffects()

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
      playCameraSound() // Add camera sound effect
      setSelectedMushroom(id)
      setShowCard(true)
    }
  }

  const handleCollectData = () => {
    if (selectedMushroom && !collectedIds.includes(selectedMushroom)) {
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

  const handleGlitchHover = (isEntering) => {
    if (isEntering) {
      setHoveredNpc('glitch')
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
    setShowTaskHint(true)
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
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
      background: 'none',
      border: 'none',
    },
    arrowIcon: {
      fontSize: '45px',
      color: '#fff',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
      fontWeight: 'bold',
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
      padding: '20px 25px',
      borderRadius: '15px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      textAlign: 'center',
      boxShadow: '0 5px 25px rgba(0,0,0,0.2)',
    },
    slotsContainer: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      zIndex: 100,
    },
    slot: {
      width: '55px',
      height: '55px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid #ddd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      color: '#999',
      fontWeight: 500,
    },
    slotFilled: {
      background: 'linear-gradient(135deg, #E8D5E8, #F5E6F5)',
      border: '3px solid #C9A0DC',
      color: '#8B5A9B',
      fontWeight: 700,
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
  }

  return (
    <div style={styles.container}>
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
        Exit
      </button>

      {/* Glitch NPC (top right corner) */}
      <div 
        style={styles.glitchNpc}
        onClick={handleGlitchClick}
        onMouseEnter={() => handleGlitchHover(true)}
        onMouseLeave={() => handleGlitchHover(false)}
      >
        <img src="/npc/npc1.png" alt="Glitch" style={styles.glitchImage} />
      </div>

      {/* Navigation Arrows */}
      {availableDirections.up !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.upArrow }}
          onClick={() => handleNavigate('up')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>︿</span>
        </button>
      )}
      {availableDirections.down !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.downArrow }}
          onClick={() => handleNavigate('down')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>﹀</span>
        </button>
      )}
      {availableDirections.left !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.leftArrow }}
          onClick={() => handleNavigate('left')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>〈</span>
        </button>
      )}
      {availableDirections.right !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.rightArrow }}
          onClick={() => handleNavigate('right')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>〉</span>
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
      {showNpcDialogue && (
        <div 
          style={{
            ...styles.npcDialogueContainer,
            ...(hoveredNpc === 'glitch' ? {
              top: '15px',
              right: '100px',
            } : currentNpc ? {
              top: currentNpc.dialogueTop,
              left: currentNpc.dialogueLeft,
              right: currentNpc.dialogueRight,
            } : {}),
          }}
        >
          <div style={styles.npcDialogueBoxInline}>
            <p style={styles.dialogueText}>{npcDialogueText}</p>
            <button
              style={styles.okButton}
              onClick={() => setShowNpcDialogue(false)}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#5170FF'
                e.target.style.color = '#fff'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.color = '#5170FF'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Collection Slots at Bottom */}
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
              {collectedId ? collectedId : '?'}
            </div>
          )
        })}
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
