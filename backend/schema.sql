-- ============================================
-- LAPTOP LAND — Supabase PostgreSQL Schema
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- جدول المنتجات
CREATE TABLE products (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL,
    description TEXT,
    specs       TEXT,
    price       TEXT        NOT NULL,
    category    TEXT        NOT NULL,
    badge       TEXT        CHECK (badge IN ('الأكثر مبيعاً','جديد','عرض') OR badge IS NULL),
    icon_type   TEXT        NOT NULL DEFAULT 'laptop'
                            CHECK (icon_type IN ('laptop','keyboard','mouse','headphones','monitor')),
    inquiry_url TEXT,
    image_url   TEXT,
    image_url   TEXT,       -- ✅ رابط صورة المنتج
    in_stock    BOOLEAN     NOT NULL DEFAULT true,
    sort_order  INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- دالة تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- تفعيل RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- سياسة: Anon يقرأ فقط المنتجات المتوفرة
CREATE POLICY "public_read_in_stock" ON products
FOR SELECT TO anon
USING (in_stock = true);

-- ============================================
-- بيانات افتراضية (Seed Data)
-- ============================================

INSERT INTO products
  (name, description, specs, price, category, badge, icon_type, inquiry_url, image_url, in_stock, sort_order)
VALUES
(
  'MSI Katana 15 B13V',
  'لابتوب جيمينج قوي مثالي للألعاب والتصميم',
  'Intel Core i7-13620H | RTX 4060 8GB | 16GB DDR5 | 512GB NVMe | 15.6" FHD 144Hz',
  '1,850,000 ل.س', 'لابتوب جيمينج', 'الأكثر مبيعاً', 'laptop',
  'https://wa.me/+963993178291?text=استفسار عن MSI Katana 15',
  NULL, true, 1
),
(
  'Lenovo Legion 5 Gen 8',
  'أداء استثنائي للألعاب الثقيلة',
  'AMD Ryzen 7 7745HX | RTX 4060 8GB | 16GB DDR5 | 1TB NVMe | 15.6" FHD 165Hz',
  '2,100,000 ل.س', 'لابتوب جيمينج', 'جديد', 'laptop',
  'https://wa.me/+963993178291?text=استفسار عن Lenovo Legion 5',
  NULL, true, 2
),
(
  'HP Pavilion 15',
  'لابتوب مكتبي موثوق للعمل اليومي',
  'Intel Core i5-1235U | Intel Iris Xe | 8GB DDR4 | 256GB SSD | 15.6" FHD IPS',
  '950,000 ل.س', 'لابتوب مكتبي', NULL, 'laptop',
  'https://wa.me/+963993178291?text=استفسار عن HP Pavilion 15',
  NULL, true, 3
),
(
  'Dell Inspiron 15 3520',
  'أداء ممتاز بسعر مناسب',
  'Intel Core i5-1235U | Intel UHD | 8GB DDR4 | 512GB SSD | 15.6" FHD',
  '870,000 ل.س', 'لابتوب مكتبي', NULL, 'laptop',
  'https://wa.me/+963993178291?text=استفسار عن Dell Inspiron 15',
  NULL, true, 4
),
(
  'Redragon K552 Kumara',
  'كيبورد ميكانيكي تكتايل احترافي',
  'مفاتيح ميكانيكية Blue | إضاءة RGB | TKL Layout | ضد الماء | USB',
  '185,000 ل.س', 'إكسسوارات', 'عرض', 'keyboard',
  'https://wa.me/+963993178291?text=استفسار عن Redragon K552',
  NULL, true, 5
),
(
  'Havit HV-H2002d',
  'سماعات ستيريو بصوت عميق وواضح',
  'درايفر 50mm | استجابة 20Hz-20kHz | مايكروفون مدمج | 3.5mm + USB | وزن 228g',
  '120,000 ل.س', 'إكسسوارات', NULL, 'headphones',
  'https://wa.me/+963993178291?text=استفسار عن Havit HV-H2002d',
  NULL, true, 6
),
(
  'Redragon M711 Cobra',
  'ماوس جيمينج دقيق بـ 7 أزرار قابلة للبرمجة',
  'DPI: 10000 | 7 أزرار | إضاءة RGB | ذاكرة داخلية | كابل نايلون 1.8m',
  '95,000 ل.س', 'إكسسوارات', 'عرض', 'mouse',
  'https://wa.me/+963993178291?text=استفسار عن Redragon M711',
  NULL, true, 7
),
(
  'T-Wolf M60',
  'ماوس خفيف وعملي للاستخدام اليومي',
  'DPI: 1200/2400 | 6 أزرار | إضاءة RGB | USB | وزن 95g',
  '65,000 ل.س', 'إكسسوارات', NULL, 'mouse',
  'https://wa.me/+963993178291?text=استفسار عن T-Wolf M60',
  NULL, true, 8
);
