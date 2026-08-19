import { useEffect, useState } from 'react'
import { TRANSLATIONS } from '../utils/translations.js'

// ===== هوك إدارة اللغة (عربي / إنجليزي) =====
export function useLanguage() {
  const [lang, setLangState] = useState(() => localStorage.getItem('ll_lang') || 'ar')

  useEffect(() => {
    const html = document.documentElement
    const t = TRANSLATIONS[lang]
    html.dir = t.dir
    html.lang = t.lang
    document.body.style.fontFamily = lang === 'ar' ? "'Cairo', sans-serif" : "'Inter', sans-serif"
  }, [lang])

  const setLang = (newLang) => {
    localStorage.setItem('ll_lang', newLang)
    setLangState(newLang)
  }

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar'
    setLang(newLang)
    return newLang
  }

  return { lang, setLang, toggleLang }
}

export function getCurrentLang() {
  return localStorage.getItem('ll_lang') || 'ar'
}
