import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, LogOut, Package, BarChart3 } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import LanguageToggle from '../components/LanguageToggle.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useLanguage } from '../hooks/useLanguage.js'
import { useHMAC } from '../hooks/useHMAC.js'
import { getTranslation } from '../utils/translations.js'
import { PRODUCT_CATEGORIES, ICON_TYPES, BADGE_TYPES } from '../utils/constants.js'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, logout } = useAuth()
  const { lang } = useLanguage()
  const { fetchWithAuth } = useHMAC()

  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '', description: '', specs: '', price: '', category: '', image_url: '',
    badge: '', icon_type: 'laptop', inquiry_url: '', in_stock: true, sort_order: 0,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/laptopland-adminlogin')
    }
  }, [isLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
      loadStats()
    }
  }, [isAuthenticated])

  const loadProducts = async () => {
    try {
      const data = await fetchWithAuth('/api/admin/products', { admin: true })
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadStats = async () => {
    try {
      const data = await fetchWithAuth('/api/admin/stats', { admin: true })
      setStats(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await fetchWithAuth(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          admin: true,
          body: JSON.stringify(formData),
        })
      } else {
        await fetchWithAuth('/api/products', {
          method: 'POST',
          admin: true,
          body: JSON.stringify(formData),
        })
      }
      setShowModal(false)
      setEditingProduct(null)
      setFormData({
        name: '', description: '', specs: '', price: '', category: '', image_url: '',
        badge: '', icon_type: 'laptop', inquiry_url: '', in_stock: true, sort_order: 0,
      })
      loadProducts()
      loadStats()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(getTranslation(lang, 'admin.confirm_delete'))) return
    try {
      await fetchWithAuth(`/api/products/${id}`, { method: 'DELETE', admin: true })
      loadProducts()
      loadStats()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setFormData({ ...product })
    setShowModal(true)
  }

  const openAdd = () => {
    setEditingProduct(null)
    setFormData({
      name: '', description: '', specs: '', price: '', category: '', image_url: '',
      badge: '', icon_type: 'laptop', inquiry_url: '', in_stock: true, sort_order: 0,
    })
    setShowModal(true)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)' }}>Loading...</div>
  }

  if (!isAuthenticated) return null

  const t = (key) => getTranslation(lang, `admin.${key}`)

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col glass" style={{ borderRight: '1px solid var(--border)' }}>
        <div className="p-6 flex items-center gap-3">
          <Logo size={40} />
          <span className="font-orbitron font-bold text-purple-neon">LAPTOP LAND</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'products' ? 'bg-purple-primary/20 text-purple-neon' : 'hover:bg-purple-primary/10'}`}
          >
            <Package size={20} />
            {t('products_nav')}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'stats' ? 'bg-purple-primary/20 text-purple-neon' : 'hover:bg-purple-primary/10'}`}
          >
            <BarChart3 size={20} />
            {t('stats_nav')}
          </button>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 glass px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h1 className="text-xl font-orbitron font-bold">{t('title')}</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'products' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">{t('products_nav')}</h2>
                <button
                  onClick={openAdd}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-primary text-white font-bold hover:shadow-lg hover:shadow-purple-primary/30 transition-all"
                >
                  <Plus size={18} />
                  {t('add_product')}
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: 'var(--purple-primary)', color: 'white' }}>
                      <th className="px-4 py-3 text-right">{t('table_name')}</th>
                      <th className="px-4 py-3 text-right">{t('table_category')}</th>
                      <th className="px-4 py-3 text-right">{t('table_price')}</th>
                      <th className="px-4 py-3 text-right">{t('table_stock')}</th>
                      <th className="px-4 py-3 text-right">{t('table_actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <tr
                        key={product.id}
                        className="border-t transition-colors hover:bg-purple-primary/5"
                        style={{ borderColor: 'var(--border)', backgroundColor: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-surface)' }}
                      >
                        <td className="px-4 py-3 font-semibold">{product.name}</td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3 text-purple-neon font-bold">{product.price}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${product.in_stock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {product.in_stock ? t('in_stock') : t('out_of_stock')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-purple-primary/20 text-purple-neon transition-all">
                              <Pencil size={16} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-4xl font-orbitron font-black text-purple-neon mb-2">{stats.total}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Products</div>
                </div>
                <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-4xl font-orbitron font-black text-green-400 mb-2">{stats.in_stock}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>In Stock</div>
                </div>
                <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="text-4xl font-orbitron font-black text-red-400 mb-2">{stats.out_of_stock}</div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Out of Stock</div>
                </div>
              </div>

              <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 className="text-lg font-bold mb-6">Products by Category</h3>
                <div className="space-y-4">
                  {Object.entries(stats.by_category).map(([category, count]) => {
                    const percentage = (count / stats.total) * 100
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>{category}</span>
                          <span className="text-purple-neon">{count}</span>
                        </div>
                        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%`, backgroundColor: 'var(--purple-primary)' }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h2 className="text-xl font-bold mb-6">{editingProduct ? t('edit') : t('add_product')}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Specs</label>
                <input
                  type="text"
                  value={formData.specs || ''}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  placeholder="i7 | RTX 4060 | 16GB | 512GB"
                  className="w-full px-4 py-2 rounded-lg outline-none transition-all font-mono text-xs"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Price *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <option value="">Select...</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Icon</label>
                  <select
                    value={formData.icon_type}
                    onChange={(e) => setFormData({ ...formData, icon_type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    {ICON_TYPES.map((icon) => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Badge</label>
                  <select
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value || null })}
                    className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    {BADGE_TYPES.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Inquiry URL</label>
                <input
                  type="url"
                  value={formData.inquiry_url || ''}
                  onChange={(e) => setFormData({ ...formData, inquiry_url: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              <div>
                <label className="block text-sm mb-1" style={{ color: 'var(--text-muted)' }}>Image URL</label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-lg outline-none transition-all"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
                {formData.image_url && (
                  <div className="mt-2 rounded-lg overflow-hidden h-32" style={{ border: '1px solid var(--border)' }}>
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="w-4 h-4 rounded accent-purple-primary"
                />
                <label htmlFor="in_stock" className="text-sm" style={{ color: 'var(--text-muted)' }}>In Stock</label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-lg font-bold transition-all hover:bg-purple-primary/10"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg font-bold bg-purple-primary text-white hover:shadow-lg hover:shadow-purple-primary/30 transition-all"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
