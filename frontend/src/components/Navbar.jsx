import React, { useState, useEffect, useCallback } from 'react'
import { Menu } from 'lucide-react'
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageToggle from './LanguageToggle.jsx'
import MobileMenu from './MobileMenu.jsx'
import { getTranslation } from '../utils/translations.js'

// ===== شريط التنقل العلوي =====
const Navbar = ({ lang }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const isRTL = lang === 'ar'

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'products', href: '#products' },
    { key: 'services', href: '#services' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Scrollspy
      const sections = navItems.map((item) => item.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(sections[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigate = useCallback((e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const navHeight = 80
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'glass shadow-lg' : 'bg-transparent'
        }`}
        style={{
          borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* اللوغو */}
            <a href="#home" onClick={(e) => handleNavigate(e, '#home')} className="flex items-center gap-3">
              <Logo size={48} />
              <span className="font-orbitron text-lg md:text-xl font-bold text-purple-neon hidden sm:block">
                LAPTOP LAND
              </span>
            </a>

            {/* روابط التنقل — سطح المكتب */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleNavigate(e, item.href)}
                  className={`relative px-4 py-2 rounded-lg font-cairo font-semibold text-sm transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? 'text-purple-neon'
                      : 'hover:text-purple-neon'
                  }`}
                  style={{ color: activeSection === item.href.slice(1) ? 'var(--purple-neon)' : 'var(--text-primary)' }}
                >
                  {getTranslation(lang, `nav.${item.key}`)}
                  {activeSection === item.href.slice(1) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-purple-neon" />
                  )}
                </a>
              ))}
            </div>

            {/* أزرار التحكم */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
              </div>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-purple-primary/20"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        lang={lang}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
    </>
  )
}

export default Navbar
