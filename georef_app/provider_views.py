# -*- coding: utf-8 -*-
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoProv, Empresa, Sitio, Region
from georef_app.utils import check_admin

# Create your views here.

@login_required
def providers(request):
	if not check_admin(request.user):
		raise PermissionDenied
	_json = {}
	providers = []
	sites_provs = []
	mProviders = Empresa.objects.all().select_related().order_by('nombre')
	mSites = Sitio.objects.all().select_related()
	mRegions = Region.objects.all().values()
	# print simplejson.dumps(list(mSites.values()))
	for site in mSites:
		mSiteProvs = mProviders.filter(region=site.region).values('pk')
		sites_provs.append({
			'id':site.id,
			'name':site.nombre,
			'provs':list(mSiteProvs)
			})
	for prov in mProviders:
		nusers = InfoProv.objects.filter(empresa=prov).count()
		# sites = Sitio.objects.filter(region=prov.region).values('pk', 'nombre')
		providers.append({
			'id':prov.id,
			'name':prov.nombre,
			'nusers':nusers,
			'reg': u'Región '+prov.region.nombre, 
			# 'sites':list(sites)
			})
	_json["providers"] = providers
	_json["sites"] = sites_provs
	_json["regiones"] = list(mRegions)
	data = simplejson.dumps(_json)
	print data
	return render(request, 'proveedor.html', {"data":data})

@login_required
def provider_new(request):
	return render(request, 'index.html')

@login_required
def provider_edit(request):
	return render(request, 'index.html')

@login_required
def provider_delete(request):
	return render(request, 'index.html')