import { useState } from 'react'
import { performMapSearch } from '../../services/workbenchService'
import { MapPin, Loader2, Navigation } from 'lucide-react'

const MapsApp = () => {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    const mapResult = await performMapSearch(query)
    setResult(mapResult)
    setIsLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    searchBar: {
      padding: '12px 16px',
      background: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    searchInput: {
      flex: 1,
      padding: '10px 16px',
      borderRadius: '20px',
      border: '1px solid #ddd',
      fontSize: '14px',
      outline: 'none',
      background: '#fff',
    },
    searchButton: {
      padding: '10px 24px',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'transform 0.2s',
    },
    content: {
      flex: 1,
      padding: '24px',
      overflowY: 'auto',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#999',
      gap: '16px',
    },
    emptyIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: '16px',
      fontWeight: 500,
    },
    resultContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    answerCard: {
      background: '#f0fdf4',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #bbf7d0',
    },
    answerTitle: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#10b981',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    answerText: {
      fontSize: '15px',
      lineHeight: 1.7,
      color: '#374151',
      whiteSpace: 'pre-line',
    },
    placesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    placesTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '8px',
    },
    placeCard: {
      background: '#fff',
      padding: '16px',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    placeName: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '6px',
    },
    placeInfo: {
      fontSize: '13px',
      color: '#666',
      lineHeight: 1.5,
    },
    placeRating: {
      display: 'inline-block',
      background: '#fef3c7',
      color: '#f59e0b',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 600,
      marginTop: '6px',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '16px',
    },
    loadingText: {
      fontSize: '14px',
      color: '#999',
      fontWeight: 500,
    },
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.searchBar}>
        <MapPin size={20} color="#999" />
        <input
          type="text"
          placeholder="Search for places, routes, or locations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.searchInput}
        />
        <button
          onClick={handleSearch}
          style={styles.searchButton}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Search'}
        </button>
      </div>
      <div style={styles.content}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={48} color="#10b981" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={styles.loadingText}>Searching maps...</div>
          </div>
        ) : result ? (
          <div style={styles.resultContainer}>
            <div style={styles.answerCard}>
              <div style={styles.answerTitle}>
                <Navigation size={16} />
                Map Information
              </div>
              <div style={styles.answerText}>{result.answer}</div>
            </div>
            {result.places && result.places.length > 0 && (
              <div style={styles.placesContainer}>
                <div style={styles.placesTitle}>Places Found:</div>
                {result.places.map((place, index) => (
                  <div key={index} style={styles.placeCard}>
                    <div style={styles.placeName}>{place.name}</div>
                    <div style={styles.placeInfo}>{place.address}</div>
                    {place.rating && (
                      <span style={styles.placeRating}>⭐ {place.rating}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <MapPin size={32} color="#ccc" />
            </div>
            <div style={styles.emptyText}>Search for locations, routes, or places</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapsApp
