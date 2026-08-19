# ============================================
# LAPTOP LAND — FastAPI Backend (Hardened)
# ============================================
import os
import hmac
import hashlib
import base64
import time
import secrets
import logging
from datetime import datetime, timedelta
from urllib.parse import urlencode

from fastapi import FastAPI, Request, Response, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel, Field, validator
from jose import jwt, JWTError
from supabase import create_client, Client
import httpx
from dotenv import load_dotenv

# Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# تحميل متغيرات البيئة
load_dotenv()

# ===== إعداد الـ Logging =====
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s — %(name)s — %(levelname)s — %(message)s"
)
logger = logging.getLogger("laptopland.security")

# ===== إنشاء تطبيق FastAPI =====
app = FastAPI(title="Laptop Land API", version="1.0.0")

# ===== Rate Limiter =====
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ===== CORS Middleware =====
ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in ALLOWED_ORIGINS if o],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "X-LL-Token"],
)

# ===== HTTPS Redirect (Production Only) =====
class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if os.getenv("ENV") == "production" and request.url.scheme == "http":
            url = request.url.replace(scheme="https")
            return RedirectResponse(str(url), status_code=301)
        return await call_next(request)

app.add_middleware(HTTPSRedirectMiddleware)

# ===== Security Headers Middleware =====
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Server"] = "LaptopLand"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://unpkg.com https://fonts.googleapis.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src https://fonts.gstatic.com; "
            "frame-src https://www.google.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' https://accounts.google.com;"
        )
        if os.getenv("ENV") == "production":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# ===== إعداد Supabase =====
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
)

# ===== ثوابت Google OAuth =====
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

# ============================================
# نماذج البيانات (Pydantic)
# ============================================
class ProductCreate(BaseModel):
    model_config = {"extra": "forbid"}

    name: str = Field(..., min_length=2, max_length=200)
    description: str | None = Field(None, max_length=1000)
    specs: str | None = Field(None, max_length=500)
    price: str = Field(..., min_length=1, max_length=50)
    category: str = Field(..., min_length=1, max_length=100)
    badge: str | None = Field(None, max_length=50)
    icon_type: str = Field("laptop", max_length=20)
    inquiry_url: str | None = Field(None, max_length=500)
    image_base64: str | None = Field(None, max_length=5000000)  # ✅ صورة Base64
    in_stock: bool = True
    sort_order: int = Field(0, ge=0, le=9999)

    @validator('name', 'description', 'specs', pre=True)
    def strip_and_sanitize(cls, v):
        if v is None:
            return v
        import re
        v = re.sub(r'<[^>]+>', '', str(v))
        return v.strip()

    @validator('category')
    def valid_category(cls, v):
        allowed = ['لابتوب جيمينج', 'لابتوب مكتبي', 'إكسسوارات', 'سماعات', 'كيبورد', 'ماوس']
        if v not in allowed:
            raise ValueError('فئة غير مسموح بها')
        return v

    @validator('icon_type')
    def valid_icon(cls, v):
        allowed = ['laptop', 'keyboard', 'mouse', 'headphones', 'monitor']
        if v not in allowed:
            raise ValueError('نوع أيقونة غير مسموح')
        return v

    @validator('badge')
    def valid_badge(cls, v):
        if v is None:
            return v
        allowed = ['الأكثر مبيعاً', 'جديد', 'عرض']
        if v not in allowed:
            raise ValueError('نوع شارة غير مسموح')
        return v


class ProductUpdate(BaseModel):
    model_config = {"extra": "forbid"}

    name: str | None = Field(None, min_length=2, max_length=200)
    description: str | None = Field(None, max_length=1000)
    specs: str | None = Field(None, max_length=500)
    price: str | None = Field(None, min_length=1, max_length=50)
    category: str | None = Field(None, min_length=1, max_length=100)
    badge: str | None = Field(None, max_length=50)
    icon_type: str | None = Field(None, max_length=20)
    inquiry_url: str | None = Field(None, max_length=500)
    image_base64: str | None = Field(None, max_length=5000000)  # ✅ صورة Base64
    in_stock: bool | None = None
    sort_order: int | None = Field(None, ge=0, le=9999)


