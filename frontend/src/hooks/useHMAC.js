import { useCallback } from 'react'
import { getAuthHeaders } from '../utils/hmac.js'
import { SITE_CONFIG } from '../utils/constants.js'

// ===== هوك HMAC للاتصال بالـ API =====
export function useHMAC() {
  const getHeaders = useCallback(async () => {
    return await getAuthHeaders()
  }, [])

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const { admin = false, ...fetchOptions } = options
    const headers = await getHeaders()

    const finalOptions = {
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
    }

    if (admin) {
      finalOptions.credentials = 'include'
    }

    const response = await fetch(`${SITE_CONFIG.API_BASE_URL}${url}`, finalOptions)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }, [getHeaders])

  return { getHeaders, fetchWithAuth }
}
