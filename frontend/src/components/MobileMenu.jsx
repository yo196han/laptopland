import React from 'react'
import { X } from 'lucide-react'
import { getTranslation } from '../utils/translations.js'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageToggle from './LanguageToggle.jsx'

// ===== القائمة الجانبية للجوال =====
const MobileMenu = ({ isOpen, onClose, lang, activeSection, onNavigate }) => {
  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'products', href: '#products' },
    { key: 'services', href: '#services' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
  ]

  const isRTL = lang === 'ar'

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 ${isRTL ? 'right-0' : 'left-0'} h-full w-72 z-50 glass transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'
        }`}
        style={{ borderLeft: isRTL ? 'none' : '1px solid var(--border)', borderRight: isRTL ? '1px solid var(--border)' : 'none' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-orbitron font-bold text-purple-neon">LAPTOP LAND</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-purple-primary/20" style={{ color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  onNavigate(e, item.href)
                  onClose()
                }}
                className={`py-3 px-4 rounded-lg font-cairo font-semibold transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? 'bg-purple-primary/20 text-purple-neon'
                    : 'hover:bg-purple-primary/10'
                }`}
                style={{ color: activeSection === item.href.slice(1) ? 'var(--purple-neon)' : 'var(--text-primary)' }}
              >
                {getTranslation(lang, `nav.${item.key}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4 mt-8 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
