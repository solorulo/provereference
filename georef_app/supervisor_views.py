from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson

# Create your views here.

# @login_required
def supervisors(request):
	users = []
	countUsers = User.objects.all().count() * 0.5
	mUsers = User.objects.all()[0:countUsers]

	for user in mUsers:
		users.append({
			"name":user.username,
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