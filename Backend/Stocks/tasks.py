from celery import shared_task
# from .models import StockPrediction,Stock
from .Prediction.LTSM import predict_stock_price
from django.utils import timezone
from datetime import date
import pandas as pd
from decimal import Decimal,InvalidOperation
import os
# from time import sleep
import numpy as np
from .models import Stock, StockPrediction, StockPredictionPending
import logging
from datetime import datetime,time

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def predict_stock_task(self, ticker: str, today_iso: str):
    date_obj = datetime.strptime(today_iso, "%Y-%m-%d").date()

    # Combine date with midnight time and make timezone-aware datetime in Django timezone
    naive_datetime = datetime.combine(date_obj, time.min)
    if timezone.is_naive(naive_datetime):
        prediction_date = timezone.make_aware(naive_datetime)
    else:
        prediction_date = naive_datetime
    

    try:
        predicted_price = predict_stock_price(ticker)
        predicted_price = Decimal(str(predicted_price))
        # -----------------------------------------------------------------------
        stock = Stock.objects.get(ticker=ticker.upper())

        # Save *only* if it does not exist (race-condition safe)
        obj, created = StockPrediction.objects.get_or_create(
            stock=stock,
            prediction_date=prediction_date,
            defaults={"predicted_price": predicted_price}
        )
        if not created:
            # Another worker already wrote it – just log
            logger.info("Prediction already stored by another worker.")
            predicted_price = obj.predicted_price

        # ---- Remove the "pending" flag ----------------------------------------
        StockPredictionPending.objects.filter(
            stock=stock, prediction_date=prediction_date
        ).delete()

        logger.info(f"Prediction for {ticker} on {prediction_date} → {predicted_price}")
        return predicted_price

    except Exception as exc:
        # Optional: retry logic
        raise self.retry(exc=exc)