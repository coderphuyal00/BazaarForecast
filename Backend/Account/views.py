from django.shortcuts import render
# from django.contrib.auth.models import User
from .models import CustomUserModel
from django.http import HttpResponse
# Create your views here.
def deleteUser(request,pk):
    user=CustomUserModel.objects.get(id=pk).delete()
    return HttpResponse(f"User with id={pk}deleted!!")