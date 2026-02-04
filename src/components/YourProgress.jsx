import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Aperture, 
  MessageCircle, 
  Mail as MailIcon, 
  StickyNote,
  Wifi,
  Battery,
  Signal,
  ChevronLeft,
  Send,
  Trash2,
  Share,
  Heart,
  CheckCircle2,
  Circle,
  Info,
  MapPin,
  ChevronRight,
  Search,
  MoreHorizontal,
  Archive,
  Reply,
  Edit3
} from 'lucide-react'
import { format } from 'date-fns'
import useSoundEffects from '../hooks/useSoundEffects'

// System UI Components
const StatusBar = ({ color = 'white' }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 50,
      color: color,
      fontWeight: '500',
      pointerEvents: 'none'
    }}>
      <div style={{ width: '80px', paddingLeft: '8px', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>
        {format(time, 'h:mm')}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingRight: '8px' }}>
        <Signal size={16} fill="currentColor" />
        <Wifi size={16} />
        <Battery size={20} />
      </div>
    </div>
  )
}

const HomeBar = ({ onSwipeUp }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: '8px',
        zIndex: 50,
        cursor: 'pointer'
      }}
      onClick={onSwipeUp}
    >
      <div style={{
        width: '128px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '9999px',
        transition: 'background 0.2s',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }} />
    </div>
  )
}

const Notch = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      height: '28px',
      width: '128px',
      background: '#000',
      borderRadius: '0 0 24px 24px',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      <div style={{
        width: '64px',
        height: '16px',
        background: '#171717',
        borderRadius: '9999px',
        marginLeft: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'flex-end',
        paddingRight: '8px'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          background: 'rgba(59, 130, 246, 0.5)'
        }} />
      </div>
    </div>
  )
}

// App Icon Component
const AppIcon = ({ name, Icon, color, onClick, badge }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer'
    }} onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <motion.div
          whileTap={{ scale: 0.9 }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />
          <Icon size={30} strokeWidth={2} />
        </motion.div>
        
        {badge && badge > 0 && (
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#ef4444',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '700',
            minWidth: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            zIndex: 10,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            padding: '0 4px'
          }}>
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>
      
      {name && (
        <span style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#fff',
          letterSpacing: '0.5px',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          {name}
        </span>
      )}
    </div>
  )
}

