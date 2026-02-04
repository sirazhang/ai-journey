import { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  Share, 
  Heart, 
  Info, 
  Trash2, 
  CheckCircle2, 
  Circle 
} from 'lucide-react'

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

export default PhotosApp
