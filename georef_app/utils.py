from georef_app.models import *
from provereference.settings import DEBUG, API_KEY
from functools import wraps
from django.contrib.sessions.models import Session
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
import datetime

def response(msg, code=0, data=None):
	"""Simple example response generator"""
	from django.utils import simplejson
	r = {'code': code,
		 'msg': msg
		 }
	if data is not None:
		r['data']=data
	return HttpResponse(simplejson.dumps(r), mimetype='application/json')

def registerLog(user, operacion, modelo, modelo_id):
	new_log = Log(
		infouser=user.infouser,
		operacion=operacion,
		modelo=modelo,
		modelo_id=str(modelo_id)
	)
	new_log.save()

def check_admin(user):
	try:
		return user.infouser.is_admin()
	except InfoUser.DoesNotExist:
		pass
	return False

def check_superadmin(user):
	try:
		return user.infouser.is_superadmin()
	except InfoUser.DoesNotExist:
		pass
	return False

def dec_magic(method='POST', required_args=[], superadmin_required=False, admin_required=False, login_required=False, json_res=False):
	def check_args(func):
		# First, validate arguments *to API_magic* and raise an exception if they are bad. 
		# This happens when the code is first loaded by the server.
		#
		#  validate the method:
		if method not in ['GET', 'POST']: # add more here if you want
			err_msg = "Invalid method %s passed to API_magic by %s" % (method, func.__name__)
			raise ValueError(err_msg)

		# Next, create an input-validating version of the decorated function:
		@wraps(func)
		def new_f(request, *args, **kwargs):
			# Validate authentication
			if login_required or admin_required or superadmin_required:
				if not request.user.is_authenticated():
					if json_res :
						return response('login required')
					else :
						return HttpResponseRedirect("/login?next="+request.path)
				if superadmin_required and not check_superadmin(request.user):
					# return HttpResponseRedirect("/login?next="+request.path)
					return HttpResponseRedirect("/")
				if admin_required and not check_admin(request.user):
					# return HttpResponseRedirect("/login?next="+request.path)
					return HttpResponseRedirect("/")
			# Validate call method and get the arguments
			if method == 'GET':
				if request.method != 'GET':
					if json_res :
						return response('method-get')
					else :
						raise SuspiciousOperation('method-get')
				arg_box = request.GET
			else: # method == 'POST':
				if request.method != 'POST':
					if json_res :
						return response('method-post')
					else :
						raise SuspiciousOperation('method-post')
				arg_box = request.POST

			# For each required argument:
			for name in required_args:
				# Make sure it's present
				if not name in arg_box.keys() or not arg_box[name]:
					if json_res :
						return response("input-missing %s is a required %s argument" % (name, method))
					else :
						raise SuspiciousOperation( "%s is a required %s argument" % (name, method))
				# value = arg_box[name]
				# Apply any transformation
				# if name in transformations.keys():
				# 	type_name, converter = transformations[name]
				# 	try:
				# 		value = converter(value)
				# 	except:
				# 		err_msg = "%s %s could not be converted to %s object" % (name, value, type_name)
				# 		return response('input-invalid', err_msg)

				# Add the (possibly transformed) value to the fixed function args
				# args += (value,)

			# Call function with new arguments and return the function's return, or a default 'ok'
			r = func(request, *args, **kwargs)
			return r if r else response('ok')
		return new_f
	return check_args

def fetch_token(token_id):
	from django.contrib.sessions.models import Session
	return Session.objects.get(pk=token_id)

def dec_magic_api(method='POST', required_args=[], login_required=True):
	def check_args(func):
		# First, validate arguments *to API_magic* and raise an exception if they are bad. 
		# This happens when the code is first loaded by the server.
		#
		#  validate the method:
		if method not in ['GET', 'POST']: # add more here if you want
			err_msg = "Invalid method %s passed to API_magic by %s" % (method, func.__name__)
			raise ValueError(err_msg)

		# Next, create an input-validating version of the decorated function:
		@wraps(func)
		def new_f(request, *args, **kwargs):
			# Validate authentication
			# Validate call method and get the arguments
			if method == 'GET':
				if request.method != 'GET':
					return response('method-get')
				arg_box = request.GET
			else: # method == 'POST':
				if request.method != 'POST':
					return response('method-post')
				arg_box = request.POST
			api_key = request.META.get('HTTP_X_GEOREF_API_KEY', None)
			if not api_key:
				return response("missing api key")
			if api_key != API_KEY:
				return response("invalid api key")
			if login_required :
				# print request.META
				token = request.META.get('HTTP_X_GEOREF_TOKEN', None)
				if not token:
					return response("missing token")
				try:
					session = fetch_token(token)
					if datetime.datetime.now().date() > session.expire_date.date() :
						session.delete()
						return response("token has expired")
					args += (session,)
				except Session.DoesNotExist:
					return response("invalid token")

			# For each required argument:
			for name in required_args:
				# Make sure it's present
				if not name in arg_box.keys() or not arg_box[name]:
					return response("input-missing %s is a required %s argument" % (name, method))

			# Call function with new arguments and return the function's return, or a default 'ok'
			r = func(request, *args, **kwargs)
			return r if r else response('ok')
		return new_f
	return check_args
