# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoProv, Empresa, Sitio, Region
from georef_app.utils import dec_magic

@dec_magic(method='GET', admin_required=True)
def providers(request):
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

@dec_magic(method='POST', required_args=['name', 'region'], admin_required=True, json_res=True)
def provider_new(request):
	try:
		name = request.POST['name']
		region = request.POST['region']

		new_provider = Empresa(
			nombre=name,
			region_id=int(region)
			)
		new_provider.save()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'provider_id' : new_provider.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', admin_required=True, json_res=True)
def provider_edit(request, id_provider):
	try:
		name = request.POST.get('name', None)
		id_region = request.POST.get('region', None)

		the_provider = Empresa.objects.get(pk=id_provider)
		if name is not None :
			the_provider.nombre = name
		if id_region is not None :
			the_provider.region_id = id_region

		the_provider.save()

		data = simplejson.dumps({
			'code' : code,
			'msg' : "Bien"
		})
	except Empresa.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el proveedor"
		})
	except:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Ocurrio un error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', admin_required=True, json_res=True)
def provider_delete(request, id_provider):
	try:
		the_provider = Empresa.objects.get(pk=id_provider)
		the_provider.delete()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except Empresa.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el proveedor"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
