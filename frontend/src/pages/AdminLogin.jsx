import React, { useEffect } from 'react'
import Logo from '../components/Logo.jsx'
import { useLanguage } from '../hooks/useLanguage.js'
import { useTheme } from '../hooks/useTheme.js'
import { getTranslation } from '../utils/translations.js'
import { SITE_CONFIG } from '../utils/constants.js'

const AdminLogin = () => {
  const { lang } = useLanguage()
  useTheme()

  useEffect(() => {
    fetch(`${SITE_CONFIG.API_BASE_URL}/auth/me`, { credentials: 'include' })
      .then((r) => {
        if (r.ok) window.location.href = '/admin-dashboard'
      })
      .catch(() => {})
  }, [])

  const handleLogin = () => {
    window.location.href = `${SITE_CONFIG.API_BASE_URL}/auth/google/login`
  }

  const urlParams = new URLSearchParams(window.location.search)
  const error = urlParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center circuit-bg" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div
        className="w-full max-w-md mx-4 rounded-2xl p-8 glass"
        style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-glow)' }}
      >
        <div className="flex justify-center mb-6">
          <Logo size={80} />
        </div>

        <h1 className="text-2xl font-orbitron font-black text-center mb-2 neon-text" style={{ color: 'var(--text-primary)' }}>
          {getTranslation(lang, 'admin.login_title')}
        </h1>

        <p className="text-center mb-8" style={{ color: 'var(--text-muted)' }}>
          {getTranslation(lang, 'admin.login_subtitle')}
        </p>

        {error === 'unauthorized' && (
          <div className="mb-6 p-4 rounded-lg text-center text-red-400 bg-red-500/10 border border-red-500/30">
            {getTranslation(lang, 'admin.unauthorized')}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          style={{ backgroundColor: 'white', color: '#1A0A2E' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {getTranslation(lang, 'admin.login_btn')}
        </button>

        <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-faint)' }}>
          {getTranslation(lang, 'admin.admin_only')}
        </p>
      </div>
    </div>
  )
}

export default AdminLogin
