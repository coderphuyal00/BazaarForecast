from multiprocessing import context
from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth.forms import UserCreationForm
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from Stocks.models import Stock,UserStocks,StockTechnicalDetails,UserPortfolioValue,UserWatchList,StockPrediction
from Account.models import CustomUserModel
from .serializers import UserSerializer,IndexdataSerializer,UserstockSerializer,UserStockSerializer,StockSerializer,stockpriceSerializer,TechnicalDataSerializer,StorePortfolioValue,UserPortfolioSerializer,StoreUserWatchList,UserWatchListSerializer,UpdateUserStockSerializer,StockDetailSerializer,StockPredictionSerializer,UserChangePasswordSerializer
from rest_framework.permissions import IsAuthenticated
#register users
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,generics,filters,permissions
from allauth.account.models import EmailAddress
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from Data_Handling.index_data import getIndexData
from Data_Handling.stock_price_data import getStockPrice
# from allauth.account.utils import perform_login
# from .models import CustomUserModel 
# from allauth.account import app_settings as allauth_settings
# Create your views here.

@api_view(['GET'])
def getRoutes(request):
    routes=[
        'GET /api',
        'GET /api/user',
        'GET /api/stock/:id',
    ]
    return Response(routes)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def getStock(request):
    stock=Stock.objects.all()
    serializer=StockSerializer(stock,many=True)    
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUser(request):
    current_user_id=request.user.id
    user=CustomUserModel.objects.get(id=current_user_id)
    serializer=UserSerializer(user,many=False)
    return Response(serializer.data)

class UserDetailsUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class=UserSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return CustomUserModel.objects.filter(id=self.request.user.id)
    
@api_view(['GET'])
def getIndexesprice(request,index):
    data = getIndexData(f'{index}')
    serializer = IndexdataSerializer(data=data, many=True)  # data= tells serializer to validate input
    
    if serializer.is_valid():
            # Use serializer.validated_data as clean Python data
        return Response(serializer.validated_data)
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['GET'])
def getStockprice(request,stock,resolution):
    data = getStockPrice(f'{stock}',f'{resolution}')
    serializer = stockpriceSerializer(data=data, many=True)  # data= tells serializer to validate input
    
    if serializer.is_valid():
            # Use serializer.validated_data as clean Python data
        return Response(serializer.validated_data)
    else:
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_stock_detail_with_price(request, stock, resolution):
    # Step 1: Fetch Stock object for 'stock'
    try:
        stock_instance = Stock.objects.get(ticker=stock)
    except Stock.DoesNotExist:
        return Response({'error': 'Stock not found'}, status=404)

    # Step 2: Fetch dynamic price data (simulate your function or call directly)
    price_data = getStockPrice(stock, resolution)  # Should return list of dict

    # Optional: Validate price data with stockpriceSerializer if desired
    price_serializer = stockpriceSerializer(data=price_data, many=True)
    if not price_serializer.is_valid():
        return Response(price_serializer.errors, status=400)

    # Step 3: Serialize stock with price data added to context
    serializer = StockDetailSerializer(stock_instance, context={'price_data': price_serializer.validated_data})

    # Step 4: Return combined data
    return Response(serializer.data)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_userstock(request):
#     if request.method == 'POST':
#         serializer = UserstockSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(user=request.user)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# @api_view(['PUT'])
# # @permission_classes([IsAuthenticated])
# def update_userstock(request):
#     if request.method == 'POST':
#         user=request.user
#         serializer = UpdateUserStockSerializer(user,data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserStockCreateView(generics.ListCreateAPIView):
    serializer_class=UserstockSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return UserStocks.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

#Update user stocks
class UserStockUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class=UpdateUserStockSerializer
    permission_classes=[permissions.IsAuthenticated]

    def get_queryset(self):
        return UserStocks.objects.filter(user=self.request.user)
    
#Delete user stock
class UserStockRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = UserStocks.objects.all()  # Queryset of all user stock records
    serializer_class = UserStockSerializer
    permission_classes=[permissions.IsAuthenticated]
    lookup_field = 'pk'  # default, can be omitted if 'pk' is used

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userstockView(request):
    stock=UserStocks.objects.filter(user_id=request.user.id)
    serializer=UserStockSerializer(stock,many=True)
    
    return Response(serializer.data)
    
@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class RegisterView(APIView):
#     def post(self,request):
#         email=request.data.get('email')
#         password=request.data.get('password')

#         if not email or not password:
#             return Response({'Error':'Email and password are required.'},status=status.HTTP_400_BAD_REQUEST)
        
