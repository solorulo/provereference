from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from georef_app.models import *

# Create your views here.
def login(request):
	if request.method == 'GET' or not 'username' in request.POST or not 'password' in request.POST:
		if 'next' in request.GET:
			next = request.GET['next']
		return render(request, 'login.html', {'next':next})
	if not 'username' in request.POST or not 'password' in request.POST:
		return render(request, 'login.html', {'wrong_data':True})
	username = request.POST.get("username", None)
	password = request.POST.get("password", None)
	
	next = request.POST.get('next', None)

	# user = User.objects.get(username=username)
	# print user.check_password(password)
	# user.set_password(password)
	# user.save()
	# print user.check_password(password)

	user = authenticate(username=username, password=password)
	print user
	if user is not None :
		auth_login(request, user)
		if next is not None:
			return HttpResponseRedirect(next)
		if user.infouser.tipo == InfoUser.ADMINISTRADOR:
			return HttpResponseRedirect('/administradores')
		else:
			return HttpResponseRedirect('/supervision')

	print 'Login fail: ' + username
	return render(request, 'login.html', {'wrong_data':True, 'username':username})


def logout(request):
	auth_logout(request)
	return HttpResponseRedirect('/')

@login_required
def home(request):
	return render(request, 'index.html')
