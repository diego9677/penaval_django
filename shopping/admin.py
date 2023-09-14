from django.contrib import admin
from .models import Provider, Shopping, ShoppingDetail


@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'address')


@admin.register(Shopping)
class ShoppingAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'provider', 'date')


@admin.register(ShoppingDetail)
class ShoppingDetailAdmin(admin.ModelAdmin):
    list_display = ('pk', 'product', 'amount', 'unit_price_shopping', 'unit_price_sale')