import { useState, useEffect } from 'react'
import { generateFactStatement } from '../../services/workbenchService'
import { Loader2, CheckCircle, XCircle, Search, MapPin, RefreshCw, Trophy } from 'lucide-react'

const CATEGORIES = [
  'COMMON_SENSE',
  'NEWS_CREDIBILITY',
  'PLACE_EXISTENCE',
  'LOCATION_ACCURACY',
  'DISTANCE_REACHABILITY'
]

const CATEGORY_NAMES = {
  'COMMON_SENSE': 'Common Sense',
  'NEWS_CREDIBILITY': 'News Credibility',
  'PLACE_EXISTENCE': 'Place Existence',
  'LOCATION_ACCURACY': 'Location Accuracy',
  'DISTANCE_REACHABILITY': 'Distance/Reachability'
}

const WorkbenchApp = () => {
  const [stage, setStage] = useState('LOADING')
  const [category, setCategory] = useState('COMMON_SENSE')
  const [currentFact, setCurrentFact] = useState(null)
  const [userGuess, setUserGuess] = useState(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    loadRandomFact()
  }, [])

  const loadRandomFact = async () => {
    const randomCat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]
    setCategory(randomCat)
    setStage('LOADING')
    await loadNewFact(randomCat)
  }

  const loadNewFact = async (cat) => {
    try {
      const fact = await generateFactStatement(cat)
      setCurrentFact(fact)
      setUserGuess(null)
      setStage('GAME')
    } catch (e) {
      console.error(e)
      setStage('GAME')
    }
  }

  const handleGuess = (guess) => {
    setUserGuess(guess)
    setStage('FEEDBACK')
    if (guess === currentFact?.isTrue) {
      setScore(s => s + 10)
    }
  }

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f5f5f5',
      fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    header: {
      padding: '16px 20px',
      background: '#fff',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    categoryLabel: {
      fontSize: '11px',
      fontWeight: 700,
      color: '#999',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    categoryName: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#667eea',
      background: '#f0f4ff',
      padding: '4px 12px',
      borderRadius: '6px',
    },
    scoreBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#fff9e6',
      padding: '6px 16px',
      borderRadius: '20px',
    },
    scoreText: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#f59e0b',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      overflowY: 'auto',
    },
    statementCard: {
      maxWidth: '700px',
      width: '100%',
      background: '#fff',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f0f0f0',
      marginBottom: '32px',
    },
    statementLabel: {
      fontSize: '12px',
      fontWeight: 700,
      color: '#999',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '16px',
      textAlign: 'center',
    },
    statementText: {
      fontSize: '24px',
      lineHeight: 1.5,
      color: '#333',
      textAlign: 'center',
      fontWeight: 500,
    },
    hintsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '32px',
      maxWidth: '700px',
    },
    hintCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: '#fff',
      padding: '10px 16px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
      fontSize: '13px',
      color: '#666',
    },
    buttonsContainer: {
      display: 'flex',
      gap: '20px',
      maxWidth: '500px',
      width: '100%',
    },
    button: {
      flex: 1,
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 700,
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    trueButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    falseButton: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
    feedbackContainer: {
      textAlign: 'center',
      maxWidth: '600px',
    },
    feedbackIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
    feedbackTitle: {
      fontSize: '32px',
      fontWeight: 700,
      marginBottom: '16px',
      color: '#333',
    },
    explanationCard: {
      background: '#fff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      marginTop: '16px',
      marginBottom: '32px',
    },
    explanationLabel: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '12px',
    },
    explanationText: {
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#666',
    },
    nextButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 32px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
      transition: 'transform 0.2s',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    },
    loadingText: {
      fontSize: '14px',
      color: '#999',
      fontWeight: 500,
    },
  }

  if (stage === 'LOADING') {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.loadingContainer}>
            <Loader2 size={48} color="#667eea" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={styles.loadingText}>Generating Verification Task...</div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'FEEDBACK') {
    const isCorrect = userGuess === currentFact?.isTrue
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.categoryBadge}>
            <span style={styles.categoryLabel}>Mission Complete</span>
          </div>
          <div style={styles.scoreBadge}>
            <Trophy size={16} color="#f59e0b" />
            <span style={styles.scoreText}>{score} pts</span>
          </div>
        </div>
        <div style={styles.content}>
          <div style={styles.feedbackContainer}>
            <div style={{
              ...styles.feedbackIcon,
              background: isCorrect ? '#d1fae5' : '#fee2e2',
              color: isCorrect ? '#10b981' : '#ef4444',
            }}>
              {isCorrect ? <CheckCircle size={40} /> : <XCircle size={40} />}
            </div>
            <div style={styles.feedbackTitle}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </div>
            <div style={styles.explanationCard}>
              <div style={styles.explanationLabel}>Analysis:</div>
              <div style={styles.explanationText}>{currentFact?.explanation}</div>
            </div>
            <button
              style={styles.nextButton}
              onClick={loadRandomFact}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              <RefreshCw size={16} />
              <span>Next Case</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.header}>
        <div style={styles.categoryBadge}>
          <span style={styles.categoryLabel}>Current Mission</span>
          <span style={styles.categoryName}>{CATEGORY_NAMES[category]}</span>
        </div>
        <div style={styles.scoreBadge}>
          <Trophy size={16} color="#f59e0b" />
          <span style={styles.scoreText}>{score} pts</span>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.statementCard}>
          <div style={styles.statementLabel}>Verify this Statement</div>
          <div style={styles.statementText}>"{currentFact?.statement}"</div>
        </div>
        <div style={styles.hintsContainer}>
          <div style={styles.hintCard}>
            <Search size={16} color="#3b82f6" />
            <span>Hint: <strong>{currentFact?.searchHint}</strong></span>
          </div>
          {(category === 'PLACE_EXISTENCE' || category === 'LOCATION_ACCURACY' || category === 'DISTANCE_REACHABILITY') && (
            <div style={styles.hintCard}>
              <MapPin size={16} color="#10b981" />
              <span>Use the <strong>Maps</strong> app</span>
            </div>
          )}
        </div>
        <div style={styles.buttonsContainer}>
          <button
            style={{...styles.button, ...styles.trueButton}}
            onClick={() => handleGuess(true)}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            TRUE
          </button>
          <button
            style={{...styles.button, ...styles.falseButton}}
            onClick={() => handleGuess(false)}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            FALSE
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkbenchApp
