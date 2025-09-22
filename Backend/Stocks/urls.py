from django.urls import path
from . import views
urlpatterns=[
    # path('/',views.abc,name='abc')
    path('home/',views.home,name='home')
]