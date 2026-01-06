import React, { useState, useEffect } from 'react'

const regions = [
  { id: 'fungi', name: 'Fungi Jungle', color: '#4CAF50', position: { top: '25%', left: '20%' } },
  { id: 'crystal', name: 'Crystal Caves', color: '#9C27B0', position: { top: '35%', right: '25%' } },
  { id: 'volcano', name: 'Volcano Peak', color: '#FF5722', position: { bottom: '30%', left: '30%' } },
  { id: 'ocean', name: 'Deep Ocean', color: '#2196F3', position: { bottom: '25%', right: '20%' } },
]

const MapView = ({ onRegionClick }) => {
  const [showNpcDialogue, setShowNpcDialogue] = useState(false)
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [regionsVisible, setRegionsVisible] = useState(false)

  useEffect(() => {
    // Delay showing regions for animation effect
    const timer = setTimeout(() => {
      setRegionsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleNpcClick = () => {
    setShowNpcDialogue(!showNpcDialogue)
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
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.2)',
      zIndex: 1,
    },
    miniNpc: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(30,30,40,1), rgba(30,30,40,1)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'transform 0.3s, box-shadow 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniNpcImage: {
      width: '70px',
      height: '70px',
      objectFit: 'contain',
    },
    npcDialogue: {
      position: 'absolute',
      top: '110px',
      right: '20px',
      width: '300px',
      padding: '20px',
      borderRadius: '15px',
      background: 'rgba(20, 20, 35, 0.95)',
      border: '2px solid transparent',
      backgroundImage: 'linear-gradient(rgba(20,20,35,0.95), rgba(20,20,35,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      zIndex: 10,
      animation: 'fadeIn 0.3s ease-out',
    },
    npcDialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#fff',
      lineHeight: 1.6,
    },
    regionButton: {
      position: 'absolute',
      width: '180px',
      height: '60px',
      borderRadius: '15px',
      border: 'none',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 500,
      color: '#fff',
      cursor: 'pointer',
      zIndex: 5,
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    },
    regionGlow: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
      pointerEvents: 'none',
      zIndex: 4,
    },
    title: {
      position: 'absolute',
      top: '30px',
      left: '40px',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '32px',
      fontWeight: 700,
      color: '#fff',
      zIndex: 10,
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    },
    subtitle: {
      position: 'absolute',
      top: '70px',
      left: '40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 300,
      color: 'rgba(255,255,255,0.7)',
      zIndex: 10,
    },
  }

  return (
    <div style={styles.container}>
      <img 
        src="/background/map.gif" 
        alt="Map Background" 
        style={styles.backgroundGif}
      />
      <div style={styles.overlay}></div>
      
      <h1 style={styles.title}>Energy Regions</h1>
      <p style={styles.subtitle}>Select a region to explore</p>
      
      {/* Mini NPC */}
      <div 
        style={styles.miniNpc}
        onClick={handleNpcClick}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(81, 112, 255, 0.5)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <img 
          src="/npc/npc1.png" 
          alt="Glitch" 
          style={styles.miniNpcImage}
        />
      </div>
      
      {/* NPC Dialogue popup */}
      {showNpcDialogue && (
        <div style={styles.npcDialogue}>
          <p style={styles.npcDialogueText}>
            I suggest we start by checking the <span style={{ color: '#4CAF50', fontWeight: 500 }}>Fungi Jungle</span>.
          </p>
        </div>
      )}
      
      {/* Region Buttons */}
      {regions.map((region, index) => (
        <button
          key={region.id}
          style={{
            ...styles.regionButton,
            ...region.position,
            background: `linear-gradient(135deg, ${region.color}dd, ${region.color}88)`,
            opacity: regionsVisible ? 1 : 0,
            transform: regionsVisible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: `${index * 0.1}s`,
          }}
          onClick={() => onRegionClick(region.id)}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.1) translateY(-5px)'
            e.target.style.boxShadow = `0 8px 30px ${region.color}66`
            setHoveredRegion(region.id)
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1) translateY(0)'
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)'
            setHoveredRegion(null)
          }}
        >
          {region.name}
        </button>
      ))}
    </div>
  )
}

export default MapView
