import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { toggleTheme, getCurrentTheme } from '../hooks/useTheme.js'

// ===== زر تبديل الثيم =====
const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(getCurrentTheme() === 'dark')
  }, [])

  const handleToggle = () => {
    const newTheme = toggleTheme()
    setIsDark(newTheme === 'dark')
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg transition-all duration-300 hover:bg-purple-primary/20"
      style={{ color: 'var(--purple-neon)' }}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}

export default ThemeToggle
