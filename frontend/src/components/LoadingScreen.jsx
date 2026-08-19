import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../hooks/useLanguage.js'
import { getTranslation } from '../utils/translations.js'

// ===== شاشة التحميل — 5 ثواني كاملة =====
const LoadingScreen = ({ onComplete }) => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const taglineRef = useRef(null)
  const progressRef = useRef(null)
  const { lang } = useLanguage()

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('ll_loaded')
    if (hasLoaded) {
      onComplete?.()
      return
    }

    const svg = svgRef.current
    const paths = svg.querySelectorAll('path, circle')

    // إعداد stroke-dasharray/offset لكل path
    paths.forEach((path) => {
      const length = path.getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      })
    })

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('ll_loaded', 'true')
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => onComplete?.(),
        })
      },
    })

    // ═══════════════════════════════════════════════
    // المدة الكلية: 5 ثواني
    // ═══════════════════════════════════════════════

    // 1️⃣ رسم الـ SVG (0s → 1.5s)
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.5,
      stagger: 0.12,
      ease: 'power2.inOut',
    })
    // Glow pulse (1.5s → 2.0s)
    .to(svg, {
      filter: 'drop-shadow(0 0 30px rgba(168,85,247,0.9))',
      duration: 0.25,
      yoyo: true,
      repeat: 3,
      ease: 'sine.inOut',
    })
    // 2️⃣ LAPTOP LAND (2.0s → 2.8s)
    .fromTo(
      titleRef.current.querySelectorAll('.letter'),
      { opacity: 0, y: 30, scale: 0.7 },
      { opacity: 1, y: 0, scale: 1, duration: 0.08, stagger: 0.06, ease: 'back.out(1.7)' },
      '-=0.2'
    )
    // 3️⃣ Sale & Service (2.8s → 3.3s)
    .fromTo(
      subtitleRef.current,
      { opacity: 0, letterSpacing: '1em' },
      { opacity: 1, letterSpacing: '0.25em', duration: 0.5, ease: 'power2.out' },
      '-=0.1'
    )
    // 4️⃣ Tagline (3.3s → 3.6s)
    .fromTo(
      taglineRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3 },
      '-=0.1'
    )
    // 5️⃣ Progress bar (3.6s → 4.6s)
    .fromTo(
      progressRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.0, ease: 'power2.inOut', transformOrigin: 'left center' },
      '-=0.1'
    )
    // 6️⃣ انتظار 0.4s إضافية → المجموع 5s
    .to({}, { duration: 0.4 })

    return () => { tl.kill() }
  }, [onComplete])

  const tagline = getTranslation(lang, 'loading_screen.tagline')
  const letters = 'LAPTOP LAND'.split('')

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center circuit-bg"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* ===== اللوغو الأصلي SVG ===== */}
      <svg
        ref={svgRef}
        width="220"
        height="124"
        viewBox="0 0 800 450"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8"
      >
        <defs>
          <linearGradient id="loader-purple" x1="0" y1="0" x2="800" y2="397" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4B00D8"/>
            <stop offset="0.55" stopColor="#5A00FF"/>
            <stop offset="1" stopColor="#3F00B8"/>
          </linearGradient>
        </defs>
        <g transform="translate(12 27)">
          <path d="M 289 112 L 241 226 L 354 220" fill="none" stroke="url(#loader-purple)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 308 140 L 264 258 L 372 251" fill="none" stroke="url(#loader-purple)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="300" cy="204" r="123" fill="none" stroke="url(#loader-purple)" strokeWidth="14" strokeLinecap="round"/>
          <path d="M 36 132 L 9 52 Q 3 31 17 16 Q 27 7 44 7 L 477 7 Q 501 7 508 29 L 619 348 Q 625 368 647 368 L 768 368 Q 778 368 778 378 Q 778 386 768 386 L 139 386" fill="none" stroke="url(#loader-purple)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 46 165 L 56 198" fill="none" stroke="url(#loader-purple)" strokeWidth="22" strokeLinecap="round"/>
          <path d="M 67 237 L 102 349 Q 110 378 139 386" fill="none" stroke="url(#loader-purple)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
      </svg>

      {/* ===== LAPTOP LAND ===== */}
      <div ref={titleRef} className="flex gap-[2px] md:gap-1 mb-3">
        {letters.map((letter, i) => (
          <span key={i} className="letter font-orbitron text-3xl md:text-5xl font-black opacity-0" style={{ color: 'var(--text-primary)' }}>
            {letter === ' ' ? ' ' : letter}
          </span>
        ))}
      </div>

      {/* ===== Sale & Service ===== */}
      <p ref={subtitleRef} className="font-orbitron text-sm md:text-lg font-bold italic tracking-[0.25em] opacity-0 mb-4" style={{ color: 'var(--purple-neon)' }}>
        — Sale &amp; Service —
      </p>

      {/* ===== Tagline ===== */}
      <p ref={taglineRef} className="text-base md:text-lg font-cairo font-semibold opacity-0" style={{ color: 'var(--text-muted)' }}>
        {tagline}
      </p>

      {/* ===== Progress bar ===== */}
      <div className="w-56 md:w-72 h-1.5 mt-8 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div ref={progressRef} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, var(--purple-primary), var(--purple-neon))', transform: 'scaleX(0)' }}/>
      </div>
    </div>
  )
}

export default LoadingScreen
