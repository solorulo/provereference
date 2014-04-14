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
def supervisors(request):
	if not check_admin(request.user):
		raise PermissionDenied
	users = []
	mUsers = InfoUser.objects.filter(tipo=InfoUser.SUPERVISOR).order_by("first_name")
	for user in mUsers:
		users.append({
			'id':user.id,
			'name':user.get_full_name(),
			'email':user.email,
			# 'tel':str(count)
			'tel':user.telefono
			})
	data = simplejson.dumps(users)
	return render(request, 'Supervisor.html', {"data":data})

@login_required
def supervisor_new(request):
	if not check_admin(request.user):
		raise PermissionDenied
	if request.method != 'POST':
		raise SuspiciousOperation('Solo POST')

	try:
		first_name = request.POST['first_name']
		last_name = request.POST['last_name']
		email = request.POST['email']
		password = request.POST['password']

		new_supervisor = InfoUser.create(
			username=email,
			first_name=first_name,
			last_name=last_name,
			tipo=InfoUser.Supervisor,
			email=email,
			password=password)
		# new_supervisor.save()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data } )

@login_required
def supervisor_edit(request, id_supervisor):
	if not check_admin(request.user):
		raise PermissionDenied
	if request.method != 'POST':
		raise SuspiciousOperation('Solo POST')

	try:
		first_name = request.POST('first_name', None)
		last_name = request.POST('last_name', None)
		email = request.POST('email', None)
		the_supervisor = request.POST('is_admin', None)

		the_supervisor = InfoUser.objects.get(pk=id_supervisor)
		if first_name is not None :
			the_supervisor.first_name = first_name
		if last_name is not None :
			the_supervisor.last_name = last_name
		if email is not None :
			the_supervisor.email = email
		if is_admin is not None :
			if is_admin != 'false' and is_admin != 'False':
				the_supervisor.tipo = InfoUser.ADMINISTRADOR
			else:
				the_supervisor.tipo = InfoUser.SUPERVISOR

		the_supervisor.save()

		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien"
		})
	except InfoUser.DoesNotExist:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "No existe el usuario"
		})
	except:
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Ocurrio un error desconocido"
		})
	return render(request, 'simple_data.html', { 'data':data } )

@login_required
def supervisor_delete(request, id_supervisor):
	if not check_admin(request.user):
		raise PermissionDenied
	try:
		the_supervisor = InfoUser.objects.get(pk=id_supervisor)
		the_supervisor.delete()
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