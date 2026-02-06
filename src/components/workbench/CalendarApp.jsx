import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

const CalendarApp = () => {
  const [currentDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = currentDate.getDate()
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }
  
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      fontFamily: "'Inter', 'Roboto', sans-serif",
      padding: '24px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      padding: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      color: '#fff',
    },
    monthYear: {
      fontSize: '20px',
      fontWeight: 700,
    },
    navButtons: {
      display: 'flex',
      gap: '8px',
    },
    navButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
    weekDays: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      marginBottom: '12px',
    },
    weekDay: {
      textAlign: 'center',
      fontSize: '12px',
      fontWeight: 600,
      color: '#999',
      padding: '8px',
    },
    daysGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '8px',
      marginBottom: '24px',
    },
    dayCell: {
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    emptyCell: {
      background: 'transparent',
    },
    normalDay: {
      background: '#f5f5f5',
      color: '#333',
    },
    todayCell: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontWeight: 700,
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    },
    todayInfo: {
      background: '#f9fafb',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      textAlign: 'center',
    },
    todayLabel: {
      fontSize: '12px',
      fontWeight: 600,
      color: '#999',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
    },
    todayDate: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#333',
    },
    todayDay: {
      fontSize: '14px',
      color: '#666',
      marginTop: '4px',
    },
  }

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.monthYear}>
          {monthNames[month]} {year}
        </div>
        <div style={styles.navButtons}>
          <button style={styles.navButton}>
            <ChevronLeft size={18} />
          </button>
          <button style={styles.navButton}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div style={styles.weekDays}>
        {dayNames.map((day) => (
          <div key={day} style={styles.weekDay}>{day}</div>
        ))}
      </div>

      <div style={styles.daysGrid}>
        {days.map((day, index) => (
          <div
            key={index}
            style={{
              ...styles.dayCell,
              ...(day === null ? styles.emptyCell : 
                  day === today ? styles.todayCell : 
                  styles.normalDay)
            }}
            onMouseOver={(e) => {
              if (day !== null && day !== today) {
                e.target.style.background = '#e5e7eb'
              }
            }}
            onMouseOut={(e) => {
              if (day !== null && day !== today) {
                e.target.style.background = '#f5f5f5'
              }
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={styles.todayInfo}>
        <div style={styles.todayLabel}>Today</div>
        <div style={styles.todayDate}>
          {monthNames[month]} {today}, {year}
        </div>
        <div style={styles.todayDay}>{getDayName(currentDate)}</div>
      </div>
    </div>
  )
}

export default CalendarApp
