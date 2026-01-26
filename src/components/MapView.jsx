import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import SettingsPanel from './SettingsPanel'

// Simple sound effect function
const playSelectSound = () => {
  try {
    const audio = new Audio('/sound/select.mp3')
    audio.volume = 0.6
    audio.play().catch(error => {
      console.log('Could not play select sound:', error)
    })
  } catch (error) {
    console.log('Error creating select audio:', error)
  }
}

// NPC Glitch dialogue sound effect
const playHumSound = () => {
  try {
    const audio = new Audio('/sound/hum.mp3')
    audio.volume = 0.5
    audio.play().catch(error => {
      console.log('Could not play hum sound:', error)
    })
  } catch (error) {
    console.log('Error creating hum audio:', error)
  }
}

// Region data with positions and info cards - will be translated dynamically
const getRegions = (t) => [
  { 
    id: 'fungi', 
    name: t('fungiJungle'), 
    regionNumber: 1,
    stars: 1,
    position: { top: '52%', left: '5%' },
    cardPosition: { top: '15%', left: '5%' },
    description: t('fungiDescription'),
    difficulty: t('easyDifficulty'),
    available: true,
  },
  { 
    id: 'desert', 
    name: t('desert'), 
    regionNumber: 2,
    stars: 2,
    position: { top: '5%', left: '30%' },
    cardPosition: { top: '15%', left: '30%' },
    description: t('desertDescription'),
    difficulty: t('intermediateDifficulty'),
    available: true,
  },
  { 
    id: 'glacier', 
    name: t('glacier'), 
    regionNumber: 4,
    stars: 3,
    position: { bottom: '8%', left: '45%' },
    cardPosition: { bottom: '22%', left: '45%' },
    description: t('glacierDescription'),
    difficulty: t('advancedDifficulty'),
    available: true,
  },
  { 
    id: 'island', 
    name: t('island'), 
    regionNumber: 3,
    stars: 3,
    position: { top: '35%', right: '5%' },
    cardPosition: { top: '38%', right: '5%' },
    description: t('islandDescription'),
    difficulty: t('advancedDifficulty'),
    available: true,
  },
]

