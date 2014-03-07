from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
@login_required
def users(request):
	return render(request, 'index.html')

@login_required
def user_new(request):
	return render(request, 'index.html')

@login_required
def user_edit(request):
	return render(request, 'index.html')

@login_required
def user_delete(request):
	return render(request, 'index.html')