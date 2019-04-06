from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
	bio_text	= models.CharField(blank=True, max_length=200)
	pro_pic 	= models.FileField(blank=True)
	assoc_user  = models.OneToOneField(User, on_delete=models.PROTECT)
	content_type = models.CharField(max_length=50, default="image")

class Request(models.Model):
	name = models.CharField(blank=True, max_length=200)
	description = models.CharField(blank=True, max_length=200)
	location = models.CharField(blank=True, max_length=200)
	datetime = models.DateTimeField()
	assoc_user  = models.ForeignKey(User, on_delete=models.PROTECT)

class Review(models.Model):
	review_text = models.CharField(blank=True, max_length=200)
	assoc_user = models.ForeignKey(User, default=None, on_delete=models.PROTECT)
	datetime = models.DateTimeField()
	user = models.IntegerField()