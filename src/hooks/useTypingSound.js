import { useRef, useCallback, useEffect } from 'react'
import volumeManager from '../utils/volumeManager'

const useTypingSound = (soundFile) => {
  const audioRef = useRef(null)

  const startTypingSound = useCallback(() => {
    if (!soundFile) return
    
    try {
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        volumeManager.unregisterAudio(audioRef.current)
      }

      // Create new audio instance
      audioRef.current = new Audio(soundFile)
      audioRef.current.loop = true
      
      // Register with volume manager
      volumeManager.registerAudio(audioRef.current)
      
      // Apply base volume multiplier
      const systemVolume = volumeManager.isMutedStatus() ? 0 : volumeManager.getVolume() / 100
      audioRef.current.volume = systemVolume * 0.3
      
      audioRef.current.play().catch(error => {
        console.log('Could not play typing sound:', error)
      })
    } catch (error) {
      console.log('Error creating typing audio:', error)
    }
  }, [soundFile])

  const stopTypingSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      volumeManager.unregisterAudio(audioRef.current)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        volumeManager.unregisterAudio(audioRef.current)
      }
    }
  }, [])

  return {
    startTypingSound,
    stopTypingSound
  }
}

export default useTypingSound
