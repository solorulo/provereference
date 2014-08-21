# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoUser
from georef_app.utils import *

@dec_magic(method='GET', admin_required=True)
def admins(request, format):
	users = []
	mUsers = InfoUser.objects.filter(tipo__in=[InfoUser.ADMINISTRADOR, InfoUser.SUPER_ADMIN]).order_by("first_name")
	for user in mUsers:
		users.append({
			'id':user.id,
			'first_name':user.first_name,
			'last_name':user.last_name,
			'email':user.email,
			'is_admin':user.is_admin(),
			'is_active':user.is_active,
			# 'tel':str(count)
			'tel':user.telefono
			})
	data = simplejson.dumps(users)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'administrador.html', {"data":data})

@dec_magic(method='POST', required_args=['password', 'email', 'my_password'], admin_required=True, json_res=True)
def admin_new(request):
	try:
		if not check_superadmin(request.user):
			data = simplejson.dumps({
				'code' : 0,
				'msg' : "Sin permiso"
			})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
		first_name = request.POST.get('first_name', '')
		last_name = request.POST['last_name']
		email = request.POST['email']
		phone = request.POST.get('tel', '')
		password = request.POST.get('password', '')
		is_admin = request.POST.get('is_admin', '')

		my_password = request.POST.get('my_password', None)
		if not request.user.check_password(my_password):
			data = simplejson.dumps({
				'code' : 0,
				'msg' : "Contraseña incorrecta"
			})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

		new_admin = InfoUser(
			username=email,
			first_name=first_name,
			last_name=last_name,
			tipo=InfoUser.ADMINISTRADOR,
			email=email,
			password=password,
			telefono=phone)
		new_admin.is_active = (is_admin.lower() == "true")
		new_admin.save()

		registerLog(request.user, 'Nuevo', 'Administrador', new_admin.pk)

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'user_id' : new_admin.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', required_args=['my_password'], admin_required=True, json_res=True)
def admin_edit(request, id_admin):
	try:
		if not check_superadmin(request.user) and request.user.infouser.pk != int(id_admin):
			data = simplejson.dumps({
				'code' : 0,
				'msg' : "Sin permiso"
			})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
		first_name = request.POST.get('first_name', None)
		last_name = request.POST.get('last_name', None)
		email = request.POST.get('email', None)
		phone = request.POST.get('tel', None)
		is_admin = request.POST.get('is_admin', '')
		password = request.POST.get('password', None)
		the_admin = InfoUser.objects.get(pk=id_admin)

		my_password = request.POST.get('my_password', None)
		if not request.user.check_password(my_password):
			data = simplejson.dumps({
				'code' : 0,
				'msg' : "Contraseña incorrecta"
			})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

		if first_name is not None :
			the_admin.first_name = first_name
		if last_name is not None :
			the_admin.last_name = last_name
		if email is not None :
			the_admin.email = email
			the_admin.username = email
		if phone is not None :
			the_admin.telefono = phone
		if password is not None:
			the_admin.set_password(password)
		code = 1
		if is_admin is not None :
			the_admin.is_active = (is_admin.lower() == "true")
		
		the_admin.save()
		registerLog(request.user, 'Edición', 'Administrador', id_admin)

		data = simplejson.dumps({
			'code' : code,
			'msg' : "Bien"
		})
	except InfoUser.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	except:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Ocurrio un error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', required_args=['my_password'], superadmin_required=True, json_res=True)
def admin_delete(request, id_admin):
	try:
		if request.user.infouser.pk == int(id_admin):
			data = simplejson.dumps({
				'code' : 0,
				'msg' : "Operación no permitida"
			})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
		my_password = request.POST.get('my_password', None)
		if not request.user.check_password(my_password):
			data = simplejson.dumps({
				'code' : 0,
				'msg' : "Contraseña incorrecta"
			})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

		the_admin = InfoUser.objects.get(pk=id_admin)
		the_admin.delete()
		registerLog(request.user, 'Borrar', 'Administrador', id_admin)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except InfoUser.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
