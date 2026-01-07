import React, { useState, useEffect, useCallback } from 'react'
import Homepage from './components/Homepage'
import SignInModal from './components/SignInModal'
import GameInterface from './components/GameInterface'
import MapView from './components/MapView'
import FungiJungleMap from './components/FungiJungleMap'
import DataCollection from './components/DataCollection'
import DataCleaning from './components/DataCleaning'
import DesertMap from './components/DesertMap'
import useBackgroundMusic from './hooks/useBackgroundMusic'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [showSignIn, setShowSignIn] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [dialogueComplete, setDialogueComplete] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [collectedData, setCollectedData] = useState([])
  const [userLoggedIn, setUserLoggedIn] = useState(false) // Track login status
  const [musicEnabled, setMusicEnabled] = useState(true) // Track music state

  // Background music based on current screen
  const getMusicFile = () => {
    switch (currentScreen) {
      case 'home':
      case 'game':
      case 'map':
        return '/sound/spaceship.mp3'
      case 'fungiMap':
      case 'dataCollection':
      case 'dataCleaning':
        return '/sound/jungle.mp3'
      case 'desertMap':
        return '/sound/desert.mp3'
      default:
        return '/sound/spaceship.mp3'
    }
  }

  // Use background music hook
  const { startMusic, stopMusic, setVolume } = useBackgroundMusic(getMusicFile(), 0.3)

  // Handle user interaction to start music (for autoplay restrictions)
  const handleUserInteraction = useCallback(() => {
    startMusic()
    // Remove the event listener after first interaction
    document.removeEventListener('click', handleUserInteraction)
    document.removeEventListener('keydown', handleUserInteraction)
  }, [startMusic])

  // Add event listeners for user interaction
  useEffect(() => {
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
    
    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }
  }, [handleUserInteraction])

  // Load saved progress on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setIsFirstVisit(!userData.hasStarted)
      setUserLoggedIn(true) // User is logged in if data exists
    }
  }, [])

  // Save progress when screen changes
  const saveProgress = (screen) => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.hasStarted = true
      userData.currentProgress = screen
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
    }
  }

  const handleStart = () => {
    saveProgress('game')
    setCurrentScreen('game')
  }

  const handleContinue = () => {
    // Load last saved screen or go to map
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const lastScreen = userData.currentProgress || 'map'
      // If saved progress was fungiIntro, go directly to fungiMap
      if (lastScreen === 'fungiIntro') {
        setCurrentScreen('fungiMap')
      } else {
        setCurrentScreen(lastScreen)
      }
    } else {
      setCurrentScreen('map')
    }
  }

  const handleStartOver = () => {
    // Reset all state and start fresh
    setDialogueComplete(false)
    setSelectedRegion(null)
    setCollectedData([])
    saveProgress('game')
    setCurrentScreen('game')
  }

  const handleSignIn = () => {
    setShowSignIn(true)
  }

  const handleCloseSignIn = () => {
    setShowSignIn(false)
  }

  const handleSignUpComplete = (userData) => {
    setIsFirstVisit(false)
    setUserLoggedIn(true) // Set login status to true
  }

  const toggleMusic = () => {
    if (musicEnabled) {
      stopMusic()
      setMusicEnabled(false)
    } else {
      startMusic()
      setMusicEnabled(true)
    }
  }

  const handleDialogueComplete = () => {
    setDialogueComplete(true)
    saveProgress('map')
    setCurrentScreen('map')
  }

  const handleRegionClick = (region, startOver = false) => {
    console.log('Region clicked:', region, 'Start over:', startOver)
    setSelectedRegion(region)
    if (region === 'fungi') {
      if (startOver) {
        // Clear Fungi Jungle progress
        const savedUser = localStorage.getItem('aiJourneyUser')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          userData.fungiJungleProgress = null
          userData.dataCollectionProgress = null
          userData.dataCleaningProgress = null
          localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
        }
      }
      // Go directly to Fungi Jungle map (skip intro)
      saveProgress('fungiMap')
      setCurrentScreen('fungiMap')
    } else if (region === 'desert') {
      if (startOver) {
        // Clear Desert progress
        const savedUser = localStorage.getItem('aiJourneyUser')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          userData.desertProgress = null
          localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
        }
      }
      // Go to Desert map
      saveProgress('desertMap')
      setCurrentScreen('desertMap')
    }
  }

  const handleFungiMapExit = () => {
    saveProgress('map')
    setCurrentScreen('map')
    setSelectedRegion(null)
  }

  const handleStartDataCollection = () => {
    console.log('Starting data collection phase...')
    saveProgress('dataCollection')
    setCurrentScreen('dataCollection')
  }

  const handleDataCollectionComplete = (samples) => {
    console.log('Data collection complete:', samples)
    setCollectedData(samples)
    saveProgress('dataCleaning')
    setCurrentScreen('dataCleaning')
  }

  const handleDataCollectionExit = () => {
    saveProgress('fungiMap')
    setCurrentScreen('fungiMap')
  }

  const handleDataCleaningComplete = () => {
    console.log('Data cleaning complete!')
    saveProgress('map')
    setCurrentScreen('map')
  }

  const handleDataCleaningExit = () => {
    saveProgress('map')
    setCurrentScreen('map')
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {currentScreen === 'home' && (
        <Homepage 
          key={userLoggedIn ? 'logged-in' : 'logged-out'} // Force re-render when login status changes
          onStart={handleStart} 
          onContinue={handleContinue}
          onStartOver={handleStartOver}
          onSignIn={handleSignIn}
          isFirstVisit={isFirstVisit}
        />
      )}
      
      {currentScreen === 'game' && (
        <GameInterface onComplete={handleDialogueComplete} />
      )}
      
      {currentScreen === 'map' && (
        <MapView onRegionClick={handleRegionClick} />
      )}

      {currentScreen === 'desertMap' && (
        <DesertMap 
          onExit={() => {
            saveProgress('map')
            setCurrentScreen('map')
          }}
        />
      )}

      {currentScreen === 'fungiMap' && (
        <FungiJungleMap 
          onExit={handleFungiMapExit}
          onStartDataCollection={handleStartDataCollection}
        />
      )}

      {currentScreen === 'dataCollection' && (
        <DataCollection
          onComplete={handleDataCollectionComplete}
          onExit={handleDataCollectionExit}
        />
      )}

      {currentScreen === 'dataCleaning' && (
        <DataCleaning
          onComplete={handleDataCleaningComplete}
          onExit={handleDataCleaningExit}
        />
      )}

      {showSignIn && (
        <SignInModal 
          onClose={handleCloseSignIn} 
          onSignUpComplete={handleSignUpComplete}
        />
      )}
    </div>
  )
}

export default App
