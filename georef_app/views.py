from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from georef_app.models import *
from georef_app.utils import check_admin

# Create your views here.
def login(request):
	if request.method == 'GET' or not 'username' in request.POST or not 'password' in request.POST:
		next = request.GET.get('next', None)
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
		return HttpResponseRedirect('/')

	print 'Login fail: ' + username
	return render(request, 'login.html', {'wrong_data':True, 'username':username})


def logout(request):
	auth_logout(request)
	return HttpResponseRedirect('/')

@login_required
def home(request):
	if check_admin(request.user):
		return HttpResponseRedirect('/administradores')
	else:
		return HttpResponseRedirect('/supervision')
