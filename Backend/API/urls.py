from django.urls import path
from . import views
from Stocks.views import predict_stock_view
from  .views import RegisterView,StockListView,StockDetailView,StockTechnicalDataDetailView, UserStockUpdateView,UserStockRetrieveDestroyAPIView,UserStockCreateView,UserDetailsUpdateView,UserWatchlistStockRetrieveDestroyAPIView,UserChangePasswordView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',RegisterView.as_view(),name='register-user'),
    path('user/detail/',views.getUser,name='get-user-details'),
    path('user/<int:pk>/detail/update/',UserDetailsUpdateView.as_view(),name='update-user-details'),
    # path('user/stock/add/',views.add_userstock,name='add-user-stocks'),
    # path('user/watchlist/',views.userwatchlistView,name='view-user-stock-watchlist'),
    path('user/watchlist/',views.user_stock_watchlist,name='view-user-stock-watchlist'),
    path('user/watchlist/add/',views.store_user_watchlist,name='add-user-stock-watchlist'),
    path('user/watchlist/stock/<int:pk>/delete/',UserWatchlistStockRetrieveDestroyAPIView.as_view(),name='delete-user-stock-watchlist'),
    path('user/stock/add/',UserStockCreateView.as_view(),name='add-user-stocks'),
    path('user/stock/<int:pk>/update/',UserStockUpdateView.as_view(),name='update-user-stocks'),
    path('user/stock/<int:pk>/delete/',UserStockRetrieveDestroyAPIView.as_view(),name='delete-user-stock'),
    path('user/portfolio/',views.userstockportfolioView,name='add-user-portfolio-value'),
    path('user/portfolio/add/',views.store_portfolio_value,name='add-user-stocks'),
    path('user/stocks/',views.user_stock_list,name='user-stock-view'),
    # path('user/stocks/',views.userstockView,name='user-stock-view'),
    path('stocks/',StockListView.as_view(),name='search-stocks'),
    path('stock/detail/<str:stock>/<str:resolution>/',views.get_stock_detail_with_price,name='detail-stocks'),
    path('stock/<str:ticker>/',views.StockTechnicalDataDetailView,name='stocks'),
    path('stock/<str:ticker>/prediction/',predict_stock_view,name='stock-prediction'),
    path('stock/<str:resolution>/<str:stock>/',views.getStockprice,name='stock-prices'),
    path('stocks/category/<str:stock_sector>/',views.StockCompetitorsView,name='stock-competitors-view'),
    path('index-price/<str:index>/',views.getIndexesprice,name='get-indexes-details'),
    path('user/change-password/', UserChangePasswordView.as_view(), name='change-password'),
]