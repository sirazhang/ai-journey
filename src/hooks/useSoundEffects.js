import { useCallback } from 'react'

const useSoundEffects = () => {
  const playSound = useCallback((soundFile, volume = 0.5) => {
    try {
      const audio = new Audio(soundFile)
      audio.volume = volume
      audio.play().catch(error => {
        console.log('Could not play sound effect:', error)
      })
    } catch (error) {
      console.log('Error creating audio:', error)
    }
  }, [])

  const playClickSound = useCallback(() => {
    playSound('/sound/click.mp3', 0.6)
  }, [playSound])

  const playCameraSound = useCallback(() => {
    playSound('/sound/camera.mp3', 0.7)
  }, [playSound])

  return {
    playSound,
    playClickSound,
    playCameraSound
  }
}

export default useSoundEffects