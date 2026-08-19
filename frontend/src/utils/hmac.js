// ===== جلب HMAC Token من Backend =====
// الـ Frontend لا يحتوي على Secret — يطلب token مؤقت من الـ Backend
export async function getSecureToken() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  const res = await fetch(`${apiUrl}/api/token`)
  if (!res.ok) {
    throw new Error('Failed to fetch secure token')
  }
  const data = await res.json()
  return data.token
}

export async function getAuthHeaders() {
  const token = await getSecureToken()
  return {
    'Content-Type': 'application/json',
    'X-LL-Token': token,
  }
}
