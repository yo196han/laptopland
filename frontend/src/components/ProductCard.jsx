import React from 'react'
import { Laptop, Keyboard, MousePointer2, Headphones, Monitor, Package, MessageCircle } from 'lucide-react'
import { getTranslation } from '../utils/translations.js'
import { SITE_CONFIG } from '../utils/constants.js'

// ===== أيقونة المنتج (fallback) =====
const ProductIcon = ({ type, size = 64 }) => {
  const iconMap = {
    laptop: Laptop,
    keyboard: Keyboard,
    mouse: MousePointer2,
    headphones: Headphones,
    monitor: Monitor,
  }
  const Icon = iconMap[type] || Package
  return (
    <Icon
      size={size}
      style={{ color: '#A855F7', filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.6))' }}
    />
  )
}

// ===== بطاقة المنتج =====
const ProductCard = ({ product, lang }) => {
  const badgeColors = {
    'الأكثر مبيعاً': 'bg-yellow-500',
    'جديد': 'bg-green-500',
    'عرض': 'bg-orange-500',
  }

  const isOutOfStock = !product.in_stock

  return (
    <div
      className={`relative rounded-2xl overflow-hidden card-hover ${isOutOfStock ? 'opacity-60' : ''}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* ===== صورة المنتج ===== */}
      <div className="relative w-full h-48 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        {/* Fallback: أيقونة لو ما في صورة */}
        <div
          className={`absolute inset-0 items-center justify-center ${product.image_url ? 'hidden' : 'flex'}`}
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <ProductIcon type={product.icon_type} size={64} />
        </div>

        {/* شارة المنتج */}
        {product.badge && (
          <div
            className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} px-3 py-1 rounded-full text-xs font-bold text-white ${badgeColors[product.badge] || 'bg-purple-primary'}`}
          >
            {product.badge}
          </div>
        )}
      </div>

      {/* ===== تفاصيل المنتج ===== */}
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {product.name}
        </h3>

        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {product.description}
        </p>

        {product.specs && (
          <div
            className="rounded-lg p-3 mb-4 font-mono text-xs"
            style={{ backgroundColor: 'var(--specs-bg)', color: 'var(--purple-neon)' }}
          >
            {product.specs}
          </div>
        )}

        <div className="text-2xl font-bold mb-4 text-purple-neon">
          {product.price}
        </div>

        <button
          onClick={() => {
            window.open(product.inquiry_url || SITE_CONFIG.DEFAULT_INQUIRY_URL, '_blank')
          }}
          disabled={isOutOfStock}
          className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
            isOutOfStock ? 'cursor-not-allowed opacity-50' : 'hover:shadow-lg hover:shadow-purple-primary/30'
          }`}
          style={{ backgroundColor: isOutOfStock ? 'var(--bg-surface)' : 'var(--purple-primary)', color: 'white' }}
        >
          <MessageCircle size={18} />
          {isOutOfStock ? getTranslation(lang, 'products.out_of_stock') : getTranslation(lang, 'products.inquiry_btn')}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
