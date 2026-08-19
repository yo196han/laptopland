import React, { useEffect, useRef } from 'react'
import { getCurrentTheme } from '../hooks/useTheme.js'

// ===== خلفية الجسيمات المتحركة =====
const ParticleCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId = null
    let particles = []
    let mouse = { x: null, y: null }

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const createParticles = () => {
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000))
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        })
      }
    }

    const draw = () => {
      const isDark = getCurrentTheme() === 'dark'
      const particleColor = isDark ? 'rgba(168,85,247,0.6)' : 'rgba(123,47,190,0.4)'
      const lineColor = isDark ? 'rgba(168,85,247,0.15)' : 'rgba(123,47,190,0.1)'

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // رسم الخطوط بين الجسيمات القريبة
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 1 - dist / 120
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // رسم الجسيمات
      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // تحديث الموقع
        p.x += p.vx
        p.y += p.vy

        // ارتداد من الحواف
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // تفاعل مع الماوس
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const force = (100 - dist) / 100
            p.vx += (dx / dist) * force * 0.02
            p.vy += (dy / dist) * force * 0.02
          }
        }
      })

      animationId = requestAnimationFrame(draw)
    }

    resize()
    createParticles()
    draw()

    const handleResize = () => {
      resize()
      createParticles()
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = null
      mouse.y = null
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  )
}

export default ParticleCanvas
