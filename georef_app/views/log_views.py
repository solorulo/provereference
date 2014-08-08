# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoUser, Log
from georef_app.utils import dec_magic

@dec_magic(method='GET', admin_required=True)
def log(request, format):
	log_db = Log.objects.all().order_by('-fecha')
	if format:
		return render(request, 'simple_data.html', { 'data':log_db }, content_type='application/json')
	return render(request, 'log.html', {"data":log_db})
