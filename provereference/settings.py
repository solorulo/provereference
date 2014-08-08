"""
Django settings for provereference project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '#r9s0(elco+iyk22@udtga#*kn-&cy-y+*f_k^8bomlzke7ifu'
API_KEY = '#r9s0(elco+iyk22@udtga#*kn-&cy-y+*f_kapi'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

LOGIN_URL='/login/'

# Application definition

INSTALLED_APPS = (
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'georef_app',
)

MIDDLEWARE_CLASSES = (
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'provereference.urls'

WSGI_APPLICATION = 'provereference.wsgi.application'

AUTHENTICATION_BACKENDS = (
	'django.contrib.auth.backends.ModelBackend',
)

# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
SESSION_EXPIRE_AT_BROWSER_CLOSE=True
# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
if DEBUG:
	DATABASES = {
		'default': {
			'ENGINE': 'django.db.backends.sqlite3',
			'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
		}
	}
else:
	DATABASES = {
		'default': {
	        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
	        'NAME': 'proverefdb',                      # Or path to database file if using sqlite3.
	        'USER': 'geo',                      # Not used with sqlite3.
	        'PASSWORD': 'telcel123',                  # Not used with sqlite3.
	        # 'HOST': '/tmp/mysql.sock',                      # Set to empty string for localhost. Not used with sqlite3.
	        # 'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
	    }
	}

TEMPLATE_DIRS = (
	# Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
	# Always use forward slashes, even on Windows.
	# Don't forget to use absolute paths, not relative paths.
	'templates'
)

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'es-MX'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT= os.path.join(BASE_DIR,'staticfiles/')
STATICFILES_DIRS = (
    os.path.join(BASE_DIR,'static/'),
)
