from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson, dateparse
from django.views.decorators.csrf import csrf_exempt
from georef_app.models import *
from georef_app.utils import dec_magic_api, response
import time
# from dateutil.parser import *
# datetime.datetime.now()

@dec_magic_api(method='GET', required_args=['imei'])
def api_log(request):
	imei = request.GET['imei']
	user_prov = InfoProv.objects.get(imei=imei)
	request.session['user_id'] = user_prov.pk
	request.session['username'] = user_prov.username
	request.session.set_expiry(1000)
	request.session.save()
	s = Session.objects.get(pk=request.session.session_key)
	context = { 'session':str(s.get_decoded()), 'expire':str(s.expire_date), 'now':str(datetime.now()) }
	return response('vientos', 1, context)

@csrf_exempt
@dec_magic_api(method='POST', required_args=['imei'], login_required=False)
def login(request):
	imei = request.POST['imei']
	try:
		user_prov = InfoProv.objects.get(imei=imei)
		# request.session['user'] = user_prov
		request.session['user_id'] = user_prov.pk
		request.session['imei'] = imei
		request.session['phone'] = user_prov.telefono
		request.session.save()
		data = {
			'token':request.session.session_key,
			'first_name':user_prov.first_name,
			'last_name':user_prov.last_name,
			'provider':user_prov.empresa.nombre,
			'phone':user_prov.telefono
		}
		return response('ok', 1, data)
	except InfoProv.DoesNotExist:
		return response('not exist')

@csrf_exempt
@dec_magic_api(method='POST', required_args=['events'])
def event(request, *args, **kwargs):
	session = args[0].get_decoded()
	events_string = request.POST['events']
	try:
		events = simplejson.loads(events_string)
	except Exception, e:
		raise e
	mSites = Sitio.objects.all()
	sites = list(mSites)
	if not sites:
		response('no sites')
	for event in events:
		# https://docs.python.org/2/library/time.html#time.strptime
		# datetime YYYY-mm-dd HH:MM
		tiempo = dateparse.parse_datetime(event['datetime'])
		tipo_evento = event['tipo']
		lat = float(event['lat'])
		lng = float(event['lng'])
		margen_error = event.get('margin_error')
		sites.sort(key=lambda x: x.distance_rel(lat, lng))
		# print sites
		nearest_site = sites[0]
		new_activity = Actividad(
			fecha=tiempo,
			tipo_evento=tipo_evento,
			lat=lat,
			lng=lng,
			margen_error=margen_error,
			sitio=nearest_site,
			infoprov_id=session['user_id']
		)
		new_activity.save()

	return response('ok', 1)

@dec_magic_api(method='GET')
def logout(request, *args, **kwargs):
	session = args[0]
	session.delete()
	return response('ok', 1)
