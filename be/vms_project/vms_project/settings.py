"""
Django settings for vms_project project.

Generated by 'django-admin startproject' using Django 5.2.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.2/ref/settings/
"""

from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-cg!^7&ihgkj*qxhl4#3wak#^&uwgolh6iegac)ou*hl(z&&rhi'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Define your base hosts/origins in one place
BASE_HOSTS = [
    "localhost",
    "127.0.0.1",
    "localhost:8000",
    "127.0.0.1:5173",
    "localhost:5173",
    "localhost:5174",
    "73b6-102-89-32-65.ngrok-free.app",
    "your-production-domain.com",  # Add your production domain here
    # Add more as needed
]

# For ngrok or dynamic domains, you can append them at runtime if needed
NGROK_DOMAIN = os.environ.get("NGROK_DOMAIN")
if NGROK_DOMAIN:
    BASE_HOSTS.append(NGROK_DOMAIN)

# ALLOWED_HOSTS
ALLOWED_HOSTS = BASE_HOSTS

APP_LOGO_URL = "https://73b6-102-89-32-65.ngrok-free.app/static/logo.png"

# CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    f"http://{host}" if not host.startswith("http") else host
    for host in BASE_HOSTS
] + [
    f"https://{host}" if not host.startswith("http") else host
    for host in BASE_HOSTS
]

# CSRF_TRUSTED_ORIGINS
CSRF_TRUSTED_ORIGINS = [
    f"http://{host}" if not host.startswith("http") else host
    for host in BASE_HOSTS
] + [
    f"https://{host}" if not host.startswith("http") else host
    for host in BASE_HOSTS
]

AUTH_USER_MODEL = 'vms_app.User'


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'vms_app',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',  # Uncomment if you want session auth
    ),
}

# Add or update your SimpleJWT settings for token lifetime
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),      # 8 hours for access token
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),      # 7 days for refresh token
    # ...other SimpleJWT settings if needed...
}



# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'vms_db',           # Change to your MySQL database name
        'USER': 'root',             # Change to your MySQL username
        'PASSWORD': '',             # Change to your MySQL password (default is empty for WAMP)
        'HOST': '127.0.0.1',        # Or 'localhost'
        'PORT': '3306',             # Default MySQL port
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Use console backend for local development
# For production, use the SMTP backend:
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'emmanuelakinmolayan1@gmail.com')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', 'aysqansretsxfqqq')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

APPEND_SLASH = False
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Make sure these are set for CORS and CSRF:
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "https://localhost:8000",
    "https://73b6-102-89-32-65.ngrok-free.app"
]
CORS_ALLOW_ALL_ORIGINS = False

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "https://localhost:8000",
    "https://73b6-102-89-32-65.ngrok-free.app"
]

SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False  # False for local dev
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False     # False for local dev


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'




# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'vms_app' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ROOT_URLCONF = 'vms_project.urls'
