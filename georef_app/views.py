from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
def login(request):
	return render(request, 'login.html')

def logout(request):
	auth_logout(request)
	return HttpResponseRedirect('/')

@login_required
def home(request):
	return render(request, 'index.html')
