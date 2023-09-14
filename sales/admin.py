from django.contrib import admin
from .models import Sale, SaleDetail, Proform, ProformDetail


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'client', 'date')


@admin.register(SaleDetail)
class SaleDetailAdmin(admin.ModelAdmin):
    list_display = ('pk', 'product', 'amount', 'unit_price', 'subtotal')


@admin.register(Proform)
class ProformaAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'client', 'date')


@admin.register(ProformDetail)
class ProformDetailAdmin(admin.ModelAdmin):
    list_display = ('pk', 'product', 'amount', 'unit_price', 'subtotal')