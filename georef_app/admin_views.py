from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import *

# Create your views here.
# @login_required
def admins(request):
	users = []
	countUsers = User.objects.all().count()
	mUsers = User.objects.all().order_by("username")[0:countUsers]
	count = 0
	for user in mUsers:
		for x in range(0,1):
			if (user.first_name == ''):
				name = user.username
			else:
				name = (user.first_name + " " + user.last_name)
			users.append({
				'id':user.id,
				'name':name,
				'email':user.email,
				'tel':str(count)
				# 'tel':user.telefono
				})
			count = count + 1
	data = simplejson.dumps(users)
	return render(request, 'administrador.html', {"data":data})

@login_required
def admin_new(request):
	return render(request, 'index.html')

@login_required
def admin_edit(request):
	return render(request, 'index.html')

@login_required
def admin_delete(request):
	return render(request, 'index.html')