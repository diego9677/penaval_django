# Generated by Django 4.2.5 on 2023-09-14 05:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='stok',
            new_name='stock',
        ),
    ]
