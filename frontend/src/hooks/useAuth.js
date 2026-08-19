import { useState, useEffect, useCallback } from 'react'
import { SITE_CONFIG } from '../utils/constants.js'

// ===== هوك مصادقة الأدمن =====
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`${SITE_CONFIG.API_BASE_URL}/auth/me`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setIsAuthenticated(true)
        setUser(data)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const logout = useCallback(async () => {
    try {
      await fetch(`${SITE_CONFIG.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = '/laptopland-adminlogin'
    }
  }, [])

  return { isAuthenticated, isLoading, user, checkAuth, logout }
}
