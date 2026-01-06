import React, { useState, useEffect, useCallback } from 'react'
import Homepage from './components/Homepage'
import SignInModal from './components/SignInModal'
import GameInterface from './components/GameInterface'
import MapView from './components/MapView'
import FungiJungleIntro from './components/FungiJungleIntro'
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

  const handleStart = () => {
    setCurrentScreen('game')
  }

  const handleSignIn = () => {
    setShowSignIn(true)
  }

  const handleCloseSignIn = () => {
    setShowSignIn(false)
  }

  const handleDialogueComplete = () => {
    setDialogueComplete(true)
    setCurrentScreen('map')
  }

  const handleRegionClick = (region) => {
    console.log('Region clicked:', region)
    setSelectedRegion(region)
    if (region === 'fungi') {
      setCurrentScreen('fungiIntro')
    }
  }

  const handleFungiIntroContinue = () => {
    setCurrentScreen('fungiMap')
  }

  const handleFungiIntroExit = () => {
    setCurrentScreen('map')
    setSelectedRegion(null)
  }

  const handleFungiMapExit = () => {
    setCurrentScreen('map')
    setSelectedRegion(null)
  }

  const handleStartDataCollection = () => {
    console.log('Starting data collection phase...')
    setCurrentScreen('dataCollection')
  }

  const handleDataCollectionComplete = (samples) => {
    console.log('Data collection complete:', samples)
    setCollectedData(samples)
    // Navigate to data cleaning phase
    setCurrentScreen('dataCleaning')
  }

  const handleDataCollectionExit = () => {
    setCurrentScreen('fungiMap')
  }

  const handleDataCleaningComplete = () => {
    console.log('Data cleaning complete!')
    // Future: Navigate to next phase (model training)
    setCurrentScreen('map')
  }

  const handleDataCleaningExit = () => {
    setCurrentScreen('dataCollection')
  }

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      {currentScreen === 'home' && (
        <Homepage 
          onStart={handleStart} 
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

      {currentScreen === 'fungiIntro' && (
        <FungiJungleIntro 
          onContinue={handleFungiIntroContinue}
          onExit={handleFungiIntroExit}
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
        <SignInModal onClose={handleCloseSignIn} />
      )}
    </div>
  )
}

export default App
