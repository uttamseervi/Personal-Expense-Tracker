from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from ..utils.plaid_client import PlaidService
from ..models import UserPlaidProfile
from django.views.decorators.csrf import csrf_exempt
@api_view(['GET'])
def create_link_token(request):
    """Create a Link Token for Plaid integration"""
    plaid_service = PlaidService()
    email = request.COOKIES.get('email')
    print('Email:', email)
    if not email:
        return Response({'error': 'Email not found in cookies'}, status=400)
    user = User.objects.get(email=email)
    if not user:
        return Response({'error': 'User not found'}, status=400)
    print('User:', user.id)
    link_token = plaid_service.create_link_token(userid=str(user.id))
    
    print('Link token:', link_token)
    
    if not link_token:
        return Response({'error': 'Failed to create link token'}, status=500)

    return Response({'link_token': link_token}, status=200)

@csrf_exempt
@api_view(['POST'])
def exchange_public_token(request):
    """Exchange the public token for an access token"""
    public_token = request.data.get('public_token')
    if not public_token:
        return Response({'error': 'Public token not provided'}, status=400)
    
    plaid_service = PlaidService()
    access_token = plaid_service.exchange_public_token(public_token)
    
    if not access_token:
        return Response({'error': 'Failed to exchange public token'}, status=500)

    # Get the current user by email
    email = request.COOKIES.get('email')
    if not email:
        return Response({'error': 'Email not found in cookies'}, status=401)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'error': 'Invalid token. Could not find the user'}, status=401)
    
    # Save the access token in the database
    user_plaid_profile, created = UserPlaidProfile.objects.get_or_create(user=user)
    user_plaid_profile.access_token = access_token
    user_plaid_profile.save()

    return Response({'message': 'Access token saved successfully', 'access_token': access_token}, status=200)

@csrf_exempt
@api_view(['POST'])
def get_account_info(request):
    """Fetch account information using the access token"""
    access_token = request.data.get('access_token')
    
    if not access_token:
        return Response({'error': 'Access token not provided'}, status=400)
    
    plaid_service = PlaidService()
    account_info = plaid_service.get_account_info(access_token)

    if not account_info:
        return Response({'error': 'Failed to fetch account info'}, status=500)

    return Response({
        'message': 'Account information fetched successfully',
        'account_info': account_info
    }, status=200)
