# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User

import math

# Create your models here.
# class UserProfile (models.Model):
# 	user = models.ForeignKey(User)

# 	def __unicode__(self):
# 		return self.user.first_name + " " + self.user.last_name
		
class Region (models.Model):
	nombre = models.CharField(max_length=45)

	def __unicode__(self):
		return u'Región '+self.nombre

class Empresa (models.Model):
	region = models.ForeignKey(Region)
	nombre = models.CharField(max_length=45)

	def __unicode__(self):
		return self.nombre

class InfoUser (User):
	telefono = models.CharField(max_length=45, blank=True, null=True)
	ADMINISTRADOR = 0
	SUPERVISOR = 1
	# USUARIO = 2
	TIPO_CHOICES = (
		(ADMINISTRADOR, "Administrador"),
		(SUPERVISOR, "Supervisor"),
		# (USUARIO, "Usuario"),
	)
	tipo = models.IntegerField(choices=TIPO_CHOICES, default=SUPERVISOR)
	class Meta:
		db_table = 'info_user'

	def __unicode__(self):
		return self.get_full_name() + ' - ' + self.get_tipo_display()

	def is_admin(self):
		return self.tipo == InfoUser.ADMINISTRADOR

	def is_supervisor(self):
		return self.tipo == InfoUser.SUPERVISOR

	def save(self, *args, **kwargs):
		print 'saving infouser'
		if self.pk is None:
			print 'first save'
			self.set_password(self.password)
		super(InfoUser, self).save(*args, **kwargs)

class InfoProv (User):
	imei = models.CharField(max_length=45, unique=True)
	empresa = models.ForeignKey(Empresa, related_name='empresa_prov')
	telefono = models.CharField(max_length=45, unique=True)
	class Meta:
		db_table = 'info_prov'

	def __unicode__(self):
		return self.get_full_name()

	def save(self, *args, **kwargs):
		print 'saving infoprov'
		if self.pk is None:
			print 'first save'
			self.set_password(self.password)
		super(InfoProv, self).save(*args, **kwargs)


class Sitio (models.Model):
	neumonico = models.CharField(max_length=45)
	nombre = models.CharField(max_length=45)
	lat = models.FloatField()
	lng = models.FloatField()
	radio = models.FloatField()
	region = models.ForeignKey(Region)

	def distance_rel(self, lat, lng):
		dlon = self.lng - lng
		dlat = self.lat - lat
		a = (math.sin(dlat/2))**2 + math.cos(lat) * math.cos(self.lat) * (math.sin(dlon/2))**2 
		return math.atan2( math.sqrt(a), math.sqrt(1-a) )

	def __unicode__(self):
		return self.nombre

class Actividad (models.Model):
	fecha = models.DateTimeField()
	tipo_evento = models.CharField(max_length=45)
	lat = models.FloatField()
	lng = models.FloatField()
	margen_error = models.FloatField()
	sitio = models.ForeignKey(Sitio)
	infoprov = models.ForeignKey(InfoProv)

	def __unicode__(self):
		return self.tipo_evento
