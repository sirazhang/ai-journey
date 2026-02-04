import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Trash2, Archive, Reply, Edit3, MoreHorizontal, Search } from 'lucide-react'

const MailApp = ({ onClose }) => {
  const [mails, setMails] = useState([])
  const [selectedMail, setSelectedMail] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const errorRecords = userData.errorRecords || []
      const formattedMails = errorRecords.map((record, index) => ({
        id: index.toString(),
        sender: 'System',
        subject: record.subject || 'Error Report',
        preview: record.preview || record.content?.substring(0, 50) + '...',
        body: record.content || 'No details available.',
        time: new Date(record.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        unread: true,
        color: '#6b7280'
      }))
      setMails(formattedMails)
    }
  }, [])

  if (selectedMail) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#000' }}>
        <div style={{
          paddingTop: '40px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '16px',
          background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'sticky', top: 0, zIndex: 10
        }}>
          <button onClick={() => setSelectedMail(null)} style={{
            display: 'flex', alignItems: 'center', color: '#3b82f6', fontSize: '16px',
            background: 'none', border: 'none', cursor: 'pointer'
          }}>
            <ChevronLeft size={24} /><span>Report</span>
          </button>
          <div style={{ display: 'flex', gap: '16px' }}>
            <ChevronLeft size={24} style={{ color: '#4b5563' }} />
            <ChevronRight size={24} style={{ color: '#4b5563' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px', lineHeight: '1.2' }}>
                {selectedMail.subject}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '9999px', background: selectedMail.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  fontSize: '12px', fontWeight: '700'
                }}>{selectedMail.sender[0]}</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{selectedMail.sender}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>To: Me</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{selectedMail.time}</div>
          </div>
          <div style={{ color: '#d1d5db', fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {selectedMail.body}
          </div>
        </div>
        <div style={{
          height: '80px', background: 'rgba(23, 23, 23, 0.9)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '16px'
        }}>
          <Trash2 style={{ color: '#3b82f6' }} size={22} />
          <Archive style={{ color: '#3b82f6' }} size={22} />
          <Reply style={{ color: '#3b82f6' }} size={22} />
          <Edit3 style={{ color: '#3b82f6' }} size={22} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', background: '#000', overflowY: 'auto' }}>
      <div style={{
        paddingTop: '48px', paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px',
        position: 'sticky', top: 0, zIndex: 10, background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#fff', margin: 0 }}>Report</h1>
          <div style={{
            width: '32px', height: '32px', borderRadius: '9999px', background: '#1f2937',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <MoreHorizontal size={20} style={{ color: '#3b82f6' }} />
          </div>
        </div>
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <div style={{
            position: 'absolute', top: '50%', left: '8px', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', pointerEvents: 'none'
          }}>
            <Search size={16} style={{ color: '#9ca3af' }} />
          </div>
          <input type="text" placeholder="Search" style={{
            width: '100%', background: '#1f2937', borderRadius: '8px', padding: '6px 12px',
            paddingLeft: '32px', fontSize: '14px', outline: 'none', color: '#fff', border: 'none'
          }} />
        </div>
      </div>
      <div style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{
          fontSize: '12px', fontWeight: '600', color: '#6b7280', marginBottom: '8px',
          textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>Today</div>
        <div style={{ background: '#000', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          {mails.length === 0 ? (
            <div style={{ padding: '48px 16px', textAlign: 'center', color: '#6b7280' }}>
              <p>No error reports yet. Keep up the good work!</p>
            </div>
          ) : (
            mails.map((mail) => (
              <div key={mail.id} onClick={() => setSelectedMail(mail)} style={{
                padding: '12px 0', display: 'flex', gap: '12px', cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {mail.unread && (
                  <div style={{
                    marginTop: '8px', width: '10px', height: '10px', borderRadius: '9999px',
                    background: '#3b82f6', flexShrink: 0
                  }} />
                )}
                <div style={{ flex: 1, paddingLeft: mail.unread ? 0 : '12px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px'
                  }}>
                    <h3 style={{
                      fontSize: '17px', fontWeight: mail.unread ? '700' : '600', color: '#fff', margin: 0
                    }}>{mail.sender}</h3>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>{mail.time}</span>
                  </div>
                  <div style={{
                    fontSize: '15px', fontWeight: '500', color: '#d1d5db', marginBottom: '2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>{mail.subject}</div>
                  <div style={{
                    fontSize: '15px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4'
                  }}>{mail.preview}</div>
                </div>
                <ChevronRight size={16} style={{ color: '#4b5563', alignSelf: 'center' }} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default MailApp
