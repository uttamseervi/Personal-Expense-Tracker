# Generated by Django 5.1.4 on 2024-12-25 06:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0006_budget_budget_emoji'),
    ]

    operations = [
        migrations.RenameField(
            model_name='transaction',
            old_name='amount',
            new_name='transaction_amount',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='category',
            new_name='transaction_category',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='name',
            new_name='transaction_name',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='date',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='iso_currency_code',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='location',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='payment_channel',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='transaction_id',
        ),
    ]
