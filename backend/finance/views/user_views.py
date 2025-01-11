from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from django.contrib.auth import authenticate, login as django_login,logout
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password,check_password
from ..models.user_plaid_profile import UserPlaidProfile
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json

@csrf_exempt
@api_view(['POST'])
def signup(request):
    """Signup view to create a new user."""
    try:
        data = request.data  # Use DRF's request.data instead of json.loads
        print("Data:", data)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        monthly_income = data.get('monthly_income')
        phone_number = data.get('phone_number')
        print('data:',data)
        # Validate required fields
        if not all([username, email, password]):
            return Response(
                {'error': 'Username, email, and password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create a new user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password  # create_user handles password hashing
        )
        newUser = UserPlaidProfile(user=user,monthly_income=monthly_income,phone_number=phone_number)
        newUser.save()
        return Response({
            'message': 'User created successfully',
            'user': {
                'username': user.username,
                'email': user.email,
                'monthly_income': newUser.monthly_income,
                'phone_number': newUser.phone_number,
            }
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@csrf_exempt
@api_view(['POST'])
def login(request):
    """Login view with token set in cookies."""
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check the password
        if not check_password(password, user.password):
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        '''In the code above, I generated both the refresh token and the access token but used the refresh token generation as the source of truth because RefreshToken is designed by rest_framework_simplejwt to handle both access and refresh token generation. '''
        refresh = RefreshToken.for_user(user)
        print("Refresh token:", refresh)
        access_token = str(refresh.access_token)

        # Create the response object
        response = Response(
            {
                'message': 'Login successful',
                'user': {
                    'username': user.username,
                    'email': user.email,
                },
                'token':{
                    'access_token': access_token,
                    'refresh_token': str(refresh),
                }
            },
            status=status.HTTP_200_OK
        )

        # Set tokens in cookies
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,  
            secure=True,    
            samesite='None', 
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite='None',
        )
        response.set_cookie(
            key='email',
            value=email,
            httponly=True,
            secure=True,
            samesite='None',
        )

        return response

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
@api_view(['POST'])
def logout(request):
    """Logout view to invalidate JWT tokens."""
    try:
        # Create the response object with a success message
        response = Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        
        # Print cookie information before deletion (for debugging)
        # print("Cookies in request:", request.COOKIES)
        
        # Delete cookies
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        response.delete_cookie('email')  
        
        # print("Response cookies after delete:", response.cookies.items())
        return response
        
    except Exception as e:
        # Return a response with an error message in case of an exception
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
@api_view(['POST'])
def get_user_info(request):
    """Fetch user information using JWT token."""
    try:

        token = request.data # Or use request.headers.get('Authorization')
        email = token.get('email')
        if not email:
            return Response({'error': 'No email provided'}, status=401)
        
        # Fetch the user based on the email
        user = User.objects.get(email=email)
        
        return Response({
            'username': user.username,
            'email': user.email,
            
        })

    except Exception as e:
        return Response({'error': str(e)}, status=500)
