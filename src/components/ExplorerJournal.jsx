import { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'

const ExplorerJournal = ({ isOpen, onClose }) => {
  const [savedPhotos, setSavedPhotos] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const { playSelectSound } = useSoundEffects()
  
  console.log('ExplorerJournal render:', { isOpen, savedPhotosCount: savedPhotos.length })
  
  // Load saved photos from localStorage
  useEffect(() => {
    if (isOpen) {
      console.log('ExplorerJournal opened, loading photos...')
      const savedUser = localStorage.getItem('aiJourneyUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        const journal = userData.explorerJournal || []
        console.log('Loaded journal:', journal)
        setSavedPhotos(journal)
        setCurrentPage(0)
      }
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const totalPhotos = savedPhotos.length
  const currentPhoto = savedPhotos[currentPage]
  
  const handleNextPage = () => {
    playSelectSound()
    if (currentPage < totalPhotos - 1) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const handlePrevPage = () => {
    playSelectSound()
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const handleClose = () => {
    playSelectSound()
    onClose()
  }
  
  return (
    <div style={styles.overlay}>
      {/* Main Container - Bottom Left with Purple Background */}
      <div style={styles.container}>
        {/* Close Button - Top Right */}
        <button
          style={styles.closeButton}
          onClick={handleClose}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          ✕
        </button>
        
        {/* Title with Icon */}
        <div style={styles.titleContainer}>
          <img src="/icon/journal.svg" alt="Journal" style={styles.titleIcon} />
          <h1 style={styles.title}>Explorer's Journal</h1>
        </div>
        
        {/* Inner Card with Shadow Effect */}
        <div style={styles.shadowCard}>
          <div style={styles.innerCard}>
            {/* Left Side - Ring Icon */}
            <div style={styles.leftSide}>
              <img src="/icon/ring.png" alt="Ring" style={styles.ringIcon} />
            </div>
            
            {/* Right Side - Photo and Info */}
            <div style={styles.rightSide}>
              {currentPhoto ? (
                <>
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <span style={styles.cardTitle}>#Object detected</span>
                    <span style={styles.cardSubtitle}>Look what I spotted!</span>
                  </div>
                  
                  {/* Photo with Grid Background */}
                  <div style={styles.photoWrapper}>
                    <img src="/icon/grid.png" alt="Grid" style={styles.gridBackground} />
                    <img 
                      src={currentPhoto.photo} 
                      alt="Captured object"
                      style={styles.photo}
                    />
                    <div style={styles.timestamp}>
                      {new Date(currentPhoto.timestamp).toLocaleString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                  
                  {/* Item and Type Info */}
                  <div style={styles.infoContainer}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Item</span>
                      <span style={styles.infoLabel}>Type</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.itemValue}>{currentPhoto.item}</span>
                      <span style={styles.typeValue}>{currentPhoto.type}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={styles.emptyState}>
                  <p style={styles.emptyText}>No photos yet</p>
                  <p style={styles.emptySubtext}>Start exploring!</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Navigation Arrows - Always show */}
        <button
          style={{
            ...styles.navButton,
            ...styles.navButtonLeft,
            opacity: totalPhotos === 0 || currentPage === 0 ? 0.3 : 1,
            cursor: totalPhotos === 0 || currentPage === 0 ? 'not-allowed' : 'pointer',
          }}
          onClick={handlePrevPage}
          disabled={totalPhotos === 0 || currentPage === 0}
          onMouseOver={(e) => {
            if (totalPhotos > 0 && currentPage !== 0) {
              e.currentTarget.style.transform = 'scale(1.1)'
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <img src="/icon/forward.png" alt="Previous" style={styles.navIcon} />
        </button>
        
        <button
          style={{
            ...styles.navButton,
            ...styles.navButtonRight,
            opacity: totalPhotos === 0 || currentPage === totalPhotos - 1 ? 0.3 : 1,
            cursor: totalPhotos === 0 || currentPage === totalPhotos - 1 ? 'not-allowed' : 'pointer',
          }}
          onClick={handleNextPage}
          disabled={totalPhotos === 0 || currentPage === totalPhotos - 1}
          onMouseOver={(e) => {
            if (totalPhotos > 0 && currentPage !== totalPhotos - 1) {
              e.currentTarget.style.transform = 'scale(1.1)'
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <img src="/icon/backward.png" alt="Next" style={styles.navIcon} />
        </button>
        
        {/* Page Counter */}
        <div style={styles.pageCounter}>
          {totalPhotos > 0 ? `${currentPage + 1}/${totalPhotos}` : '0/0'}
        </div>
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
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    zIndex: 10000,
  },
  container: {
    position: 'relative',
    width: '33.33%',
    minWidth: '400px',
    height: '50%',
    minHeight: '400px',
    background: '#8b78bb',
    margin: '40px 40px 80px 40px', // 增加底部和右侧边距
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.4)',
    border: '2px solid #fff',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    zIndex: 10,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '15px',
  },
  titleIcon: {
    width: '35px',
    height: '35px',
    filter: 'brightness(0) invert(1)',
  },
  title: {
    fontFamily: "'Kaushan Script', cursive",
    fontSize: '28px',
    color: '#fff',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  shadowCard: {
    position: 'relative',
    flex: 1,
    marginBottom: '10px',
  },
  innerCard: {
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#FFF9F0',
    borderRadius: '12px',
    boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.3)',
    padding: '15px',
    display: 'flex',
    gap: '15px',
  },
  leftSide: {
    width: '30%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '2px solid #e0e0e0',
    padding: '10px',
  },
  ringIcon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    opacity: 0.8,
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: '8px',
  },
  cardTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    color: '#333',
    display: 'block',
    lineHeight: 1.2,
  },
  cardSubtitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '11px',
    color: '#666',
    display: 'block',
    lineHeight: 1.2,
  },
  photoWrapper: {
    position: 'relative',
    flex: 1,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: '8px',
  },
  gridBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.4,
    pointerEvents: 'none',
    zIndex: 0,
  },
  photo: {
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '6px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 1,
  },
  timestamp: {
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '9px',
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '2px 6px',
    borderRadius: '3px',
    zIndex: 2,
  },
  infoContainer: {
    marginTop: 'auto',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '3px',
  },
  infoLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '10px',
    color: '#666',
    fontWeight: 600,
  },
  itemValue: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '12px',
    fontWeight: 700,
    color: '#333',
  },
  typeValue: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '12px',
    fontWeight: 700,
    color: '#f89303',
  },
  emptyState: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    color: '#999',
    marginBottom: '8px',
  },
  emptySubtext: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '12px',
    color: '#bbb',
  },
  navButton: {
    position: 'absolute',
    top: '55%', // 调整到卡片中心位置
    transform: 'translateY(-50%)',
    width: '50px',
    height: '50px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #8b78bb',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s',
    zIndex: 10,
  },
  navButtonLeft: {
    left: '-25px', // 更靠近容器
  },
  navButtonRight: {
    right: '-25px', // 更靠近容器
  },
  navIcon: {
    width: '30px',
    height: '30px',
    objectFit: 'contain',
  },
  pageCounter: {
    textAlign: 'center',
    fontFamily: "'Kaushan Script', cursive",
    fontSize: '24px',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    marginTop: '10px',
  },
}

export default ExplorerJournal
