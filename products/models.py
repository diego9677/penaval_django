from django.db import models


class Brand(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nombre')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Marca'
        verbose_name_plural = 'Marcas'


class Place(models.Model):
    name = models.CharField(max_length=200, verbose_name='Nombre')
    description = models.TextField(blank=True, null=True, verbose_name='Descripción')

    @property
    def products_count(self):
        return self.products.count()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Lugar'
        verbose_name_plural = 'Lugares'


class TypeProduct(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = 'Tipo de Producto'
        verbose_name_plural = 'Tipos de Productos'


class Product(models.Model):
    code = models.CharField(max_length=100, unique=True, verbose_name='Código')
    place = models.ForeignKey(Place, related_name='products', on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, related_name='products', on_delete=models.CASCADE)
    stock = models.PositiveIntegerField(default=0, verbose_name='Cantidad Disponible')
    pucharse_price = models.DecimalField(default=0, max_digits=9, decimal_places=2, verbose_name='Precio Compra')
    price = models.DecimalField(default=0, max_digits=9, decimal_places=2, verbose_name='Precio Unitario')
    measures = models.CharField(max_length=255, verbose_name='Medidas')
    type_product = models.ForeignKey(TypeProduct, null=True, related_name='products', on_delete=models.SET_NULL)

    def __str__(self):
        return self.code

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
