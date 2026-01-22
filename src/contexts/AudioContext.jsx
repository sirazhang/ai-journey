import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const AudioContext = createContext()

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider')
  }
  return context
}

export const AudioProvider = ({ children }) => {
  const [volume, setVolumeState] = useState(85)
  const [isMuted, setIsMuted] = useState(false)
  const audioElementsRef = useRef(new Set())

  // Load saved volume from localStorage on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('systemVolume')
    if (savedVolume) {
      const vol = parseInt(savedVolume)
      setVolumeState(vol)
    }
  }, [])

  // Register audio element
  const registerAudio = (audioElement) => {
    if (audioElement) {
      audioElementsRef.current.add(audioElement)
      // Update volume immediately
      const actualVolume = isMuted ? 0 : volume / 100
      audioElement.volume = actualVolume
    }
  }

  // Unregister audio element
  const unregisterAudio = (audioElement) => {
    if (audioElement) {
      audioElementsRef.current.delete(audioElement)
    }
  }

  // Apply volume changes
  const setVolume = (newVolume) => {
    setVolumeState(newVolume)
    localStorage.setItem('systemVolume', newVolume.toString())
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  // Update all audio volumes when volume or mute state changes
  useEffect(() => {
    const actualVolume = isMuted ? 0 : volume / 100
    audioElementsRef.current.forEach(audioElement => {
      if (audioElement) {
        audioElement.volume = actualVolume
      }
    })
  }, [volume, isMuted])

  const value = {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    registerAudio,
    unregisterAudio,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}
