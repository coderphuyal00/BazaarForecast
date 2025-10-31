from django.db import models
from django.core.validators import MinValueValidator
from Account.models import CustomUserModel
from django.utils import timezone
from datetime import date
# Stores Stock Details 
class Stock(models.Model):
    ticker=models.CharField(max_length=10,unique=True)
    name=models.CharField(max_length=200)
    sector=models.CharField(max_length=150)
    # Fundamental Metrics
    market_cap=models.DecimalField(max_digits=25, decimal_places=5,null=True)
    eps=models.CharField(max_length=30,null=True)
    pe_ratio=models.DecimalField(max_digits=10,decimal_places=3,null=True)
    dividend=models.CharField(max_length=20,null=True)
    bvps=models.DecimalField(max_digits=10,decimal_places=3,null=True)
    paid_capital=models.DecimalField(max_digits=50,decimal_places=5,null=True)
    listed_share=models.BigIntegerField(validators=[MinValueValidator(0)])
    year_yield=models.IntegerField(null=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.ticker}-{self.name}"
    
# Stores Daily Price Data of Stock
class StockTechnicalDetails(models.Model):
    stock=models.ForeignKey(Stock,related_name="Stock",on_delete=models.CASCADE)
    date=models.DateField()
    # daily_price
    open_price=models.DecimalField(max_digits=10,decimal_places=4)
    high_price=models.DecimalField(max_digits=10,decimal_places=4)
    low_price=models.DecimalField(max_digits=10,decimal_places=4)
    close_price=models.DecimalField(max_digits=10,decimal_places=4)
    #52 week high and low price
    high_price_52_week=models.DecimalField(max_digits=10,decimal_places=4)
    low_price_52_week=models.DecimalField(max_digits=10,decimal_places=4)
    # Daily_volume
    volume=models.BigIntegerField(validators=[MinValueValidator(0)],null=True)
     # Sentiment analysis (from search result [3])
    sentiment_score = models.IntegerField(
        null=True,
        help_text="Sentiment score ranging from -1 to 1"
    )
    class Meta:
        unique_together = ('stock', 'date')
        indexes = [models.Index(fields=['date'])]

# Stores User Stocks
class UserStocks(models.Model):
    stock=models.ForeignKey(Stock,related_name='user_stocks',on_delete=models.CASCADE)
    user=models.ForeignKey(CustomUserModel,related_name='user',on_delete=models.CASCADE)
    buy_price = models.FloatField()
    quantity = models.FloatField()
    purchase_date = models.DateField()    

    def __str__(self):
        return f"{self.user.username} - {self.stock.ticker} ({self.quantity} shares)"

class UserPortfolioValue(models.Model):
    portfolio_value_date=models.DateField()
    portfolio_value=models.DecimalField(max_digits=10,decimal_places=4)
    user=models.ForeignKey(CustomUserModel,related_name='userportolio_value',on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username}-{self.portfolio_value}"

class UserWatchList(models.Model):
    user = models.ForeignKey(CustomUserModel, on_delete=models.CASCADE, related_name='watchlist_items')
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} Watchlist - {self.stock.name}"

class StockPrediction(models.Model):
    stock = models.ForeignKey(Stock,related_name='predicted_stock_price', on_delete=models.CASCADE)  # e.g., AAPL, TSLA
    predicted_price = models.DecimalField(max_digits=10, decimal_places=2)  # Predicted price
    prediction_date = models.DateTimeField(default=timezone.now)  # When prediction was made
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for record creation

    class Meta:
        unique_together = ['stock', 'prediction_date']  # Ensure unique predictions per symbol and date
        indexes = [
            models.Index(fields=['stock', 'prediction_date']),  # Optimize queries
        ]

    def __str__(self):
        return f"{self.stock.ticker} - ${self.predicted_price} on {self.prediction_date}"
    
class StockPredictionPending(models.Model):
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    prediction_date = models.DateTimeField()
    task_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("stock", "prediction_date")