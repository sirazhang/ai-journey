import { useState, useEffect } from 'react'
import { db } from '../config/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

/**
 * 管理员仪表板 - 查看所有用户数据
 * 访问路径: /admin (需要在路由中配置)
 */
const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'high-p-high-j', etc.

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const usersRef = collection(db, 'users')
      const q = query(usersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const usersData = []
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() })
      })
      
      setUsers(usersData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      setLoading(false)
    }
  }

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => user.userProfile?.aiType === filter)

  const stats = {
    total: users.length,
    highPHighJ: users.filter(u => u.userProfile?.aiType === 'high-p-high-j').length,
    lowPHighJ: users.filter(u => u.userProfile?.aiType === 'low-p-high-j').length,
    lowPLowJ: users.filter(u => u.userProfile?.aiType === 'low-p-low-j').length,
    highPLowJ: users.filter(u => u.userProfile?.aiType === 'high-p-low-j').length,
    avgReplayCount: users.reduce((sum, u) => sum + (u.abilityLevel?.replayCount || 0), 0) / users.length || 0,
    avgWrongClicks: users.reduce((sum, u) => sum + (u.abilityLevel?.wrongClicks || 0), 0) / users.length || 0,
    avgAIAttempts: users.reduce((sum, u) => sum + (u.abilityLevel?.aiImageAttempts || 0), 0) / users.length || 0,
    avgTotalTime: users.reduce((sum, u) => sum + (u.preferences?.totalTime || 0), 0) / users.length || 0,
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const styles = {
    container: {
      padding: '20px',
      fontFamily: "'Roboto', sans-serif",
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '30px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    statLabel: {
      fontSize: '14px',
      opacity: 0.9,
      marginBottom: '8px',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
    },
    filters: {
      marginBottom: '20px',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    },
    filterButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
    filterButtonActive: {
      background: '#667eea',
      color: 'white',
    },
    filterButtonInactive: {
      background: '#e0e0e0',
      color: '#333',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    th: {
      background: '#f5f5f5',
      padding: '12px',
      textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '14px',
      borderBottom: '2px solid #ddd',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #eee',
      fontSize: '13px',
    },
    aiTypeBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
    },
    loading: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
    },
    refreshButton: {
      padding: '10px 20px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      marginBottom: '20px',
    },
  }

  const getAITypeBadgeStyle = (aiType) => {
    const colors = {
      'high-p-high-j': { bg: '#4caf50', color: 'white' },
      'low-p-high-j': { bg: '#2196f3', color: 'white' },
      'low-p-low-j': { bg: '#ff9800', color: 'white' },
      'high-p-low-j': { bg: '#f44336', color: 'white' },
    }
    return {
      ...styles.aiTypeBadge,
      background: colors[aiType]?.bg || '#999',
      color: colors[aiType]?.color || 'white',
    }
  }

  if (loading) {
    return <div style={styles.loading}>Loading user data...</div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Journey - User Analytics Dashboard</h1>
        <button style={styles.refreshButton} onClick={fetchUsers}>
          🔄 Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Users</div>
          <div style={styles.statValue}>{stats.total}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>High P, High J</div>
          <div style={styles.statValue}>{stats.highPHighJ}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Low P, High J</div>
          <div style={styles.statValue}>{stats.lowPHighJ}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Low P, Low J</div>
          <div style={styles.statValue}>{stats.lowPLowJ}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>High P, Low J</div>
          <div style={styles.statValue}>{stats.highPLowJ}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Avg Replay Count</div>
          <div style={styles.statValue}>{stats.avgReplayCount.toFixed(1)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Avg Wrong Clicks</div>
          <div style={styles.statValue}>{stats.avgWrongClicks.toFixed(1)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Avg Game Time</div>
          <div style={styles.statValue}>{formatTime(stats.avgTotalTime)}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {['all', 'high-p-high-j', 'low-p-high-j', 'low-p-low-j', 'high-p-low-j'].map(f => (
          <button
            key={f}
            style={{
              ...styles.filterButton,
              ...(filter === f ? styles.filterButtonActive : styles.filterButtonInactive)
            }}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Users' : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>AI Type</th>
            <th style={styles.th}>P Score</th>
            <th style={styles.th}>J Score</th>
            <th style={styles.th}>Replays</th>
            <th style={styles.th}>Wrong Clicks</th>
            <th style={styles.th}>AI Attempts</th>
            <th style={styles.th}>Total Time</th>
            <th style={styles.th}>Keywords</th>
            <th style={styles.th}>Created At</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>
                {user.userProfile?.aiType ? (
                  <span style={getAITypeBadgeStyle(user.userProfile.aiType)}>
                    {user.userProfile.aiType}
                  </span>
                ) : (
                  <span style={{ color: '#999' }}>Not completed</span>
                )}
              </td>
              <td style={styles.td}>{user.userProfile?.pScore || 'N/A'}</td>
              <td style={styles.td}>{user.userProfile?.jScore || 'N/A'}</td>
              <td style={styles.td}>{user.abilityLevel?.replayCount || 0}</td>
              <td style={styles.td}>{user.abilityLevel?.wrongClicks || 0}</td>
              <td style={styles.td}>{user.abilityLevel?.aiImageAttempts || 0}</td>
              <td style={styles.td}>{formatTime(user.preferences?.totalTime || 0)}</td>
              <td style={styles.td}>
                {user.preferences?.npcQuestionKeywords?.length || 0} keywords
              </td>
              <td style={styles.td}>{formatDate(user.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          No users found with the selected filter.
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
