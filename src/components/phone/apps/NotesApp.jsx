import { useState, useEffect } from 'react'
import { ChevronLeft, Share } from 'lucide-react'

const NotesApp = ({ onClose }) => {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const congratulations = userData.congratulations || []
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
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fef3c7' }}>
        <div style={{
          paddingTop: '48px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#d97706'
        }}>
          <button onClick={() => setSelectedNote(null)} style={{
            display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: '500',
            background: 'none', border: 'none', cursor: 'pointer', color: '#d97706'
          }}>
            <ChevronLeft size={24} /> Review
          </button>
          <Share size={20} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
            {selectedNote.title}
          </h1>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>
            {new Date(selectedNote.timestamp).toLocaleDateString('en-US', { 
              month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
            })}
          </p>
          <div style={{
            fontSize: '16px', lineHeight: '1.6', color: '#1f2937', whiteSpace: 'pre-line', fontFamily: 'monospace'
          }}>
            {selectedNote.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', background: '#000', overflowY: 'auto' }}>
      <div style={{
        paddingTop: '48px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px',
        position: 'sticky', top: 0, zIndex: 10, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'
        }}>
          <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#fff', margin: 0 }}>Review</h1>
        </div>
        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="Search" style={{
            width: '100%', background: '#1f2937', borderRadius: '8px', padding: '8px 12px',
            paddingLeft: '32px', fontSize: '14px', outline: 'none', color: '#fff', border: 'none'
          }} />
        </div>
      </div>
      <div style={{ paddingLeft: '16px', paddingRight: '16px', marginTop: '16px' }}>
        {notes.length === 0 ? (
          <div style={{ padding: '48px 16px', textAlign: 'center', color: '#6b7280' }}>
            <p>Complete missions to receive congratulations!</p>
          </div>
        ) : (
          <div style={{
            background: '#1f2937', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
          }}>
            {notes.map((note, index) => (
              <div key={note.id} style={{
                padding: '16px', borderBottom: index < notes.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                cursor: 'pointer', transition: 'background 0.2s'
              }} onClick={() => setSelectedNote(note)}>
                <h3 style={{ fontWeight: '700', color: '#fff', margin: 0, marginBottom: '4px' }}>
                  {note.title}
                </h3>
                <p style={{
                  fontSize: '14px', color: '#6b7280', marginTop: '4px', marginBottom: '8px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>{note.preview}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                  {new Date(note.timestamp).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
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

export default NotesApp
