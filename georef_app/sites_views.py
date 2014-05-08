# -*- coding: utf-8 -*-
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoProv, Empresa, Sitio, Region
from georef_app.utils import dec_magic

# Create your views here.

@dec_magic(method='GET', admin_required=True)
def sites(request, format):
	_json = {}
	sites_provs = []
	mSites = Sitio.objects.all().select_related()
	mRegions = Region.objects.all().values()
	# print simplejson.dumps(list(mSites.values()))
	for site in mSites:
		sites_provs.append({
			'id':site.id,
			'name':site.nombre,
			})
	_json["sites"] = sites_provs
	_json["regiones"] = list(mRegions)
	data = simplejson.dumps(_json)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'sitios.html', {"data":data})

@dec_magic(method='POST', required_args=['name', 'neumonico', 'lat', 'lng', 'region'], admin_required=True, json_res=True)
def site_new(request):
	try:
		name = request.POST['name']
		neumonico = request.POST['neumonico']
		lat = request.POST['lat']
		lng = request.POST['lng']
		region = request.POST['region']
		radio = request.POST.get('radio', '10')

		new_site = Sitio(
			neumonico=neumonico,
			nombre=name,
			lat=lat,
			lng=lng,
			radio=float(radio),
			region=int(region))
		new_site.save()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'provider_id' : new_site.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', admin_required=True, json_res=True)
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
			the_site.nombre = name
		if neumonico is not None :
			the_site.neumonico = neumonico
		if id_region is not None :
			the_site.region_id = id_region
		if lat is not None :
			the_site.lat = lat
		if lng is not None :
			the_site.lng = lng

		the_site.save()

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	except Sitio.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el sitio"
		})
	except:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Ocurrio un error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', admin_required=True, json_res=True)
def site_delete(request, id_site):
	try:
		the_site = Sitio.objects.get(pk=id_site)
		the_site.delete()
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
