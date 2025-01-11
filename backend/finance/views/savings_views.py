from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from ..models import Transaction
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def get_savings(request):
    
    data = request.data
    email = data.get('email')
    print('email', email)
    user = User.objects.get(email=email)
    transactions = Transaction.objects.filter(user=user.id,transaction_category="savings")
    if not len(transactions)>0:
        return Response({"message": "No savings found"}, status=status.HTTP_404_NOT_FOUND)
    savings = []
    for transaction in transactions:
        savings.append(
            {
                'saving_name': transaction.transaction_name,
                'saving_amount': transaction.transaction_amount,
                'saving_date': transaction.transaction_date.strftime("%Y-%m-%d"),
                'saving_category': transaction.transaction_category
                
            }
        )
    return Response({
            "message":"Savings fetched successfully",
            "savings":savings
        },status=status.HTTP_200_OK)
    