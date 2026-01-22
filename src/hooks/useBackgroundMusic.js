import { useEffect, useRef } from 'react'
import volumeManager from '../utils/volumeManager'

const useBackgroundMusic = (musicFile) => {
  const audioRef = useRef(null)
  const currentMusicFile = useRef(null)

  useEffect(() => {
    // Skip if no music file provided
    if (!musicFile) {
      return
    }

    // If music file changed, stop current music and start new one
    if (currentMusicFile.current !== musicFile) {
      // Stop current music
      if (audioRef.current) {
        volumeManager.unregisterAudio(audioRef.current)
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Create new audio element
      audioRef.current = new Audio(musicFile)
      audioRef.current.loop = true
      
      // Don't set volume here - let volumeManager handle it after registration
      currentMusicFile.current = musicFile

      // Register with volume manager (this will set the correct volume)
      volumeManager.registerAudio(audioRef.current)

      // Start playing
      const playMusic = async () => {
        try {
          await audioRef.current.play()
          console.log(`Playing background music: ${musicFile}`)
        } catch (error) {
          console.log('Could not play background music:', error)
          // Auto-play might be blocked, we'll try again on user interaction
        }
      }

      playMusic()
    }

    // Cleanup function
    return () => {
      if (audioRef.current) {
        volumeManager.unregisterAudio(audioRef.current)
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [musicFile])

  // Function to manually start music (for user interaction)
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }

  // Function to stop music
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  // Function to set volume
  const setVolume = (newVolume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume))
    }
  }

  return { startMusic, stopMusic, setVolume }
}

export default useBackgroundMusic