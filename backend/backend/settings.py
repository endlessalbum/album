import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url  # 👈 добавлено

# Базовая директория
BASE_DIR = Path(__file__).resolve().parent.parent

# Загружаем .env
load_dotenv(BASE_DIR / ".env")

# ==============================
# 🔐 Безопасность
# ==============================
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env file")

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",") if os.getenv("ALLOWED_HOSTS") else []

# ==============================
# 📦 Приложения
# ==============================
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",   # 👈 CORS защита
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # 👈 CORS Middleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

# ==============================
# 🌐 CORS / CSRF
# ==============================
CORS_ALLOW_ALL_ORIGINS = DEBUG  # В продакшене лучше ограничить
CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")

# ==============================
# 🗄 База данных (Supabase / стандартный DATABASE_URL)
# ==============================
DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("DATABASE_URL") or os.getenv("SUPABASE_DATABASE_URL"),
        conn_max_age=600,
        ssl_require=True
    )
}

# ==============================
# 📂 Статические и медиа-файлы
# ==============================
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# ==============================
# 📊 Логирование (только консоль)
# ==============================
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "WARNING",
    },
}

# ==============================
# 🌍 Локализация
# ==============================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# ==============================
# 📂 WSGI
# ==============================
WSGI_APPLICATION = "backend.wsgi.application"