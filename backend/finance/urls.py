from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),  
    path('login/', views.login, name='login'),  
    path('logout/', views.logout, name='logout'),  
    path('get_current_user/', views.get_user_info, name='current_user_info'),  
    path('get_suggestions/', views.get_suggestions, name='get_suggestions'),  

    # budget url's
    path('create_budget/', views.create_budget, name='create_budget'),
    path('get_all_budgets/', views.get_all_budgets, name='get_all_budgets'),
    path('update_budget/', views.update_budget_amount, name='get_budget'),
    
    # plaid url's
    path('create_link_token/', views.create_link_token, name='create_link_token'),
    path('exchange_public_token/', views.exchange_public_token, name='exchange_public_token'),
    path('get_account_info/', views.get_account_info, name='get_account_info'),

    # transaction url's
    path('create_transaction/', views.create_transaction, name='create_transaction'),
    path('fetch_transaction_by_category/', views.fetch_transaction_by_category, name='fetch_transaction_by_category'),

    # savings url's
    path('get_savings/', views.get_savings, name='get_savings'),
]
