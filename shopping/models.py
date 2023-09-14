from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Provider(models.Model):
    name = models.CharField(max_length=255, verbose_name='Nombre')
    address = models.TextField(verbose_name='Dirección')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Proveedor'
        verbose_name_plural = 'Proveedores'


class Shopping(models.Model):
    user = models.ForeignKey(User, related_name='shopping', on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, related_name='shopping', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, verbose_name='Fecha Emisión')
    products = models.ManyToManyField(Product, related_name='shopping', through='ShoppingDetail')

    def __str__(self):
        return str(self.pk)

    class Meta:
        verbose_name = 'Compra'
        verbose_name_plural = 'Compras'


class ShoppingDetail(models.Model):
    shopping = models.ForeignKey(Shopping, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(verbose_name='Cantidad')
    unit_price_shopping = models.DecimalField(max_digits=9, decimal_places=2, verbose_name='Precio Unitario Compra')
    unit_price_sale = models.DecimalField(max_digits=9, decimal_places=2, verbose_name='Precio Unitario Venta')

    def __str__(self):
        return str(self.pk)

    class Meta:
        verbose_name = 'Detalle de Compra'
        verbose_name_plural = 'Detalle de Compras'