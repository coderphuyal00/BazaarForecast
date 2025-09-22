from django.shortcuts import render
# from django.contrib.auth.models import User
from .models import CustomUserModel
from django.http import HttpResponse
# Create your views here.
def deleteUser(request):
    user=CustomUserModel.objects.get(id=8).delete()
    return HttpResponse("User with id=2 deleted!!")