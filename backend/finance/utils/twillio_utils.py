from django.conf import settings
from twilio.rest import Client

def send_sms(to, message):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
    try:
        message = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=to
        )
        return message.sid  # Returns the message SID if successful
    except Exception as e:
        return str(e)  # Return the exception as a string for debugging