const YourProgress = ({ isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeApp, setActiveApp] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [wallpaper] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')
  const [badges, setBadges] = useState({ npcLink: 0, report: 0, review: 0 })
  const { playSelectSound } = useSoundEffects()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsExpanded(true)
      calculateBadges()
    }
  }, [isOpen])

  // Calculate badge numbers based on user progress
  const calculateBadges = () => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (!savedUser) {
      setBadges({ npcLink: 1, report: 0, review: 0 }) // Only Glitch available by default
      return
    }

    const userData = JSON.parse(savedUser)
    
    // NPC Link badge: Count NPCs from regions with progress > 0
    // Regions: Desert, Jungle, Island, Glacier, Central City (Glitch always available)
    let availableNPCs = 1 // Glitch is always available
    
    // Check Desert progress (Alpha)
    const desertProgress = userData.desertProgress || 0
    if (desertProgress > 0) availableNPCs++
    
    // Check Jungle progress (Ranger Moss)
    const jungleProgress = userData.jungleProgress || 0
    if (jungleProgress > 0) availableNPCs++
    
    // Check Island progress (Sparky)
    const islandProgress = userData.islandProgress || 0
    if (islandProgress > 0) availableNPCs++
    
    // Check Glacier progress (Momo)
    const glacierProgress = userData.glacierProgress || 0
    if (glacierProgress > 0) availableNPCs++
    
    // Report badge: Count regions with 100% completion
    let completedRegions = 0
    if (desertProgress === 100) completedRegions++
    if (jungleProgress === 100) completedRegions++
    if (islandProgress === 100) completedRegions++
    if (glacierProgress === 100) completedRegions++
    
    // Review badge: Count total wrong answers
    const errorRecords = userData.errorRecords || []
    const wrongAnswersCount = errorRecords.length
    
    setBadges({
      npcLink: availableNPCs,
      report: completedRegions,
      review: wrongAnswersCount
    })
  }

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

  // App configurations with dynamic badges
  const apps = [
    { id: 'photos', name: 'Vision Log', icon: Aperture, color: 'linear-gradient(135deg, #fbbf24 0%, #f43f5e 50%, #a855f7 100%)' },
    { id: 'assistant', name: 'NPC Link', icon: MessageCircle, color: '#10b981', badge: badges.npcLink > 0 ? badges.npcLink : undefined },
    { id: 'mail', name: 'Report', icon: MailIcon, color: '#fbbf24', badge: badges.report > 0 ? badges.report : undefined },
    { id: 'notes', name: 'Review', icon: StickyNote, color: '#f97316', badge: badges.review > 0 ? badges.review : undefined },
  ]

  const dockApps = ['photos', 'assistant', 'mail']

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
        {/* Screen Content */}
        <div style={{
          ...styles.screen,
          backgroundImage: `url(${wallpaper})`
        }}>
          {/* Overlay for better text visibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            pointerEvents: 'none'
          }} />

          <StatusBar color={activeApp ? 'white' : 'white'} />
          <Notch />

          {/* Home Screen */}
          <div style={{
            position: 'absolute',
            inset: 0,
            paddingTop: '96px',
            paddingBottom: '96px',
            paddingLeft: '24px',
            paddingRight: '24px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.5s',
            transform: activeApp ? 'scale(0.95)' : 'scale(1)',
            opacity: activeApp ? 0 : 1
          }}>
            {/* Grid - 2 rows, 2 columns */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              rowGap: '32px',
              justifyItems: 'center',
              marginTop: '40px',
              maxWidth: '200px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {apps.map((app) => (
                <AppIcon 
                  key={app.id} 
                  name={app.name} 
                  Icon={app.icon} 
                  color={app.color} 
                  onClick={() => openApp(app.id)} 
                  badge={app.badge}
                />
              ))}
            </div>
            
            {/* Page Dots */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: '32px',
              gap: '8px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                background: '#fff'
              }} />
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.4)'
              }} />
            </div>

            {/* Dock */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '16px',
              right: '16px',
              height: '96px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: '0 16px'
            }}>
              {dockApps.map((dockAppId) => {
                const app = apps.find(a => a.id === dockAppId)
                if (!app) return null
                return (
                  <AppIcon 
                    key={app.id} 
                    name="" 
                    Icon={app.icon} 
                    color={app.color} 
                    onClick={() => openApp(app.id)} 
                    badge={app.badge}
                  />
                )
              })}
            </div>
          </div>

          {/* Active App View */}
          <AnimatePresence>
            {activeApp && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 30,
                  background: '#000',
                  overflow: 'hidden'
                }}
              >
                {renderApp()}
                <HomeBar onSwipeUp={closeApp} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Global Home Bar for Home Screen */}
          {!activeApp && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '8px',
              zIndex: 10
            }}>
              <div style={{
                width: '128px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '9999px'
              }} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Photos App - Complete iOS Implementation
