import React from 'react'
import { Facebook, Send, MessageCircle } from 'lucide-react'
import Logo from './Logo.jsx'
import AdminTrigger from './AdminTrigger.jsx'
import { getTranslation } from '../utils/translations.js'
import { SITE_CONFIG } from '../utils/constants.js'

const Footer = ({ lang }) => {
  return (
    <footer
      className="relative py-8"
      style={{
        backgroundColor: 'var(--dark-base)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* اللوغو والنص */}
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="text-sm" style={{ color: 'var(--text-faint)' }}>
              {getTranslation(lang, 'footer.rights')}
            </span>
          </div>

          {/* أيقونات السوشيال */}
          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-all duration-300 hover:bg-purple-primary/20 hover:-translate-y-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <Facebook size={20} />
            </a>
            <a
              href={SITE_CONFIG.TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-all duration-300 hover:bg-purple-primary/20 hover:-translate-y-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <Send size={20} />
            </a>
            <a
              href={SITE_CONFIG.WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-all duration-300 hover:bg-purple-primary/20 hover:-translate-y-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* زر الأدمن المخفي */}
      <AdminTrigger />
    </footer>
  )
}

export default Footer