#         if CustomUserModel.objects.filter(email=email).exists():
#             return Response({'Error':'Email Address already exists.'},status=status.HTTP_400_BAD_REQUEST)
        
#         user=CustomUserModel.objects.create_user(
#             username=email,
#             email=email,
#             password=password
#         )
#         EmailAddress.objects.create(
#             user=user,
#             email=email,
#             verified=False,
#             primary=True
#         )

#         return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)


class RegisterView(generics.CreateAPIView):
    queryset=CustomUserModel.objects.all()
    permission_classes=[AllowAny]
    serializer_class=RegisterSerializer

class StockListView(generics.ListAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['ticker', 'name']

# @api_view(['GET'])
class StockDetailView(APIView):
    def get(self, request, ticker=None):
        try:
            stock_obj = Stock.objects.get(ticker=ticker)
        except Stock.DoesNotExist:
            return Response({"error": "Stock not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StockSerializer(stock_obj)  # pass single object here
        return Response(serializer.data)
    
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def StockTechnicalDataDetailView(request,ticker):
    stock=Stock.objects.get(ticker=ticker)
    # stock_id=stock.id
    stock_technical_data=StockTechnicalDetails.objects.filter(stock_id=stock.id)
    serializer=TechnicalDataSerializer(stock_technical_data,many=True)
    return Response(serializer.data)

# @api_view(['GET'])
# def StockCompetitorsView(request,stock_sector):
#     stock_ids = list(Stock.objects.filter(sector=stock_sector).values_list('id', flat=True)[:5])
#     stock_technical_data=StockTechnicalDetails.objects.filter(stock_id__in=stock_ids)
#     serializer=TechnicalDataSerializer(stock_technical_data,many=True)
#     # serializer=StockSerializer(stock,many=True)    
#     return Response(serializer.data)

@api_view(['GET'])
def StockCompetitorsView(request, stock_sector):
    # Get stock objects in requested sector (limit as needed)
    stocks = Stock.objects.filter(sector=stock_sector)[:5]
    response_data = []

    for stock in stocks:
        # Fetch dynamic price data
        price_data = getStockPrice(stock.ticker, resolution='1D')
        price_serializer = stockpriceSerializer(data=price_data, many=True)
        if not price_serializer.is_valid():
            return Response(price_serializer.errors, status=400)

        # Serialize stock with price data in context
        stock_serializer = StockDetailSerializer(stock, context={'price_data': price_serializer.validated_data})

        # Append serialized stock details (with price) to response list
        response_data.append(stock_serializer.data)

    return Response(response_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def store_portfolio_value(request):
    if request.method == 'POST':
        serializer = StorePortfolioValue(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            # serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userstockportfolioView(request):
    portfolio=UserPortfolioValue.objects.filter(user_id=request.user.id)
    serializer=UserPortfolioSerializer(portfolio,many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def store_user_watchlist(request):
    if request.method=='POST':
        serializer=StoreUserWatchList(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userwatchlistView(request):
    watchlist=UserWatchList.objects.select_related('stock').filter(user_id=request.user.id)
    serializer=UserWatchListSerializer(watchlist,many=True)
    return Response(serializer.data)

class UserWatchlistStockRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = UserWatchList.objects.all()  # Queryset of all user stock records
    serializer_class = UserWatchListSerializer
    permission_classes=[permissions.IsAuthenticated]
    lookup_field = 'pk'  # default, can be omitted if 'pk' is used

@api_view(['GET'])
def user_stock_list(request):
    user_stocks = UserStocks.objects.select_related('stock', 'user').filter(user=request.user)

    # Example dynamic price data dictionary keyed by stock id
    price_data = {}
    for us in user_stocks:
        price_data[us.stock.id] = getStockPrice(us.stock.ticker, '1D')  # your price fetch logic

    serializer = UserStockSerializer(user_stocks, many=True, context={'price_data': price_data})

    return Response(serializer.data)

@api_view(['GET'])
def user_stock_watchlist(request):
    user_stocks = UserWatchList.objects.select_related('stock', 'user').all()

    # Example dynamic price data dictionary keyed by stock id
    price_data = {}
    for us in user_stocks:
        price_data[us.stock.id] = getStockPrice(us.stock.ticker, '1D')  # your price fetch logic

    serializer = UserWatchListSerializer(user_stocks, many=True, context={'price_data': price_data})

    return Response(serializer.data)

class StockPredictedPriceView(generics.CreateAPIView):
    queryset=StockPrediction.objects.all()
    permission_classes=[AllowAny]
    serializer_class=StockPredictionSerializer

class UserChangePasswordView(APIView):
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)