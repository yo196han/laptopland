import { useState, useEffect, useCallback } from 'react'
import { useHMAC } from './useHMAC.js'

// ===== هوك جلب وإدارة المنتجات =====
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { fetchWithAuth } = useHMAC()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWithAuth('/api/products')
      // ✅ التحقق أن الرد هو array
      if (Array.isArray(data)) {
        setProducts(data)
      } else if (data && Array.isArray(data.data)) {
        // بعض الـ APIs ترجع { data: [...] }
        setProducts(data.data)
      } else {
        console.warn('API returned non-array:', data)
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Products fetch error:', err.message)
      setError(err.message)
      // ✅ fallback: بيانات افتراضية مضمونة
      setProducts(getFallbackProducts())
    } finally {
      setLoading(false)
    }
  }, [fetchWithAuth])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

// ===== بيانات fallback (8 منتجات) =====
function getFallbackProducts() {
  return [
    {
      id: '1',
      name: 'MSI Katana 15 B13V',
      description: 'لابتوب جيمينج قوي مثالي للألعاب والتصميم',
      specs: 'Intel Core i7-13620H | RTX 4060 8GB | 16GB DDR5 | 512GB NVMe | 15.6" FHD 144Hz',
      price: '1,850,000 ل.س',
      category: 'لابتوب جيمينج',
      badge: 'الأكثر مبيعاً',
      icon_type: 'laptop',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن MSI Katana 15',
      image_url: null,
      in_stock: true,
      sort_order: 1,
    },
    {
      id: '2',
      name: 'Lenovo Legion 5 Gen 8',
      description: 'أداء استثنائي للألعاب الثقيلة',
      specs: 'AMD Ryzen 7 7745HX | RTX 4060 8GB | 16GB DDR5 | 1TB NVMe | 15.6" FHD 165Hz',
      price: '2,100,000 ل.س',
      category: 'لابتوب جيمينج',
      badge: 'جديد',
      icon_type: 'laptop',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن Lenovo Legion 5',
      image_url: null,
      in_stock: true,
      sort_order: 2,
    },
    {
      id: '3',
      name: 'HP Pavilion 15',
      description: 'لابتوب مكتبي موثوق للعمل اليومي',
      specs: 'Intel Core i5-1235U | Intel Iris Xe | 8GB DDR4 | 256GB SSD | 15.6" FHD IPS',
      price: '950,000 ل.س',
      category: 'لابتوب مكتبي',
      badge: null,
      icon_type: 'laptop',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن HP Pavilion 15',
      image_url: null,
      in_stock: true,
      sort_order: 3,
    },
    {
      id: '4',
      name: 'Dell Inspiron 15 3520',
      description: 'أداء ممتاز بسعر مناسب',
      specs: 'Intel Core i5-1235U | Intel UHD | 8GB DDR4 | 512GB SSD | 15.6" FHD',
      price: '870,000 ل.س',
      category: 'لابتوب مكتبي',
      badge: null,
      icon_type: 'laptop',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن Dell Inspiron 15',
      image_url: null,
      in_stock: true,
      sort_order: 4,
    },
    {
      id: '5',
      name: 'Redragon K552 Kumara',
      description: 'كيبورد ميكانيكي تكتايل احترافي',
      specs: 'مفاتيح ميكانيكية Blue | إضاءة RGB | TKL Layout | ضد الماء | USB',
      price: '185,000 ل.س',
      category: 'إكسسوارات',
      badge: 'عرض',
      icon_type: 'keyboard',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن Redragon K552',
      image_url: null,
      in_stock: true,
      sort_order: 5,
    },
    {
      id: '6',
      name: 'Havit HV-H2002d',
      description: 'سماعات ستيريو بصوت عميق وواضح',
      specs: 'درايفر 50mm | استجابة 20Hz-20kHz | مايكروفون مدمج | 3.5mm + USB | وزن 228g',
      price: '120,000 ل.س',
      category: 'إكسسوارات',
      badge: null,
      icon_type: 'headphones',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن Havit HV-H2002d',
      image_url: null,
      in_stock: true,
      sort_order: 6,
    },
    {
      id: '7',
      name: 'Redragon M711 Cobra',
      description: 'ماوس جيمينج دقيق بـ 7 أزرار قابلة للبرمجة',
      specs: 'DPI: 10000 | 7 أزرار | إضاءة RGB | ذاكرة داخلية | كابل نايلون 1.8m',
      price: '95,000 ل.س',
      category: 'إكسسوارات',
      badge: 'عرض',
      icon_type: 'mouse',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن Redragon M711',
      image_url: null,
      in_stock: true,
      sort_order: 7,
    },
    {
      id: '8',
      name: 'T-Wolf M60',
      description: 'ماوس خفيف وعملي للاستخدام اليومي',
      specs: 'DPI: 1200/2400 | 6 أزرار | إضاءة RGB | USB | وزن 95g',
      price: '65,000 ل.س',
      category: 'إكسسوارات',
      badge: null,
      icon_type: 'mouse',
      inquiry_url: 'https://wa.me/+963993178291?text=استفسار عن T-Wolf M60',
      image_url: null,
      in_stock: true,
      sort_order: 8,
    },
  ]
}
