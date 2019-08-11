from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import admin
from datetime import datetime
from LocalUser.models import LocalUser, UserProfile


# Create your models here.
class Bookmark(models.Model):
    user = models.ForeignKey(UserProfile, related_name='bookmarks', on_delete=models.CASCADE)
    lat = models.CharField(max_length=1000)
    lon = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)

