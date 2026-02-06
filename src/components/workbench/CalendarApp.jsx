import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Circle, AlertCircle } from 'lucide-react'

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

  // Task list
  const tasks = [
    {
      id: 1,
      title: 'Complete 5 Information Verifications',
      description: 'Verify statements in the Workbench app',
      completed: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Use Safari for Uncertain Information',
      description: 'Search and verify facts you\'re unsure about',
      completed: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Check Location Accuracy',
      description: 'Use Maps app to verify geographical claims',
      completed: false,
      priority: 'medium'
    },
    {
      id: 4,
      title: 'Verify Distance Claims',
      description: 'Use Maps to check travel distances and times',
      completed: false,
      priority: 'low'
    }
  ]

  const styles = {
    container: {
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      background: '#fff',
      fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    leftPanel: {
      width: '45%',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      overflowY: 'auto',
    },
    rightPanel: {
      width: '55%',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      overflowY: 'auto',
      background: '#f9fafb',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    monthYear: {
      fontSize: '22px',
      fontWeight: 700,
      color: '#333',
    },
    navButtons: {
      display: 'flex',
      gap: '8px',
    },
    navButton: {
      width: '32px',
      height: '32px',
      borderRadius: '6px',
      background: '#f3f4f6',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
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
      gap: '4px',
    },
    dayCell: {
      aspectRatio: '1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      fontSize: '13px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    emptyCell: {
      background: 'transparent',
    },
    normalDay: {
      background: 'transparent',
      color: '#333',
    },
    todayCell: {
      background: '#ef4444',
      color: '#fff',
      fontWeight: 700,
    },
    todayInfo: {
      marginTop: '24px',
      padding: '16px',
      borderRadius: '10px',
      background: '#fef2f2',
      border: '1px solid #fecaca',
    },
    todayLabel: {
      fontSize: '11px',
      fontWeight: 600,
      color: '#991b1b',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px',
    },
    todayDate: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#dc2626',
    },
    todayDay: {
      fontSize: '13px',
      color: '#991b1b',
      marginTop: '2px',
    },
    rightHeader: {
      marginBottom: '20px',
    },
    rightTitle: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '8px',
    },
    rightSubtitle: {
      fontSize: '13px',
      color: '#666',
    },
    tasksSection: {
      flex: 1,
    },
    tasksHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
    },
    tasksTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#333',
    },
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    taskCard: {
      background: '#fff',
      padding: '16px',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.2s',
      cursor: 'pointer',
    },
    taskCardHover: {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-2px)',
    },
    taskHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '8px',
    },
    taskCheckbox: {
      marginTop: '2px',
    },
    taskContent: {
      flex: 1,
    },
    taskTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '4px',
    },
    taskDescription: {
      fontSize: '13px',
      color: '#666',
      lineHeight: 1.5,
    },
    taskPriority: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      marginTop: '8px',
    },
    priorityHigh: {
      background: '#fee2e2',
      color: '#dc2626',
    },
    priorityMedium: {
      background: '#fef3c7',
      color: '#d97706',
    },
    priorityLow: {
      background: '#dbeafe',
      color: '#2563eb',
    },
    guideSection: {
      marginTop: '20px',
      padding: '16px',
      background: '#eff6ff',
      borderRadius: '10px',
      border: '1px solid #bfdbfe',
    },
    guideTitle: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#1e40af',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    guideList: {
      fontSize: '13px',
      color: '#1e40af',
      lineHeight: 1.8,
      paddingLeft: '20px',
      margin: 0,
    },
    guideItem: {
      marginBottom: '6px',
    },
  }

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh
      case 'medium':
        return styles.priorityMedium
      case 'low':
        return styles.priorityLow
      default:
        return styles.priorityMedium
    }
  }

  return (
    <div style={styles.container}>
      {/* Left Panel - Calendar */}
      <div style={styles.leftPanel}>
        <div style={styles.header}>
          <div style={styles.monthYear}>
            {monthNames[month]} {year}
          </div>
          <div style={styles.navButtons}>
            <button 
              style={styles.navButton}
              onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
              onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              style={styles.navButton}
              onMouseOver={(e) => e.target.style.background = '#e5e7eb'}
              onMouseOut={(e) => e.target.style.background = '#f3f4f6'}
            >
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
                  e.target.style.background = '#f3f4f6'
                }
              }}
              onMouseOut={(e) => {
                if (day !== null && day !== today) {
                  e.target.style.background = 'transparent'
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

      {/* Right Panel - Tasks & Guidelines */}
      <div style={styles.rightPanel}>
        <div style={styles.rightHeader}>
          <div style={styles.rightTitle}>Today's Tasks</div>
          <div style={styles.rightSubtitle}>Complete these verification tasks</div>
        </div>

        {/* Tasks Section */}
        <div style={styles.tasksSection}>
          <div style={styles.tasksList}>
            {tasks.map((task) => (
              <div 
                key={task.id} 
                style={styles.taskCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={styles.taskHeader}>
                  <div style={styles.taskCheckbox}>
                    {task.completed ? (
                      <CheckCircle size={20} color="#10b981" />
                    ) : (
                      <Circle size={20} color="#d1d5db" />
                    )}
                  </div>
                  <div style={styles.taskContent}>
                    <div style={styles.taskTitle}>{task.title}</div>
                    <div style={styles.taskDescription}>{task.description}</div>
                    <span style={{...styles.taskPriority, ...getPriorityStyle(task.priority)}}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guide Section */}
        <div style={styles.guideSection}>
          <div style={styles.guideTitle}>
            <AlertCircle size={16} />
            Task Guidelines
          </div>
          <ul style={styles.guideList}>
            <li style={styles.guideItem}>
              <strong>Workbench:</strong> Review and verify 5 statements (TRUE or FALSE)
            </li>
            <li style={styles.guideItem}>
              <strong>Safari:</strong> Search for information when you're uncertain
            </li>
            <li style={styles.guideItem}>
              <strong>Maps:</strong> Verify locations, distances, and geographical claims
            </li>
            <li style={styles.guideItem}>
              <strong>Tip:</strong> Use multiple tools to cross-check information for accuracy
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CalendarApp
