// ===== إعدادات الموقع =====
export const SITE_CONFIG = {
  DEFAULT_INQUIRY_URL: 'https://wa.me/+963993178291',
  FACEBOOK_URL: 'https://www.facebook.com/profile.php?id=61557618479960',
  TELEGRAM_URL: 'https://t.me/laptoplandhoms',
  WHATSAPP_URL: 'https://wa.me/+963993178291',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
}

export const PHONES = [
  '0993178291',
  '0934838874',
  '0939240923',
]

export const BRANDS = ['MSI', 'REDRAGON', 'HAVIT', 'T-WOLF']

export const PRODUCT_CATEGORIES = [
  'لابتوب جيمينج',
  'لابتوب مكتبي',
  'إكسسوارات',
  'سماعات',
  'كيبورد',
  'ماوس',
]

export const ICON_TYPES = [
  { value: 'laptop', label: 'Laptop' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'headphones', label: 'Headphones' },
  { value: 'monitor', label: 'Monitor' },
]

export const BADGE_TYPES = [
  { value: '', label: 'لا يوجد / None' },
  { value: 'الأكثر مبيعاً', label: 'الأكثر مبيعاً / Best Seller' },
  { value: 'جديد', label: 'جديد / New' },
  { value: 'عرض', label: 'عرض / Offer' },
]

export const MAPS_EMBED_URL = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d820.0149836353418!2d36.72537578531953!3d34.70366821644548!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15230f002f9fff5f%3A0xb0e2aef372189f6f!2sLaptop%20Land!5e0!3m2!1sen!2sjp!4v1787085746193!5m2!1sen!2sjp'
