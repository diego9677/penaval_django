from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Client(models.Model):
    nit = models.CharField(max_length=20, unique=True, verbose_name='Nit')
    first_name = models.CharField(max_length=255, verbose_name='Nombres')
    last_name = models.CharField(max_length=255, verbose_name='Apellidos')
    phone = models.CharField(max_length=50, verbose_name='Teléfono')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha Creación')

    def __str__(self):
        return self.nit

    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'


class Sale(models.Model):
    user = models.ForeignKey(User, related_name='sales', on_delete=models.CASCADE)
    client = models.ForeignKey(Client, related_name='sales', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, verbose_name='Fecha Emisión')
    products = models.ManyToManyField(Product, related_name='sales', through='SaleDetail')

    def __str__(self):
        return self.date.strftime('%d/%m/%Y %H:%M:%S')

    class Meta:
        verbose_name = 'Venta'
        verbose_name_plural = 'Ventas'


class SaleDetail(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='sale_detail')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(verbose_name='Cantidad')
    unit_price = models.DecimalField(max_digits=9, decimal_places=2, verbose_name='Precio Unitario')
    subtotal = models.DecimalField(max_digits=9, decimal_places=2, verbose_name='Subtotal')

    def __str__(self):
        return str(self.pk)

    class Meta:
        verbose_name = 'Detalle de Venta'
        verbose_name_plural = 'Detalle de Ventas'


class Proform(models.Model):
    user = models.ForeignKey(User, related_name='proforms', on_delete=models.CASCADE)
    client = models.ForeignKey(Client, related_name='proforms', on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True, verbose_name='Fecha Emisión')
    products = models.ManyToManyField(Product, related_name='proforms', through='ProformDetail')

    def __str__(self):
        return str(self.pk)

    class Meta:
        verbose_name = 'Proforma'
        verbose_name_plural = 'Proformas'


class ProformDetail(models.Model):
    proforma = models.ForeignKey(Proform, related_name='proform_detail', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(default=0, verbose_name='Cantidad')
    unit_price = models.DecimalField(max_digits=9, decimal_places=2, verbose_name='Precio Unitario')
    subtotal = models.DecimalField(max_digits=9, decimal_places=2, verbose_name='Subtotal')

    def __str__(self):
        return str(self.pk)

    class Meta:
        verbose_name = 'Detalle de la proforma'
        verbose_name_plural = 'Detalles de las proformas'
