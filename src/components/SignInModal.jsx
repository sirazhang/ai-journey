import React, { useState } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'
import { useLanguage } from '../contexts/LanguageContext'

const SignInModal = ({ onClose, onSignUpComplete }) => {
  const { t } = useLanguage()
  const [isSignUp, setIsSignUp] = useState(false) // Toggle between sign-in and sign-up
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  })
  const [error, setError] = useState('')
  const [hoveredInput, setHoveredInput] = useState(null) // Track which input is hovered
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
        setError(t('invalidCredentials'))
      }
    } else {
      setError(t('noAccountFound'))
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
        setError(t('userAlreadyExists'))
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
      width: '560px',
      padding: '40px 50px',
      borderRadius: '25px',
      background: 'rgba(0, 0, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(81, 112, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
      position: 'relative',
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
    inputWrapper: {
      flex: 1,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
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
      transition: 'all 0.3s',
    },
    spaceshipIcon: {
      position: 'absolute',
      right: '15px',
      width: '24px',
      height: '24px',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    },
    submitButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 500,
      color: '#fff',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '16px 60px',
      borderRadius: '30px',
      cursor: 'pointer',
      letterSpacing: '2px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      marginTop: '15px',
      position: 'relative',
    },
    toggleButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      color: '#5170FF',
      background: 'transparent',
      border: 'none',
      padding: '10px 15px',
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
        <h2 style={styles.title}>{isSignUp ? t('signUpTitle') : t('signInTitle')}</h2>
        
        <form style={styles.form} onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <div style={styles.inputRow}>
            <label style={styles.label}>
              {isSignUp ? t('userName') : t('userNameEmail')}
            </label>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                placeholder={isSignUp ? t('enterUsername') : t('enterUsernameOrEmail')}
                onMouseEnter={() => setHoveredInput('username')}
                onMouseLeave={() => setHoveredInput(null)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5170FF'
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                  e.target.style.boxShadow = '0 0 15px rgba(81, 112, 255, 0.5)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
                  e.target.style.boxShadow = 'none'
                }}
                required
              />
              <img 
                src="/icon/spaceship.svg" 
                alt="spaceship" 
                style={{
                  ...styles.spaceshipIcon,
                  opacity: hoveredInput === 'username' ? 1 : 0
                }}
              />
            </div>
          </div>
          
          <div style={styles.inputRow}>
            <label style={styles.label}>{t('password')}</label>
            <div style={styles.inputWrapper}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder={t('enterPassword')}
                onMouseEnter={() => setHoveredInput('password')}
                onMouseLeave={() => setHoveredInput(null)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#5170FF'
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                  e.target.style.boxShadow = '0 0 15px rgba(81, 112, 255, 0.5)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
                  e.target.style.boxShadow = 'none'
                }}
                required
              />
              <img 
                src="/icon/spaceship.svg" 
                alt="spaceship" 
                style={{
                  ...styles.spaceshipIcon,
                  opacity: hoveredInput === 'password' ? 1 : 0
                }}
              />
            </div>
          </div>
          
          {/* Email field only for sign up */}
          {isSignUp && (
            <div style={styles.inputRow}>
              <label style={styles.label}>{t('email')}</label>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder={t('enterEmail')}
                  onMouseEnter={() => setHoveredInput('email')}
                  onMouseLeave={() => setHoveredInput(null)}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#5170FF'
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
                    e.target.style.boxShadow = '0 0 15px rgba(81, 112, 255, 0.5)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                    e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
                    e.target.style.boxShadow = 'none'
                  }}
                  required
                />
                <img 
                  src="/icon/spaceship.svg" 
                  alt="spaceship" 
                  style={{
                    ...styles.spaceshipIcon,
                    opacity: hoveredInput === 'email' ? 1 : 0
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && <div style={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            style={styles.submitButton}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.8)'
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.6)'
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            {t('done')}
          </button>
        </form>

        {/* Toggle between sign in and sign up */}
        <div style={styles.toggleText}>
          {isSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
          <button 
            style={styles.toggleButton}
            onClick={toggleMode}
            onMouseOver={(e) => e.target.style.opacity = '0.7'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            {isSignUp ? t('signInTitle') : t('signUp')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SignInModal
