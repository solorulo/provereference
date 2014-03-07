from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render

# Create your views here.
@login_required
def admins(request):
	return render(request, 'index.html')

@login_required
def admin_new(request):
	return render(request, 'index.html')

@login_required
def admin_edit(request):
	return render(request, 'index.html')

@login_required
def admin_delete(request):
	return render(request, 'index.html')