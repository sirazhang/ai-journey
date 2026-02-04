import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Aperture, 
  MessageCircle, 
  Mail as MailIcon, 
  StickyNote,
  X
} from 'lucide-react'
import { format } from 'date-fns'
import useSoundEffects from '../hooks/useSoundEffects'

const YourProgress = ({ isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeApp, setActiveApp] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { playSelectSound } = useSoundEffects()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsExpanded(true)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleClose = () => {
    playSelectSound()
    setIsExpanded(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const openApp = (appId) => {
    playSelectSound()
    setActiveApp(appId)
  }

  const closeApp = () => {
    playSelectSound()
    setActiveApp(null)
  }

  // App configurations
  const apps = [
    { id: 'photos', name: 'Vision Log', icon: Aperture, color: 'linear-gradient(135deg, #fbbf24 0%, #f43f5e 50%, #a855f7 100%)' },
    { id: 'assistant', name: 'NPC Link', icon: MessageCircle, color: '#10b981', badge: 3 },
    { id: 'mail', name: 'Report', icon: MailIcon, color: '#fbbf24', badge: 5 },
    { id: 'notes', name: 'Review', icon: StickyNote, color: '#f97316' },
  ]

  const renderApp = () => {
    switch (activeApp) {
      case 'photos':
        return <PhotosApp onClose={closeApp} />
      case 'assistant':
        return <AssistantApp onClose={closeApp} />
      case 'mail':
        return <MailApp onClose={closeApp} />
      case 'notes':
        return <NotesApp onClose={closeApp} />
      default:
        return null
    }
  }

  return (
    <div style={styles.overlay}>
      <motion.div
        initial={{ scale: 0.3, opacity: 0, x: 300, y: 300 }}
        animate={{ 
          scale: isExpanded ? 1 : 0.3, 
          opacity: isExpanded ? 1 : 0,
          x: isExpanded ? 0 : 300,
          y: isExpanded ? 0 : 300
        }}
        exit={{ scale: 0.3, opacity: 0, x: 300, y: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={styles.phoneFrame}
      >
        {/* Close button */}
        <button style={styles.closeButton} onClick={handleClose}>
          <X size={20} color="#fff" />
        </button>

        {/* Screen */}
        <div style={styles.screen}>
          {/* Status Bar */}
          <div style={styles.statusBar}>
            <span style={styles.statusTime}>{format(currentTime, 'h:mm')}</span>
            <div style={styles.notch} />
            <div style={styles.statusIcons}>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Home Screen */}
          {!activeApp && (
            <div style={styles.homeScreen}>
              {/* Time Display */}
              <div style={styles.timeDisplay}>
                <div style={styles.timeDate}>{format(currentTime, 'EEEE, MMMM d')}</div>
                <div style={styles.timeLarge}>{format(currentTime, 'h:mm')}</div>
              </div>

              {/* App Grid */}
              <div style={styles.appGrid}>
                {apps.map((app) => (
                  <div key={app.id} style={styles.appIconContainer} onClick={() => openApp(app.id)}>
                    <div style={{
                      ...styles.appIcon,
                      background: app.color
                    }}>
                      <app.icon size={32} color="#fff" />
                      {app.badge && (
                        <div style={styles.badge}>{app.badge}</div>
                      )}
                    </div>
                    <div style={styles.appName}>{app.name}</div>
                  </div>
                ))}
              </div>

              {/* Home Bar */}
              <div style={styles.homeBar} />
            </div>
          )}

          {/* Active App */}
          <AnimatePresence>
            {activeApp && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={styles.appContainer}
              >
                {renderApp()}
                <div style={styles.homeBar} onClick={closeApp} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

// Placeholder app components (to be implemented)
const PhotosApp = ({ onClose }) => (
  <div style={styles.appContent}>
    <div style={styles.appHeader}>
      <h2 style={styles.appTitle}>Vision Log</h2>
    </div>
    <div style={styles.appBody}>
      <p style={styles.placeholder}>Photos from Desert & Jungle missions will appear here</p>
    </div>
  </div>
)

const AssistantApp = ({ onClose }) => (
  <div style={styles.appContent}>
    <div style={styles.appHeader}>
      <h2 style={styles.appTitle}>NPC Link</h2>
    </div>
    <div style={styles.appBody}>
      <p style={styles.placeholder}>Chat with NPCs using Gemini AI</p>
    </div>
  </div>
)

const MailApp = ({ onClose }) => (
  <div style={styles.appContent}>
    <div style={styles.appHeader}>
      <h2 style={styles.appTitle}>Report</h2>
    </div>
    <div style={styles.appBody}>
      <p style={styles.placeholder}>Quiz errors and Glitch conversations</p>
    </div>
  </div>
)

const NotesApp = ({ onClose }) => (
  <div style={styles.appContent}>
    <div style={styles.appHeader}>
      <h2 style={styles.appTitle}>Review</h2>
    </div>
    <div style={styles.appBody}>
      <p style={styles.placeholder}>Congratulations messages for completed missions</p>
    </div>
  </div>
)

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  phoneFrame: {
    position: 'relative',
    width: '375px',
    height: '812px',
    background: '#000',
    borderRadius: '50px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
    border: '8px solid #1f1f1f',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: '-50px',
    right: '0',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10001,
    transition: 'all 0.2s',
  },
  screen: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    zIndex: 100,
  },
  statusTime: {
    flex: 1,
  },
  notch: {
    width: '150px',
    height: '30px',
    background: '#000',
    borderRadius: '0 0 20px 20px',
  },
  statusIcons: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '5px',
  },
  homeScreen: {
    width: '100%',
    height: '100%',
    padding: '60px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
  },
  timeDisplay: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: '40px',
  },
  timeDate: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  timeLarge: {
    fontSize: '72px',
    fontWeight: '700',
    lineHeight: 1,
  },
  appGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    padding: '20px 0',
  },
  appIconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  appIcon: {
    position: 'relative',
    width: '60px',
    height: '60px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  badge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: '#ff3b30',
    color: '#fff',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: '700',
    border: '2px solid #000',
  },
  appName: {
    color: '#fff',
    fontSize: '11px',
    textAlign: 'center',
    fontWeight: '500',
  },
  homeBar: {
    position: 'absolute',
    bottom: '8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '5px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '3px',
    cursor: 'pointer',
  },
  appContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: '#fff',
    zIndex: 200,
  },
  appContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  appHeader: {
    padding: '60px 20px 20px',
    background: '#f5f5f7',
    borderBottom: '1px solid #e5e5e7',
  },
  appTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1d1d1f',
    margin: 0,
  },
  appBody: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
  },
  placeholder: {
    textAlign: 'center',
    color: '#86868b',
    fontSize: '16px',
    marginTop: '40px',
  },
}

export default YourProgress
