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
      {/* Main Container - Bottom Left */}
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
        
        {/* Card Container with Ring Background */}
        <div style={styles.cardContainer}>
          {/* Ring Background */}
          <img src="/icon/ring.png" alt="Ring" style={styles.ringBackground} />
          
          {/* Photo Card */}
          {currentPhoto ? (
            <div style={styles.photoCard}>
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
            </div>
          ) : (
            <div style={styles.emptyCard}>
              <p style={styles.emptyText}>No photos yet</p>
              <p style={styles.emptySubtext}>Start exploring!</p>
            </div>
          )}
        </div>
        
        {/* Navigation Arrows */}
        {totalPhotos > 0 && (
          <>
            <button
              style={{
                ...styles.navButton,
                ...styles.navButtonLeft,
                opacity: currentPage === 0 ? 0.3 : 1,
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              }}
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              onMouseOver={(e) => {
                if (currentPage !== 0) {
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
                opacity: currentPage === totalPhotos - 1 ? 0.3 : 1,
                cursor: currentPage === totalPhotos - 1 ? 'not-allowed' : 'pointer',
              }}
              onClick={handleNextPage}
              disabled={currentPage === totalPhotos - 1}
              onMouseOver={(e) => {
                if (currentPage !== totalPhotos - 1) {
                  e.currentTarget.style.transform = 'scale(1.1)'
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <img src="/icon/backward.png" alt="Next" style={styles.navIcon} />
            </button>
          </>
        )}
        
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
    height: '50%',
    background: '#8B7355',
    margin: '20px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    padding: '30px',
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
    marginBottom: '20px',
  },
  titleIcon: {
    width: '40px',
    height: '40px',
  },
  title: {
    fontFamily: "'Kaushan Script', cursive",
    fontSize: '32px',
    color: '#FFF9F0',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  cardContainer: {
    position: 'relative',
    flex: 1,
    background: '#FFF9F0',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ringBackground: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    objectFit: 'contain',
    opacity: 0.15,
    pointerEvents: 'none',
    zIndex: 0,
  },
  photoCard: {
    position: 'relative',
    width: '90%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
  },
  cardHeader: {
    marginBottom: '10px',
  },
  cardTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    color: '#333',
    display: 'block',
  },
  cardSubtitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '12px',
    color: '#666',
    display: 'block',
  },
  photoWrapper: {
    position: 'relative',
    flex: 1,
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.3,
    pointerEvents: 'none',
    zIndex: 0,
  },
  photo: {
    position: 'relative',
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
  timestamp: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '10px',
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.7)',
    padding: '3px 8px',
    borderRadius: '4px',
    zIndex: 2,
  },
  infoContainer: {
    marginTop: 'auto',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  infoLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '11px',
    color: '#666',
    fontWeight: 600,
  },
  itemValue: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '13px',
    fontWeight: 700,
    color: '#333',
  },
  typeValue: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '13px',
    fontWeight: 700,
    color: '#f89303',
  },
  emptyCard: {
    position: 'relative',
    width: '90%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  emptyText: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '18px',
    color: '#999',
    marginBottom: '10px',
  },
  emptySubtext: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    color: '#bbb',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '50px',
    height: '50px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
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
    left: '-70px',
  },
  navButtonRight: {
    right: '-70px',
  },
  navIcon: {
    width: '30px',
    height: '30px',
    objectFit: 'contain',
  },
  pageCounter: {
    position: 'absolute',
    bottom: '-40px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'Kaushan Script', cursive",
    fontSize: '20px',
    color: '#FFF9F0',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
}

export default ExplorerJournal
