import React, { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'

const ExplorerJournal = ({ isOpen, onClose }) => {
  const [savedPhotos, setSavedPhotos] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const { playSelectSound } = useSoundEffects()
  
  const photosPerPage = 2 // Show 2 photos per page (one on each side)
  
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
  
  const totalPages = Math.ceil(savedPhotos.length / photosPerPage)
  const startIndex = currentPage * photosPerPage
  const currentPhotos = savedPhotos.slice(startIndex, startIndex + photosPerPage)
  
  const handleNextPage = () => {
    playSelectSound()
    if (currentPage < totalPages - 1) {
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
      {/* Journal Book */}
      <div style={styles.journalBook}>
        {/* Close Button */}
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
        
        {/* Journal Title */}
        <div style={styles.journalTitle}>
          <span style={styles.titleText}>Explorer's Journal</span>
        </div>
        
        {/* Spiral Binding */}
        <div style={styles.spiralBinding}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={styles.spiralRing} />
          ))}
        </div>
        
        {/* Journal Pages */}
        <div style={styles.pagesContainer}>
          {/* Left Page */}
          <div style={styles.page}>
            {currentPhotos[0] ? (
              <div style={styles.photoCard}>
                <div style={styles.cardHeader}>#Object detected</div>
                <div style={styles.cardSubtitle}>Look what I spotted!</div>
                
                <div style={styles.photoContainer}>
                  <img 
                    src={currentPhotos[0].photo} 
                    alt="Captured object"
                    style={styles.photo}
                  />
                  <div style={styles.timestamp}>
                    Captured: {currentPhotos[0].timestamp}
                  </div>
                </div>
                
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>Item</div>
                  <div style={styles.infoLabel}>Type</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoValue}>{currentPhotos[0].item}</div>
                  <div style={styles.infoValueType}>{currentPhotos[0].type}</div>
                </div>
              </div>
            ) : (
              <div style={styles.emptyPage}>
                <div style={styles.emptyText}>No photos yet</div>
              </div>
            )}
          </div>
          
          {/* Right Page */}
          <div style={styles.page}>
            {currentPhotos[1] ? (
              <div style={styles.photoCard}>
                <div style={styles.cardHeader}>#Object detected</div>
                <div style={styles.cardSubtitle}>Look what I spotted!</div>
                
                <div style={styles.photoContainer}>
                  <img 
                    src={currentPhotos[1].photo} 
                    alt="Captured object"
                    style={styles.photo}
                  />
                  <div style={styles.timestamp}>
                    Captured: {currentPhotos[1].timestamp}
                  </div>
                </div>
                
                <div style={styles.infoRow}>
                  <div style={styles.infoLabel}>Item</div>
                  <div style={styles.infoLabel}>Type</div>
                </div>
                <div style={styles.infoRow}>
                  <div style={styles.infoValue}>{currentPhotos[1].item}</div>
                  <div style={styles.infoValueType}>{currentPhotos[1].type}</div>
                </div>
              </div>
            ) : (
              <div style={styles.emptyPage}>
                <div style={styles.emptyText}>
                  {savedPhotos.length === 0 ? 'Start exploring!' : ''}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        {savedPhotos.length > 0 && (
          <div style={styles.navigation}>
            <button
              style={{
                ...styles.navButton,
                opacity: currentPage === 0 ? 0.3 : 1,
                cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
              }}
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              onMouseOver={(e) => {
                if (currentPage > 0) e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              ← PREV
            </button>
            
            <div style={styles.pageIndicator}>
              Page {currentPage + 1} / {Math.max(1, totalPages)}
            </div>
            
            <button
              style={{
                ...styles.navButton,
                opacity: currentPage >= totalPages - 1 ? 0.3 : 1,
                cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
              }}
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              onMouseOver={(e) => {
                if (currentPage < totalPages - 1) e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              NEXT →
            </button>
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
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  journalBook: {
    position: 'relative',
    width: '90%',
    maxWidth: '1200px',
    height: '80vh',
    background: 'linear-gradient(to bottom, #8B7355 0%, #6B5344 100%)',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 2px 10px rgba(255, 255, 255, 0.1)',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '2px solid #fff',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    zIndex: 10,
  },
  journalTitle: {
    background: '#4A3728',
    borderRadius: '12px',
    padding: '15px 30px',
    marginBottom: '30px',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  },
  titleText: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#F5E6D3',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  spiralBinding: {
    position: 'absolute',
    left: '50%',
    top: '80px',
    bottom: '80px',
    width: '40px',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 5,
  },
  spiralRing: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '4px solid #2C2416',
    background: 'linear-gradient(135deg, #4A3728 0%, #2C2416 100%)',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
  },
  pagesContainer: {
    flex: 1,
    display: 'flex',
    gap: '60px',
    marginBottom: '20px',
  },
  page: {
    flex: 1,
    background: '#FFF9F0',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    overflow: 'auto',
  },
  photoCard: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#f89303',
    marginBottom: '5px',
  },
  cardSubtitle: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  photoContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
    border: '3px dashed #fff',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#f5f5f5',
  },
  photo: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  timestamp: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '11px',
    color: '#fff',
    background: 'rgba(0, 0, 0, 0.6)',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  infoLabel: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
  },
  infoValue: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  infoValueType: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#f89303',
  },
  emptyPage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '18px',
    color: '#999',
    fontStyle: 'italic',
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '20px',
  },
  navButton: {
    padding: '12px 24px',
    background: '#4A3728',
    border: '2px solid #F5E6D3',
    borderRadius: '8px',
    color: '#F5E6D3',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pageIndicator: {
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '16px',
    color: '#F5E6D3',
    fontWeight: 'bold',
  },
}

export default ExplorerJournal
