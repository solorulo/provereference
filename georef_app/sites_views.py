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
def sites(request):
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
	print data
	return render(request, 'proveedor.html', {"data":data})

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

@login_required
def site_edit(request):
	return render(request, 'index.html')

@login_required
def site_delete(request):
	return render(request, 'index.html')