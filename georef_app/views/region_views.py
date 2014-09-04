# -*- coding: utf-8 -*-
from django.db import IntegrityError
from django.core import serializers
from django.shortcuts import render, get_object_or_404
from django.utils import simplejson
from georef_app.models import InfoProv, Empresa, Sitio, Region
from georef_app.utils import dec_magic, registerLog

@dec_magic(method='GET', login_required=True)
def regions(request, format):
	_json = {}
	mRegions = Region.objects.all().values()
	_json["regiones"] = list(mRegions)
	data = simplejson.dumps(_json)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'regiones.html', {"data":data})

@dec_magic(method='POST', required_args=['name', 'phone'], login_required=True, json_res=True)
def region_new(request):
	try:
		name = request.POST['name'].strip()
		phone = request.POST['phone'].strip()

		if Region.objects.all().filter(nombre__iexact=name).count() > 0:
			data = simplejson.dumps({
					'code' : 0,
					'msg' : "El nombre de la región ya existe"
				})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

		new_region = Region(
			nombre=name,
			telefono=phone,
			)
		new_region.save()
		registerLog(request.user, 'Nuevo', 'Region', new_region.pk)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'region_id' : new_region.pk
		})
	except Exception as e:
		raise e
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', login_required=True, json_res=True)
def region_edit(request, id_region):
	try:
		name = request.POST.get('name', None)
		phone = request.POST['phone'].strip()

		the_region = Region.objects.get(pk=id_region)

		if Region.objects.all().exclude(pk=id_region).filter(nombre__iexact=name).count() > 0:
			data = simplejson.dumps({
					'code' : 0,
					'msg' : "El nombre de la Región ya existe"
				})
			return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

		if name is not None :
			the_region.nombre = name.strip()
		if phone is not None :
			the_region.telefono = phone

		the_region.save()
		registerLog(request.user, 'Edición', 'Región', id_region)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	except Region.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe la Región"
		})
	except Exception, e:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', login_required=True, json_res=True)
def region_delete(request, id_region):
	try:
		the_region = Region.objects.get(pk=id_region)
		the_region.delete()
		registerLog(request.user, 'Borrar', 'Región', id_region)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except Empresa.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe la región"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
