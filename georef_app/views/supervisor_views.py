# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoUser
from georef_app.utils import *

@dec_magic(method='GET', login_required=True)
def supervisors(request, format):
	users = []
	if check_admin(request.user):
		mUsers = InfoUser.objects.filter(tipo=InfoUser.SUPERVISOR).order_by("first_name")
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
	else:
		user = request.user.infouser
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
	return render(request, 'Supervisor.html', {"data":data})

@dec_magic(method='POST', required_args=['last_name', 'email'], admin_required=True, json_res=True)
def supervisor_new(request):
	try:
		first_name = request.POST.get('first_name', '')
		last_name = request.POST['last_name']
		email = request.POST['email']
		phone = request.POST.get('tel', '')
		is_admin = request.POST.get('is_admin', '')

		password = request.POST.get('password', last_name)

		new_supervisor = InfoUser(
			username=email,
			first_name=first_name,
			last_name=last_name,
			tipo=InfoUser.SUPERVISOR,
			email=email,
			password=password,
			telefono=phone)
		new_supervisor.is_active = (is_admin.lower() == "true")
		new_supervisor.save()

		registerLog(request.user, 'Nuevo', 'Supervisor', new_supervisor.pk)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'user_id':new_supervisor.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )

@dec_magic(method='POST', login_required=True, json_res=True)
def supervisor_edit(request, id_supervisor):
	try:
		if not check_admin(request.user) and request.user.infouser.pk != int(id_supervisor):
			data = simplejson.dumps({
				'code' : 0,
				'msg' : "Sin permiso"
			})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
		first_name = request.POST.get('first_name', None)
		last_name = request.POST.get('last_name', None)
		email = request.POST.get('email', None)
		password = request.POST.get('password', None)
		phone = request.POST.get('tel', None)
		is_admin = request.POST.get('is_admin', '')
		the_supervisor = InfoUser.objects.get(pk=id_supervisor)
		
		if first_name is not None :
			the_supervisor.first_name = first_name
		if last_name is not None :
			the_supervisor.last_name = last_name
		if email is not None :
			the_supervisor.email = email
			the_supervisor.username = email
		if phone is not None :
			the_supervisor.telefono = phone
		if password is not None:
			the_supervisor.set_password(password)
		code = 1
		if is_admin is not None :
			the_supervisor.is_active = (is_admin.lower() == "true")

		the_supervisor.save()

		registerLog(request.user, 'Edición', 'Supervisor', id_supervisor)
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

@dec_magic(method='POST', admin_required=True, json_res=True)                    
def supervisor_delete(request, id_supervisor):
	try:
		the_supervisor = InfoUser.objects.get(pk=id_supervisor)
		the_supervisor.delete()

		registerLog(request.user, 'Borrar', 'Supervisor', id_supervisor)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except InfoUser.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )
