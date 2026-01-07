import { useEffect, useRef } from 'react'

const useBackgroundMusic = (musicFile, volume = 0.3) => {
  const audioRef = useRef(null)
  const currentMusicFile = useRef(null)

  useEffect(() => {
    // If music file changed, stop current music and start new one
    if (currentMusicFile.current !== musicFile) {
      // Stop current music
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Create new audio element
      audioRef.current = new Audio(musicFile)
      audioRef.current.loop = true
      audioRef.current.volume = volume
      currentMusicFile.current = musicFile

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
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [musicFile, volume])

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