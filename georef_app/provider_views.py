from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoUser
from georef_app.utils import check_admin

# Create your views here.

@login_required
def providers(request):
	if not check_admin(request.user):
		raise PermissionDenied
	users = []
	# mUsers = InfoUser.objects.filter(tipo=InfoUser.ADMINISTRADOR).order_by("first_name")
	# for user in mUsers:
	# 	users.append({
	# 		'id':user.id,
	# 		'name':user.get_full_name(),
	# 		'email':user.email,
	# 		# 'tel':str(count)
	# 		'tel':user.telefono
	# 		})
	data = simplejson.dumps(users)
	return render(request, 'proveedor.html', {"data":data})

@login_required
def provider_new(request):
	return render(request, 'index.html')

@login_required
def provider_edit(request):
	return render(request, 'index.html')

@login_required
def provider_delete(request):
	return render(request, 'index.html')