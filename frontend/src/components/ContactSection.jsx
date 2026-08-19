import React from 'react'
import { Phone, MapPin, Facebook, Send, MessageCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations.js'
import { PHONES, SITE_CONFIG, MAPS_EMBED_URL } from '../utils/constants.js'
import ScrollReveal from './ScrollReveal.jsx'

const ContactSection = ({ lang }) => {
  const isRTL = lang === 'ar'

  return (
    <section id="contact" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-surface)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-orbitron font-black text-center mb-4 neon-text" style={{ color: 'var(--text-primary)' }}>
            {getTranslation(lang, 'contact.section_title')}
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-primary to-purple-neon mb-16" />
        </ScrollReveal>

        {/* الصف الأول: بطاقات المعلومات */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* الهواتف */}
          <ScrollReveal delay={0}>
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Phone size={20} className="text-purple-neon" />
                {getTranslation(lang, 'contact.phones_title')}
              </h3>
              <div className="space-y-3">
                {PHONES.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    className="flex items-center gap-2 text-purple-neon hover:underline font-mono"
                  >
                    <Phone size={16} />
                    {phone}
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* الموقع */}
          <ScrollReveal delay={0.1}>
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={20} className="text-purple-neon" />
                {getTranslation(lang, 'contact.location_title')}
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {getTranslation(lang, 'contact.address')}
              </p>
            </div>
          </ScrollReveal>

          {/* الخريطة */}
          <ScrollReveal delay={0.2}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-lg font-bold p-4 pb-2" style={{ color: 'var(--text-primary)' }}>
                {getTranslation(lang, 'contact.map_title')}
              </h3>
              <iframe
                src={MAPS_EMBED_URL}
                className="maps-iframe w-full"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* الصف الثاني: سوشيال ميديا */}
        <ScrollReveal>
          <h3 className="text-xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            {getTranslation(lang, 'contact.social_title')}
          </h3>
          <div className={`flex flex-wrap justify-center gap-4 max-w-2xl mx-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
            <a href={SITE_CONFIG.FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ backgroundColor: '#1877F2' }}>
              <Facebook size={24} />
              <span>{getTranslation(lang, 'contact.facebook_label')}</span>
              <small>Laptop Land</small>
            </a>

            <a href={SITE_CONFIG.TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ backgroundColor: '#229ED9' }}>
              <Send size={24} />
              <span>{getTranslation(lang, 'contact.telegram_label')}</span>
              <small>Laptop Land</small>
            </a>

            <a href={SITE_CONFIG.WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="social-btn" style={{ backgroundColor: '#25D366' }}>
              <MessageCircle size={24} />
              <span>{getTranslation(lang, 'contact.whatsapp_label')}</span>
              <small>{getTranslation(lang, 'contact.whatsapp_sub')}</small>
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default ContactSection
