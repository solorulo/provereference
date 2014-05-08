from django.shortcuts import render
from django.utils import simplejson
from georef_app.models import InfoUser
from georef_app.utils import dec_magic

@dec_magic(method='GET', admin_required=True)
def admins(request, format):
	users = []
	mUsers = InfoUser.objects.filter(tipo=InfoUser.ADMINISTRADOR).order_by("first_name")
	for user in mUsers:
		users.append({
			'id':user.id,
			'first_name':user.first_name,
			'last_name':user.last_name,
			'email':user.email,
			'is_admin':user.is_admin(),
			# 'tel':str(count)
			'tel':user.telefono
			})
	data = simplejson.dumps(users)
	if format:
		return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
	return render(request, 'administrador.html', {"data":data})

@dec_magic(method='POST', required_args=['last_name', 'email'], admin_required=True, json_res=True)
def admin_new(request):
	try:
		first_name = request.POST.get('first_name', '')
		last_name = request.POST['last_name']
		email = request.POST['email']
		phone = request.POST.get('tel', '')

		if 'password' in request.POST:
			password = request.POST['password']
		else:
			password = last_name

		new_admin = InfoUser(
			username=email,
			first_name=first_name,
			last_name=last_name,
			tipo=InfoUser.ADMINISTRADOR,
			email=email,
			password=password,
			telefono=phone)
		new_admin.save()
		data = simplejson.dumps({
			'code' : 1,
			'msg' : "Bien",
			'user_id' : new_admin.pk
		})
	except :
		data = simplejson.dumps({
			'code' : 0,
			'msg' : "Fallo"
		})
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', admin_required=True, json_res=True)
def admin_edit(request, id_admin):
	try:
		first_name = request.POST.get('first_name', None)
		last_name = request.POST.get('last_name', None)
		email = request.POST.get('email', None)
		phone = request.POST.get('tel', None)
		is_admin = request.POST.get('is_admin', None)
		the_admin = InfoUser.objects.get(pk=id_admin)

		if first_name is not None :
			the_admin.first_name = first_name
		if last_name is not None :
			the_admin.last_name = last_name
		if email is not None :
			the_admin.email = email
		if phone is not None :
			the_admin.telefono = phone
		code = 1
		if is_admin is not None :
			if is_admin != 'false' and is_admin != 'False':
				type_user = InfoUser.ADMINISTRADOR
			else:
				type_user = InfoUser.SUPERVISOR
			if the_admin.tipo != type_user:
				code = 1.1
				the_admin.tipo = type_user

		the_admin.save()

		data = simplejson.dumps({
			'code' : code,
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
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')

@dec_magic(method='POST', admin_required=True, json_res=True)
def admin_delete(request, id_admin):
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
	return render(request, 'simple_data.html', { 'data':data }, content_type='application/json')
