from django.shortcuts import render,get_object_or_404
from .models import UserStocks,Stock,StockPrediction,StockPredictionPending
from Account.models import CustomUserModel
from Data_Handling.handle_stocks import upload_daily_price
from .Prediction.LTSM import predict_stock_price 
from django.http import JsonResponse
from django.utils import timezone
from .tasks import predict_stock_task
from decimal import Decimal
from datetime import date,datetime,time
from celery.result import AsyncResult
# from django.shortcuts import get_object_or_404
# from .tasks import add
# Create your views here.
def home(request):
    # data=getIndexData()
    # store_company_data()
    # update_company_yearyield_data()
    # upload_daily_price()
    # current_user_id=request.user.id
    # user=CustomUserModel.objects.get(id=current_user_id)
    # stocks=UserStocks.objects.get(user=user)
    # predicted_price=predict_stock_price(symbol='ACLBSL')
    stocks=Stock.objects.all()
    # add.delay(10,20)
    # result=add.delay(2,5)
    # print(result)
    context={
        'data':stocks,
        # 'data':predicted_price
        # 'price':predicted_price
    }
    return render(request,'index_data.html',context)

def predict_stock_view(request, ticker: str):
    ticker = ticker.upper().strip()

    stock = get_object_or_404(Stock, ticker=ticker)

    today_date = date.today()

    # 1. Check for cached prediction
    cached = StockPrediction.objects.filter(
        stock=stock,
        prediction_date=today_date
    ).first()

    if cached:
        return JsonResponse({
            "ticker": ticker,
            "predicted_price": float(cached.predicted_price),
            "prediction_date": cached.prediction_date.isoformat(),
            "message": "Already predicted today (cached).",
            "source": "database",
        })

    # 2. Check if a prediction task is pending or running
    try:
        pending = StockPredictionPending.objects.get(stock=stock, prediction_date=today_date)
        task_id = pending.task_id
    except StockPredictionPending.DoesNotExist:
        pending = None
        task_id = None

    if pending:
        res = AsyncResult(task_id)
        if res.state == "SUCCESS":
            # Task finished, fetch stored prediction from DB
            completed_prediction = StockPrediction.objects.filter(
                stock=stock,
                prediction_date=today_date
            ).first()

            if completed_prediction:
                # Delete pending record, task done
                pending.delete()
                return JsonResponse({
                    "ticker": ticker,
                    "predicted_price": float(completed_prediction.predicted_price),
                    "prediction_date": completed_prediction.prediction_date.isoformat(),
                    "status": "Prediction complete",
                    "message": "Prediction result fetched.",
                    "source": "celery",
                })
            else:
                # DB not updated yet; ask client to retry soon
                return JsonResponse({
                    "ticker": ticker,
                    "task_id": task_id,
                    "status": "Waiting for DB update",
                    "message": "Please check back again shortly.",
                    "source": "celery",
                })
        elif res.state in {"PENDING", "STARTED", "PROGRESS"}:
            return JsonResponse({
                "ticker": ticker,
                "task_id": task_id,
                "status": "Prediction in progress…",
                "message": "Check back in a few seconds.",
                "source": "celery",
            })
        else:
            # Possible failure or unknown state
            return JsonResponse({
                "ticker": ticker,
                "status": "Prediction failed or unknown",
                "message": "Please retry later.",
                "source": "celery",
            })

    # 3. No cache & no pending task → launch new one
    task = predict_stock_task.delay(ticker, today_iso=today_date.isoformat())

    pending_obj, created = StockPredictionPending.objects.get_or_create(
        stock=stock,
        prediction_date=today_date,
        defaults={"task_id": task.id},
    )
    if not created and pending_obj.task_id != task.id:
        pending_obj.task_id = task.id
        pending_obj.save()

    return JsonResponse({
        "ticker": ticker,
        "task_id": task.id,
        "status": "Prediction queued",
        "message": "Check back in a few seconds. Refresh to see result.",
        "source": "celery",
    })