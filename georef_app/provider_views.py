from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.

@login_required
def providers(request):
	return render(request, 'index.html')

@login_required
def provider_new(request):
	return render(request, 'index.html')

@login_required
def provider_edit(request):
	return render(request, 'index.html')

@login_required
def provider_delete(request):
	return render(request, 'index.html')