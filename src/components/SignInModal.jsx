import React, { useState } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'

const SignInModal = ({ onClose, onSignUpComplete }) => {
  const [isSignUp, setIsSignUp] = useState(false) // Toggle between sign-in and sign-up
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  })
  const [error, setError] = useState('')
  const { playClickSound } = useSoundEffects()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') // Clear error when user types
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    playClickSound()
    
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      // Simple validation - check username/email and password
      if ((userData.username === formData.username || userData.email === formData.username) && 
          userData.password === formData.password) {
        console.log('Sign in successful:', userData)
        if (onSignUpComplete) {
          onSignUpComplete(userData)
        }
        onClose()
      } else {
        setError('Invalid username/email or password')
      }
    } else {
      setError('No account found. Please sign up first.')
    }
  }

  const handleSignUp = (e) => {
    e.preventDefault()
    playClickSound()
    
    // Check if user already exists
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (userData.username === formData.username || userData.email === formData.email) {
        setError('User already exists. Please sign in instead.')
        return
      }
    }
    
    console.log('Sign up data:', formData)
    // Save user to localStorage
    const newUser = {
      username: formData.username,
      email: formData.email,
      password: formData.password, // In real app, this should be hashed
      hasStarted: false,
      currentProgress: null,
      createdAt: Date.now()
    }
    localStorage.setItem('aiJourneyUser', JSON.stringify(newUser))
    
    if (onSignUpComplete) {
      onSignUpComplete(newUser)
    }
    onClose()
  }

  const toggleMode = () => {
    playClickSound()
    setIsSignUp(!isSignUp)
    setFormData({ username: '', password: '', email: '' })
    setError('')
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
    toggleButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      color: '#5170FF',
      background: 'transparent',
      border: 'none',
      padding: '10px',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'opacity 0.2s',
      textDecoration: 'underline',
    },
    error: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#ff6b6b',
      textAlign: 'center',
      marginTop: '10px',
    },
    toggleText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#fff',
      textAlign: 'center',
      marginTop: '20px',
      opacity: 0.8,
    },
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        
        <form style={styles.form} onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div style={styles.inputRow}>
            <label style={styles.label}>
              {isSignUp ? 'User Name' : 'User Name/ Email'}
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder={isSignUp ? 'Enter username' : 'Enter username or email'}
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
              placeholder="Enter password"
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
          
          {/* Email field only for sign up */}
          {isSignUp && (
            <div style={styles.inputRow}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter email address"
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
          )}
          
          {/* Error message */}
          {error && <div style={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            style={styles.submitButton}
            onMouseOver={(e) => e.target.style.opacity = '0.7'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            Done
          </button>
        </form>

        {/* Toggle between sign in and sign up */}
        <div style={styles.toggleText}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            style={styles.toggleButton}
            onClick={toggleMode}
            onMouseOver={(e) => e.target.style.opacity = '0.7'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignInModal
