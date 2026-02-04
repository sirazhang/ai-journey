import { motion } from 'framer-motion'

// App Icon Component
const AppIcon = ({ name, Icon, color, onClick, badge }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer'
    }} onClick={onClick}>
      <div style={{ position: 'relative' }}>
        <motion.div
          whileTap={{ scale: 0.9 }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
            pointerEvents: 'none'
          }} />
          <Icon size={30} strokeWidth={2} />
        </motion.div>
        
        {badge && badge > 0 && (
          <div style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#ef4444',
            color: '#fff',
            fontSize: '11px',
            fontWeight: '700',
            minWidth: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '9999px',
            zIndex: 10,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            padding: '0 4px'
          }}>
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>
      
      {name && (
        <span style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#fff',
          letterSpacing: '0.5px',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          {name}
        </span>
      )}
    </div>
  )
}

export default AppIcon
