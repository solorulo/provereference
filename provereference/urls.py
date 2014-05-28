from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
from django.contrib.auth import views as auth_views
import settings
admin.autodiscover()

urlpatterns = patterns('',

	url(r'^admin/', include(admin.site.urls)),

	# Reseteo de password TODO verificar si van a funcionar
	url(r'^forgot_password/$',auth_views.password_reset,name='forgot_password1'),
	url(r'^forgot_password/done/$',auth_views.password_reset_done,name='forgot_password2'),
	url(r'^forgot_password/confirm/(?P<uidb64>[-\w]+)/(?P<token>[-\w]+)/$',auth_views.password_reset_confirm,name='forgot_password3'),
	url(r'^forgot_password/complete/$',auth_views.password_reset_complete,name='forgot_password4'),
)

urlpatterns += patterns('georef_app.views',
	# Examples:
	url(r'^$', 'home', name='home'),
	url(r'^login/$', 'login', name='login'),
	url(r'^logout/$', 'logout', name='logout'),
)

urlpatterns += patterns('georef_app.admin_views',
	# Examples:
	url(r'^administradores/(?P<format>json)?$', 'admins', name='admins'),
	url(r'^administradores/new/$', 'admin_new', name='admin_new'),
	url(r'^administradores/(?P<id_admin>\d{1,5})/edit/$', 'admin_edit', name='admin_edit'),
	url(r'^administradores/(?P<id_admin>\d{1,5})/delete/$', 'admin_delete', name='admin_delete'),
)

urlpatterns += patterns('georef_app.supervisor_views',
	# Examples:
	url(r'^supervisores/(?P<format>json)?$', 'supervisors', name='supervisors'),
	url(r'^supervisores/new/$', 'supervisor_new', name='supervisor_new'),
	url(r'^supervisores/(?P<id_supervisor>\d{1,5})/edit/$', 'supervisor_edit', name='supervisor_edit'),
	url(r'^supervisores/(?P<id_supervisor>\d{1,5})/delete/$', 'supervisor_delete', name='supervisor_delete'),
)

urlpatterns += patterns('georef_app.provider_views',
	# Examples:
	url(r'^proveedores/(?P<format>json)?$', 'users', name='users'),
	url(r'^proveedores/new/$', 'user_new', name='user_new'),
	url(r'^proveedores/(?P<id_user>\d{1,5})/edit/$', 'user_edit', name='user_edit'),
	url(r'^proveedores/(?P<id_user>\d{1,5})/delete/$', 'user_delete', name='user_delete'),

	url(r'^proveedor/(?P<id_user>\d{1,5})/(?P<format>json)?$', 'user', name='user'),

	url(r'^supervision/(?P<format>json)?$', 'supervision', name='supervision'),
)

urlpatterns += patterns('georef_app.company_views',
	# Examples:
	url(r'^companias/(?P<format>json)?$', 'companies', name='companies'),
	url(r'^companias/new/$', 'company_new', name='company_new'),
	url(r'^companias/(?P<id_provider>\d{1,5})/edit/$', 'company_edit', name='company_edit'),
	url(r'^companias/(?P<id_provider>\d{1,5})/delete/$', 'company_delete', name='company_delete'),

	url(r'^compania/(?P<id_provider>\d{1,5})/(?P<format>json)?$', 'company', name='company'),
)

urlpatterns += patterns('georef_app.user_views',
	# Examples:
	url(r'^usuarios/(?P<format>json)?$', 'users', name='users'),
	url(r'^usuarios/new/$', 'user_new', name='user_new'),
	url(r'^usuarios/(?P<id_user>\d{1,5})/edit/$', 'user_edit', name='user_edit'),
	url(r'^usuarios/(?P<id_user>\d{1,5})/delete/$', 'user_delete', name='user_delete'),

	# url(r'^usuario/(?P<id_user>\d{1,5})/(?P<format>json)?$', 'user', name='user'),

)

urlpatterns += patterns('georef_app.sites_views',
	# Examples:
	url(r'^sitios/(?P<format>json)?$', 'sites', name='sites'),
	url(r'^sitios/new/$', 'site_new', name='site_new'),
	url(r'^sitios/(?P<id_site>\d{1,5})/edit/$', 'site_edit', name='site_edit'),
	url(r'^sitios/(?P<id_site>\d{1,5})/delete/$', 'site_delete', name='site_delete'),
)

urlpatterns += patterns('georef_app.api',
	# Examples:
	url(r'^api/log/$', 'api_log', name='api_log'),
	url(r'^api/login/$', 'login', name='api_login'),
	url(r'^api/logout/$', 'logout', name='api_logout'),

	url(r'^api/event/$', 'event', name='api_event'),
	# url(r'^sitios/$', 'sites', name='sites'),
)

if settings.DEBUG:
	urlpatterns += staticfiles_urlpatterns() 
