from django.db import models
from django.contrib.auth.models import AbstractUser, User
from django.conf import settings
from django.contrib.auth.hashers import check_password
# Create your models here.

class LocalUser(AbstractUser):
    premium = models.BooleanField(default=False)
