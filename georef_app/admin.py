from georef_app.models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User #, Group

# Register your models here.
class UserProfileInline(admin.StackedInline):
    model = InfoUser
    can_delete = False
    verbose_name_plural = 'profile'

# # Define a new User admin
class UserAdmin(UserAdmin):
	inlines = (UserProfileInline, )

class UserProvProfileInline(admin.StackedInline):
	model = InfoProv

class UserProv(UserAdmin):
	inlines = (UserProvProfileInline, )

class EmpresaAdmin(admin.ModelAdmin):
	fields = ['nombre']

# # Re-register UserAdmin

# admin.site.unregister(Group)
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
# admin.site.unregister(User)
# admin.site.register(User, UserProv)
admin.site.register(Region)
admin.site.register(Empresa)
admin.site.register(Sitio)
admin.site.register(Actividad)