from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.utils import simplejson
from georef_app.models import *
from georef_app.utils import dec_magic, check_admin
import hashlib
from provereference.settings import API_KEY

# Create your views here.
@dec_magic(method='GET', admin_required=True)
def users(request, format):
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'usuarios.html', {"data":data})

@dec_magic(method='POST', required_args=['email', 'imei', 'provider'], admin_required=True, json_res=True)
def user_new(request):
	try:

		# TODO dar de alta el usuario
		email = request.POST['email']
		imei = request.POST['imei']
		provider = request.POST['provider']
		first_name = request.POST.get('first_name', '')
		last_name = request.POST.get('last_name', '')
		phone = request.POST.get('phone', '')
		password = hashlib.md5(imei+API_KEY)

		new_userprov = InfoProv(
			username=imei,
			first_name=first_name,
			last_name=last_name,
			email=email,
			password=password,
			imei=imei,
			telefono=phone,
			empresa=int(provider)
			)
		new_userprov.save()

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'user_id':new_userprov.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )

@dec_magic(method='POST', admin_required=True, json_res=True)
def user_edit(request, id_user):
	try:
		# TODO Editar al usuario
		email = request.POST.get('email', None)
		imei = request.POST.get('imei',None)
		provider = request.POST.get('provider', None)
		first_name = request.POST.get('first_name', None)
		last_name = request.POST.get('last_name', None)
		phone = request.POST.get('phone', None)

		the_userprov = InfoProv.objects.get(pk=id_user)
		if email is not None :
			the_userprov.email = email
		if imei is not None :
			the_userprov.imei = imei
		if provider is not None :
			the_userprov.empresa = int(provider)
		if first_name is not None :
			the_userprov.first_name = first_name
		if last_name is not None :
			the_userprov.last_name = last_name
		if phone is not None :
			the_userprov.telefono = phone

		# the_supervisor.save()

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	except InfoProv.DoesNotExist:
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
def user_delete(request):
	try:
		# TODO Borrar Supervisor
		the_userprov = InfoProv.objects.get(pk=id_supervisor)
		the_userprov.delete()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except InfoProv.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )

@dec_magic(method='GET', admin_required=False)
def user(request, id_user, format):
	the_userprov = get_object_or_404(InfoProv, pk=id_user)
	try:
		actividades = Actividad.objects.all().order_by('-fecha')
		last_act = actividades.latest('fecha')
	except Actividad.DoesNotExist:
		pass

	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'mostrardatos.html', {"data":data})

@dec_magic(method='GET', admin_required=False)
def supervision(request, format):
	usersprov = InfoProv.objects.all().select_related('empresa')
	actividades = Actividad.objects.all().select_related('sitio', 'infoprov')
	for user in usersprov:
		try:
			last_act = actividades.filter(infoprov=user).latest('fecha')
			# TODO agregar last_act al json
		except :
			pass
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'Supervision.html', {"data":data})
