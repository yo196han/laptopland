import React, { useCallback } from 'react'

// ===== زر الأدمن المخفي (ثلاث نقرات) =====
const AdminTrigger = () => {
  const handleClick = useCallback(() => {
    let clickCount = parseInt(sessionStorage.getItem('admin_clicks') || '0', 10)
    clickCount++
    sessionStorage.setItem('admin_clicks', clickCount.toString())

    setTimeout(() => {
      sessionStorage.setItem('admin_clicks', '0')
    }, 600)

    if (clickCount >= 3) {
      sessionStorage.setItem('admin_clicks', '0')
      window.location.href = '/laptopland-adminlogin'
    }
  }, [])

  return (
    <span
      onClick={handleClick}
      className="absolute bottom-2 left-2 w-5 h-5 cursor-default"
      style={{ opacity: 0 }}
      aria-hidden="true"
    />
  )
}

export default AdminTrigger
