from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.

@login_required
def sites(request):
	return render(request, 'index.html')

@login_required
def site_new(request):
	return render(request, 'index.html')

@login_required
def site_edit(request):
	return render(request, 'index.html')

@login_required
def site_delete(request):
	return render(request, 'index.html')