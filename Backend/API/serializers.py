from rest_framework.serializers import ModelSerializer
from Stocks.models import UserStocks,StockTechnicalDetails,Stock,UserPortfolioValue,UserWatchList
from Account.models import CustomUserModel
from Data_Handling.stock_price import getStockPrice
from rest_framework import serializers
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
# Get Stock Details 
class StockSerializer(ModelSerializer):
    class Meta:
        model=Stock
        fields='__all__'
# Get User Details
class UserSerializer(ModelSerializer):
    class Meta:
        model=CustomUserModel
        fields=['first_name','last_name','email','username']

# Stock Daily Price
class stockpriceSerializer(serializers.Serializer):
    stock=serializers.CharField()
    date=serializers.DateField()
    open_price=serializers.FloatField()
    close_price=serializers.FloatField()
    high_price=serializers.FloatField()
    low_price=serializers.FloatField()
    volume=serializers.IntegerField()

class TechnicalDataSerializer(ModelSerializer):
        stock=StockSerializer(read_only=True)   
        class Meta:
            model=StockTechnicalDetails
            fields='__all__'
    

# Get User Stock Details 
class UserStockSerializer(ModelSerializer):   
    # Get Limited Stock Details 
    class StockNameSerializer(ModelSerializer):
        class Meta:
            model=Stock
            fields=['ticker','name','id']
    stock=StockNameSerializer(read_only=True)
    user=UserSerializer(read_only=True)
    class Meta:
        model=UserStocks
        fields=['id','buy_price', 'purchase_date', 'quantity', 'stock', 'user']
    
    # def update(self,instance,validated_data):
    #     instance.buy_price=validated_data.get('buy_price',instance.buy_price)
    #     instance.purchase_date=validated_data.get('purchase_date',instance.purchase_date)
    #     instance.quantity=validated_data.get('quantity',instance.quantity)
#Update user stocks
class UpdateUserStockSerializer(ModelSerializer):   
    # Get Limited Stock Details
    user=UserSerializer(read_only=True)
    stock=StockSerializer(read_only=True)
    class Meta:
        model=UserStocks
        fields=['buy_price', 'purchase_date', 'quantity', 'stock', 'user']
        # read_only_fields = ['user']
    def update(self,instance,validated_data):
        instance.buy_price=validated_data.get('buy_price',instance.buy_price)
        instance.purchase_date=validated_data.get('purchase_date',instance.purchase_date)
        instance.quantity=validated_data.get('quantity',instance.quantity)
        instance.save()
        return instance   
    

# Add stock on user profile [POST]
class UserstockSerializer(ModelSerializer):
    stock = serializers.PrimaryKeyRelatedField(queryset=Stock.objects.all())
    
    class Meta:
        model=UserStocks
        exclude=['user']
        read_only_fields=['user']

    def create(self, validated_data):
        user = self.request.user  # Getting logged-in user
        return UserStocks.objects.create(user=user, **validated_data)

# Index data details
class IndexdataSerializer(serializers.Serializer):
    index=serializers.CharField()
    date=serializers.DateField()
    close_price=serializers.FloatField()

# Register User
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
   class Meta:
    model=User
    fields=['username','email','password']

   def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already registered.")
        return email
   def validate_password(self, value):
        validate_password(value)  # raises ValidationError if weak
        return value
   
   def create(self,validated_data):
        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']           
        )
        # user.set_password(validated_data['password'])
        # user.save()
        return user

class CustomRegisterSerializer(RegisterSerializer):
    # No phone number field here
    email = serializers.EmailField(required=True)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data['email'] = self.validated_data.get('email', '')
        return data
class StorePortfolioValue(serializers.ModelSerializer):    
    class Meta:
        model=UserPortfolioValue
        exclude=['user']

class UserPortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserPortfolioValue
        fields=['portfolio_value_date','portfolio_value']

class StoreUserWatchList(serializers.ModelSerializer):
    class Meta:
        model=UserWatchList
        exclude=['user']

class UserWatchListSerializer(serializers.ModelSerializer):
    # stock = serializers.PrimaryKeyRelatedField(queryset=Stock.objects.all())
    stock=StockSerializer(read_only=True)
    class Meta:
        model=UserWatchList
        fields='__all__'