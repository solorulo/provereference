from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied, SuspiciousOperation
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import *
from georef_app.utils import dec_magic, check_admin

# Create your views here.
@dec_magic(method='GET', admin_required=True)
def users(request):
	return render(request, 'index.html')

@dec_magic(method='POST', required_args=[], admin_required=True, json_res=True)
def user_new(request):
	try:
		# TODO dar de alta el usuario
		# first_name = request.POST['first_name']
		# last_name = request.POST['last_name']
		# email = request.POST['email']

		# if 'password' in request.POST:
		# 	password = request.POST['password']
		# else:
		# 	password = last_name

		# new_supervisor = InfoUser(
		# 	username=email,
		# 	first_name=first_name,
		# 	last_name=last_name,
		# 	tipo=InfoUser.SUPERVISOR,
		# 	email=email,
		# 	password=password,
		# 	telefono='3934290')
		# new_supervisor.save()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			# 'user_id':new_supervisor.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json' )

@dec_magic(method='POST', admin_required=True, json_res=True)
def user_edit(request, id_user):
	try:
		# TODO Editar al usuario
		# first_name = request.POST.get('first_name', None)
		# last_name = request.POST.get('last_name', None)
		# email = request.POST.get('email', None)
		# the_supervisor = request.POST.get('is_admin', None)

		# the_supervisor = InfoUser.objects.get(pk=id_supervisor)
		# if first_name is not None :
		# 	the_supervisor.first_name = first_name
		# if last_name is not None :
		# 	the_supervisor.last_name = last_name
		# if email is not None :
		# 	the_supervisor.email = email
		# code = 1
		# if is_admin is not None :
		# 	if is_admin != 'false' and is_admin != 'False':
		# 		the_supervisor.tipo = InfoUser.ADMINISTRADOR
		# 		code = 1.1
		# 	else:
		# 		the_supervisor.tipo = InfoUser.SUPERVISOR

		# the_supervisor.save()

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	# except InfoUser.DoesNotExist:
	# 	data = simplejson.dumps({
	# 		'code' : 0,
	# 		'msg' : "No existe el usuario"
	# 	})
	except:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Ocurrio un error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data } )

@dec_magic(method='POST', admin_required=True, json_res=True)
def user_delete(request):
	try:
		# TODO Borrar Supervisor
		# the_supervisor = InfoUser.objects.get(pk=id_supervisor)
		# the_supervisor.delete()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Borrado"
		})
	except InfoUser.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	return render(request, 'simple_data.html', { 'data':data } )

@dec_magic(method='GET', admin_required=False)
def user(request, id_user):
	return render(request, 'mostrardatos.html')

@dec_magic(method='GET', admin_required=False)
def supervision(request):

	return render(request, 'Supervision.html')
