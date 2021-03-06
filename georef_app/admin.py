from georef_app.models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User #, Group

# Register your models here.
# class UserProfileInline(admin.StackedInline):
#     model = InfoUser
#     can_delete = False
#     verbose_name_plural = 'profile'

# # # Define a new User admin
# class UserAdminOther(UserAdmin):
# 	inlines = (UserProfileInline, )

# class UserProvProfileInline(admin.StackedInline):
# 	model = UserProfile

# class UserProv(UserAdmin):
# 	inlines = (UserProvProfileInline, )

# class EmpresaAdmin(admin.ModelAdmin):
# 	fields = ['nombre']

# # Re-register UserAdmin

# admin.site.unregister(Group)
admin.site.unregister(User)
# admin.site.register(User, UserAdminOther)
# admin.site.register(InfoProv)
# admin.site.register(InfoProv, UserProv)
# admin.site.register(UserProfile)
admin.site.register(InfoUser)
admin.site.register(InfoProv)
admin.site.register(Region)
admin.site.register(Empresa)
admin.site.register(Sitio)
admin.site.register(Log)
admin.site.register(Actividad)