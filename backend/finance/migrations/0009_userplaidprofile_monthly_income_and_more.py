# Generated by Django 5.1.4 on 2024-12-28 10:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0008_transaction_transaction_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='userplaidprofile',
            name='monthly_income',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AddField(
            model_name='userplaidprofile',
            name='phone_number',
            field=models.CharField(default='', max_length=128, unique=True),
            preserve_default=False,
        ),
    ]
