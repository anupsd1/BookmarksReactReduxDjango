from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class LocalUser(AbstractUser):
    profile_id = models.ForeignKey(
        'UserProfile', on_delete=models.DO_NOTHING, null=True
    )


class UserProfile(models.Model):
    first_name = models.CharField(max_length=300)
    last_name = models.CharField(max_length=300)
    email = models.EmailField(unique=True)
    premium = models.BooleanField(default=False)

    def __str__(self):
        return self.first_name+" "+self.last_name


class GmailAccount(models.Model):
    user_profile_id = models.ForeignKey('UserProfile', on_delete=models.CASCADE)
    gmail_id = models.CharField(max_length=500)

    def __str__(self):
        return self.gmail_id