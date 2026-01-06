import React, { useState } from 'react'

const SignInModal = ({ onClose }) => {
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
    onClose()
  }

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)',
    },
    modal: {
      position: 'relative',
      width: '400px',
      padding: '50px 40px',
      borderRadius: '20px',
      background: 'rgba(20, 20, 30, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(20,20,30,0.95), rgba(20,20,30,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      animation: 'scaleIn 0.3s ease-out',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      background: 'none',
      border: 'none',
      color: '#fff',
      fontSize: '24px',
      cursor: 'pointer',
      opacity: 0.7,
      transition: 'opacity 0.2s',
    },
    title: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '28px',
      fontWeight: 500,
      color: '#fff',
      textAlign: 'center',
      marginBottom: '40px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      color: 'rgba(255, 255, 255, 0.7)',
      letterSpacing: '1px',
    },
    input: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      padding: '14px 18px',
      borderRadius: '10px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      outline: 'none',
      transition: 'border-color 0.2s, background-color 0.2s',
    },
    submitButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 500,
      color: '#fff',
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      border: 'none',
      padding: '16px',
      borderRadius: '30px',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    },
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button 
          style={styles.closeButton}
          onClick={onClose}
          onMouseOver={(e) => e.target.style.opacity = '1'}
          onMouseOut={(e) => e.target.style.opacity = '0.7'}
        >
          ×
        </button>
        
        <h2 style={styles.title}>Sign Up</h2>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#5170FF'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              }}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#5170FF'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              }}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => {
                e.target.style.borderColor = '#5170FF'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
              }}
              required
            />
          </div>
          
          <button 
            type="submit" 
            style={styles.submitButton}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.02)'
              e.target.style.boxShadow = '0 5px 20px rgba(81, 112, 255, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignInModal
