from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUserModel(AbstractUser):
    full_name=models.CharField(max_length=50,null=True,blank=True)
    email=models.EmailField(unique=True)
    REQUIRED_FIELDS=[]
    def __str__(self):
        return self.email
    

    