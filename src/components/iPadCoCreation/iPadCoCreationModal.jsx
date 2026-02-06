import React, { useState, useRef, useEffect } from 'react'
import CanvasBoard from './CanvasBoard'
import { generateIdea, polishStory, generateMagicImage } from '../../services/geminiService'

// Add CSS animation for spinner
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  if (!document.querySelector('style[data-ipad-animations]')) {
    style.setAttribute('data-ipad-animations', 'true')
    document.head.appendChild(style)
  }
}

const COLORS = [
  '#1e293b', // Black/Slate
  '#ef4444', // Red
  '#10b981', // Green
  '#3b82f6', // Blue
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#f472b6', // Pink
  '#eab308', // Yellow
]

const STICKERS = [
  { type: 'star', label: 'Star', emoji: '⭐' },
  { type: 'heart', label: 'Heart', emoji: '❤️' },
  { type: 'cloud', label: 'Cloud', emoji: '☁️' },
  { type: 'moon', label: 'Moon', emoji: '🌙' },
  { type: 'flower', label: 'Flower', emoji: '🌸' },
  { type: 'diamond', label: 'Gem', emoji: '💎' },
]

const STAGES = {
  START: 'START',
  DRAWING: 'DRAWING',
  GENERATING: 'GENERATING',
  RESULT: 'RESULT'
}

// Helper function to create composite image
const createCompositeImage = async (aiImageUrl, storyText) => {
  const img = new Image()
  img.crossOrigin = "anonymous"
  img.src = aiImageUrl
  await new Promise(resolve => img.onload = resolve)
  
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  const textAreaHeight = 200
  const padding = 40
  canvas.width = img.width
  canvas.height = img.height + textAreaHeight
  
  // Draw background
  ctx.fillStyle = '#FFF8E1'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw AI image
  ctx.drawImage(img, 0, 0)
  
  // Draw separator line
  ctx.strokeStyle = '#D7CCC8'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(padding, img.height + 10)
  ctx.lineTo(canvas.width - padding, img.height + 10)
  ctx.stroke()
  
  // Draw story text (wrapped)
  ctx.fillStyle = '#5D4037'
  ctx.font = 'bold 32px "Fredoka", sans-serif'
  ctx.textAlign = 'center'
  
  const maxWidth = canvas.width - (padding * 2)
  const words = storyText.split(' ')
  let line = ''
  const lines = []
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line)
      line = words[n] + ' '
    } else {
      line = testLine
    }
  }
  lines.push(line)
  
  const lineHeight = 40
  const startY = img.height + (textAreaHeight / 2) - ((lines.length - 1) * lineHeight / 2)
  
  lines.forEach((l, i) => {
    ctx.fillText(l, canvas.width / 2, startY + (i * lineHeight))
  })
  
  return canvas.toDataURL('image/png')
}

