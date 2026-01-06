import React, { useState, useEffect } from 'react'

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
    { id: '11', top: '25%', left: '15%' },
    { id: '09', top: '15%', left: '40%' },
    { id: '02', top: '45%', left: '55%' },
    { id: '04', top: '55%', left: '20%' },
  ],
  [POSITIONS.BOTTOM_LEFT]: [
    { id: '10', top: '20%', left: '10%' },
    { id: '06', top: '50%', left: '60%' },
    { id: '12', top: '30%', left: '75%' },
    { id: '03', top: '15%', left: '55%' },
  ],
  [POSITIONS.BOTTOM_RIGHT]: [
    { id: '07', top: '15%', left: '15%' },
    { id: '08', top: '45%', left: '10%' },
    { id: '01', top: '55%', left: '70%' },
    { id: '05', top: '25%', left: '55%' },
  ],
  [POSITIONS.TOP_RIGHT]: [], // Ranger Moss area - no mushrooms
}

// NPC positions
const npcPositions = {
  [POSITIONS.BOTTOM_LEFT]: { npc: 'npc_a', image: '/jungle/npc_a.png', top: '50%', left: '35%' },
  [POSITIONS.BOTTOM_RIGHT]: { npc: 'npc_b', image: '/jungle/npc_b.gif', top: '45%', left: '55%' },
  [POSITIONS.TOP_RIGHT]: { npc: 'npc_c', image: '/jungle/npc_c.png', top: '50%', left: '50%' },
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
    if (collectedIds.length < 12) {
      setNpcDialogueText("Not finished yet! You're still missing some data!")
      setShowNpcDialogue(true)
    } else if (npcType === 'npc_c') {
      // Ranger Moss - proceed to data cleaning
      onComplete(collectedIds)
    } else {
      // Other NPCs remind to give to Ranger Moss
      setNpcDialogueText("Give ALL these to Ranger Moss!")
      setShowNpcDialogue(true)
    }
  }

  const handleGlitchClick = () => {
    if (allCollected) {
      setNpcDialogueText("Give ALL these to Ranger Moss!")
      setShowNpcDialogue(true)
    } else {
      setShowTaskHint(true)
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
      width: '80px',
      height: '80px',
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
      width: '120px',
      height: '120px',
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
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
      {currentMushrooms.map((mushroom) => (
        <div
          key={mushroom.id}
          style={{
            ...styles.mushroomItem,
            top: mushroom.top,
            left: mushroom.left,
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
      ))}

      {/* NPC in current quadrant */}
      {currentNpc && (
        <img
          src={currentNpc.image}
          alt={currentNpc.npc}
          style={{
            ...styles.npcCharacter,
            top: currentNpc.top,
            left: currentNpc.left,
          }}
          onClick={() => handleNpcClick(currentNpc.npc)}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
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

      {/* NPC Dialogue Modal */}
      {showNpcDialogue && (
        <div style={styles.cardOverlay} onClick={() => setShowNpcDialogue(false)}>
          <div style={styles.npcDialogueBox} onClick={(e) => e.stopPropagation()}>
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
    </div>
  )
}

export default DataCollection
