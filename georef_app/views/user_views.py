from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.utils import simplejson
from georef_app.models import *
from georef_app.utils import dec_magic, check_admin, registerLog
import hashlib
from provereference.settings import API_KEY

# Create your views here.
@dec_magic(method='GET', admin_required=True)
def users(request, format):
	_json = {}
	usersprov = InfoOther.objects.all().order_by('first_name')
	
	_json['users'] = list(usersprov.values('pk', 'first_name', 'last_name', 'email', 'telefono'))
	data = simplejson.dumps(_json)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'usuarios.html', {"data":data})

@dec_magic(method='POST', required_args=['email', 'password'], admin_required=True, json_res=True)
def user_new(request):
	try:
		email = request.POST['email']
		first_name = request.POST.get('first_name', '')
		last_name = request.POST.get('last_name', '')
		phone = request.POST.get('phone', '')
		password = request.POST.get('password', None)

		new_userprov = InfoOther(
			username=email,
			first_name=first_name,
			last_name=last_name,
			email=email,
			password=password,
			telefono=phone,
			)
		new_userprov.save()

		registerLog(request.user, 'Nuevo', 'Usuario', new_userprov.pk)

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'user_id':new_userprov.pk
		})
	except Exception, e :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )

@dec_magic(method='POST', admin_required=True, json_res=True)
def user_edit(request, id_user):
	try:
		email = request.POST.get('email', None)
		first_name = request.POST.get('first_name', None)
		last_name = request.POST.get('last_name', None)
		phone = request.POST.get('phone', None)
		the_userprov = InfoOther.objects.get(pk=id_user)
		if email is not None :
			the_userprov.email = email
		if first_name is not None :
			the_userprov.first_name = first_name
		if last_name is not None :
			the_userprov.last_name = last_name
		if phone is not None :
			the_userprov.telefono = phone

		the_userprov.save()

		registerLog(request.user, 'Edición', 'Usuario', id_user)

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	except InfoOther.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	except:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Ocurrio un error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )

@dec_magic(method='POST', admin_required=True, json_res=True)
def user_delete(request, id_user):
	try:
		the_userprov = InfoOther.objects.get(pk=id_user)
		the_userprov.delete()
		registerLog(request.user, 'Borrar', 'Usuario', id_user)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except InfoOther.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )
