from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from django.contrib.auth.models import User
from ..models import Transaction,UserPlaidProfile
from datetime import datetime  # Correct import for datetime
from ..utils.twillio_utils import send_sms
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils.timezone import make_aware

@csrf_exempt
@api_view(['POST'])
def create_transaction(request):
    data = request.data

    # Extract fields
    transaction_name = data.get('transaction_name')
    transaction_amount = data.get('transaction_amount')
    transaction_category = data.get('transaction_category')
    transaction_date = data.get('transaction_date')
    email = data.get('email')
    # Validation
    print("data for creation of transaction is ",data)
    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not transaction_name or not transaction_amount or not transaction_category or not transaction_date:
        return Response({'error': 'All fields are required (transaction_name, transaction_amount, transaction_category, transaction_date).'}, status=status.HTTP_400_BAD_REQUEST)

    # Check date format and strip time
    try:
        transaction_date = datetime.strptime(transaction_date, "%Y-%m-%d").date()
    except ValueError:
        return Response({'error': 'transaction_date must be in the format YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

    # Check if user exists
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Create transaction
    transaction = Transaction.objects.create(
        transaction_name=transaction_name,
        transaction_amount=transaction_amount,
        transaction_category=transaction_category,
        transaction_date=transaction_date,
        user=user
    )

    return Response({
        'message': 'Transaction created successfully',
        'transaction': {
            'transaction_name': transaction_name,
            'transaction_amount': transaction_amount,
            'transaction_category': transaction_category,
            'transaction_date': transaction_date.strftime("%Y-%m-%d"),
        }
    }, status=status.HTTP_201_CREATED)


from datetime import datetime, timedelta
from django.utils.timezone import make_aware

@csrf_exempt
@api_view(['POST'])
def fetch_transaction_by_category(request):
    data = request.data
    transaction_category = data.get('transaction_category')
    email = data.get('email')
    transaction_date = data.get('transaction_date', 'all')  # Added date filter option

    if not email:
        return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

    if not transaction_category:
        return Response({'error': 'transaction_category is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Fetch user based on email
    user = User.objects.filter(email=email).first()

    if not user:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Fetch user's Plaid profile
    user_plaid = UserPlaidProfile.objects.filter(user=user).first() 
    if not user_plaid:
        return Response({'error': 'User Plaid profile not found'}, status=status.HTTP_404_NOT_FOUND)

    # Get the user's monthly income and validate it
    user_monthly_income = user_plaid.monthly_income
    if user_monthly_income is None:
        return Response({'error': 'User monthly income is not set'}, status=status.HTTP_400_BAD_REQUEST)

    print("user_monthly_income is ", user_monthly_income)

    # Get user's phone number (for SMS alert purposes)
    user_number = user_plaid.phone_number
    # id = send_sms(user_number, f'Your {transaction_category} transactions are being fetched. Please wait a moment.')
    print("id is ", id)

    # Filter transactions based on category
    if transaction_category.lower() == 'all':
        transactions = Transaction.objects.filter(user=user)
    else:
        transactions = Transaction.objects.filter(user=user, transaction_category=transaction_category)

    # Filter transactions based on date range
    if transaction_date == 'today':
        today = make_aware(datetime.today())
        transactions = transactions.filter(transaction_date__year=today.year,transaction_date__month=today.month, transaction_date__day=today.day)

    elif transaction_date == 'this_week':
        today = make_aware(datetime.today())
        start_of_week = today - timedelta(days=today.weekday())  # Start of the week (Monday)
        transactions = transactions.filter(transaction_date__gte=start_of_week)

    elif transaction_date == 'this_month':
        today = make_aware(datetime.today())
        start_of_month = today.replace(day=1)
        transactions = transactions.filter(transaction_date__gte=start_of_month)

    elif transaction_date == 'last_month':
        today = make_aware(datetime.today())
        first_day_last_month = (today.replace(day=1) - timedelta(days=1)).replace(day=1)
        last_day_last_month = today.replace(day=1) - timedelta(days=1)
        transactions = transactions.filter(transaction_date__gte=first_day_last_month, transaction_date__lte=last_day_last_month)

    # Prepare the list of transactions and calculate total spent amount
    transaction_list = []
    total_spent_amount = Decimal(0)  # Use Decimal for accurate calculations
    total_savings_amount = Decimal(0)
    
    for transaction in transactions:
        transaction_list.append({
            'transaction_name': transaction.transaction_name,
            'transaction_amount': float(transaction.transaction_amount),  # Ensure it's a float for the response
            'transaction_category': transaction.transaction_category,
            'transaction_date': transaction.transaction_date.strftime("%Y-%m-%d"),
        })

        total_spent_amount += Decimal(transaction.transaction_amount)  # Add to the total spent amount

    remaining_amount = user_monthly_income - total_spent_amount  # Calculate remaining amount (savings)

    # If total spent amount exceeds monthly income, send an SMS alert
    if total_spent_amount > user_monthly_income:
        send_sms(user_number, f'You have exceeded your monthly income by {total_spent_amount - user_monthly_income}. Please review your transactions.')

    return Response({
        'message': f'{transaction_category} transactions fetched successfully' if transaction_category != 'all' else 'All transactions fetched successfully',
        'transactions': transaction_list,
        'total_spent_amount': float(total_spent_amount),
        'total_savings_amount': float(remaining_amount),
    }, status=status.HTTP_200_OK)