const PhotosApp = ({ onClose }) => {
  const [photos, setPhotos] = useState([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [viewingPhotoId, setViewingPhotoId] = useState(null)

  useEffect(() => {
    // Load photos from localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const journal = userData.explorerJournal || []
      // Convert to format with id and additional fields
      const photosWithIds = journal.map((item, index) => ({
        id: index,
        url: item.photo,
        item: item.item || 'Unknown Item',
        type: item.type || 'uncertain', // healthy, unhealthy, uncertain
        timestamp: item.timestamp || Date.now(),
        date: 'Today',
        time: new Date(item.timestamp || Date.now()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        description: item.description || '',
        tags: item.tags || [],
        region: item.region || ''
      }))
      setPhotos(photosWithIds)
    }
  }, [])

  const toggleSelection = (id) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const deleteSelected = () => {
    setPhotos(photos.filter(p => !selectedIds.has(p.id)))
    setSelectedIds(new Set())
    setIsSelecting(false)
  }

  const deleteSingle = (id) => {
    setPhotos(photos.filter(p => p.id !== id))
    setViewingPhotoId(null)
  }

  const viewingPhoto = photos.find(p => p.id === viewingPhotoId)

  // Full Screen Detail View
  if (viewingPhoto) {
    return (
      <div style={{
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto'
      }}>
        {/* Top Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: '96px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.4))',
          zIndex: 20,
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '16px',
          paddingLeft: '16px',
          paddingRight: '16px',
          justifyContent: 'space-between',
          backdropFilter: 'blur(10px)'
        }}>
          <button 
            onClick={() => setViewingPhotoId(null)}
            style={{
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <ChevronLeft size={30} />
          </button>
          <div style={{
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}>
            {viewingPhoto.date} • {viewingPhoto.time}
          </div>
          <button style={{ opacity: 0 }}>
            <ChevronLeft size={30} />
          </button>
        </div>

        {/* Image Container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          minHeight: '300px'
        }}>
          <img 
            src={viewingPhoto.url} 
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
            alt="Detail"
          />
        </div>

        {/* Photo Information Card */}
        <div style={{
          padding: '16px',
          paddingBottom: '100px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {/* Item Name */}
            <div style={{
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Item</div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#fff'
              }}>{viewingPhoto.item || 'Unknown'}</div>
            </div>

            {/* Type/Classification */}
            {viewingPhoto.type && (
              <div style={{
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Classification</div>
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  background: viewingPhoto.type === 'healthy' ? 'rgba(34, 197, 94, 0.2)' : 
                              viewingPhoto.type === 'unhealthy' ? 'rgba(239, 68, 68, 0.2)' : 
                              'rgba(251, 191, 36, 0.2)',
                  color: viewingPhoto.type === 'healthy' ? '#4ade80' : 
                         viewingPhoto.type === 'unhealthy' ? '#f87171' : 
                         '#fbbf24',
                  border: `1px solid ${viewingPhoto.type === 'healthy' ? 'rgba(34, 197, 94, 0.3)' : 
                                       viewingPhoto.type === 'unhealthy' ? 'rgba(239, 68, 68, 0.3)' : 
                                       'rgba(251, 191, 36, 0.3)'}`
                }}>
                  {viewingPhoto.type === 'healthy' ? '✓ Healthy' : 
                   viewingPhoto.type === 'unhealthy' ? '✗ Unhealthy' : 
                   '? Uncertain'}
                </div>
              </div>
            )}

            {/* Description */}
            {viewingPhoto.description && (
              <div style={{
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Description</div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.5'
                }}>{viewingPhoto.description}</div>
              </div>
            )}

            {/* Tags */}
            {viewingPhoto.tags && viewingPhoto.tags.length > 0 && (
              <div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Tags</div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {viewingPhoto.tags.map((tag, index) => (
                    <div 
                      key={index}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: 'rgba(147, 51, 234, 0.2)',
                        color: '#c084fc',
                        border: '1px solid rgba(147, 51, 234, 0.3)'
                      }}
                    >
                      #{tag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location/Region */}
            {viewingPhoto.region && (
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>Location</div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>{viewingPhoto.region}</div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Share style={{ color: '#3b82f6' }} size={24} />
            <span style={{ fontSize: '10px', color: '#3b82f6' }}>Share</span>
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Heart style={{ color: '#fff' }} size={24} />
            <span style={{ fontSize: '10px', color: '#fff' }}>Like</span>
          </button>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Info style={{ color: '#fff' }} size={24} />
            <span style={{ fontSize: '10px', color: '#fff' }}>Info</span>
          </button>
          <button 
            onClick={() => deleteSingle(viewingPhoto.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 style={{ color: '#ef4444' }} size={24} />
            <span style={{ fontSize: '10px', color: '#ef4444' }}>Delete</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: '100%',
      background: '#000',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        paddingTop: '48px',
        paddingBottom: '8px',
        paddingLeft: '16px',
        paddingRight: '16px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(40px)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h1 style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#fff',
            margin: 0
          }}>Vision Log</h1>
        </div>
        <button 
          onClick={() => {
            setIsSelecting(!isSelecting)
            setSelectedIds(new Set())
          }}
          style={{
            color: '#3b82f6',
            fontSize: '16px',
            fontWeight: '500',
            padding: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {isSelecting ? 'Cancel' : 'Select'}
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {photos.length === 0 ? (
          <div style={{
            height: '256px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af'
          }}>
            <p>No Photos</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px',
            paddingBottom: '96px'
          }}>
            {photos.map((photo) => {
              const isSelected = selectedIds.has(photo.id)
              return (
                <div 
                  key={photo.id} 
                  style={{
                    aspectRatio: '1',
                    background: '#1f2937',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (isSelecting) {
                      toggleSelection(photo.id)
                    } else {
                      setViewingPhotoId(photo.id)
                    }
                  }}
                >
                  <img 
                    src={photo.url} 
                    alt="Gallery Item" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'all 0.3s',
                      transform: isSelecting && isSelected ? 'scale(0.9)' : 'scale(1)',
                      opacity: isSelecting && isSelected ? 0.8 : 1
                    }}
                    loading="lazy" 
                  />
                  {isSelecting && (
                    <div style={{
                      position: 'absolute',
                      bottom: '4px',
                      right: '4px'
                    }}>
                      {isSelected ? (
                        <CheckCircle2 style={{ color: '#3b82f6', fill: '#fff' }} size={20} />
                      ) : (
                        <Circle style={{ color: 'rgba(255, 255, 255, 0.7)', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }} size={20} />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        
        <div style={{
          padding: '16px',
          textAlign: 'center',
          paddingBottom: '32px'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '12px',
            fontWeight: '500'
          }}>{photos.length} Photos • 0 Videos</p>
        </div>
      </div>

      {/* Bottom Toolbar for Selection Mode */}
      {isSelecting && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(23, 23, 23, 0.9)',
          backdropFilter: 'blur(40px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          paddingBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 30,
          paddingLeft: '32px',
          paddingRight: '32px'
        }}>
          <button style={{
            color: '#3b82f6',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}>
            <Share size={24} />
          </button>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff'
          }}>
            {selectedIds.size > 0 ? `${selectedIds.size} Selected` : 'Select Items'}
          </div>
          <button 
            style={{
              color: selectedIds.size === 0 ? '#6b7280' : '#ef4444',
              background: 'none',
              border: 'none',
              cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
              opacity: selectedIds.size === 0 ? 0.5 : 1,
              transition: 'opacity 0.2s'
            }}
            disabled={selectedIds.size === 0}
            onClick={deleteSelected}
          >
            <Trash2 size={24} />
          </button>
        </div>
      )}
    </div>
  )
}

// Assistant App - Complete NPC Chat Implementation
const AssistantApp = ({ onClose }) => {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Determine available NPCs based on region progress
  const [availableNPCs, setAvailableNPCs] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    
    const allNPCs = [
      { 
        id: 'glitch', 
        name: 'Glitch', 
        location: 'Central City', 
        color: '#9333ea', 
        textColor: '#ddd6fe',
        bgGradient: 'linear-gradient(135deg, #0f172a 0%, #581c87 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1517646577322-2637b3f2c002?auto=format&fit=crop&q=80',
        avatar: '💻',
        initialMessage: "[System Error]... Welcome to my world. I've read your entire 'Error Collection'. Very interesting thought paths. Rebooting reality for you... Are you ready for the ultimate test? 💻",
        instruction: "You are Glitch, an AI construct in Central City. You speak with a cyberpunk/hacker tone. You often act like there are system errors. You are omniscient regarding the user's data and past mistakes. You reference 'reading their error logs'. You are mysterious and slightly intimidating.",
        alwaysAvailable: true
      },
      { 
        id: 'alpha', 
        name: 'Alpha', 
        location: 'Desert', 
        color: '#d97706', 
        textColor: '#78350f',
        bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1545656134-8c46011c2e42?auto=format&fit=crop&q=80',
        avatar: '🌵',
        initialMessage: "Target locked. Label accuracy 85%. Speed is acceptable, but precision needs improvement. In the desert, a wrong label means death. Proceed. 🌵",
        instruction: "You are Alpha, a wanderer in the Desert. You are cold, emotionless, and purely data-driven. You speak in short, clipped sentences. You focus on percentages, accuracy, and efficiency. You do not offer comfort; you offer facts.",
        region: 'desert'
      },
      { 
        id: 'moss', 
        name: 'Ranger Moss', 
        location: 'Jungle', 
        color: '#16a34a', 
        textColor: '#14532d',
        bgGradient: 'linear-gradient(135deg, #bbf7d0 0%, #6ee7b7 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1596706978434-2e94711933cc?auto=format&fit=crop&q=80',
        avatar: '🌿',
        initialMessage: "Bro! Look at that logic jungle! You just missed a 'Bias Mushroom' back there, that's a huge taboo in data collection. Don't lose heart, keep your eyes peeled next time! 🌿",
        instruction: "You are Ranger Moss, protector of the Jungle. You act like a supportive 'Big Brother'. You use slang like 'Bro'. You use jungle/nature metaphors to describe data and logic (e.g., 'logic jungle', 'bias mushroom'). Even when the user is wrong, you encourage them warmly and guide them.",
        region: 'jungle'
      },
      { 
        id: 'sparky', 
        name: 'Sparky', 
        location: 'Island', 
        color: '#f97316', 
        textColor: '#7c2d12',
        bgGradient: 'linear-gradient(135deg, #fed7aa 0%, #fef08a 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1596484552993-9c8cb05d15a5?auto=format&fit=crop&q=80',
        avatar: '🏝️',
        initialMessage: "OMG! You actually spotted that the 'Fake Captain' was an AI? 😱 How did you train those eagle eyes? Come play another round with me, if you win I've got a huge gift pack for you! ✨",
        instruction: "You are Sparky, living on a tropical Island. You are extremely high-energy, use lots of emojis (✨, 😱, 🔥), and treat everything like a game. You are very enthusiastic and get incredibly excited when the user identifies AI or solves puzzles correctly. You are a gamer/surfer archetype.",
        region: 'island'
      },
      { 
        id: 'momo', 
        name: 'Momo', 
        location: 'Glacier', 
        color: '#0891b2', 
        textColor: '#164e63',
        bgGradient: 'linear-gradient(135deg, #cffafe 0%, #bfdbfe 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1478562853135-c3c9e3ef7905?auto=format&fit=crop&q=80',
        avatar: '❄️',
        initialMessage: "Privacy is the last bastion of civilization. You showed respect for 'Alex Chen's' personal data in the last verdict, which is good. But the law allows for no deviation. Stay vigilant. ❄️",
        instruction: "You are Momo, living in the Glacier. You focus on ethics, values, and legal precision. You speak formally and use sophisticated vocabulary. You view privacy as sacred. Even when praising, remain cautious and stern. Focus on the user's ethical tendencies.",
        region: 'glacier'
      }
    ]

    if (!savedUser) {
      setAvailableNPCs(allNPCs.filter(npc => npc.alwaysAvailable))
      return
    }

    const userData = JSON.parse(savedUser)
    const filtered = allNPCs.filter(npc => {
      if (npc.alwaysAvailable) return true
      const progressKey = `${npc.region}Progress`
      const progress = userData[progressKey] || 0
      return progress > 0
    })

    setAvailableNPCs(filtered)
  }, [])

  const handleSelectNPC = (npc) => {
    setSelectedNPC(npc)
    setMessages([{ 
      id: 'init', 
      role: 'model', 
      text: npc.initialMessage 
    }])
  }

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !selectedNPC) return

    const userMsg = { id: Date.now().toString(), role: 'user', text: inputText }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsLoading(true)

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))

    // Import the service dynamically
    const { sendMessageToGemini } = await import('../services/geminiService')
    const responseText = await sendMessageToGemini(userMsg.text, history, selectedNPC.instruction)

    const modelMsg = { id: (Date.now() + 1).toString(), role: 'model', text: responseText }
    setMessages(prev => [...prev, modelMsg])
    setIsLoading(false)
  }

  // NPC Selection Screen
  if (!selectedNPC) {
    return (
      <div style={{
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{
          paddingTop: '56px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '16px'
        }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '8px'
          }}>Choose your Companion</h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '15px'
          }}>Select a character to start chatting.</p>
        </div>
        <div style={{
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {availableNPCs.length === 0 ? (
            <div style={{
              padding: '48px 16px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <p>Complete missions to unlock NPCs!</p>
            </div>
          ) : (
            availableNPCs.map(npc => (
            <div 
              key={npc.id}
              onClick={() => handleSelectNPC(npc)}
              style={{
                padding: '16px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transform: 'scale(1)',
                transition: 'transform 0.2s',
                background: npc.bgGradient,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                zIndex: 10
              }}>
                {npc.avatar}
              </div>
              <div style={{ flex: 1, zIndex: 10 }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: npc.id === 'glitch' ? '#fff' : '#111827'
                }}>{npc.name}</h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: 0.8,
                  color: npc.id === 'glitch' ? '#bfdbfe' : '#1f2937'
                }}>
                  <MapPin size={12} style={{ marginRight: '4px' }} />
                  {npc.location}
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    )
  }

  // Chat Screen
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: selectedNPC.id === 'glitch' ? '#0f172a' : '#f3f4f6'
    }}>
      {/* Header */}
      <div style={{
        height: '96px',
        paddingTop: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
        background: selectedNPC.id === 'glitch' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: selectedNPC.id === 'glitch' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }}>
        <button 
          onClick={() => setSelectedNPC(null)}
          style={{
            marginRight: '8px',
            padding: '8px',
            borderRadius: '9999px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
            color: selectedNPC.id === 'glitch' ? '#fff' : '#000'
          }}
        >
          <ChevronLeft />
        </button>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          fontSize: '24px',
          background: 'rgba(128, 128, 128, 0.2)',
          backdropFilter: 'blur(4px)'
        }}>
          {selectedNPC.avatar}
        </div>
        <div style={{ color: selectedNPC.id === 'glitch' ? '#fff' : '#000' }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '700',
            lineHeight: 1,
            margin: 0
          }}>{selectedNPC.name}</h1>
          <span style={{
            fontSize: '12px',
            opacity: 0.7,
            fontWeight: '500'
          }}>{selectedNPC.location}</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: selectedNPC.id === 'glitch' ? '#0f172a' : '#f3f4f6'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '15px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                background: msg.role === 'user' ? selectedNPC.color : (selectedNPC.id === 'glitch' ? '#1e293b' : '#fff'),
                color: msg.role === 'user' ? '#fff' : (selectedNPC.id === 'glitch' ? '#fff' : '#1f2937'),
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: selectedNPC.id === 'glitch' ? '#1e293b' : '#fff',
              borderRadius: '16px',
              borderBottomLeftRadius: '4px',
              padding: '12px 16px',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                background: '#6b7280',
                borderRadius: '9999px',
                animation: 'bounce 1s infinite'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                background: '#6b7280',
                borderRadius: '9999px',
                animation: 'bounce 1s infinite 0.1s'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                background: '#6b7280',
                borderRadius: '9999px',
                animation: 'bounce 1s infinite 0.2s'
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        background: selectedNPC.id === 'glitch' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(40px)',
        borderTop: selectedNPC.id === 'glitch' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        paddingBottom: '32px'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedNPC.name}...`}
            style={{
              width: '100%',
              background: selectedNPC.id === 'glitch' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: selectedNPC.id === 'glitch' ? '#fff' : '#000',
              borderRadius: '9999px',
              padding: '12px 16px',
              paddingRight: '48px',
              outline: 'none',
              border: selectedNPC.id === 'glitch' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              padding: '8px',
              borderRadius: '9999px',
              color: '#fff',
              background: selectedNPC.color,
              border: 'none',
              cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !inputText.trim() ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Mail App - Complete iOS Implementation
const MailApp = ({ onClose }) => {
  const [mails, setMails] = useState([])
  const [selectedMail, setSelectedMail] = useState(null)

  useEffect(() => {
    // Load error records from localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const errorRecords = userData.errorRecords || []
      // Format for mail display
      const formattedMails = errorRecords.map((record, index) => ({
        id: index.toString(),
        sender: 'System',
        subject: record.subject || 'Error Report',
        preview: record.preview || record.content?.substring(0, 50) + '...',
        body: record.content || 'No details available.',
        time: new Date(record.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        unread: true,
        color: '#6b7280'
      }))
      setMails(formattedMails)
    }
  }, [])

  if (selectedMail) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#000'
      }}>
        {/* Detail Header */}
        <div style={{
          paddingTop: '40px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '16px',
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <button 
            onClick={() => setSelectedMail(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#3b82f6',
              fontSize: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={24} />
            <span>Report</span>
          </button>
          <div style={{ display: 'flex', gap: '16px', color: '#3b82f6' }}>
            <ChevronLeft size={24} style={{ color: '#4b5563' }} />
            <ChevronRight size={24} style={{ color: '#4b5563' }} />
          </div>
        </div>

        {/* Detail Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px'
          }}>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '8px',
                lineHeight: '1.2'
              }}>{selectedMail.subject}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  background: selectedMail.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '700'
                }}>
                  {selectedMail.sender[0]}
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#fff'
                  }}>{selectedMail.sender}</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>To: Me</div>
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '12px',
              color: '#9ca3af'
            }}>{selectedMail.time}</div>
          </div>
          
          <div style={{
            color: '#d1d5db',
            fontSize: '16px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>
            {selectedMail.body}
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div style={{
          height: '80px',
          background: 'rgba(23, 23, 23, 0.9)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '16px'
        }}>
          <Trash2 style={{ color: '#3b82f6' }} size={22} />
          <Archive style={{ color: '#3b82f6' }} size={22} />
          <Reply style={{ color: '#3b82f6' }} size={22} />
          <Edit3 style={{ color: '#3b82f6' }} size={22} />
        </div>
      </div>
    )
  }

  // Inbox View
  return (
    <div style={{
      height: '100%',
      background: '#000',
      overflowY: 'auto'
    }}>
      <div style={{
        paddingTop: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '8px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#fff',
            margin: 0
          }}>Report</h1>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '9999px',
            background: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MoreHorizontal size={20} style={{ color: '#3b82f6' }} />
          </div>
        </div>
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '8px',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            <Search size={16} style={{ color: '#9ca3af' }} />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            style={{
              width: '100%',
              background: '#1f2937',
              borderRadius: '8px',
              padding: '6px 12px',
              paddingLeft: '32px',
              fontSize: '14px',
              outline: 'none',
              color: '#fff',
              border: 'none'
            }}
          />
        </div>
      </div>
      
      <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6b7280',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>Today</div>
        <div style={{
          background: '#000',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {mails.length === 0 ? (
            <div style={{
              padding: '48px 16px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <p>No error reports yet. Keep up the good work!</p>
            </div>
          ) : (
            mails.map((mail) => (
              <div 
                key={mail.id} 
                onClick={() => setSelectedMail(mail)}
                style={{
                  padding: '12px 0',
                  display: 'flex',
                  gap: '12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {mail.unread && (
                  <div style={{
                    marginTop: '8px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '9999px',
                    background: '#3b82f6',
                    flexShrink: 0
                  }} />
                )}
                <div style={{ flex: 1, paddingLeft: mail.unread ? 0 : '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '2px'
                  }}>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: mail.unread ? '700' : '600',
                      color: '#fff',
                      margin: 0
                    }}>{mail.sender}</h3>
                    <span style={{
                      fontSize: '14px',
                      color: '#9ca3af'
                    }}>{mail.time}</span>
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#d1d5db',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{mail.subject}</div>
                  <div style={{
                    fontSize: '15px',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4'
                  }}>{mail.preview}</div>
                </div>
                <ChevronRight size={16} style={{ color: '#4b5563', alignSelf: 'center' }} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Notes App - Complete iOS Implementation
const NotesApp = ({ onClose }) => {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    // Load congratulation messages from localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const congratulations = userData.congratulations || []
      // Format for notes display
      const formattedNotes = congratulations.map((congrat, index) => ({
        id: index.toString(),
        title: congrat.title || 'Achievement Unlocked',
        preview: congrat.preview || congrat.content?.substring(0, 50) + '...',
        content: congrat.content || 'Congratulations on your progress!',
        timestamp: congrat.timestamp || Date.now()
      }))
      setNotes(formattedNotes)
    }
  }, [])

  if (selectedNote) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#fef3c7'
      }}>
        <div style={{
          paddingTop: '48px',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#d97706'
        }}>
          <button 
            onClick={() => setSelectedNote(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: '500',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#d97706'
            }}
          >
            <ChevronLeft size={24} /> Review
          </button>
          <Share size={20} />
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '16px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>{selectedNote.title}</h1>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginBottom: '24px'
          }}>
            {new Date(selectedNote.timestamp).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </p>
          <div style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#1f2937',
            whiteSpace: 'pre-line',
            fontFamily: 'monospace'
          }}>
            {selectedNote.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: '100%',
      background: '#000',
      overflowY: 'auto'
    }}>
      <div style={{
        paddingTop: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '8px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#fff',
            margin: 0
          }}>Review</h1>
        </div>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search" 
            style={{
              width: '100%',
              background: '#1f2937',
              borderRadius: '8px',
              padding: '8px 12px',
              paddingLeft: '32px',
              fontSize: '14px',
              outline: 'none',
              color: '#fff',
              border: 'none'
            }}
          />
        </div>
      </div>

      <div style={{
        paddingLeft: '16px',
        paddingRight: '16px',
        marginTop: '16px'
      }}>
        {notes.length === 0 ? (
          <div style={{
            padding: '48px 16px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p>Complete missions to receive congratulations!</p>
          </div>
        ) : (
          <div style={{
            background: '#1f2937',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            {notes.map((note, index) => (
              <div 
                key={note.id}
                style={{
                  padding: '16px',
                  borderBottom: index < notes.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onClick={() => setSelectedNote(note)}
              >
                <h3 style={{
                  fontWeight: '700',
                  color: '#fff',
                  margin: 0,
                  marginBottom: '4px'
                }}>{note.title}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '4px',
                  marginBottom: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>{note.preview}</p>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  margin: 0
                }}>
                  {new Date(note.timestamp).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

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
    bottom: '80px',
    left: '5%',
    width: '280px',
    height: '75vh',
    maxHeight: '600px',
    background: '#000',
    borderRadius: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
    border: '6px solid #1f1f1f',
    overflow: 'hidden',
    transformOrigin: 'bottom left',
  },
  screen: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
}

export default YourProgress
