import React from 'react'
import { Wrench, ShieldCheck, Tag, Headphones } from 'lucide-react'
import { getTranslation } from '../utils/translations.js'
import ScrollReveal from './ScrollReveal.jsx'

// ===== قسم الخدمات =====
const ServicesSection = ({ lang }) => {
  const icons = [Wrench, ShieldCheck, Tag, Headphones]
  const items = getTranslation(lang, 'services.items') || []

  return (
    <section
      id="services"
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-orbitron font-black text-center mb-4 neon-text" style={{ color: 'var(--text-primary)' }}>
            {getTranslation(lang, 'services.section_title')}
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-primary to-purple-neon mb-16" />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const Icon = icons[index]
            return (
              <ScrollReveal key={index} delay={index * 0.15}>
                <div
                  className="group rounded-2xl p-8 text-center card-hover"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {/* دائرة الأيقونة */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-primary/40"
                    style={{ backgroundColor: 'var(--specs-bg)' }}
                  >
                    <Icon
                      size={32}
                      className="transition-all duration-300 group-hover:scale-110"
                      style={{ color: 'var(--purple-neon)' }}
                    />
                  </div>

                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
