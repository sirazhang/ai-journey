import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import volumeManager from '../utils/volumeManager'

const SettingsPanel = ({ position = 'topLeft' }) => {
  const { language, changeLanguage, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [volume, setVolume] = useState(volumeManager.getVolume())
  const [tempVolume, setTempVolume] = useState(volumeManager.getVolume())
  const [isMuted, setIsMuted] = useState(volumeManager.isMutedStatus())

  // Subscribe to volume changes
  useEffect(() => {
    const unsubscribe = volumeManager.subscribe(({ volume: newVolume, isMuted: newMuted }) => {
      setVolume(newVolume)
      setIsMuted(newMuted)
    })
    
    return unsubscribe
  }, [])

  // Sync tempVolume with actual volume when panel opens
  useEffect(() => {
    if (isOpen) {
      setTempVolume(volume)
    }
  }, [isOpen, volume])

  const getPositionStyles = () => {
    switch (position) {
      case 'topLeft':
        return { top: '5%', left: '5%' }
      case 'topRight':
        return { top: '20px', right: '20px' }
      default:
        return { top: '5%', left: '5%' }
    }
  }

  const handleLanguageChange = (lang) => {
    changeLanguage(lang)
  }

  const handleVolumeChange = (e) => {
    setTempVolume(parseInt(e.target.value))
  }

  const handleMuteToggle = () => {
    volumeManager.toggleMute()
  }

  const handleReset = () => {
    setTempVolume(85)
  }

  const handleApply = () => {
    volumeManager.setVolume(tempVolume)
    setIsOpen(false)
  }

  const styles = {
    container: {
      position: 'absolute',
      ...getPositionStyles(),
      zIndex: 100,
    },
    settingButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: '8px',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      background: 'rgba(0, 0, 0, 0.3)',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      backdropFilter: 'blur(5px)',
    },
    settingIcon: {
      width: '18px',
      height: '18px',
      objectFit: 'contain',
    },
    panel: {
      position: 'absolute',
      top: '50px',
      left: '0',
      width: '320px',
      padding: '20px',
      borderRadius: '15px',
      background: '#e5e6e0',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      animation: 'slideDown 0.3s ease-out',
    },
    panelHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    },
    panelTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#333',
      margin: 0,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#999',
      cursor: 'pointer',
      padding: '0',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    section: {
      marginBottom: '20px',
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '12px',
    },
    sectionHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    sectionIcon: {
      width: '20px',
      height: '20px',
      objectFit: 'contain',
    },
    sectionTitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      fontWeight: 600,
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      margin: 0,
    },
    languageButtons: {
      display: 'flex',
      gap: '10px',
    },
    languageButton: {
      flex: 1,
      padding: '10px',
      borderRadius: '10px',
      border: 'none',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'rgba(255, 255, 255, 0.5)',
      color: '#333',
    },
    languageButtonActive: {
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    },
    volumeControl: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    volumeValue: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      minWidth: '50px',
      textAlign: 'right',
    },
    muteButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      flexShrink: 0,
    },
    muteIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
    },
    volumeIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
      flexShrink: 0,
    },
    sliderWrapper: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    slider: {
      flex: 1,
      height: '8px',
      borderRadius: '4px',
      background: '#d9d7de',
      outline: 'none',
      WebkitAppearance: 'none',
      appearance: 'none',
      cursor: 'pointer',
      margin: '0',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    resetButton: {
      flex: '0 0 35%',
      padding: '10px',
      borderRadius: '10px',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      background: 'rgba(255, 255, 255, 0.5)',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#333',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    applyButton: {
      flex: '0 0 60%',
      padding: '10px',
      borderRadius: '10px',
      border: 'none',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    keyframes: `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  }

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      <style>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          margin-top: -6px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #4c4cef 0%, #4c4cef ${tempVolume}%, #d9d7de ${tempVolume}%, #d9d7de 100%);
        }
        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #d9d7de;
        }
        input[type="range"]::-moz-range-progress {
          height: 8px;
          border-radius: 4px;
          background: #4c4cef;
        }
      `}</style>
      
      <button
        style={styles.settingButton}
        onClick={() => setIsOpen(!isOpen)}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <img src="/icon/setting.png" alt="Settings" style={styles.settingIcon} />
        <span>{t('setting')}</span>
      </button>

      {isOpen && (
        <div style={styles.panel}>
          {/* Header */}
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>{t('controlPanel')}</h3>
            <button
              style={styles.closeButton}
              onClick={() => setIsOpen(false)}
              onMouseOver={(e) => {
                e.target.style.color = '#333'
                e.target.style.transform = 'scale(1.1)'
              }}
              onMouseOut={(e) => {
                e.target.style.color = '#999'
                e.target.style.transform = 'scale(1)'
              }}
            >
              ✕
            </button>
          </div>

          {/* Language Selection */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <img src="/icon/language.png" alt="Language" style={styles.sectionIcon} />
              <h4 style={styles.sectionTitle}>{t('languageSelection')}</h4>
            </div>
            <div style={styles.languageButtons}>
              <button
                style={{
                  ...styles.languageButton,
                  ...(language === 'zh' ? styles.languageButtonActive : {})
                }}
                onClick={() => handleLanguageChange('zh')}
              >
                中文
              </button>
              <button
                style={{
                  ...styles.languageButton,
                  ...(language === 'en' ? styles.languageButtonActive : {})
                }}
                onClick={() => handleLanguageChange('en')}
              >
                ENGLISH
              </button>
            </div>
          </div>

          {/* System Volume */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionHeaderLeft}>
                <img src="/icon/volume.png" alt="Volume" style={styles.sectionIcon} />
                <h4 style={styles.sectionTitle}>{t('systemVolume')}</h4>
              </div>
              <span style={styles.volumeValue}>{tempVolume}%</span>
            </div>
            <div style={styles.volumeControl}>
              <button
                style={styles.muteButton}
                onClick={handleMuteToggle}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <img 
                  src="/icon/mute.png" 
                  alt="Mute" 
                  style={styles.muteIcon}
                />
              </button>
              <div style={styles.sliderWrapper}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tempVolume}
                  onChange={handleVolumeChange}
                  style={styles.slider}
                />
              </div>
              <img 
                src="/icon/volume.png" 
                alt="Volume" 
                style={styles.volumeIcon}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={styles.resetButton}
              onClick={handleReset}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.7)'
                e.target.style.transform = 'scale(1.02)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.5)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              {t('reset')}
            </button>
            <button
              style={styles.applyButton}
              onClick={handleApply}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.95)'
                e.target.style.transform = 'scale(1.02)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(0, 0, 0, 0.8)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              {t('applyChanges')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsPanel
