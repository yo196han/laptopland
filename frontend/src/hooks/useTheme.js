import { useEffect } from 'react'

// ===== هوك إدارة الثيم (داكن / فاتح) =====
export function useTheme() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('ll_theme') || 'dark'
    const html = document.documentElement

    if (savedTheme === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }, [])
}

export function toggleTheme() {
  const html = document.documentElement
  const isDark = html.classList.contains('dark')

  if (isDark) {
    html.classList.remove('dark')
    html.classList.add('light')
    localStorage.setItem('ll_theme', 'light')
  } else {
    html.classList.remove('light')
    html.classList.add('dark')
    localStorage.setItem('ll_theme', 'dark')
  }

  return !isDark ? 'dark' : 'light'
}

export function getCurrentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
