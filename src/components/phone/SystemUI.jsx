import { useState, useEffect } from 'react'
import { Wifi, Battery, Signal } from 'lucide-react'
import { format } from 'date-fns'

// Status Bar Component
export const StatusBar = ({ color = 'white' }) => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 50,
      color: color,
      fontWeight: '500',
      pointerEvents: 'none'
    }}>
      <div style={{ width: '80px', paddingLeft: '8px', fontSize: '15px', fontWeight: '600', letterSpacing: '0.5px' }}>
        {format(time, 'h:mm')}
      </div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingRight: '8px' }}>
        <Signal size={16} fill="currentColor" />
        <Wifi size={16} />
        <Battery size={20} />
      </div>
    </div>
  )
}

// Home Bar Component
export const HomeBar = ({ onSwipeUp }) => {
  return (
    <div 
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: '8px',
        zIndex: 50,
        cursor: 'pointer'
      }}
      onClick={onSwipeUp}
    >
      <div style={{
        width: '128px',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '9999px',
        transition: 'background 0.2s',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }} />
    </div>
  )
}

// Notch Component
export const Notch = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      height: '28px',
      width: '128px',
      background: '#000',
      borderRadius: '0 0 24px 24px',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      <div style={{
        width: '64px',
        height: '16px',
        background: '#171717',
        borderRadius: '9999px',
        marginLeft: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'flex-end',
        paddingRight: '8px'
      }}>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '9999px',
          background: 'rgba(59, 130, 246, 0.5)'
        }} />
      </div>
    </div>
  )
}
