import React from 'react'
import { getTranslation } from '../utils/translations.js'
import ScrollReveal from './ScrollReveal.jsx'
import StatsCounter from './StatsCounter.jsx'

const AboutSection = ({ lang }) => {
  const stats = getTranslation(lang, 'about.stats') || []
  const brands = ['MSI', 'REDRAGON', 'HAVIT', 'T-WOLF']

  return (
    <section id="about" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-orbitron font-black text-center mb-4 neon-text" style={{ color: 'var(--text-primary)' }}>
            {getTranslation(lang, 'about.section_title')}
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-primary to-purple-neon mb-12" />
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* النص */}
          <ScrollReveal direction={lang === 'ar' ? 'right' : 'left'}>
            <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
              {getTranslation(lang, 'about.text')}
            </p>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <StatsCounter key={i} value={stat.value} label={stat.label} />
              ))}
            </div>
          </ScrollReveal>

          {/* الشعارات */}
          <ScrollReveal direction={lang === 'ar' ? 'left' : 'right'}>
            <div className="grid grid-cols-2 gap-4">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className="rounded-xl p-8 flex items-center justify-center card-hover"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <span className="font-orbitron text-2xl md:text-3xl font-black text-purple-neon">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
