from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('georef_app.views',
    # Examples:
    url(r'^$', 'home', name='home'),
    url(r'^login/$', 'login', name='login'),
)

urlpatterns += patterns('georef_app.admin_views',
    # Examples:
    url(r'^admins/$', 'admins', name='admins'),
    url(r'^admin_new/$', 'admin_new', name='admin_new'),
    url(r'^admin_edit/$', 'admin_edit', name='admin_edit'),
    url(r'^admin_delete/$', 'admin_delete', name='admin_delete'),
)
