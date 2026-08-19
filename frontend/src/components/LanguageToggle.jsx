import React from 'react'
import { useLanguage } from '../hooks/useLanguage.js'

// ===== زر تبديل اللغة =====
const LanguageToggle = () => {
  const { lang, toggleLang } = useLanguage()

  return (
    <button
      onClick={toggleLang}
      className="px-3 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 hover:bg-purple-primary/20 border"
      style={{
        color: 'var(--purple-neon)',
        borderColor: 'var(--border)',
      }}
      aria-label="Toggle language"
    >
      {lang === 'ar' ? 'EN' : 'AR'}
    </button>
  )
}

export default LanguageToggle
