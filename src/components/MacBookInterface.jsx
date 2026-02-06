import { useState } from 'react'
import { X, Circle, Minus, Square } from 'lucide-react'

const MacBookInterface = ({ onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  }))

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out',
    },
    macbook: {
      width: '90vw',
      height: '85vh',
      maxWidth: '1400px',
      maxHeight: '900px',
      background: 'linear-gradient(135deg, #866ac6 0%, #9071b5 40%, #392a68 100%)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    menuBar: {
      height: '28px',
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    menuLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    menuRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    menuText: {
      color: '#fff',
      fontSize: '13px',
      fontWeight: 600,
      fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    desktop: {
      flex: 1,
      position: 'relative',
      padding: '20px',
      overflow: 'hidden',
    },
    desktopIcons: {
      position: 'absolute',
      top: '60px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    desktopIcon: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      width: '80px',
    },
    iconImage: {
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      transition: 'transform 0.2s',
    },
    iconLabel: {
      color: '#fff',
      fontSize: '12px',
      fontWeight: 600,
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
    },
    window: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      height: '70%',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    windowHeader: {
      height: '40px',
      background: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '8px',
    },
    windowButton: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
    },
    windowTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: '13px',
      fontWeight: 600,
      color: '#333',
    },
    windowContent: {
      flex: 1,
      padding: '32px',
      overflowY: 'auto',
      background: '#fff',
    },
    welcomeText: {
      fontSize: '32px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '16px',
      textAlign: 'center',
    },
    descriptionText: {
      fontSize: '16px',
      color: '#666',
      lineHeight: 1.6,
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
    },
    dock: {
      position: 'absolute',
      bottom: '8px',
      left: '50%',
      transform: 'translateX(-50%)',
      height: '68px',
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      borderRadius: '16px',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    dockIcon: {
      width: '52px',
      height: '52px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    },
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.macbook} onClick={(e) => e.stopPropagation()}>
        {/* Menu Bar */}
        <div style={styles.menuBar}>
          <div style={styles.menuLeft}>
            <span style={styles.menuText}>🍎</span>
            <span style={styles.menuText}>Workbench</span>
          </div>
          <div style={styles.menuRight}>
            <span style={styles.menuText}>{currentTime}</span>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '4px 8px',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Desktop */}
        <div style={styles.desktop}>
          {/* Desktop Icons */}
          <div style={styles.desktopIcons}>
            <div style={styles.desktopIcon}>
              <div 
                style={styles.iconImage}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span style={styles.iconLabel}>Workbench</span>
            </div>
          </div>

          {/* Window */}
          <div style={styles.window}>
            {/* Window Header */}
            <div style={styles.windowHeader}>
              <button 
                style={{...styles.windowButton, background: '#ff5f57'}}
                onClick={onClose}
              />
              <button style={{...styles.windowButton, background: '#ffbd2e'}} />
              <button style={{...styles.windowButton, background: '#28ca42'}} />
              <div style={styles.windowTitle}>Glitch's Workbench</div>
            </div>

            {/* Window Content */}
            <div style={styles.windowContent}>
              <div style={styles.welcomeText}>
                Welcome to Glitch's Workbench! 🚀
              </div>
              <div style={styles.descriptionText}>
                This is where I work on AI models, analyze data, and help learners understand 
                the fascinating world of artificial intelligence. Here, you can see how I process 
                information, make decisions, and learn from interactions.
                <br /><br />
                <strong>Coming Soon:</strong> Interactive demos, real-time AI processing visualization, 
                and hands-on experiments!
              </div>
            </div>
          </div>

          {/* Dock */}
          <div style={styles.dock}>
            <div 
              style={styles.dockIcon}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div 
              style={{...styles.dockIcon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MacBookInterface
