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

	return render(request, 'sitios.html')

@login_required
def site_new(request):
	return render(request, 'index.html')

@login_required
def site_edit(request):
	return render(request, 'index.html')

@login_required
def site_delete(request):
	return render(request, 'index.html')