import React, { useState, useEffect, useCallback } from 'react'
import Homepage from './components/Homepage'
import SignInModal from './components/SignInModal'
import GameInterface from './components/GameInterface'
import MapView from './components/MapView'
import FungiJungleMap from './components/FungiJungleMap'
import DataCollection from './components/DataCollection'
import DataCleaning from './components/DataCleaning'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home')
  const [showSignIn, setShowSignIn] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [dialogueComplete, setDialogueComplete] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [collectedData, setCollectedData] = useState([])

  // Load saved progress on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setIsFirstVisit(!userData.hasStarted)
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
  }

  const handleDialogueComplete = () => {
    setDialogueComplete(true)
    saveProgress('map')
    setCurrentScreen('map')
  }

  const handleRegionClick = (region) => {
    console.log('Region clicked:', region)
    setSelectedRegion(region)
    if (region === 'fungi') {
      // Go directly to Fungi Jungle map (skip intro)
      saveProgress('fungiMap')
      setCurrentScreen('fungiMap')
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
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {currentScreen === 'home' && (
        <Homepage 
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