const MapView = ({ onRegionClick }) => {
  const { t } = useLanguage()
  const regions = getRegions(t)
  const [hoveredNpc, setHoveredNpc] = useState(false)
  const [showGlitchDialogue, setShowGlitchDialogue] = useState(false) // Changed to click-based
  const [selectedRegion, setSelectedRegion] = useState(null)  // Changed from hoveredRegion to selectedRegion (click-based)
  const [regionsVisible, setRegionsVisible] = useState(false)
  const [zoomRegion, setZoomRegion] = useState(null) // For zoom effect
  const [isZooming, setIsZooming] = useState(false) // Animation state
  const [glitchInput, setGlitchInput] = useState('') // For Glitch chat input
  const [regionProgress, setRegionProgress] = useState({}) // Track progress for each region

  useEffect(() => {
    const timer = setTimeout(() => {
      setRegionsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])
  
  // Load progress from localStorage
  useEffect(() => {
    const loadProgress = () => {
      const progress = {}
      
      // Load Glacier progress
      const glacierProgress = localStorage.getItem('glacierProgress')
      if (glacierProgress) {
        const data = JSON.parse(glacierProgress)
        // Calculate glacier progress: 4 main tasks, each 25%
        // Task 1: Court (5 cases) - 25%
        // Task 2: Court summary quiz - 25%
        // Task 3: Rooftop (3 tasks) - 25%
        // Task 4: Rooftop summary quiz - 25%
        let glacierPercent = 0
        
        // Task 1: Court cases (0-25%)
        if (data.completedCases && data.completedCases.length > 0) {
          glacierPercent += (data.completedCases.length / 5) * 25
        }
        
        // Task 2: Court summary (25%)
        if (data.courtSummaryCompleted) {
          glacierPercent += 25
        }
        
        // Task 3: Rooftop tasks (0-25%)
        if (data.rooftopCompletedTasks && data.rooftopCompletedTasks.length > 0) {
          glacierPercent += (data.rooftopCompletedTasks.length / 3) * 25
        }
        
        // Task 4: Rooftop summary / Complete (25%)
        if (data.isComplete) {
          glacierPercent = 100 // Fully complete
        }
        
        progress.glacier = Math.round(glacierPercent)
      } else {
        progress.glacier = 0
      }
      
      // Load Island progress (if exists)
      const islandProgress = localStorage.getItem('islandProgress')
      if (islandProgress) {
        const data = JSON.parse(islandProgress)
        // Calculate based on island's completion logic
        // Phase 1: Mission completed (9 GenAI NPCs) - 40%
        // Phase 2: Phase 2 completed (5 GenAI NPCs) - 40%
        // Final: Island restored - 20%
        let islandPercent = 0
        
        if (data.missionCompleted) {
          islandPercent += 40
        }
        
        if (data.phase2Completed) {
          islandPercent += 40
        }
        
        if (data.islandRestored) {
          islandPercent = 100 // Fully complete
        }
        
        progress.island = Math.round(islandPercent)
      } else {
        progress.island = 0
      }
      
      // Load Desert progress (if exists)
      const desertProgress = localStorage.getItem('desertProgress')
      if (desertProgress) {
        const data = JSON.parse(desertProgress)
        progress.desert = data.isComplete ? 100 : 0
      } else {
        progress.desert = 0
      }
      
      // Load Fungi progress (if exists)
      const fungiProgress = localStorage.getItem('fungiProgress')
      if (fungiProgress) {
        const data = JSON.parse(fungiProgress)
        progress.fungi = data.isComplete ? 100 : 0
      } else {
        progress.fungi = 0
      }
      
      setRegionProgress(progress)
    }
    
    loadProgress()
    
    // Listen for storage changes to update progress in real-time
    const handleStorageChange = () => {
      loadProgress()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Check if any region card is showing
  const isCardShowing = selectedRegion !== null

  const handleRegionClick = (regionId) => {
    // Play select sound effect
    playSelectSound()
    
    // If already zoomed to this region, just toggle the card
    if (zoomRegion === regionId && !isZooming) {
      setSelectedRegion(selectedRegion === regionId ? null : regionId)
      return
    }
    
    // Start zoom effect
    setZoomRegion(regionId)
    setIsZooming(true)
    
    // After zoom animation, show the region card and stay zoomed
    setTimeout(() => {
      setIsZooming(false)
      setSelectedRegion(regionId)
    }, 800) // Animation duration
  }

  // Handle close button - zoom out and hide card
  const handleCloseCard = () => {
    playSelectSound()
    setSelectedRegion(null)
    setZoomRegion(null)
  }

  // Handle Glitch chat send
  const handleGlitchSend = () => {
    if (glitchInput.trim()) {
      playSelectSound()
      console.log('User message to Glitch:', glitchInput)
      // Here you can add logic to handle the user's message
      setGlitchInput('') // Clear input after sending
    }
  }

  // Handle Enter key in input
  const handleGlitchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGlitchSend()
    }
  }

  // Get zoom transform based on region
  const getZoomTransform = (regionId) => {
    if (!zoomRegion) return 'scale(1) translate(0, 0)'
    
    switch (regionId) {
      case 'island': // NEXUS ISLAND - 显示右上角
        return 'scale(3) translate(-25%, 25%)'
      case 'desert': // AETHER DESERT - 显示左上角  
        return 'scale(3) translate(25%, 25%)'
      case 'fungi': // FUNGI JUNGLE - 显示左下角
        return 'scale(3) translate(25%, -25%)'
      case 'glacier': // GLACIER PEAKS - 显示右下角
        return 'scale(3) translate(-25%, -25%)'
      default:
        return 'scale(1) translate(0, 0)'
    }
  }

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundGif: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
      transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transformOrigin: 'center center',
    },
    // NPC in top-right corner (no background card)
    npcContainer: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '120px',
      height: '120px',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'opacity 0.3s ease',
    },
    npcImage: {
      width: '120px',
      height: '120px',
      objectFit: 'contain',
      transition: 'transform 0.3s ease',
      animation: hoveredNpc ? 'breathe 1s ease-in-out infinite' : 'none',
    },
    // NPC dialogue bubble (top-right)
    npcDialogue: {
      position: 'absolute',
      top: '20px',
      right: '150px',
      padding: '20px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid #af4dca',
      zIndex: 10,
      minWidth: '280px',
      maxWidth: '320px',
      boxShadow: '0 4px 20px rgba(175, 77, 202, 0.3)',
    },
    npcDialogueHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
    },
    npcDialogueAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#af4dca',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    npcDialogueAvatarIcon: {
      fontSize: '24px',
    },
    npcDialogueName: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#af4dca',
      margin: 0,
    },
    npcDialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.6,
      margin: '0 0 15px 0',
    },
    npcDialogueInputContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#d9d7de',
      borderRadius: '20px',
      border: '2px solid #d9d7de',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    },
    npcDialogueInput: {
      flex: 1,
      padding: '10px 15px',
      border: 'none',
      backgroundColor: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      color: '#333',
      outline: 'none',
    },
    npcDialogueDivider: {
      width: '2px',
      height: '24px',
      backgroundColor: '#af4dca',
      margin: '0 8px',
      flexShrink: 0,
    },
    npcDialogueSendButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 12px',
      transition: 'all 0.2s',
      flexShrink: 0,
    },
    npcDialogueSendIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
    },
    npcDialogueCloseButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#999',
      cursor: 'pointer',
      padding: '0',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    // Region label button - New card style
    regionLabel: {
      position: 'absolute',
      width: '280px',
      padding: '15px 20px',
      borderRadius: '20px',
      border: '3px solid transparent',
      background: 'rgba(255, 255, 255, 0.95)',
      fontFamily: "'Montserrat', sans-serif",
      cursor: 'pointer',
      zIndex: 5,
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #5170FF, #FF6B9D)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    regionLabelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    },
    regionLabelRegion: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '11px',
      fontWeight: 600,
      color: '#999',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    regionLabelStars: {
      display: 'flex',
      gap: '3px',
    },
    regionLabelStarIcon: {
      width: '16px',
      height: '16px',
      objectFit: 'contain',
    },
    regionLabelTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '20px',
      fontWeight: 800,
      color: '#000',
      textTransform: 'uppercase',
      marginBottom: '10px',
      lineHeight: 1.2,
    },
    regionLabelProgressContainer: {
      width: '100%',
      height: '6px',
      backgroundColor: '#E0E0E0',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    regionLabelProgressFill: {
      height: '100%',
      backgroundColor: '#777777',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
    },
    // Region info card
    regionCard: {
      position: 'absolute',
      width: '450px',
      padding: '30px',
      paddingBottom: '30px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #5170FF, #FF6B9D)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      zIndex: 20,
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      animation: 'fadeInUp 0.3s ease-out',
    },
    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    cardHeaderLeft: {
      flex: 1,
    },
    cardCloseButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: '#999',
      cursor: 'pointer',
      padding: '0',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      marginLeft: '10px',
      flexShrink: 0,
    },
    cardRegionLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      fontWeight: 600,
      color: '#999',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '5px',
    },
    cardStars: {
      display: 'flex',
      gap: '6px',
    },
    starIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
    },
    cardTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '32px',
      fontWeight: 900,
      color: '#000',
      marginBottom: '18px',
      textTransform: 'uppercase',
      lineHeight: 1.1,
      letterSpacing: '1px',
    },
    progressBarContainer: {
      width: '100%',
      height: '10px',
      backgroundColor: '#E0E0E0',
      borderRadius: '5px',
      overflow: 'hidden',
      marginBottom: '20px',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#777777',
      borderRadius: '5px',
      transition: 'width 0.3s ease',
    },
    cardDescription: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#333',
      lineHeight: 1.7,
      marginBottom: '12px',
      textAlign: 'left',
    },
    cardDifficulty: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      color: '#666',
      marginBottom: '20px',
      textAlign: 'left',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    goButton: {
      display: 'block',
      width: '100%',
      margin: '0 auto 12px auto',
      padding: '16px 0',
      borderRadius: '12px',
      border: 'none',
      background: '#000',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '20px',
      fontWeight: 700,
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    startOverButton: {
      display: 'block',
      width: '100%',
      margin: '0 auto',
      padding: '8px 0',
      borderRadius: '8px',
      border: 'none',
      background: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      fontWeight: 500,
      color: '#666',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'center',
    },
    lockedButton: {
      display: 'block',
      width: '100%',
      margin: '0 auto',
      padding: '16px 0',
      borderRadius: '12px',
      border: 'none',
      background: '#999',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#fff',
      cursor: 'not-allowed',
    },
    // NPC state 2 at bottom-left of card
    cardNpc: {
      position: 'absolute',
      bottom: '20px',
      left: '-60px',
      width: '140px',
      height: '140px',
      objectFit: 'contain',
      zIndex: 21,
    },
    // Keyframes style tag
    keyframes: `
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  }

  const getHoveredRegionData = () => {
    return regions.find(r => r.id === selectedRegion)
  }

  const getCardTitle = (regionData) => {
    if (!regionData) return ''
    
    // Use translation keys for region names
    switch (regionData.id) {
      case 'island':
        return t('island')
      case 'desert':
        return t('desert')
      case 'fungi':
        return t('fungiJungle')
      case 'glacier':
        return t('glacier')
      default:
        return regionData.name
    }
  }

  // Render stars based on region
  const renderStars = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <img 
        key={index}
        src="/icon/star.png" 
        alt="star" 
        style={styles.starIcon}
      />
    ))
  }

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      
      {/* Settings Panel */}
      {!isZooming && <SettingsPanel position="topLeft" />}
      
      <img 
        src="/background/map.gif" 
        alt="Map Background" 
        style={{
          ...styles.backgroundGif,
          transform: zoomRegion ? getZoomTransform(zoomRegion) : 'scale(1) translate(0, 0)'
        }}
      />
      
      {/* NPC Glitch in top-right (disappears when card shows) */}
      <div 
        style={{
          ...styles.npcContainer,
          opacity: (isCardShowing || isZooming) ? 0 : 1,
          pointerEvents: (isCardShowing || isZooming) ? 'none' : 'auto',
        }}
        onMouseEnter={() => setHoveredNpc(true)}
        onMouseLeave={() => setHoveredNpc(false)}
        onClick={() => {
          playHumSound()
          setShowGlitchDialogue(true)
        }}
      >
        <img 
          src="/npc/npc1.png" 
          alt="Glitch" 
          style={styles.npcImage}
        />
      </div>
      
      {/* NPC Dialogue (shows on click) */}
      {showGlitchDialogue && !isCardShowing && !isZooming && (
        <div style={styles.npcDialogue}>
          {/* Close button */}
          <button
            style={styles.npcDialogueCloseButton}
            onClick={() => setShowGlitchDialogue(false)}
            onMouseOver={(e) => {
              e.target.style.color = '#333'
              e.target.style.transform = 'scale(1.1)'
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#999'
              e.target.style.transform = 'scale(1)'
            }}
          >
            ✕
          </button>
          
          {/* Header with avatar and name */}
          <div style={styles.npcDialogueHeader}>
            <div style={styles.npcDialogueAvatar}>
              <span style={styles.npcDialogueAvatarIcon}>👾</span>
            </div>
            <h4 style={styles.npcDialogueName}>Glitch</h4>
          </div>
          
          {/* Message content */}
          <p style={styles.npcDialogueText}>
            I suggest go to the Fungi Jungle first.
          </p>
          
          {/* Input container */}
          <div 
            style={styles.npcDialogueInputContainer}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#af4dca'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d9d7de'
            }}
          >
            <input
              type="text"
              placeholder="Ask Glitch anything..."
              value={glitchInput}
              onChange={(e) => setGlitchInput(e.target.value)}
              onKeyPress={handleGlitchInputKeyPress}
              style={styles.npcDialogueInput}
            />
            <div style={styles.npcDialogueDivider}></div>
            <button
              onClick={handleGlitchSend}
              style={styles.npcDialogueSendButton}
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
                style={styles.npcDialogueSendIcon}
              />
            </button>
          </div>
        </div>
      )}
      
      {/* Region Labels - New Card Style */}
      {regions.map((region, index) => (
        <div
          key={region.id}
          style={{
            ...styles.regionLabel,
            ...region.position,
            opacity: regionsVisible && !zoomRegion ? 1 : 0,
            transform: regionsVisible && !zoomRegion ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${index * 0.1}s`,
            pointerEvents: zoomRegion ? 'none' : 'auto',
            ...(selectedRegion === region.id ? { 
              boxShadow: '0 8px 25px rgba(81, 112, 255, 0.4)',
              transform: 'scale(1.02)'
            } : {}),
          }}
          onClick={() => handleRegionClick(region.id)}
        >
          {/* Header with Region and Stars */}
          <div style={styles.regionLabelHeader}>
            <div style={styles.regionLabelRegion}>
              REGION {region.regionNumber}
            </div>
            <div style={styles.regionLabelStars}>
              {Array.from({ length: region.stars }).map((_, i) => (
                <img 
                  key={i}
                  src="/icon/star.png" 
                  alt="star" 
                  style={styles.regionLabelStarIcon}
                />
              ))}
            </div>
          </div>
          
          {/* Title */}
          <div style={styles.regionLabelTitle}>
            {getCardTitle({ id: region.id })}
          </div>
          
          {/* Progress Bar */}
          <div style={styles.regionLabelProgressContainer}>
            <div style={{
              ...styles.regionLabelProgressFill,
              width: `${regionProgress[region.id] || 0}%`
            }} />
          </div>
        </div>
      ))}
      
      {/* Region Info Card (shows on click, stays visible) */}
      {selectedRegion && !isZooming && (
        <div 
          style={{
            ...styles.regionCard,
            ...getHoveredRegionData()?.cardPosition,
          }}
        >
          {/* Card Header with Region Label, Stars, and Close Button */}
          <div style={styles.cardHeader}>
            <div style={{flex: 1}}>
              <div style={styles.cardRegionLabel}>
                REGION {getHoveredRegionData()?.regionNumber}
              </div>
            </div>
            <div style={styles.cardStars}>
              {renderStars(getHoveredRegionData()?.stars)}
            </div>
            <button
              style={styles.cardCloseButton}
              onClick={handleCloseCard}
              onMouseOver={(e) => {
                e.target.style.color = '#333'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#999'
                e.target.style.transform = 'scale(1)'
              }}
            >
              ✕
            </button>
          </div>
          
          {/* Card Title */}
          <h3 style={styles.cardTitle}>
            {getCardTitle(getHoveredRegionData())}
          </h3>
          
          {/* Progress Bar */}
          <div style={styles.progressBarContainer}>
            <div style={{
              ...styles.progressBarFill,
              width: `${regionProgress[selectedRegion] || 0}%`
            }} />
          </div>
          
          <p style={styles.cardDescription}>
            {getHoveredRegionData()?.description}
          </p>
          <p style={styles.cardDifficulty}>
            <span>Difficulty: </span>
            <span>{getHoveredRegionData()?.difficulty}</span>
          </p>
          
          {getHoveredRegionData()?.available ? (
            <>
              <button 
                style={styles.goButton}
                onClick={() => {
                  playSelectSound()
                  onRegionClick(selectedRegion)
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#333'
                  e.target.style.transform = 'scale(1.02)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#000'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                {t('continue')}
              </button>
              
              {(selectedRegion === 'fungi' || selectedRegion === 'desert') && (
                <button 
                  style={styles.startOverButton}
                  onClick={() => {
                    playSelectSound()
                    onRegionClick(selectedRegion, true)
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#666'
                    e.target.style.transform = 'scale(1.02)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#333'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  {t('startOver')}
                </button>
              )}
            </>
          ) : (
            <button style={styles.lockedButton}>
              🔒 {t('comingSoon')}
            </button>
          )}
          
          {/* NPC state 2 at card bottom-left */}
          <img 
            src="/npc/npc2.png" 
            alt="Glitch" 
            style={styles.cardNpc}
          />
        </div>
      )}
    </div>
  )
}

export default MapView
