// Simple volume manager using event emitter pattern
class VolumeManager {
  constructor() {
    this.volume = 85 // Default volume (0-100)
    this.isMuted = false
    this.listeners = new Set()
    this.audioElements = new Set()
    
    // Load saved volume
    const savedVolume = localStorage.getItem('systemVolume')
    if (savedVolume) {
      this.volume = parseInt(savedVolume)
    }
  }

  // Register an audio element
  registerAudio(audioElement) {
    if (audioElement) {
      this.audioElements.add(audioElement)
      this.updateAudioVolume(audioElement)
    }
  }

  // Unregister an audio element
  unregisterAudio(audioElement) {
    if (audioElement) {
      this.audioElements.delete(audioElement)
    }
  }

  // Set volume (0-100)
  setVolume(newVolume) {
    this.volume = Math.max(0, Math.min(100, newVolume))
    localStorage.setItem('systemVolume', this.volume.toString())
    this.updateAllAudioVolumes()
    this.notifyListeners()
  }

  // Get current volume
  getVolume() {
    return this.volume
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted
    this.updateAllAudioVolumes()
    this.notifyListeners()
  }

  // Get mute status
  isMutedStatus() {
    return this.isMuted
  }

  // Update volume for a specific audio element
  updateAudioVolume(audioElement) {
    if (audioElement) {
      // Convert 0-100 to 0-1, and apply mute
      const actualVolume = this.isMuted ? 0 : this.volume / 100
      audioElement.volume = actualVolume
    }
  }

  // Update all registered audio elements
  updateAllAudioVolumes() {
    this.audioElements.forEach(audioElement => {
      this.updateAudioVolume(audioElement)
    })
  }

  // Subscribe to volume changes
  subscribe(callback) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        volume: this.volume,
        isMuted: this.isMuted
      })
    })
  }
}

// Create singleton instance
const volumeManager = new VolumeManager()

export default volumeManager
