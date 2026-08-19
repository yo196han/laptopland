import React, { useEffect, useRef } from 'react'

// ===== تأثير الإضاءة البنفسجية حول المؤشر =====
const CursorGlow = () => {
  const glowRef = useRef(null)

  useEffect(() => {
    // تعطيل على الجوال
    if (window.matchMedia('(pointer: coarse)').matches) return

    const glow = glowRef.current
    let rafId = null
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const updatePosition = () => {
      glow.style.transform = `translate(${mouseX - 150}px, ${mouseY - 150}px)`
      rafId = requestAnimationFrame(updatePosition)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafId = requestAnimationFrame(updatePosition)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // لا تعرض على الجوال
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
      style={{
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        transition: 'transform 0.1s linear',
      }}
    />
  )
}

export default CursorGlow
