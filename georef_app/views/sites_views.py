# -*- coding: utf-8 -*-
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoProv, Empresa, Sitio, Region
from georef_app.utils import dec_magic, registerLog

# Create your views here.

@dec_magic(method='GET', login_required=True)
def sites(request, format):
	_json = {}
	mSites = Sitio.objects.all().order_by('nombre').select_related()
	mRegions = Region.objects.all()
	_jsonRegiones = []
	for region in mRegions:
		_jsonRegiones.append( {
			'pk' : region.pk,
			'nombre':region.nombre,
			'sites':list(mSites.filter(region=region).values('pk')),
		})
	_json["sites"] = list(mSites.extra(select={'reg': 'region_id', 'name':'nombre'}).values('pk', 'name', 'neumonico', 'lat', 'lng', 'reg'))
	_json["regiones"] = _jsonRegiones
	data = simplejson.dumps(_json)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'sitios.html', {"data":data})

@dec_magic(method='POST', required_args=['name', 'neumonico', 'lat', 'lng', 'region'], login_required=True, json_res=True)
def site_new(request):
	try:
		name = request.POST['name'].strip()
		neumonico = request.POST['neumonico'].strip()
		lat = request.POST['lat'].strip()
		lng = request.POST['lng'].strip()
		region = request.POST['region'].strip()
		radio = request.POST.get('radio', '10')

		new_site = Sitio(
			neumonico=neumonico,
			nombre=name,
			lat=lat,
			lng=lng,
			radio=float(radio),
			region=Region.objects.get(pk=int(region)))
		new_site.save()

		registerLog(request.user, 'Nuevo', 'Sitio', new_site.pk)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'provider_id' : new_site.pk
		})
	except IntegrityError, e:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : 'Los campos de nombre y/o neumónico no pueden repetirse'
		})
	except Exception, e:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', login_required=True, json_res=True)
def site_edit(request, id_site):
	try:
		name = request.POST.get('name', None)
		neumonico = request.POST.get('neumonico', None)
		id_region = request.POST.get('region', None)
		lat = request.POST.get('lat', None)
		lng = request.POST.get('lng', None)
		radio = request.POST.get('radio', None)

		the_site = Sitio.objects.get(pk=id_site)
		if name is not None :
			the_site.nombre = name.strip()
		if neumonico is not None :
			the_site.neumonico = neumonico.strip()
		if id_region is not None :
			the_site.region_id = Region.objects.get(pk=int(id_region))
		if lat is not None :
			the_site.lat = lat.strip()
		if lng is not None :
			the_site.lng = lng.strip()

		the_site.save()

		registerLog(request.user, 'Edición', 'Sitio', id_site)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	except Sitio.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el sitio"
		})
	except IntegrityError, e:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : 'Los campos de nombre y/o neumonico no pueden repetirse'
		})
	except Exception, e:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', login_required=True, json_res=True)
def site_delete(request, id_site):
	try:
		the_site = Sitio.objects.get(pk=id_site)
		the_site.delete()
		registerLog(request.user, 'Borrar', 'Sitio', id_site)
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except Site.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el sitio"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
