# -*- coding: utf-8 -*-
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
@dec_magic(method='GET', login_required=True)
def users(request, format):
	_json = {}
	usersprov = InfoProv.objects.all().order_by('first_name').select_related('empresa')
	providers = Empresa.objects.all()
	regiones = Region.objects.all()
	sitios = Sitio.objects.all()
	_jsonregiones = []
	_jsonsitios = []
	_jsonproviders = []
	for region in regiones:
		_jsonregiones.append( {
			'pk' : region.pk,
			'name':region.nombre,
			'providers':list(providers.filter(region=region).values('pk')),
			'sites':list(sitios.filter(region=region).values('pk')),
			'users':list(usersprov.filter(empresa__region=region).values('pk'))
		})
	for sitio in sitios:
		_jsonsitios.append ({
			'pk':sitio.pk,
			'name':sitio.nombre,
			'users':list(usersprov.filter(actividad__sitio=sitio).values('pk'))
		})
	for provider in providers:
		_jsonproviders.append( {
			'pk':provider.pk,
			'name':provider.nombre,
			'users':list(usersprov.filter(empresa=provider).values('pk'))
		})

	_json['users'] = list(usersprov.values('pk', 'first_name', 'last_name', 'email', 'telefono', 'imei', 'empresa_id', 'empresa__region', 'is_active'))
	_json['companies'] = _jsonproviders
	_json['site'] = _jsonsitios
	_json['region'] = _jsonregiones
	data = simplejson.dumps(_json)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'proveedor.html', {"data":data})

@dec_magic(method='POST', required_args=['email', 'imei', 'empresa'], login_required=True, json_res=True)
def user_new(request):
	try:
		email = request.POST['email']
		imei = request.POST['imei']
		provider = request.POST['empresa']
		first_name = request.POST.get('first_name', '')
		last_name = request.POST.get('last_name', '')
		phone = request.POST.get('phone', '')
		is_active = request.POST.get('is_active', None)

		new_userprov = InfoProv(
			username=imei,
			first_name=first_name,
			last_name=last_name,
			email=email,
			imei=imei,
			telefono=phone,
			empresa_id=int(provider)
			)
		if is_active is not None:
			new_userprov.is_active=(is_active.lower() == 'true'),
		new_userprov.save()

		registerLog(request.user, 'Nuevo', 'Proveedor', new_userprov.pk)
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

@dec_magic(method='POST', login_required=True, json_res=True)
def user_edit(request, id_user):
	try:
		# TODO Editar al usuario
		email = request.POST.get('email', None)
		imei = request.POST.get('imei',None)
		provider = request.POST.get('provider', None)
		first_name = request.POST.get('first_name', None)
		last_name = request.POST.get('last_name', None)
		phone = request.POST.get('phone', None)
		is_active = request.POST.get('is_active', None)
		the_userprov = InfoProv.objects.get(pk=id_user)
		if email is not None :
			the_userprov.email = email
		if imei is not None :
			the_userprov.imei = imei
			the_userprov.username = imei
		if provider is not None :
			the_userprov.empresa_id = int(provider)
		if first_name is not None :
			the_userprov.first_name = first_name
		if last_name is not None :
			the_userprov.last_name = last_name
		if phone is not None :
			the_userprov.telefono = phone
		if is_active is not None:
			the_userprov.is_active = (is_active.lower() == 'true')

		the_userprov.save()

		registerLog(request.user, 'Edición', 'Proveedor', id_user)
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

@dec_magic(method='POST', login_required=True, json_res=True)
def user_delete(request, id_user):
	try:
		# TODO Borrar Supervisor
		the_userprov = InfoProv.objects.get(pk=id_user)
		the_userprov.delete()
		registerLog(request.user, 'Borrar', 'Proveedor', id_user)
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

@dec_magic(method='GET', login_required=True)
def user(request, id_user, format):
	_json = {}
	the_userprov = get_object_or_404(InfoProv, pk=id_user)
	mSites = Sitio.objects.all()
	try:
		actividades = Actividad.objects.filter(infoprov_id=id_user).order_by('-pk').select_related()
		_json['activity'] = list(actividades.values('fecha', 'tipo_evento', 'lat', 'lng', 'margen_error', 'sitio__nombre'))
		for element in _json['activity']:
			fech = str(element['fecha'])
			element['fecha'] = fech

		last_act = actividades.latest('fecha')
		_json['last_act'] = {
			'date':str(last_act.fecha),
			'site':last_act.sitio.nombre,
		}
	except Actividad.DoesNotExist:
		pass
	_json['first_name'] = the_userprov.first_name
	_json['last_name'] = the_userprov.last_name
	_json['phone'] = the_userprov.telefono
	_json['imei'] = the_userprov.imei
	_json['sites'] = list(mSites.values('nombre'))
	_json['provider'] = the_userprov.empresa.nombre
	data = simplejson.dumps(_json)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'mostrardatos.html', {"data":data})

@dec_magic(method='GET', login_required=True)
def supervision(request, format):
	_json = {}
	usersprov = InfoProv.objects.all().order_by('first_name').select_related('empresa')
	providers = Empresa.objects.all()
	regiones = Region.objects.all()
	sitios = Sitio.objects.all()
	actividades = Actividad.objects.all().select_related('sitio', 'infoprov')
	_jsonactivity = []
	_jsonregiones = []
	_jsonsitios = []
	_jsonproviders = []
	for region in regiones:
		_jsonregiones.append( {
			'pk':region.pk,
			'name':region.nombre,
			'providers':list(providers.filter(region=region).values('pk')),
			'sites':list(sitios.filter(region=region).values('pk')),
			'users':list(usersprov.filter(empresa__region=region).values('pk'))
		})
	for sitio in sitios:
		_jsonsitios.append( {
			'pk':sitio.pk,
			'name':sitio.nombre,
			'users':list(usersprov.filter(actividad__sitio=sitio).values('pk'))
		})
	for provider in providers:
		_jsonproviders.append( {
			'pk':provider.pk,
			'name':provider.nombre,
			'users':list(usersprov.filter(empresa=provider).values('pk'))
		})
	for user in usersprov:
		try:
			last_act = actividades.filter(infoprov=user).latest('fecha')
			_jsonactivity.append( {
				'user_pk':user.pk,
				'date':str(last_act.fecha),
				'site':last_act.sitio.nombre,
			})
		except :
			pass

	_json['users'] = list(usersprov.values('pk', 'first_name', 'last_name', 'email', 'telefono', 'imei', 'is_active'))
	_json['activity'] = _jsonactivity
	_json['provider'] = _jsonproviders
	_json['site'] = _jsonsitios
	_json['region'] = _jsonregiones
	data = simplejson.dumps(_json)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'Supervision.html', {"data":data})
