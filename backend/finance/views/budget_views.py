from decimal import Decimal
from collections import defaultdict
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from finance.models import Budget,UserPlaidProfile
from django.contrib.auth.models import User
from ..utils.twillio_utils import send_sms
from ..models import Transaction
@csrf_exempt
@api_view(['POST'])
def create_budget(request):
    try:
        # Get data from the request body
        data = request.data
        budget_name = data.get('budget_name')
        category = data.get('category')
        budget_amount = data.get('budget_amount')
        budget_emoji = data.get('budget_emoji')
        email = data.get('email')
        print(data)
        print(email)
        print(category)
        user = User.objects.get(email=email)
        if not user:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        # Validate category (must be from the CATEGORY_CHOICES)
        valid_categories = [choice[0] for choice in Budget.CATEGORY_CHOICES]
        if category not in valid_categories:
            print('Invalid category')
            return Response({'error': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)


        
        # Check if all required fields are provided
        if not all([budget_name, category, budget_amount]):
            print("wtf is happening")
            return Response(
                {'error': 'All fields are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create the budget
        budget = Budget.objects.create(
            budget_name=budget_name,
            category=category,
            budget_amount=budget_amount,
            budget_emoji=budget_emoji,
            user=user
        )
        
        # Respond with success message
        return Response(
            {'message': 'Budget created successfully',
            'budget': {
                "budget_name": budget.budget_name,
                "category": budget.category,
                "budget_amount": budget.budget_amount,
                "start_date": str(budget.start_date),
                "amount_spent": budget.amount_spent,
                "budget_emoji": budget.budget_emoji
            }
            }, 
            status=status.HTTP_201_CREATED
        )
        
    except Exception as e:
        print(e)
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Get All Budgets View (GET)
@csrf_exempt
@api_view(['GET'])
def get_all_budgets(request):
    try:
        # Get all budgets
        budgets = Budget.objects.all()
        if not budgets:
            return Response({'message': 'No budgets found'}, status=404)
        total_budget_amount = 0
        for budget in budgets:
            total_budget_amount += budget.budget_amount
        # Return success response with the created budget details
        return Response({
            'budgets': [{
                'budget_name': budget.budget_name,
                'category': budget.category,
                'budget_amount': budget.budget_amount,
                'start_date': str(budget.start_date),
                'amount_spent': budget.amount_spent,
                'budget_emoji': budget.budget_emoji
            } for budget in budgets],
            'total_budget_amount': total_budget_amount
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        print(e)
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
def update_budget_amount(request):
    
    CATEGORY_CHOICES = [
        ('housing', 'Housing'),
        ('transportation', 'Transportation'),
        ('food', 'Food'),
        ('healthcare', 'Healthcare'),
        ('utilities', 'Utilities'),
        ('insurance', 'Insurance'),
        ('debt', 'Debt Payments'),
        ('savings', 'Savings & Investments'),
        ('entertainment', 'Entertainment'),
        ('personal_care', 'Personal Care'),
        ('clothing', 'Clothing'),
        ('education', 'Education'),
        ('gifts_donations', 'Gifts & Donations'),
        ('children', 'Children'),
        ('pets', 'Pets'),
        ('travel', 'Travel'),
        ('miscellaneous', 'Miscellaneous'),
        ('business_operations', 'Business Operations'),
        ('professional_development', 'Professional Development'),
        ('freelance', 'Freelance Work'),
        ('taxes', 'Taxes'),
        ('legal_accounting', 'Legal & Accounting'),
    ]

    try:
        data = request.data
        email = data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the user
        user = User.objects.get(email=email)

        # Get all transactions for the user
        transactions = Transaction.objects.filter(user=user)

        # Get all budgets for the user
        budgets = Budget.objects.filter(user=user)

        # Dictionary to accumulate total spent for each category
        category_totals = defaultdict(Decimal)
        valid_categories = [choice[0] for choice in CATEGORY_CHOICES]

        # Accumulate the total spent amount for each category
        for transaction in transactions:
            category = transaction.transaction_category or 'unknown'
            if category not in valid_categories:
                continue  # Skip invalid categories
            
            try:
                # Ensure the transaction amount is treated as Decimal
                amount = Decimal(transaction.transaction_amount or 0)
                category_totals[category] += amount
            except Exception as e:
                continue  # Skip transactions with invalid amounts

        total_budget_amount = 0
        user_plaid = UserPlaidProfile.objects.filter(user=user).first() 

        if user_plaid:
            user_number = user_plaid.phone_number
        else:
            return Response({'error': 'User Plaid profile not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Update the amount_spent for each budget
        for budget in budgets:
            category = budget.category
            total_budget_amount += budget.budget_amount
            amount_spent = category_totals.get(category, Decimal(0))
            budget.amount_spent = amount_spent
            budget.save()  # Save the updated budget

            # Send SMS if the budget is exceeded
            if amount_spent > budget.budget_amount:
                send_sms(user_number, f'You have exceeded your budget for {category}. Your budget amount is {budget.budget_amount} and you have spent {amount_spent}.')
                
        # Prepare the response with updated budget information
        updated_budgets = [
            {
                'start_date': str(budget.start_date),
                'budget_emoji': budget.budget_emoji,
                'budget_name': budget.budget_name,
                'category': budget.category,
                'budget_amount': float(budget.budget_amount),
                'amount_spent': float(budget.amount_spent),
                'remaining_amount': float(budget.budget_amount - budget.amount_spent),
            }
            for budget in budgets
        ]

        return Response({
            'message': 'Budgets updated successfully',
            'updated_budgets': updated_budgets,
            'total_budget_amount': total_budget_amount
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # It's a good practice to log the error for debugging purposes
        print(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
@csrf_exempt
def newRoute(request):
    CATEGORY_CHOICES = [
        ('housing', 'Housing'),
        ('transportation', 'Transportation'),
        ('food', 'Food'),
        ('healthcare', 'Healthcare'),
        ('utilities', 'Utilities'),
        ('insurance', 'Insurance'),
        ('debt', 'Debt Payments'),
        ('savings', 'Savings & Investments'),
        ('entertainment', 'Entertainment'),
        ('personal_care', 'Personal Care'),
        ('clothing', 'Clothing'),
        ('education', 'Education'),
        ('gifts_donations', 'Gifts & Donations'),
        ('children', 'Children'),
        ('pets', 'Pets'),
        ('travel', 'Travel'),
        ('miscellaneous', 'Miscellaneous'),
        ('business_operations', 'Business Operations'),
        ('professional_development', 'Professional Development'),
        ('freelance', 'Freelance Work'),
        ('taxes', 'Taxes'),
        ('legal_accounting', 'Legal & Accounting'),
    ]

    try:
        data = request.data
        email = data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(email=email)
        transactions = Transaction.objects.filter(user=user)
        budgets = Budget.objects.get(user=user)
        category_totals = defaultdict(Decimal)
        valid_categories = [choice[0] for choice in CATEGORY_CHOICES]

        for transaction in transactions:
            category = transaction.transaction_category or 'unknown'
            if category not in valid_categories:
                print(f"Invalid category: {category}")
                continue  
            
            try:
                # Ensure the amount is treated as Decimal
                amount = Decimal(transaction.transaction_amount or 0)
                category_totals[category] += amount
                
            except Exception as e:
                print(f"Error processing transaction amount: {transaction.transaction_amount}, Error: {str(e)}")
                continue

        # Prepare the response
        updated_categories = [
            {'category': category, 'total_amount': float(total)}  # Convert to float for JSON serialization
            for category, total in category_totals.items()
        ]

        return Response({
            'message': 'Budget updated successfully',
            'updated_categories': updated_categories,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)