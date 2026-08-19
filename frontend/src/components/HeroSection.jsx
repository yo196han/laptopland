import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown, Phone } from 'lucide-react'
import ParticleCanvas from '../components/ParticleCanvas.jsx'
import { getTranslation } from '../utils/translations.js'

// ===== قسم Hero الرئيسي =====
const HeroSection = ({ lang }) => {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const laptopRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current.querySelectorAll('.animate-in'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.3,
        }
      )

      gsap.fromTo(
        laptopRef.current,
        { opacity: 0, rotateY: -30, scale: 0.8 },
        {
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5,
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleScroll = (e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const isRTL = lang === 'ar'

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* خلفية الجسيمات */}
      <ParticleCanvas />

      {/* تأثير الشفق */}
      <div className="absolute inset-0 hero-vignette pointer-events-none" style={{ zIndex: 1 }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? '' : 'lg:flex-row-reverse'}`}>
          {/* النص */}
          <div ref={contentRef} className={`text-center ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}>
            <h1
              className="animate-in font-orbitron text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 neon-text"
              style={{ color: 'var(--text-primary)' }}
            >
              {getTranslation(lang, 'hero.title')}
            </h1>

            <p
              className="animate-in text-lg md:text-xl mb-8 font-cairo"
              style={{ color: 'var(--text-muted)' }}
            >
              {getTranslation(lang, 'hero.subtitle')}
            </p>

            <div className={`animate-in flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''} justify-center lg:justify-start`}>
              <a
                href="#products"
                onClick={(e) => handleScroll(e, '#products')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-primary/40 hover:-translate-y-1"
                style={{ backgroundColor: 'var(--purple-primary)' }}
              >
                <ArrowDown size={20} />
                {getTranslation(lang, 'hero.cta_primary')}
              </a>

              <a
                href="#contact"
                onClick={(e) => handleScroll(e, '#contact')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  border: '2px solid var(--purple-primary)',
                  color: 'var(--purple-neon)',
                }}
              >
                <Phone size={20} />
                {getTranslation(lang, 'hero.cta_secondary')}
              </a>
            </div>
          </div>

          {/* لابتوب تزييني */}
          <div ref={laptopRef} className="hidden lg:flex justify-center items-center perspective-1000">
            <div
              className="relative w-80 h-52 rounded-xl animate-float"
              style={{
                background: 'linear-gradient(135deg, var(--dark-card) 0%, var(--purple-primary) 100%)',
                border: '2px solid var(--purple-accent)',
                boxShadow: '0 0 60px rgba(168,85,247,0.3), inset 0 0 40px rgba(168,85,247,0.1)',
                transform: 'rotateY(-15deg) rotateX(5deg)',
              }}
            >
              {/* شاشة */}
              <div
                className="absolute inset-3 rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, rgba(168,85,247,0.2) 0%, rgba(13,13,15,0.9) 100%)',
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-orbitron text-3xl font-black text-purple-neon animate-pulse-glow">
                    LL
                  </span>
                </div>
                {/* خطوط برمجية زخرفية */}
                <div className="absolute top-4 left-4 right-4 space-y-2">
                  <div className="h-1 rounded-full bg-purple-primary/30 w-3/4" />
                  <div className="h-1 rounded-full bg-purple-primary/20 w-1/2" />
                  <div className="h-1 rounded-full bg-purple-primary/30 w-2/3" />
                </div>
              </div>

              {/* قاعدة اللابتوب */}
              <div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-96 h-3 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, var(--purple-accent), transparent)',
                  opacity: 0.5,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
