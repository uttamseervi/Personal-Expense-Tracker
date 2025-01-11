import google.generativeai as genai
import os
from dotenv import load_dotenv
from urllib.parse import urlparse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import logging

# Load environment variables
load_dotenv()

# Configure generative AI with API key from environment
genai.configure(api_key=os.getenv("GENAI_API_KEY"))

# Create a logger
logger = logging.getLogger(__name__)

@api_view(['POST'])
def get_suggestions(request):
    try:
        # Ensure the API key is loaded correctly
        data = request.data
        print("Data: ", data)
        prompt = data.get("prompt", "What are some ways to save money?")
        print("Prompt: ", prompt)
        api_key = os.getenv("GENAI_API_KEY")
        if not api_key:
            raise ValueError("GENAI_API_KEY is not set in environment variables")

        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate content based on the prompt
        response = model.generate_content(prompt)
        
        # Log the response text (instead of using print)
        logger.info("Received response: %s", response.text)
        
        # Extract the content to return as a response
        return Response({"response": response.text}, status=status.HTTP_200_OK)
    
    except Exception as e:
        # Log the error and handle exceptions
        logger.error("Error occurred: %s", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