const iPadCoCreationModal = ({ onClose, onSave }) => {
  const [stage, setStage] = useState(STAGES.START)
  const [idea, setIdea] = useState(null)
  const [userStory, setUserStory] = useState('')
  const [magicInput, setMagicInput] = useState('')
  const [magicStory, setMagicStory] = useState('')
  const [generatedImage, setGeneratedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [drawingTool, setDrawingTool] = useState({ mode: 'brush', color: '#1e293b', size: 5 })
  const [activeTab, setActiveTab] = useState('colors')
  const [currentTime, setCurrentTime] = useState('')
  
  const canvasRef = useRef(null)

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  // Initialize with an idea on start
  useEffect(() => {
    const initIdea = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const newIdea = await generateIdea()
        setIdea(newIdea)
        setUserStory(newIdea.storyStarter + " ")
        setStage(STAGES.DRAWING)
      } catch (err) {
        setError("Oops! The idea fairy is sleeping. Try again!")
      } finally {
        setIsLoading(false)
      }
    }
    initIdea()
  }, [])

  const handleGenerateMagic = async () => {
    if (!canvasRef.current) return
    const drawing = canvasRef.current.getCanvasData()
    if (!drawing) {
      setError('Please draw something first!')
      return
    }

    setIsLoading(true)
    setStage(STAGES.GENERATING)
    setError(null)

    try {
      const [resultImage, resultStory] = await Promise.all([
        generateMagicImage(drawing, userStory, magicInput),
        polishStory(userStory).catch(() => userStory)
      ])

      setGeneratedImage(resultImage)
      setMagicStory(resultStory)
      setStage(STAGES.RESULT)
    } catch (err) {
      setError("Magic spell failed! Please try again.")
      setStage(STAGES.DRAWING)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!generatedImage || !magicStory) return
    
    try {
      const compositeImage = await createCompositeImage(generatedImage, magicStory)
      onSave(compositeImage, magicStory)
      onClose()
    } catch (err) {
      setError("Failed to save. Please try again.")
    }
  }

  const handleReset = () => {
    setStage(STAGES.START)
    setIdea(null)
    setUserStory('')
    setMagicInput('')
    setMagicStory('')
    setGeneratedImage(null)
    setError(null)
    // Re-initialize
    const initIdea = async () => {
      setIsLoading(true)
      try {
        const newIdea = await generateIdea()
        setIdea(newIdea)
        setUserStory(newIdea.storyStarter + " ")
        setStage(STAGES.DRAWING)
      } catch (err) {
        setError("Oops! Try again!")
      } finally {
        setIsLoading(false)
      }
    }
    initIdea()
  }

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.ipadDevice} onClick={(e) => e.stopPropagation()}>
        <div style={styles.ipadScreen}>
          {/* Status Bar */}
          <div style={styles.statusBar}>
            <div>{currentTime}</div>
            <div></div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>📶</span>
              <span>🔋</span>
            </div>
          </div>

          {/* App Header */}
          <div style={styles.appHeader}>
            <div style={styles.appTitle}>
              <div style={styles.appIcon}>🚀</div>
              <h1 style={styles.appTitleText}>NEXUS ISLAND</h1>
            </div>
            {idea && (
              <button style={styles.resetButton} onClick={handleReset} title="Start New Story">
                ↻
              </button>
            )}
          </div>

          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Error Message */}
            {error && (
              <div style={styles.errorMessage}>{error}</div>
            )}

            {/* Loading State */}
            {!idea && (
              <div style={styles.loadingContainer}>
                {isLoading ? (
                  <>
                    <div style={styles.spinner}></div>
                    <h2 style={styles.loadingText}>Dreaming up a new world...</h2>
                  </>
                ) : error ? (
                  <div style={{ textAlign: 'center' }}>
                    <p style={styles.errorText}>Something went wrong.</p>
                    <button style={styles.retryButton} onClick={handleReset}>Try Again</button>
                  </div>
                ) : null}
              </div>
            )}

            {/* Workspace - will add in next part */}
            {idea && (
              <div style={{ width: '100%', height: '100%', display: 'flex', gap: '20px' }}>
                {/* Left Sidebar */}
                <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
                  {/* Story Card */}
                  <div style={{
                    background: '#FFF8E1',
                    padding: '4px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '2px solid #FFE082',
                    flex: 1,
                    maxHeight: '40%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.6)',
                      padding: '16px',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}>
                      <h3 style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#8D6E63',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        ✏️ Finish the Story
                      </h3>
                      <div style={{ flex: 1, minHeight: 0 }}>
                        {stage === STAGES.RESULT ? (
                          <p style={{
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#333',
                            lineHeight: '1.6',
                            height: '100%',
                            overflowY: 'auto',
                          }}>
                            "{magicStory || userStory}"
                          </p>
                        ) : (
                          <textarea
                            value={userStory}
                            onChange={(e) => setUserStory(e.target.value)}
                            style={{
                              width: '100%',
                              height: '100%',
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              fontSize: '16px',
                              lineHeight: '28px',
                              color: '#333',
                              resize: 'none',
                              fontWeight: 500,
                              backgroundImage: 'linear-gradient(transparent, transparent 27px, #EFEBE9 27px)',
                              backgroundSize: '100% 28px',
                            }}
                            placeholder="..."
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tools Panel - placeholder for now */}
                  <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e7ff',
                    flex: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}>
                    {stage === STAGES.DRAWING && (
                      <>
                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #e0e7ff' }}>
                          <button
                            onClick={() => setActiveTab('colors')}
                            style={{
                              flex: 1,
                              padding: '12px',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              background: activeTab === 'colors' ? '#eef2ff' : 'transparent',
                              color: activeTab === 'colors' ? '#4f46e5' : '#94a3b8',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            🎨 Colors
                          </button>
                          <button
                            onClick={() => setActiveTab('shapes')}
                            style={{
                              flex: 1,
                              padding: '12px',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              background: activeTab === 'shapes' ? '#eef2ff' : 'transparent',
                              color: activeTab === 'shapes' ? '#4f46e5' : '#94a3b8',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            ⭐ Shapes
                          </button>
                        </div>

                        {/* Tab Content */}
                        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                          {activeTab === 'colors' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                {COLORS.map(c => (
                                  <button
                                    key={c}
                                    onClick={() => setDrawingTool({ ...drawingTool, color: c, mode: 'brush' })}
                                    style={{
                                      width: '100%',
                                      aspectRatio: '1',
                                      borderRadius: '8px',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      transition: 'all 0.2s',
                                      transform: drawingTool.color === c && drawingTool.mode === 'brush' ? 'scale(1.05)' : 'scale(1)',
                                      border: drawingTool.color === c && drawingTool.mode === 'brush' ? '4px solid #e0e7ff' : 'none',
                                      background: c,
                                      cursor: 'pointer',
                                    }}
                                  />
                                ))}
                              </div>
                              <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                                <label style={{
                                  fontSize: '10px',
                                  fontWeight: 'bold',
                                  color: '#94a3b8',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  marginBottom: '8px',
                                  display: 'block',
                                }}>Brush Size</label>
                                <input
                                  type="range"
                                  min="2"
                                  max="20"
                                  value={drawingTool.size}
                                  onChange={(e) => setDrawingTool({...drawingTool, size: parseInt(e.target.value)})}
                                  style={{
                                    width: '100%',
                                    height: '8px',
                                    background: '#f1f5f9',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                              {STICKERS.map(s => (
                                <button
                                  key={s.type}
                                  onClick={() => setDrawingTool({ ...drawingTool, mode: 'sticker', sticker: s.type })}
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: drawingTool.mode === 'sticker' && drawingTool.sticker === s.type ? '2px solid #4f46e5' : '2px solid #f1f5f9',
                                    background: drawingTool.mode === 'sticker' && drawingTool.sticker === s.type ? '#eef2ff' : 'white',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.emoji}</div>
                                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>{s.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Clear Button */}
                        <div style={{ padding: '12px', borderTop: '1px solid #e0e7ff' }}>
                          <button
                            onClick={() => canvasRef.current?.clearCanvas()}
                            style={{
                              width: '100%',
                              padding: '10px',
                              color: '#ef4444',
                              fontWeight: 'bold',
                              borderRadius: '12px',
                              border: '2px solid #fee2e2',
                              background: 'white',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            🗑️ Clear Canvas
                          </button>
                        </div>
                      </>
                    )}

                    {stage === STAGES.RESULT && (
                      <div style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}>
                        <div style={{
                          textAlign: 'center',
                          padding: '16px',
                          background: '#eef2ff',
                          borderRadius: '16px',
                          width: '100%',
                        }}>
                          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
                          <p style={{ color: '#4f46e5', fontWeight: 'bold' }}>Magic Applied!</p>
                        </div>
                        <button
                          onClick={handleSave}
                          style={{
                            width: '100%',
                            padding: '16px',
                            background: '#4f46e5',
                            color: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                            border: 'none',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                        >
                          💾 Save Story Card
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Main Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>
                  {/* Canvas Area */}
                  <div style={{
                    flex: 1,
                    background: 'white',
                    borderRadius: '32px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '4px solid #f1f5f9',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: 0,
                  }}>
                    {stage === STAGES.RESULT && generatedImage ? (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f8fafc',
                      }}>
                        <img
                          src={generatedImage}
                          alt="Magic Result"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        {stage === STAGES.GENERATING && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            zIndex: 50,
                            background: 'rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{
                                width: '64px',
                                height: '64px',
                                border: '8px solid #e0e7ff',
                                borderTop: '8px solid #FF7043',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 16px',
                              }}></div>
                              <h3 style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#3730a3',
                              }}>Making Magic...</h3>
                            </div>
                          </div>
                        )}
                        <CanvasBoard ref={canvasRef} shape={idea.shape} tool={drawingTool} />
                      </>
                    )}
                  </div>

                  {/* Action Bar - placeholder */}
                  <div style={{ flexShrink: 0 }}>
                    {stage === STAGES.DRAWING && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                          onClick={handleGenerateMagic}
                          disabled={isLoading}
                          style={{
                            width: '100%',
                            padding: '16px',
                            background: '#10B981',
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            borderRadius: '16px',
                            border: 'none',
                            boxShadow: '0 6px 0 #059669',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            opacity: isLoading ? 0.6 : 1,
                          }}
                          onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(3px)')}
                          onMouseUp={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                          🪄 MAKE IT REAL!
                        </button>

                        <div style={{
                          background: 'white',
                          padding: '8px',
                          borderRadius: '16px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '1px solid #e0e7ff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <div style={{
                            padding: '10px',
                            background: '#eef2ff',
                            color: '#4f46e5',
                            borderRadius: '12px',
                            fontSize: '18px',
                          }}>
                            ✍️
                          </div>
                          <input
                            type="text"
                            value={magicInput}
                            onChange={(e) => setMagicInput(e.target.value)}
                            placeholder="Tell the AI what else to add... e.g. 'A blue dinosaur'"
                            style={{
                              flex: 1,
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: '#333',
                              fontSize: '14px',
                              fontWeight: 500,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Home Indicator */}
          <div style={styles.homeIndicator}></div>
        </div>
      </div>
    </div>
  )
}

export default iPadCoCreationModal


// Styles object
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  ipadDevice: {
    background: '#1f2937',
    borderRadius: '2.5rem',
    padding: '12px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '4px solid #374151',
    width: '90vw',
    maxWidth: '1400px',
    height: '85vh',
  },
  ipadScreen: {
    background: '#F0F4F8',
    borderRadius: '2rem',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  statusBar: {
    height: '32px',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#1e293b',
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderBottom: '1px solid #e0e7ff',
  },
  appTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  appIcon: {
    background: '#FF7043',
    padding: '6px',
    borderRadius: '12px',
    fontSize: '20px',
  },
  appTitleText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1e293b',
    margin: 0,
  },
  resetButton: {
    padding: '8px',
    background: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '20px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  errorMessage: {
    position: 'absolute',
    top: '80px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    background: '#fee2e2',
    border: '2px solid #fca5a5',
    color: '#991b1b',
    padding: '12px 24px',
    borderRadius: '9999px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  spinner: {
    width: '64px',
    height: '64px',
    border: '8px solid #e0e7ff',
    borderTop: '8px solid #FF7043',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  loadingText: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3730a3',
  },
  errorText: {
    color: '#64748b',
    marginBottom: '16px',
    fontWeight: 500,
  },
  retryButton: {
    padding: '12px 24px',
    background: '#FF7043',
    color: 'white',
    borderRadius: '12px',
    border: 'none',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '128px',
    height: '4px',
    background: '#cbd5e1',
    borderRadius: '9999px',
  },
}
