import React, { useState } from 'react'

const SignInModal = ({ onClose, onSignUpComplete }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Sign up data:', formData)
    // Save user to localStorage
    localStorage.setItem('aiJourneyUser', JSON.stringify({
      username: formData.username,
      email: formData.email,
      hasStarted: false,
      currentProgress: null,
    }))
    if (onSignUpComplete) {
      onSignUpComplete(formData)
    }
    onClose()
  }

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      position: 'relative',
      width: '550px',
      padding: '40px 50px',
      borderRadius: '25px',
      background: 'rgba(0, 0, 10, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(0,0,10,0.95), rgba(0,0,10,0.95)), linear-gradient(90deg, #5170FF, #FF6B9D)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      animation: 'scaleIn 0.3s ease-out',
    },
    title: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '24px',
      fontWeight: 400,
      color: '#fff',
      textAlign: 'center',
      marginBottom: '35px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    label: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 400,
      color: '#fff',
      width: '120px',
      textAlign: 'right',
      flexShrink: 0,
    },
    input: {
      flex: 1,
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      padding: '12px 16px',
      borderRadius: '25px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      color: '#fff',
      outline: 'none',
      transition: 'border-color 0.2s, background-color 0.2s',
    },
    submitButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 400,
      color: '#fff',
      background: 'transparent',
      border: 'none',
      padding: '15px',
      cursor: 'pointer',
      marginTop: '15px',
      transition: 'opacity 0.2s',
    },
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Sign Up</h2>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputRow}>
            <label style={styles.label}>User Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#5170FF'
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
              }}
              required
            />
          </div>
          
          <div style={styles.inputRow}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#5170FF'
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
              }}
              required
            />
          </div>
          
          <div style={styles.inputRow}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#5170FF'
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
              }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={styles.submitButton}
            onMouseOver={(e) => e.target.style.opacity = '0.7'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Done
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignInModal
