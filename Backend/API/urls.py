from django.urls import path
from . import views
from  .views import RegisterView,StockListView,StockDetailView,StockTechnicalDataDetailView, UserStockUpdateView,UserStockRetrieveDestroyAPIView,UserStockCreateView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',RegisterView.as_view(),name='register-user'),
    path('user/detail/',views.getUser,name='get-user-details'),
    # path('user/stock/add/',views.add_userstock,name='add-user-stocks'),
    path('user/stock/add/',UserStockCreateView.as_view(),name='add-user-stocks'),
    path('user/stock/<int:pk>/update/',UserStockUpdateView.as_view(),name='update-user-stocks'),
    path('user/stock/<int:pk>/delete/',UserStockRetrieveDestroyAPIView.as_view(),name='delete-user-stock'),
    path('user/portfolio/',views.userstockportfolioView,name='add-user-portfolio-value'),
    path('user/portfolio/add/',views.store_portfolio_value,name='add-user-stocks'),
    path('user/stock/watchlist/',views.userwatchlistView,name='view-user-watchlist'),
    path('user/stock/watchlist/add/',views.store_user_watchlist,name='add-stock-on-user-watchlist'),
    path('user/stocks/',views.userstockView,name='user-stock-view'),
    path('stocks/',StockListView.as_view(),name='search-stocks'),
    path('stock/<str:ticker>/',views.StockTechnicalDataDetailView,name='stocks'),
    path('stock/<str:resolution>/<str:stock>/',views.getStockprice,name='stock-price'),
    path('stocks/category/<str:stock_sector>/',views.StockCompetitorsView,name='stock-competitors-view'),
    path('index-price/<str:index>/',views.getIndexesprice,name='get-indexes-details'),
]