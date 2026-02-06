import { useState, useEffect } from 'react'
import WorkbenchApp from './workbench/WorkbenchApp'
import BrowserApp from './workbench/BrowserApp'
import MapsApp from './workbench/MapsApp'
import CalendarApp from './workbench/CalendarApp'
import { FileText, Globe, MapPin, Calendar } from 'lucide-react'

const MacBookInterface = ({ onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  }))
  const [openApps, setOpenApps] = useState(['workbench'])
  const [activeApp, setActiveApp] = useState('workbench')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const toggleApp = (id) => {
    if (openApps.includes(id)) {
      setActiveApp(id)
    } else {
      setOpenApps([...openApps, id])
      setActiveApp(id)
    }
  }

  const closeApp = (id) => {
    setOpenApps(openApps.filter(app => app !== id))
    if (activeApp === id) {
      setActiveApp(openApps.length > 1 ? openApps[openApps.length - 2] : null)
    }
  }

  const getZIndex = (id) => {
    return activeApp === id ? 50 : 10
  }

  const apps = {
    workbench: {
      id: 'workbench',
      name: 'Workbench',
      icon: FileText,
      color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      component: WorkbenchApp
    },
    browser: {
      id: 'browser',
      name: 'Safari',
      icon: Globe,
      color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      component: BrowserApp
    },
    maps: {
      id: 'maps',
      name: 'Maps',
      icon: MapPin,
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      component: MapsApp
    },
    calendar: {
      id: 'calendar',
      name: 'Calendar',
      icon: Calendar,
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      component: CalendarApp
    }
  }

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
      background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 30%, #fef3c7 70%, #fde68a 100%)',
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
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '4px 8px',
      transition: 'opacity 0.2s',
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
      zIndex: 1,
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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      transition: 'transform 0.2s',
      position: 'relative',
      overflow: 'hidden',
    },
    iconGradient: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)',
      opacity: 0.5,
    },
    iconLabel: {
      color: '#fff',
      fontSize: '12px',
      fontWeight: 600,
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
    },
    windowsContainer: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
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
      pointerEvents: 'auto',
    },
    windowHeader: {
      height: '40px',
      background: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '8px',
      cursor: 'move',
    },
    windowButton: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
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
      overflow: 'hidden',
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
      zIndex: 100,
    },
    dockIcon: {
      width: '52px',
      height: '52px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      position: 'relative',
    },
    dockIndicator: {
      position: 'absolute',
      bottom: '-6px',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: '#fff',
    },
  }

  const DesktopIcon = ({ app }) => {
    const Icon = app.icon
    return (
      <div style={styles.desktopIcon} onClick={() => toggleApp(app.id)}>
        <div 
          style={{...styles.iconImage, background: app.color}}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={styles.iconGradient} />
          <Icon size={32} color="#fff" style={{ position: 'relative', zIndex: 1 }} />
        </div>
        <span style={styles.iconLabel}>{app.name}</span>
      </div>
    )
  }

  const Window = ({ app }) => {
    const AppComponent = app.component
    return (
      <div 
        style={{...styles.window, zIndex: getZIndex(app.id)}}
        onClick={() => setActiveApp(app.id)}
      >
        <div style={styles.windowHeader}>
          <button 
            style={{...styles.windowButton, background: '#ff5f57'}}
            onClick={(e) => {
              e.stopPropagation()
              closeApp(app.id)
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          />
          <button 
            style={{...styles.windowButton, background: '#ffbd2e'}}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          />
          <button 
            style={{...styles.windowButton, background: '#28ca42'}}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          />
          <div style={styles.windowTitle}>{app.name}</div>
        </div>
        <div style={styles.windowContent}>
          <AppComponent />
        </div>
      </div>
    )
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
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
              style={styles.closeButton}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Desktop */}
        <div style={styles.desktop}>
          {/* Desktop Icons */}
          <div style={styles.desktopIcons}>
            {Object.values(apps).map((app) => (
              <DesktopIcon key={app.id} app={app} />
            ))}
          </div>

          {/* Windows */}
          <div style={styles.windowsContainer}>
            {openApps.map((appId) => (
              <Window key={appId} app={apps[appId]} />
            ))}
          </div>

          {/* Dock */}
          <div style={styles.dock}>
            {Object.values(apps).map((app) => {
              const Icon = app.icon
              const isOpen = openApps.includes(app.id)
              return (
                <div 
                  key={app.id}
                  style={{...styles.dockIcon, background: app.color}}
                  onClick={() => toggleApp(app.id)}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Icon size={28} color="#fff" />
                  {isOpen && <div style={styles.dockIndicator} />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MacBookInterface
