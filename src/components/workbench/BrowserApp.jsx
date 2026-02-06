import { useState } from 'react'
import { performWebSearch } from '../../services/workbenchService'
import { Search, Loader2, Globe } from 'lucide-react'

const BrowserApp = () => {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    const searchResult = await performWebSearch(query)
    setResult(searchResult)
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
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
    resultCard: {
      background: '#f9fafb',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
    },
    resultTitle: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#3b82f6',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    resultText: {
      fontSize: '15px',
      lineHeight: 1.7,
      color: '#374151',
      whiteSpace: 'pre-line',
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
        <Search size={20} color="#999" />
        <input
          type="text"
          placeholder="Search the web..."
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
          {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'Go'}
        </button>
      </div>
      <div style={styles.content}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={48} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={styles.loadingText}>Searching the web...</div>
          </div>
        ) : result ? (
          <div style={styles.resultCard}>
            <div style={styles.resultTitle}>
              <Globe size={16} />
              Search Results
            </div>
            <div style={styles.resultText}>{result}</div>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Search size={32} color="#ccc" />
            </div>
            <div style={styles.emptyText}>Enter a search query to find information</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowserApp
