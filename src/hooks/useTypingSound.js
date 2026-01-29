import { useRef, useCallback } from 'react'

const useTypingSound = (soundFile) => {
  const audioRef = useRef(null)

  const startTypingSound = useCallback(() => {
    if (!soundFile) return
    
    try {
      // Stop any existing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }

      // Create new audio instance
      audioRef.current = new Audio(soundFile)
      audioRef.current.volume = 0.3
      audioRef.current.loop = true
      
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
    }
  }, [])

  return {
    startTypingSound,
    stopTypingSound
  }
}

export default useTypingSound