# ============================================
# دوال المساعدة
# ============================================
async def verify_hmac(request: Request):
    """التحقق من HMAC Token"""
    token = request.headers.get("X-LL-Token")
    if not token:
        logger.warning(f"طلب بدون HMAC token | IP: {request.client.host} | Path: {request.url.path}")
        raise HTTPException(status_code=401, detail="Missing token")

    secret = os.getenv("LL_HMAC_SECRET", "LL_SECRET_2025_LAPTOPLAND").encode()
    current = str(int(time.time() // 60))
    prev = str(int(time.time() // 60) - 1)

    for minute in [current, prev]:
        expected = base64.b64encode(
            hmac.new(secret, minute.encode(), hashlib.sha256).digest()
        ).decode()
        if hmac.compare_digest(token, expected):
            return True

    logger.warning(f"HMAC token خاطئ | IP: {request.client.host}")
    raise HTTPException(status_code=401, detail="Invalid token")


async def get_admin_user(request: Request):
    """التحقق من جلسة الأدمن"""
    token = request.cookies.get("ll_admin_session")
    if not token:
        raise HTTPException(status_code=401, detail="لا يوجد جلسة")

    try:
        payload = jwt.decode(
            token,
            os.getenv("SESSION_SECRET"),
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        if payload.get("email") != os.getenv("ALLOWED_ADMIN_EMAIL"):
            raise HTTPException(status_code=403, detail="غير مصرح")
        return payload
    except jwt.ExpiredSignatureError:
        logger.info(f"جلسة منتهية | IP: {request.client.host}")
        raise HTTPException(status_code=401, detail="انتهت الجلسة، سجّل دخول مجدداً")
    except JWTError:
        logger.warning(f"JWT مزور أو تالف | IP: {request.client.host}")
        raise HTTPException(status_code=401, detail="جلسة غير صالحة")


# ============================================
# مسار توزيع HMAC Token (Protected by Rate Limit)
# ============================================
@app.get("/api/token")
@limiter.limit("30/minute")
async def get_token(request: Request):
    """يرجع HMAC token صالح لـ 60 ثانية — محمي بـ Rate Limit"""
    secret = os.getenv("LL_HMAC_SECRET", "LL_SECRET_2025_LAPTOPLAND").encode()
    minute = str(int(time.time() // 60))
    token = base64.b64encode(
        hmac.new(secret, minute.encode(), hashlib.sha256).digest()
    ).decode()
    return {"token": token, "expires_in": 60}


# ============================================
# مسارات المصادقة (Google OAuth)
# ============================================
@app.get("/auth/google/login")
@limiter.limit("5/minute")
async def google_login(request: Request, response: Response):
    """بدء تدفق Google OAuth"""
    csrf_token = secrets.token_hex(32)
    response.set_cookie(
        "ll_csrf_state", csrf_token,
        httponly=True, secure=True, max_age=300, samesite="lax"
    )

    params = {
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "select_account",
        "state": csrf_token,
    }
    return RedirectResponse(GOOGLE_AUTH_URL + "?" + urlencode(params))


@app.get("/auth/google/callback")
@limiter.limit("5/minute")
async def google_callback(request: Request, code: str, state: str, response: Response):
    """استقبال رمز Google وإنشاء الجلسة"""
    csrf_token = request.cookies.get("ll_csrf_state")
    if not csrf_token or not secrets.compare_digest(state, csrf_token):
        raise HTTPException(status_code=400, detail="CSRF check failed")

    response.delete_cookie("ll_csrf_state")

    async with httpx.AsyncClient() as client:
        token_res = await client.post(GOOGLE_TOKEN_URL, data={
            "code": code,
            "client_id": os.getenv("GOOGLE_CLIENT_ID"),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
            "grant_type": "authorization_code",
        })
        token_data = token_res.json()
        access_token = token_data.get("access_token")

        userinfo_res = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        userinfo = userinfo_res.json()
        email = userinfo.get("email")

    if email != os.getenv("ALLOWED_ADMIN_EMAIL"):
        return RedirectResponse("/laptopland-adminlogin?error=unauthorized")

    payload = {"email": email, "exp": datetime.utcnow() + timedelta(hours=24)}
    session_token = jwt.encode(payload, os.getenv("SESSION_SECRET"), algorithm="HS256")

    redirect = RedirectResponse("/admin-dashboard", status_code=302)
    redirect.set_cookie(
        key="ll_admin_session",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=86400,
    )
    return redirect


@app.get("/auth/me")
@limiter.limit("10/minute")
async def get_me(request: Request, admin=Depends(get_admin_user)):
    """فحص حالة الجلسة"""
    return {"email": admin["email"], "authenticated": True}


@app.post("/auth/logout")
@limiter.limit("10/minute")
async def logout(request: Request, response: Response):
    """تسجيل الخروج"""
    response.delete_cookie("ll_admin_session")
    return {"message": "logged out"}


# ============================================
# مسارات المنتجات (Public)
# ============================================
@app.get("/api/products")
@limiter.limit("60/minute")
async def get_products(request: Request):
    """جلب المنتجات المتوفرة (عام)"""
    res = supabase.table("products").select("*").eq("in_stock", True).order("sort_order").execute()
    return res.data


# ============================================
# مسارات الأدمن (Protected)
# ============================================
@app.get("/api/admin/products")
@limiter.limit("30/minute")
async def admin_get_products(request: Request, admin=Depends(get_admin_user)):
    """جلب كل المنتجات (أدمن)"""
    res = supabase.table("products").select("*").order("sort_order").execute()
    return res.data


@app.post("/api/products")
@limiter.limit("10/minute")
async def create_product(request: Request, product: ProductCreate, admin=Depends(get_admin_user)):
    """إضافة منتج جديد"""
    res = supabase.table("products").insert(product.model_dump()).execute()
    logger.info(f"منتج جديد | IP: {request.client.host} | Admin: {admin['email']}")
    return res.data[0]


@app.put("/api/products/{product_id}")
@limiter.limit("10/minute")
async def update_product(request: Request, product_id: str, product: ProductUpdate, admin=Depends(get_admin_user)):
    """تعديل منتج"""
    update_data = {k: v for k, v in product.model_dump().items() if v is not None}
    res = supabase.table("products").update(update_data).eq("id", product_id).execute()
    logger.info(f"تعديل منتج {product_id} | IP: {request.client.host}")
    return res.data[0]


@app.delete("/api/products/{product_id}")
@limiter.limit("10/minute")
async def delete_product(request: Request, product_id: str, admin=Depends(get_admin_user)):
    """حذف منتج"""
    supabase.table("products").delete().eq("id", product_id).execute()
    logger.info(f"حذف منتج {product_id} | IP: {request.client.host}")
    return {"deleted": True}


@app.get("/api/admin/stats")
@limiter.limit("30/minute")
async def get_stats(request: Request, admin=Depends(get_admin_user)):
    """إحصائيات المنتجات"""
    all_products = supabase.table("products").select("*").execute().data
    by_category = {}
    in_stock = 0
    for p in all_products:
        by_category[p["category"]] = by_category.get(p["category"], 0) + 1
        if p["in_stock"]:
            in_stock += 1
    return {
        "total": len(all_products),
        "in_stock": in_stock,
        "out_of_stock": len(all_products) - in_stock,
        "by_category": by_category,
    }


# ============================================
# تشغيل السيرفر
# ============================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
