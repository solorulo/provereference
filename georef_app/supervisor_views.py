from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import *

# Create your views here.

# @login_required
def supervisors(request):
	users = []
	mUsers = InfoUser.objects.filter(tipo=InfoUser.SUPERVISOR).order_by("first_name")

	for user in mUsers:
		if (not user.first_name ):
			name = user.username
		else:
			name = (user.first_name + " " + user.last_name)
		users.append({
			"name":name,
			"email":user.email
			})
	data = simplejson.dumps(users)
	return render(request, 'Supervisor.html', {"data":data})

@login_required
def supervisor_new(request):
	return render(request, 'index.html')

@login_required
def supervisor_edit(request):
	return render(request, 'index.html')

@login_required
def supervisor_delete(request):
	return render(request, 'index.html')