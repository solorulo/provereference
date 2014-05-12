from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoUser, InfoProv
from georef_app.utils import dec_magic_api, response

import datetime
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
	context = { 'session':str(s.get_decoded()), 'expire':str(s.expire_date), 'now':str(datetime.datetime.now()) }
	return response('vientos', 1, context)

@dec_magic_api(method='POST', required_args=['imei'], login_required=False)
def login(request):
	imei = request.POST['imei']
	try:
		user_prov = InfoProv.objects.get(imei=imei)
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

@dec_magic_api(method='GET')
def logout(request, *args, **kwargs):
	session = args[0]
	session.delete()
	return response('ok', 1)
