from django.db import models
from django.contrib.auth.models import User
class Budget(models.Model):
    # Define the possible categories using choices
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
    
    # Model fields
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    budget_emoji = models.CharField(max_length=2, default='💰')
    budget_name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)  # Use choices for category
    budget_amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(auto_now_add=True)
    amount_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def __str__(self):
        return f"{self.budget_name} ({self.category})"
