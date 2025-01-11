import plaid
from django.conf import settings
from plaid.api import plaid_api
from plaid.models import LinkTokenCreateRequest, Products, CountryCode, LinkTokenCreateRequestUser, LinkTokenTransactions,ItemPublicTokenExchangeRequest

class PlaidService:
    def __init__(self):    
        # Set up configuration with Plaid API keys
        configuration = plaid.Configuration(
            host=plaid.Environment.Sandbox,
            api_key={
                'clientId': settings.PLAID_CLIENT_ID,
                'secret': settings.PLAID_SECRET,
            }
        )

        # Initialize the API client and Plaid API interface
        api_client = plaid.ApiClient(configuration)
        self.client = plaid_api.PlaidApi(api_client)

    def create_link_token(self, userid):
        # Set up the request data for creating the link token
        request = LinkTokenCreateRequest(
            user=LinkTokenCreateRequestUser(
                client_user_id=userid,
            ),
            client_name='Personal Finance App',
            products=[Products('transactions')],
            transactions=LinkTokenTransactions(
                days_requested=730
            ),
            country_codes=[CountryCode('US')],
            language='en',
            
        )

        try:
            response = self.client.link_token_create(request)
            link_token = response['link_token']
            return link_token
        except Exception as e:
            print(f"Error creating link token: {e}")
            return None
    
    def exchange_public_token(self, public_token):
        try:
            request = ItemPublicTokenExchangeRequest(
                public_token = public_token
            )
            print('public token:', public_token)
            response = self.client.item_public_token_exchange(request)
            print('the response from exchange_public_token is:', response)
            return response.access_token
        except Exception as e:
            print(f"Error exchanging public token: {e}")
            return None

    def get_account_info(self, access_token):
        try:
            request = {
                "access_token": access_token
            }
            response = self.client.accounts_get(request)
            return response.to_dict()
        except Exception as e:
            print(f"Error getting account info: {e}")
            return None

    def get_transactions(self, access_token, start_date, end_date):
        try:
            request = {
                "access_token": access_token,
                "start_date": start_date,
                "end_date": end_date
            }
            response = self.client.transactions_get(request)
            return response.to_dict()
        except Exception as e:
            print(f"Error getting transactions: {e}")
            return None