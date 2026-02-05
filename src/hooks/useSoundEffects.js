import { useCallback } from 'react'
import volumeManager from '../utils/volumeManager'

const useSoundEffects = () => {
  const playSound = useCallback((soundFile, baseVolume = 0.5) => {
    try {
      const audio = new Audio(soundFile)
      
      // Register with volume manager to apply system volume
      volumeManager.registerAudio(audio)
      
      // Apply base volume multiplier (the audio element's volume is already set by volumeManager)
      // We need to adjust it by the base volume
      const systemVolume = volumeManager.isMutedStatus() ? 0 : volumeManager.getVolume() / 100
      audio.volume = systemVolume * baseVolume
      
      audio.play().catch(error => {
        console.log('Could not play sound effect:', error)
      })
      
      // Unregister after playing
      audio.addEventListener('ended', () => {
        volumeManager.unregisterAudio(audio)
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

  const playStampSound = useCallback(() => {
    playSound('/sound/stamp.mp3', 0.8)
  }, [playSound])

  const playSafeSound = useCallback(() => {
    playSound('/sound/correct.wav', 0.7)
  }, [playSound])

  const playAlertSound = useCallback(() => {
    playSound('/sound/alert.mp3', 0.7)
  }, [playSound])

  const playCorrectSound = useCallback(() => {
    playSound('/sound/correct.wav', 0.7)
  }, [playSound])

  const playWrongSound = useCallback(() => {
    playSound('/sound/wrong.mp3', 0.7)
  }, [playSound])

  const playMarkSound = useCallback(() => {
    playSound('/sound/mark.wav', 0.7)
  }, [playSound])

  const playSelectSound = useCallback(() => {
    playSound('/sound/select.mp3', 0.6)
  }, [playSound])

  const playLoadingSound = useCallback(() => {
    playSound('/sound/loading.wav', 0.7)
  }, [playSound])

  return {
    playSound,
    playClickSound,
    playCameraSound,
    playStampSound,
    playSafeSound,
    playAlertSound,
    playCorrectSound,
    playWrongSound,
    playMarkSound,
    playSelectSound,
    playLoadingSound
  }
}

export default useSoundEffects