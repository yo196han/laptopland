import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ===== عداد الإحصائيات المتحرك =====
const StatsCounter = ({ value, label, suffix = '' }) => {
  const ref = useRef(null)
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // استخراج الرقم من القيمة
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0
    const hasPlus = value.includes('+')
    const hasPercent = value.includes('%')

    const obj = { val: 0 }

    gsap.to(obj, {
      val: numericValue,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        let result = Math.round(obj.val).toString()
        if (hasPlus) result += '+'
        if (hasPercent) result += '%'
        setDisplayValue(result)
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill()
      })
    }
  }, [value])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-orbitron font-black text-purple-neon neon-text">
        {displayValue}
      </div>
      <div className="mt-2 text-sm md:text-base" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  )
}

export default StatsCounter
