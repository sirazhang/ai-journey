import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from './LanguageToggle'

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
    position: { top: '52%', left: '5%' },
    cardPosition: { top: '62%', left: '5%' },
    description: t('fungiDescription'),
    difficulty: t('easyDifficulty'),
    available: true,
  },
  { 
    id: 'desert', 
    name: t('desert'), 
    position: { top: '5%', left: '30%' },
    cardPosition: { top: '15%', left: '30%' },
    description: t('desertDescription'),
    difficulty: t('intermediateDifficulty'),
    available: true,
  },
  { 
    id: 'glacier', 
    name: t('glacier'), 
    position: { bottom: '8%', left: '45%' },
    cardPosition: { bottom: '22%', left: '45%' },
    description: t('glacierDescription'),
    difficulty: t('advancedDifficulty'),
    available: false,
  },
  { 
    id: 'island', 
    name: t('island'), 
    position: { top: '35%', right: '5%' },
    cardPosition: { top: '48%', right: '5%' },
    description: t('islandDescription'),
    difficulty: t('advancedDifficulty'),
    available: true, // 改为可用
  },
]

const MapView = ({ onRegionClick }) => {
  const { t } = useLanguage()
  const regions = getRegions(t)
  const [hoveredNpc, setHoveredNpc] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)  // Changed from hoveredRegion to selectedRegion (click-based)
  const [regionsVisible, setRegionsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRegionsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Check if any region card is showing
  const isCardShowing = selectedRegion !== null

  const handleRegionClick = (regionId) => {
    // Play select sound effect
    playSelectSound()
    
    // Toggle: if clicking same region, keep it open; otherwise switch to new region
    if (selectedRegion === regionId) {
      // Keep open, do nothing (user can click GO to proceed)
    } else {
      setSelectedRegion(regionId)
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
      opacity: isCardShowing ? 0 : 1,
      pointerEvents: isCardShowing ? 'none' : 'auto',
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
      padding: '12px 20px',
      borderRadius: '15px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid',
      borderImage: 'linear-gradient(90deg, #5170FF, #FF6B9D) 1',
      zIndex: 10,
      maxWidth: '200px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    npcDialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.5,
      margin: 0,
    },
    // Region label button
    regionLabel: {
      position: 'absolute',
      padding: '12px 30px',
      borderRadius: '30px',
      border: '3px solid transparent',
      background: 'rgba(255, 255, 255, 0.9)',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '20px',
      fontWeight: 800,
      color: '#000',
      cursor: 'pointer',
      zIndex: 5,
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #5170FF, #FF6B9D)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    // Region info card
    regionCard: {
      position: 'absolute',
      width: '350px',
      padding: '20px',
      paddingBottom: '25px', // 从70px减少到25px，减少下方留白
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #5170FF, #FF6B9D)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      zIndex: 20,
      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      animation: 'fadeInUp 0.3s ease-out',
    },
    cardDescription: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      color: '#333',
      lineHeight: 1.6,
      marginBottom: '10px', // 从12px减少到10px
      textAlign: 'center',
    },
    cardDifficulty: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#666',
      marginBottom: '12px', // 从15px减少到12px
      textAlign: 'center',
    },
    goButton: {
      display: 'block',
      width: '80%',
      margin: '0 auto 8px auto', // 从10px减少到8px
      padding: '12px 0',
      borderRadius: '8px',
      border: 'none',
      background: '#000',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '18px',
      fontWeight: 700,
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    startOverButton: {
      display: 'block',
      width: '80%',
      margin: '0 auto', // 移除上边距，让按钮更紧凑
      padding: '6px 0',
      borderRadius: '6px',
      border: 'none',
      background: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#333',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    lockedButton: {
      display: 'block',
      width: '80%',
      margin: '0 auto',
      padding: '12px 0',
      borderRadius: '8px',
      border: 'none',
      background: '#999',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#fff',
      cursor: 'not-allowed',
    },
    // NPC state 2 at bottom-left of card
    cardNpc: {
      position: 'absolute',
      top: '40px', // 从50px调整到40px，适应更紧凑的卡片
      left: '-50px',
      width: '100px',
      height: '100px',
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

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      
      {/* Language Toggle Button */}
      <LanguageToggle position="topLeft" />
      
      <img 
        src="/background/map.gif" 
        alt="Map Background" 
        style={styles.backgroundGif}
      />
      
      {/* NPC Glitch in top-right (disappears when card shows) */}
      <div 
        style={styles.npcContainer}
        onMouseEnter={() => {
          setHoveredNpc(true)
          playHumSound() // 添加hum音效
        }}
        onMouseLeave={() => setHoveredNpc(false)}
      >
        <img 
          src="/npc/npc1.png" 
          alt="Glitch" 
          style={styles.npcImage}
        />
      </div>
      
      {/* NPC Dialogue (shows on hover) */}
      {hoveredNpc && !isCardShowing && (
        <div style={styles.npcDialogue}>
          <p style={styles.npcDialogueText}>
            I suggest go to the Fungi Jungle first.
          </p>
        </div>
      )}
      
      {/* Region Labels */}
      {regions.map((region, index) => (
        <div
          key={region.id}
          style={{
            ...styles.regionLabel,
            ...region.position,
            opacity: regionsVisible ? 1 : 0,
            transform: regionsVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${index * 0.1}s`,
            ...(selectedRegion === region.id ? { background: 'rgba(81, 112, 255, 0.2)' } : {}),
          }}
          onClick={() => handleRegionClick(region.id)}
        >
          {region.name}
        </div>
      ))}
      
      {/* Region Info Card (shows on click, stays visible) */}
      {selectedRegion && (
        <div 
          style={{
            ...styles.regionCard,
            ...getHoveredRegionData()?.cardPosition,
          }}
        >
          <p style={styles.cardDescription}>
            {getHoveredRegionData()?.description}
          </p>
          <p style={styles.cardDifficulty}>
            Difficulty: {getHoveredRegionData()?.difficulty}
          </p>
          
          {getHoveredRegionData()?.available ? (
            <>
              <button 
                style={styles.goButton}
                onClick={() => {
                  playSelectSound() // 添加音效
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
                    playSelectSound() // 添加音效
                    onRegionClick(selectedRegion, true) // Pass true for startOver
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
