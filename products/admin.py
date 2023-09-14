from django.contrib import admin
from .models import Place, Brand, Product


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'description')


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'description')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('pk', 'code', 'place', 'brand', 'measures', 'stock', 'price')