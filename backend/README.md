# Laptop Land — Backend (FastAPI)

## المتطلبات
- Python 3.11+

## الإعداد

```bash
pip install -r requirements.txt
cp .env.example .env
# عدّل .env بقيمك
```

## التشغيل

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## إعداد Supabase

1. أنشئ مشروع في [supabase.com](https://supabase.com)
2. من **SQL Editor** شغّل `schema.sql`
3. انسخ المفاتيح من **Settings → API**

## إعداد Google OAuth

1. اذهب لـ [console.cloud.google.com](https://console.cloud.google.com)
2. **OAuth consent screen** → External
3. **Credentials → OAuth 2.0 Client ID** → Web application
4. أضف redirect URI:
   - `http://localhost:8000/auth/google/callback`
   - `https://your-domain/auth/google/callback` (production)
