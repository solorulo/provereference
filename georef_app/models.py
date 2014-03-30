from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class InfoUser (models.Model):
	user = models.OneToOneField(User)
	ADMINISTRADOR = 0
	SUPERVISOR = 1
	TIPO_CHOICES = (
		(ADMINISTRADOR, "Administrador"),
		(SUPERVISOR, "Supervisor")
	)
	tipo = models.IntegerField(choices=TIPO_CHOICES, default=SUPERVISOR)

	def __unicode__(self):
		return self.user.first_name + " " + self.user.last_name

class InfoProv (models.Model):
	user = models.OneToOneField(User)
	telefono = models.CharField(max_length=45)

	def __unicode__(self):
		return self.user.first_name + " " + self.user.last_name

class Region (models.Model):
	nombre = models.CharField(max_length=45)

	def __unicode__(self):
		return self.nombre

class Empresa (models.Model):
	region = models.ForeignKey(Region)
	nombre = models.CharField(max_length=45)

	def __unicode__(self):
		return self.nombre


class Sitio (models.Model):
	neumonico = models.CharField(max_length=45)
	nombre = models.CharField(max_length=45)
	lat = models.FloatField()
	lng = models.FloatField()
	radio = models.FloatField()
	region = models.ForeignKey(Region)

	def __unicode__(self):
		return self.nombre

class Actividad (models.Model):
	fecha = models.DateTimeField()
	tipo_evento = models.CharField(max_length=45)
	lat = models.FloatField()
	lng = models.FloatField()
	margen_error = models.FloatField()
	sitio = models.ForeignKey(Sitio)
	info_user = models.ForeignKey(User)

	def __unicode__(self):
		return self.tipo_evento
