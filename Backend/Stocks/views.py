from django.shortcuts import render,get_object_or_404
from .models import UserStocks,Stock
from Account.models import CustomUserModel
from Data_Handling.handle_stocks import upload_daily_price
# Create your views here.
def home(request):
    # data=getIndexData()
    # store_company_data()
    # update_company_yearyield_data()
    # upload_daily_price()
    # current_user_id=request.user.id
    # user=CustomUserModel.objects.get(id=current_user_id)
    # stocks=UserStocks.objects.get(user=user)
    stocks=Stock.objects.all()
    context={
        'data':stocks
    }
    return render(request,'index_data.html',context)