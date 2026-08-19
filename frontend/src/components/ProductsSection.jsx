import React, { useState } from 'react'
import { getTranslation } from '../utils/translations.js'
import { useProducts } from '../hooks/useProducts.js'
import ProductCard from './ProductCard.jsx'
import ScrollReveal from './ScrollReveal.jsx'

// ===== قسم المنتجات =====
const ProductsSection = ({ lang }) => {
  const [activeFilter, setActiveFilter] = useState('all')
  const { products, loading } = useProducts()

  const filters = [
    { key: 'all', label: getTranslation(lang, 'products.filter_all') },
    { key: 'لابتوب جيمينج', label: getTranslation(lang, 'products.filter_gaming') },
    { key: 'لابتوب مكتبي', label: getTranslation(lang, 'products.filter_office') },
    { key: 'إكسسوارات', label: getTranslation(lang, 'products.filter_accessories') },
  ]

  // ✅ تأكد أن products هو array
  const safeProducts = Array.isArray(products) ? products : []

  const filteredProducts = activeFilter === 'all'
    ? safeProducts
    : safeProducts.filter((p) => p.category === activeFilter)

  const isRTL = lang === 'ar'

  return (
    <section
      id="products"
      className="py-20 md:py-28"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-orbitron font-black text-center mb-4 neon-text" style={{ color: 'var(--text-primary)' }}>
            {getTranslation(lang, 'products.section_title')}
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-purple-primary to-purple-neon mb-12" />
        </ScrollReveal>

        {/* أزرار التصفية */}
        <ScrollReveal delay={0.1}>
          <div className={`flex flex-wrap justify-center gap-3 mb-12 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  activeFilter === filter.key
                    ? 'text-white shadow-lg shadow-purple-primary/30'
                    : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor: activeFilter === filter.key ? 'var(--purple-primary)' : 'var(--bg-card)',
                  color: activeFilter === filter.key ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* شبكة المنتجات */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-6 skeleton"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  height: '400px',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ScrollReveal key={product.id} delay={index * 0.1}>
                <ProductCard product={product} lang={lang} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsSection
