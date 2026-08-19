import React, { useState } from 'react'
import { Copy, Check, AlertTriangle, X } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import { useLanguage } from '../hooks/useLanguage.js'
import { getTranslation } from '../utils/translations.js'

// ===== Toast Component =====
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'error' ? 'bg-red-500/90' : type === 'success' ? 'bg-green-500/90' : 'bg-purple-primary/90'
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-xl ${bgColor} text-white shadow-lg animate-in`}>
      {type === 'error' && <AlertTriangle size={18} />}
      {type === 'success' && <Check size={18} />}
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={16} /></button>
    </div>
  )
}

// ===== أداة التشفير المزدوج AES-256 =====
const KeyGenerator = () => {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('encrypt')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [data, setData] = useState('')
  const [encrypted, setEncrypted] = useState('')
  const [decrypted, setDecrypted] = useState('')
  const [kgPassword, setKgPassword] = useState('')
  const [kgLength, setKgLength] = useState(32)
  const [kgHex, setKgHex] = useState('')
  const [kgB64, setKgB64] = useState('')
  const [copied, setCopied] = useState(false)
  const [strength, setStrength] = useState({ score: 0, label: '', color: '' })
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const t = (key) => getTranslation(lang, `keygen.${key}`)

  const checkStrength = (val) => {
    let score = 0
    if (val.length >= 12) score++
    if (val.length >= 20) score++
    if (/[A-Z]/.test(val)) score++
    if (/[a-z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++

    const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#22C55E', '#22C55E', '#22C55E']
    const labels = [t('weak'), t('fair'), t('good'), t('strong'), t('very_strong'), t('extremely_strong')]

    setStrength({
      score,
      label: labels[score] || '',
      color: colors[score] || '#EF4444',
    })
  }

  const deriveKey = async (password, salt, hashAlgo = 'SHA-256', iterations = 310000) => {
    const passwordKey = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
    )
    return await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: hashAlgo },
      passwordKey, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']
    )
  }

  const encryptDouble = async (plaintext, password) => {
    const VERSION = 0x02
    const salt1 = crypto.getRandomValues(new Uint8Array(32))
    const iv1 = crypto.getRandomValues(new Uint8Array(12))
    const key1 = await deriveKey(password, salt1, 'SHA-256', 310000)
    const ct1 = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv1 }, key1, new TextEncoder().encode(plaintext)))

    const salt2Seed = crypto.getRandomValues(new Uint8Array(32))
    const salt2 = new Uint8Array(salt2Seed.length + salt1.length + iv1.length)
    salt2.set(salt2Seed, 0)
    salt2.set(salt1, salt2Seed.length)
    salt2.set(iv1, salt2Seed.length + salt1.length)

    const iv2 = crypto.getRandomValues(new Uint8Array(12))
    const key2 = await deriveKey(password, salt2, 'SHA-512', 480000)
    const ct2 = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv2 }, key2, ct1))

    const out = new Uint8Array(1 + 32 + 12 + 32 + 12 + ct2.length)
    let offset = 0
    out[offset++] = VERSION
    out.set(salt1, offset); offset += 32
    out.set(iv1, offset); offset += 12
    out.set(salt2Seed, offset); offset += 32
    out.set(iv2, offset); offset += 12
    out.set(ct2, offset)

    return btoa(String.fromCharCode(...out))
  }

  const decryptDouble = async (encryptedB64, password) => {
    const raw = Uint8Array.from(atob(encryptedB64), c => c.charCodeAt(0))
    let offset = 0
    const version = raw[offset++]
    if (version !== 0x02) throw new Error('Invalid version')
    const salt1 = raw.slice(offset, offset + 32); offset += 32
    const iv1 = raw.slice(offset, offset + 12); offset += 12
    const salt2Seed = raw.slice(offset, offset + 32); offset += 32
    const iv2 = raw.slice(offset, offset + 12); offset += 12
    const ct2 = raw.slice(offset)

    const salt2 = new Uint8Array(salt2Seed.length + salt1.length + iv1.length)
    salt2.set(salt2Seed, 0)
    salt2.set(salt1, salt2Seed.length)
    salt2.set(iv1, salt2Seed.length + salt1.length)

    const key2 = await deriveKey(password, salt2, 'SHA-512', 480000)
    const ct1 = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv2 }, key2, ct2))

    const key1 = await deriveKey(password, salt1, 'SHA-256', 310000)
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv1 }, key1, ct1)

    return new TextDecoder().decode(plain)
  }

  const handleEncrypt = async () => {
    if (!password) return showToast(t('password') + ' required')
    if (password !== password2) return showToast('Passwords do not match')
    if (!data) return showToast('Data required')
    try {
      const result = await encryptDouble(data, password)
      setEncrypted(result)
      showToast('Encrypted successfully', 'success')
    } catch (e) {
      console.error('Encryption failed:', e)
      showToast('Encryption failed')
    }
  }

  const handleDecrypt = async () => {
    if (!password) return showToast(t('password') + ' required')
    if (!encrypted) return showToast('Data required')
    try {
      const result = await decryptDouble(encrypted, password)
      setDecrypted(result)
      showToast('Decrypted successfully', 'success')
    } catch (e) {
      console.error('Decryption failed:', e)
      showToast('Decryption failed: wrong password or corrupted data')
    }
  }

  const generateKey = async () => {
    let keyBytes
    if (kgPassword) {
      const salt = crypto.getRandomValues(new Uint8Array(32))
      const key = await deriveKey(kgPassword, salt, 'SHA-512', 310000)
      const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key))
      keyBytes = new Uint8Array(raw.slice(0, Math.min(kgLength, 32)))
      if (kgLength > 32) {
        const key2 = await deriveKey(kgPassword + '_ext', salt, 'SHA-512', 480000)
        const raw2 = new Uint8Array(await crypto.subtle.exportKey('raw', key2))
        const extra = new Uint8Array(kgLength)
        extra.set(keyBytes, 0)
        extra.set(raw2.slice(0, kgLength - 32), 32)
        keyBytes = extra
      }
    } else {
      keyBytes = crypto.getRandomValues(new Uint8Array(kgLength))
    }

    const hex = Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join('')
    const b64 = btoa(String.fromCharCode(...keyBytes))
    setKgHex(hex)
    setKgB64(b64)
    showToast('Key generated successfully', 'success')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { key: 'encrypt', label: t('encrypt_tab') },
    { key: 'decrypt', label: t('decrypt_tab') },
    { key: 'keygen', label: t('keygen_tab') },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 circuit-bg" style={{ backgroundColor: 'var(--bg-base)' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full max-w-2xl rounded-2xl p-8 glass" style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-glow)' }}>
        <div className="text-center mb-8">
          <Logo size={60} className="mx-auto mb-4" />
          <h1 className="font-orbitron text-xl font-bold text-purple-neon">LAPTOP LAND</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
        </div>

        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.key ? 'bg-purple-primary text-white' : 'hover:bg-purple-primary/10'}`}
              style={activeTab === tab.key ? {} : { color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'encrypt' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d' }}>
              {t('warning')}
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); checkStrength(e.target.value) }}
                className="w-full px-4 py-3 rounded-lg outline-none font-mono text-sm"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
              <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(strength.score / 6) * 100}%`, backgroundColor: strength.color }} />
              </div>
              <div className="text-xs mt-1" style={{ color: strength.color }}>{strength.label}</div>
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('confirm_password')}</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none font-mono text-sm"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('data')}</label>
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none font-mono text-sm resize-y"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', minHeight: '80px' }}
              />
            </div>

            <button onClick={handleEncrypt} className="w-full py-3 rounded-lg font-bold bg-purple-primary text-white hover:shadow-lg hover:shadow-purple-primary/30 transition-all">
              {t('encrypt_btn')}
            </button>

            {encrypted && (
              <div className="relative">
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('result')}</label>
                <div className="p-4 rounded-lg font-mono text-xs break-all relative" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--purple-neon)' }}>
                  {encrypted}
                  <button onClick={() => copyToClipboard(encrypted)} className="absolute top-2 left-2 p-1.5 rounded bg-purple-primary text-white hover:bg-purple-accent transition-all">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'decrypt' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none font-mono text-sm"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('decrypt_data')}</label>
              <textarea
                value={encrypted}
                onChange={(e) => setEncrypted(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none font-mono text-sm resize-y"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', minHeight: '80px' }}
              />
            </div>

            <button onClick={handleDecrypt} className="w-full py-3 rounded-lg font-bold bg-purple-primary text-white hover:shadow-lg hover:shadow-purple-primary/30 transition-all">
              {t('decrypt_btn')}
            </button>

            {decrypted && (
              <div className="relative">
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('original')}</label>
                <div className="p-4 rounded-lg font-mono text-xs break-all relative" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: '#86efac' }}>
                  {decrypted}
                  <button onClick={() => copyToClipboard(decrypted)} className="absolute top-2 left-2 p-1.5 rounded bg-purple-primary text-white hover:bg-purple-accent transition-all">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'keygen' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('optional_password')}</label>
              <input
                type="password"
                value={kgPassword}
                onChange={(e) => setKgPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg outline-none font-mono text-sm"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('key_length')}</label>
              <select
                value={kgLength}
                onChange={(e) => setKgLength(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-lg outline-none"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                <option value={32}>256-bit (32 bytes) — AES-256</option>
                <option value={64}>512-bit (64 bytes) — SESSION_SECRET</option>
                <option value={128}>1024-bit (128 bytes) — Maximum</option>
              </select>
            </div>

            <button onClick={generateKey} className="w-full py-3 rounded-lg font-bold bg-purple-primary text-white hover:shadow-lg hover:shadow-purple-primary/30 transition-all">
              {t('generate_btn')}
            </button>

            {kgHex && (
              <>
                <div className="relative">
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('hex')}</label>
                  <div className="p-4 rounded-lg font-mono text-xs break-all relative" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--purple-neon)' }}>
                    {kgHex}
                    <button onClick={() => copyToClipboard(kgHex)} className="absolute top-2 left-2 p-1.5 rounded bg-purple-primary text-white hover:bg-purple-accent transition-all">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{t('base64')}</label>
                  <div className="p-4 rounded-lg font-mono text-xs break-all relative" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--purple-neon)' }}>
                    {kgB64}
                    <button onClick={() => copyToClipboard(kgB64)} className="absolute top-2 left-2 p-1.5 rounded bg-purple-primary text-white hover:bg-purple-accent transition-all">
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default KeyGenerator
