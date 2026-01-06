import React from 'react'

const Homepage = ({ onStart, onSignIn, isFirstVisit }) => {
  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    backgroundGif: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1,
    },
    content: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 80px',
      borderRadius: '20px',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      animation: 'breathe 3s ease-in-out infinite',
    },
    title: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '72px',
      fontWeight: 800,
      color: '#fff',
      marginBottom: '16px',
      textAlign: 'center',
      letterSpacing: '2px',
    },
    subtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      fontWeight: 300,
      color: '#fff',
      marginBottom: '40px',
      textAlign: 'center',
      opacity: 0.9,
    },
    startButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 500,
      color: '#fff',
      backgroundColor: '#000',
      border: 'none',
      padding: '16px 60px',
      borderRadius: '30px',
      cursor: 'pointer',
      textTransform: 'lowercase',
      letterSpacing: '2px',
      transition: 'all 0.3s ease',
    },
    welcome: {
      position: 'absolute',
      top: '30px',
      left: '40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 400,
      color: '#fff',
      zIndex: 3,
      letterSpacing: '1px',
    },
    signIn: {
      position: 'absolute',
      top: '30px',
      right: '40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 500,
      background: 'linear-gradient(90deg, #CDFFD8, #94B9FF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      cursor: 'pointer',
      zIndex: 3,
      letterSpacing: '1px',
      border: 'none',
      backgroundColor: 'transparent',
    },
    footer: {
      position: 'absolute',
      bottom: '20px',
      right: '30px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 300,
      color: '#fff',
      opacity: 0.7,
      zIndex: 3,
    },
  }

  return (
    <div style={styles.container}>
      <img 
        src="/background/home.gif" 
        alt="Background" 
        style={styles.backgroundGif}
      />
      <div style={styles.overlay}></div>
      
      <span style={styles.welcome}>welcome</span>
      
      <button style={styles.signIn} onClick={onSignIn}>
        sign in
      </button>
      
      <div style={styles.content}>
        <h1 style={styles.title}>AI Journey</h1>
        <p style={styles.subtitle}>An interactive journey into AI literacy</p>
        <button 
          style={styles.startButton}
          onClick={onStart}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#333'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#000'
            e.target.style.transform = 'scale(1)'
          }}
        >
          start
        </button>
      </div>
      
      <span style={styles.footer}>
        Ver 1.0 Beta © 2026 Zhihui ZHANG All Rights Reserved.
      </span>
    </div>
  )
}

export default Homepage
