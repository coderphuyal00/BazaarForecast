from django.shortcuts import render
from django.http import HttpResponse
from .index_data import getIndexData
from Data_Handling.handle_stocks import store_company_data,update_company_yearyield_data,update_company_data
# Create your views here.

# def home(request):
#     # data=getIndexData()
#     # store_company_data()
#     # update_company_yearyield_data()
#     update_company_data()
#     return HttpResponse("Data Inserted Successfully.")