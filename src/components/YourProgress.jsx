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

  const handleToggle = () => {
    playSelectSound()
    if (isExpanded) {
      handleClose()
    }
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
    { id: 'photos', name: 'Vision Log', icon: Aperture, color: 'linear-gradient(135deg, #fbbf24 0%, #f43f5e 50%, #a855f7 100%)', iconSize: 26 },
    { id: 'assistant', name: 'NPC Link', icon: MessageCircle, color: '#10b981', badge: 3, iconSize: 26 },
    { id: 'mail', name: 'Report', icon: MailIcon, color: '#fbbf24', badge: 5, iconSize: 26 },
    { id: 'notes', name: 'Review', icon: StickyNote, color: '#f97316', iconSize: 26 },
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
    <div style={styles.overlay} onClick={handleToggle}>
      <motion.div
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ 
          scale: isExpanded ? 1 : 0.2, 
          opacity: isExpanded ? 1 : 0,
        }}
        exit={{ scale: 0.2, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={styles.phoneFrame}
        onClick={(e) => e.stopPropagation()}
      >
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
                      <app.icon size={app.iconSize || 26} color="#fff" />
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
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    zIndex: 10000,
    pointerEvents: 'auto',
  },
  phoneFrame: {
    position: 'absolute',
    bottom: '80px', // 定位在按钮上方
    left: '5%',
    width: '280px', // 缩小宽度
    height: '75vh', // 75%视口高度
    maxHeight: '600px', // 最大高度限制
    background: '#000',
    borderRadius: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
    border: '6px solid #1f1f1f',
    overflow: 'hidden',
    transformOrigin: 'bottom left', // 从左下角展开
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
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 15px',
    color: '#fff',
    fontSize: '11px',
    fontWeight: '600',
    zIndex: 100,
  },
  statusTime: {
    flex: 1,
    fontSize: '11px',
  },
  notch: {
    width: '120px',
    height: '25px',
    background: '#000',
    borderRadius: '0 0 15px 15px',
  },
  statusIcons: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '4px',
    fontSize: '11px',
  },
  homeScreen: {
    width: '100%',
    height: '100%',
    padding: '45px 15px 15px',
    display: 'flex',
    flexDirection: 'column',
  },
  timeDisplay: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: '30px',
  },
  timeDate: {
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '6px',
  },
  timeLarge: {
    fontSize: '56px',
    fontWeight: '700',
    lineHeight: 1,
  },
  appGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    padding: '15px 0',
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
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '6px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#ff3b30',
    color: '#fff',
    borderRadius: '8px',
    padding: '1px 5px',
    fontSize: '9px',
    fontWeight: '700',
    border: '2px solid #000',
  },
  appName: {
    color: '#fff',
    fontSize: '9px',
    textAlign: 'center',
    fontWeight: '500',
  },
  homeBar: {
    position: 'absolute',
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '2px',
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
    padding: '45px 15px 15px',
    background: '#f5f5f7',
    borderBottom: '1px solid #e5e5e7',
  },
  appTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1d1d1f',
    margin: 0,
  },
  appBody: {
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
  },
  placeholder: {
    textAlign: 'center',
    color: '#86868b',
    fontSize: '13px',
    marginTop: '30px',
  },
}

export default YourProgress
