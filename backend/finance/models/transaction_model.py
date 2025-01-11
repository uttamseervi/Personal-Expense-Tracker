from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Transaction(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User who made the transaction
    transaction_date = models.DateField(null=True, blank=True) 
    transaction_amount = models.DecimalField(max_digits=10, decimal_places=2)  # Amount spent
    transaction_name = models.CharField(max_length=255)  # Name of the merchant/vendor
    transaction_category = models.CharField(max_length=255)  # Category of the transaction (e.g., "Food", "Shopping")
    # payment_channel = models.CharField(max_length=50 )  # Payment method (e.g., "online", "in-store")
    # iso_currency_code = models.CharField(max_length=3)  # Currency code (e.g., USD)

    def __str__(self):
        return f"{self.transaction_name} - {self.transaction_amount} ({self.transaction_date})"
