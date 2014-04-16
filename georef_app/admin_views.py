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
def admins(request):
	if not check_admin(request.user):
		raise PermissionDenied
	users = []
	mUsers = InfoUser.objects.filter(tipo=InfoUser.ADMINISTRADOR).order_by("first_name")
	for user in mUsers:
		users.append({
			'id':user.id,
			'name':user.get_full_name(),
			'email':user.email,
			# 'tel':str(count)
			'tel':user.telefono
			})
	data = simplejson.dumps(users)
	return render(request, 'administrador.html', {"data":data})

@login_required
def admin_new(request):
	if not check_admin(request.user):
		print "permission denied admin_new"
		raise PermissionDenied
	if request.method != 'POST':
		print "solo post admin_new"
		raise SuspiciousOperation('Solo POST')

	try:
		first_name = request.POST['first_name']
		last_name = request.POST['last_name']
		email = request.POST['email']

		if 'password' in request.POST:
			password = request.POST['password']
		else:
			password = last_name

		# TODO Verificar que funcione el password con la funcion de primer registro
		new_admin = InfoUser(
			username=email,
			first_name=first_name,
			last_name=last_name,
			tipo=InfoUser.ADMINISTRADOR,
			email=email,
			password=password,
			telefono='3934290')


		new_admin.save()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'admin_id' : new_admin.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data })

@login_required
def admin_edit(request, id_admin):
	if not check_admin(request.user):
		raise PermissionDenied
	if request.method != 'POST':
		raise SuspiciousOperation('Solo POST')

	try:
		first_name = request.POST('first_name', None)
		last_name = request.POST('last_name', None)
		email = request.POST('email', None)
		is_admin = request.POST('is_admin', None)

		the_admin = InfoUser.objects.get(pk=id_admin)
		if first_name is not None :
			the_admin.first_name = first_name
		if last_name is not None :
			the_admin.last_name = last_name
		if email is not None :
			the_admin.email = email
		if is_admin is not None :
			if is_admin != 'false' and is_admin != 'False':
				the_admin.tipo = InfoUser.ADMINISTRADOR
			else:
				the_admin.tipo = InfoUser.SUPERVISOR

		the_admin.save()

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
def admin_delete(request, id_admin):
	if not check_admin(request.user):
		raise PermissionDenied
	try:
		the_admin = InfoUser.objects.get(pk=id_admin)
		the_admin.delete()
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
