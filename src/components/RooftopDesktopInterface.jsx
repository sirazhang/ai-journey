import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, MessageSquare, FileText, Brain, Palette, Zap } from 'lucide-react'

const RooftopDesktopInterface = ({ 
  npcId, 
  npcData, 
  completedTasks = [],
  onTaskComplete,
  onClose 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  }))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      }))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Define tasks for each NPC (Only 3 NPCs on rooftop)
  const npcTasks = {
    npc5: {
      name: 'Master Librarian',
      avatar: '/glacier/npc/npc5.png',
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', // Purple
      dialogueNote: "P-please... help me... I used to be a Master Librarian. Or at least... I thought I was. I relied on GenAI for everything—research, fact-checking, even basic recall. Now I can't think critically anymore. My judgment... it's gone. They're making me take a competency test. If I fail, I'll be unemployed forever.",
      tasks: [
        { 
          id: 'npc5_puzzle', 
          title: 'Logic Puzzles', 
          appName: 'Logic Test',
          description: 'Review logic puzzles',
          icon: Brain,
          color: '#3b82f6',
          type: 'puzzle'
        },
        { 
          id: 'npc5_exercise', 
          title: 'Error Marking', 
          appName: 'Text Analyzer',
          description: 'Identify logical errors',
          icon: FileText,
          color: '#8b5cf6',
          type: 'exercise'
        }
      ]
    },
    npc6: {
      name: 'Concept Artist',
      avatar: '/glacier/npc/npc6.png',
      bgColor: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #f97316 100%)', // Orange/Pink
      dialogueNote: "It's gone. It's all gone. The spark... the vision... the soul. I used to be a concept artist. A good one. But then... I got lazy. I started using 'MidJourney-X' for everything. Need a dragon? Click. Need a landscape? Click. It was so easy. But last week, the studio fired me. They said, 'Your portfolio looks like everyone else's. Where is your voice?' I tried! I sat here for three days, and I couldn't draw a single line.",
      tasks: [
        { 
          id: 'npc6_creativity', 
          title: 'Creativity Test', 
          appName: 'Creative Mind',
          description: 'Creative thinking exercises',
          icon: Brain,
          color: '#ec4899',
          type: 'creativity'
        },
        { 
          id: 'npc6_cocreation', 
          title: 'Co-Creation', 
          appName: 'Art Studio',
          description: 'Work together creatively',
          icon: Palette,
          color: '#f97316',
          type: 'cocreation'
        }
      ]
    },
    npc9: {
      name: 'Super Worker',
      avatar: '/glacier/npc/npc9.png',
      bgColor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)', // Green/Cyan
      dialogueNote: "Hi there! I'm… I used to be a super worker, but then I started outsourcing my own thinking to... AI well. Now my attention span is shorter than a... —Oh, look! A snowflake! It's so shiny! ...Wait, where was I? Right. Unemployment. I completely forgot to show up on Monday. So, now I need to reboot my brain. Can you help me?",
      tasks: [
        { 
          id: 'npc9_memory_blocks', 
          title: 'Memory Blocks', 
          appName: 'Memory Game',
          description: 'Remember patterns',
          icon: Brain,
          color: '#10b981',
          type: 'memory_blocks'
        },
        { 
          id: 'npc9_memory_footprint', 
          title: 'Memory Path', 
          appName: 'Path Tracer',
          description: 'Trace footprint paths',
          icon: Zap,
          color: '#06b6d4',
          type: 'memory_footprint'
        },
        { 
          id: 'npc9_sharing', 
          title: 'Share Memory Tips', 
          appName: 'Memory Sharing',
          description: 'Share your memory secrets',
          icon: MessageSquare,
          color: '#3b82f6',
          type: 'sharing'
        }
      ]
    }
  }

  const currentNpc = npcTasks[npcId]
  if (!currentNpc) return null

  const isTaskCompleted = (taskId) => completedTasks.includes(taskId)

  const handleDockIconClick = (task) => {
    if (isTaskCompleted(task.id)) return
    
    console.log('Dock icon clicked:', task.type, task.id)
    
    // Don't open windows - just call handlers to show task cards on desktop
    // Call the appropriate handler based on task type
    if (task.type === 'puzzle' && npcData && npcData.openPuzzle) {
      npcData.openPuzzle()
    } else if (task.type === 'exercise' && npcData && npcData.openExercise) {
      npcData.openExercise()
    } else if (task.type === 'creativity' && npcData && npcData.openCreativity) {
      npcData.openCreativity()
    } else if (task.type === 'cocreation' && npcData && npcData.openCoCreation) {
      npcData.openCoCreation()
    } else if (task.type === 'memory_blocks' && npcData && npcData.openMemoryBlocks) {
      console.log('Calling openMemoryBlocks handler')
      npcData.openMemoryBlocks()
    } else if (task.type === 'memory_footprint' && npcData && npcData.openMemoryFootprint) {
      console.log('Calling openMemoryFootprint handler')
      npcData.openMemoryFootprint()
    } else if (task.type === 'sharing' && npcData && npcData.openSharing) {
      console.log('Calling openSharing handler')
      npcData.openSharing()
    }
  }

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease-out',
    },
    desktop: {
      width: '90vw',
      height: '85vh',
      maxWidth: '1400px',
      maxHeight: '900px',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    menuBar: {
      height: '32px',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
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
      fontSize: '20px',
      padding: '4px 8px',
      transition: 'opacity 0.2s',
    },
    desktopArea: {
      flex: 1,
      position: 'relative',
      padding: '20px',
      overflow: 'hidden',
    },
    // Notes app (NPC dialogue) - bottom left
    notesApp: {
      position: 'absolute',
      bottom: '100px',
      left: '20px',
      width: '320px',
      maxHeight: '500px',
      background: '#fef9e7',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    notesHeader: {
      background: '#f9e79f',
      padding: '12px 16px',
      borderBottom: '1px solid #f4d03f',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    notesContent: {
      padding: '16px',
      fontSize: '13px',
      lineHeight: '1.6',
      color: '#333',
      fontFamily: "'Marker Felt', 'Comic Sans MS', cursive",
      overflow: 'auto',
      flex: 1,
    },
    // To Do List widget - top right
    todoWidget: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '280px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      padding: '20px',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    },
    todoHeader: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    todoItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '12px',
      padding: '8px',
      background: '#f9fafb',
      borderRadius: '8px',
      transition: 'all 0.2s',
    },
    todoItemCompleted: {
      background: '#f0fdf4',
      opacity: 0.7,
    },
    // Dock at bottom
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
    // Task window (macOS style)
    taskWindow: {
      position: 'absolute',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
    },
    windowHeader: {
      height: '40px',
      background: '#f5f5f5',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '8px',
    },
    windowButtons: {
      display: 'flex',
      gap: '8px',
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
      fontWeight: '600',
      color: '#333',
    },
    windowContent: {
      flex: 1,
      overflow: 'auto',
      padding: '20px',
    },
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div style={{...styles.desktop, background: currentNpc.bgColor}} onClick={(e) => e.stopPropagation()}>
        {/* Menu Bar */}
        <div style={styles.menuBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={styles.menuText}>🏔️ Glacier Station</span>
            <span style={styles.menuText}>{currentNpc.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        {/* Desktop Area */}
        <div style={styles.desktopArea}>
          {/* Notes App - NPC Dialogue (Bottom Left) */}
          <div style={styles.notesApp}>
            <div style={styles.notesHeader}>
              <span style={{ fontSize: '16px' }}>📝</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>Notes</span>
            </div>
            <div style={styles.notesContent}>
              {currentNpc.dialogueNote}
            </div>
          </div>

          {/* To Do List Widget (Top Right) */}
          <div style={styles.todoWidget}>
            <div style={styles.todoHeader}>
              <CheckCircle2 size={20} color="#667eea" />
              To Do List
            </div>
            {currentNpc.tasks.map((task) => {
              const completed = isTaskCompleted(task.id)
              return (
                <div
                  key={task.id}
                  style={{
                    ...styles.todoItem,
                    ...(completed ? styles.todoItemCompleted : {}),
                  }}
                >
                  {completed ? (
                    <CheckCircle2 size={18} color="#22c55e" />
                  ) : (
                    <Circle size={18} color="#d1d5db" />
                  )}
                  <span style={{
                    fontSize: '13px',
                    color: completed ? '#6b7280' : '#1f2937',
                    textDecoration: completed ? 'line-through' : 'none',
                    fontWeight: completed ? 'normal' : '500',
                  }}>
                    {task.title}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Dock */}
          <div style={styles.dock}>
            {currentNpc.tasks.map((task) => {
              const Icon = task.icon
              const completed = isTaskCompleted(task.id)
              
              return (
                <div
                  key={task.id}
                  style={{
                    ...styles.dockIcon,
                    background: task.color,
                    opacity: completed ? 0.5 : 1,
                    cursor: completed ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => !completed && handleDockIconClick(task)}
                  onMouseOver={(e) => {
                    if (!completed) {
                      e.currentTarget.style.transform = 'scale(1.15)'
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <Icon size={28} color="#fff" />
                  {completed && (
                    <div style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '20px',
                      height: '20px',
                      background: '#22c55e',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: 'white',
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RooftopDesktopInterface
