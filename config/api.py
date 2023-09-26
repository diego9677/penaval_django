from typing import List
from datetime import datetime
from django.shortcuts import get_object_or_404
from django.db.models import Q, Prefetch
from django.http import HttpRequest
from products.models import Brand, Place, Product
from products.schemas import BrandIn, BrandSchema, PlaceIn, PlaceSchema, ProductIn, ProductSchema
from sales.schemas import ClientSchema, SaleIn, SaleSchema
from shopping.models import Provider, Shopping, ShoppingDetail
from sales.models import Client, Sale, SaleDetail
from ninja import NinjaAPI

from shopping.schemas import ProviderIn, ProviderSchema, ShoppingIn, ShoppingSchema

api = NinjaAPI()


# products section
@api.get('products/', response=List[ProductSchema])
def get_products(request: HttpRequest, search: str):
    qs = Product.objects.select_related('brand', 'place').filter(
        Q(code__icontains=search) |
        Q(measures__icontains=search) |
        Q(brand__name__icontains=search)
    ).order_by('id')[:20]
    return qs


@api.get('products/{id}/', response=ProductSchema)
def get_one_product(request: HttpRequest, id: int):
    qs = Product.objects.select_related('brand', 'place').get(pk=id)
    return qs


@api.post('products/', response=ProductSchema)
def create_product(request: HttpRequest, input: ProductIn):
    qs = Product.objects.create(**input.dict())
    return qs


@api.put('products/{id}/', response=ProductSchema)
def update_product(request: HttpRequest, id: int, input: ProductIn):
    Product.objects.filter(id=id).update(**input.dict())
    qs = Product.objects.select_related('brand', 'place').get(id=id)
    return qs


@api.delete('products/{id}/', response=ProductSchema)
def delete_product(request: HttpRequest, id: int):
    qs = get_object_or_404(Product, id=id)
    qs.delete()
    return qs


# places section
@api.get('places/', response=List[PlaceSchema])
def get_places(request: HttpRequest, search: str):
    qs = Place.objects.filter(name__iendswith=search).order_by('id')[:20]
    return qs


@api.get('places/{id}', response=PlaceSchema)
def get_one_place(request: HttpRequest, id: int):
    qs = Place.objects.get(id=id)
    return qs


@api.post('places/', response=PlaceSchema)
def create_place(request: HttpRequest, input: PlaceIn):
    qs = Place.objects.create(**input.dict())
    return qs


@api.put('places/{id}/', response=PlaceSchema)
def update_place(request: HttpRequest, id: int, input: PlaceIn):
    Place.objects.filter(id=id).update(**input.dict())
    qs = Place.objects.get(id=id)
    return 200, qs


@api.delete('places/{id}/', response=PlaceSchema)
def delete_place(request: HttpRequest, id: int):
    qs = get_object_or_404(Place, id=id)
    qs.delete()
    return qs


# brands section
@api.get('brands/', response=List[BrandSchema])
def get_brands(request: HttpRequest, search: str):
    qs = Brand.objects.filter(name__icontains=search).order_by('id')[:20]
    return qs


@api.get('brands/{id}/', response=BrandSchema)
def get_one_brand(request: HttpRequest, id: int):
    qs = Brand.objects.get(id=id)
    return qs


@api.post('brands/', response=BrandSchema)
def create_brand(request: HttpRequest, input: BrandIn):
    qs = Brand.objects.create(**input.dict())
    return qs


@api.put('brands/{id}/', response=BrandSchema)
def update_brand(request: HttpRequest, id: int, input: BrandIn):
    Brand.objects.filter(id=id).update(**input.dict())
    qs = Brand.objects.get(id=id)
    return qs


@api.delete('brands/{id}/', response=BrandSchema)
def delete_brand(request: HttpRequest, id: int):
    qs = get_object_or_404(Brand, id=id)
    qs.delete()
    return qs


# provider section
@api.get('providers/', response=List[ProviderSchema])
def get_providers(request: HttpRequest, search: str):
    qs = Provider.objects.filter(name__icontains=search).order_by('id')[:20]
    return qs


@api.get('providers/{id}/', response=ProviderSchema)
def get_one_provider(request: HttpRequest, id: int):
    qs = Provider.objects.get(id=id)
    return qs


@api.post('providers/', response=ProviderSchema)
def create_provider(request: HttpRequest, input: ProviderIn):
    qs = Provider.objects.create(**input.dict())
    return qs


@api.put('providers/{id}/', response=ProviderSchema)
def update_provider(request: HttpRequest, id: int, input: ProviderIn):
    Provider.objects.filter(id=id).update(**input.dict())
    qs = Provider.objects.get(id=id)
    return qs


@api.delete('providers/{id}/', response=ProviderSchema)
def delete_provider(request: HttpRequest, id: int):
    qs = get_object_or_404(Provider, id=id)
    qs.delete()
    return qs


# shopping section
@api.get('shopping/', response=List[ShoppingSchema])
def get_shopping(request: HttpRequest, begin: str, end: str):
    date1 = datetime.fromisoformat(begin)
    date2 = datetime.fromisoformat(end)
    qs = Shopping.objects.select_related('provider')\
        .prefetch_related(
            Prefetch('shopping_detail', queryset=ShoppingDetail.objects.select_related('product').all())
    ).filter(date__range=(date1, date2))
    return qs


@api.post('shopping/')
def create_shopping(request: HttpRequest, input: ShoppingIn):
    shopping = Shopping.objects.create(provider_id=input.provider_id, user=request.user)
    for product in input.products:
        prod_instance = Product.objects.get(pk=product.product_id)
        ShoppingDetail.objects.create(
            shopping=shopping,
            product=prod_instance,
            amount=product.amount,
            unit_price_shopping=product.pucharse_price,
            unit_price_sale=product.sale_price,
        )
        prod_instance.stock += product.amount
        prod_instance.price = product.sale_price
        prod_instance.pucharse_price = product.pucharse_price
        prod_instance.save()
    return {'msg': 'Shopping created successfully'}


# sales section
@api.get('sales/', response=List[SaleSchema])
def get_sales(request: HttpRequest, begin: str, end: str):
    date1 = datetime.fromisoformat(begin)
    date2 = datetime.fromisoformat(end)
    qs = Sale.objects.select_related('client')\
        .prefetch_related(
            Prefetch('sale_detail', queryset=SaleDetail.objects.select_related('product').all())
    ).filter(date__range=(date1, date2))
    return qs


@api.post('sales/')
def create_sales(request: HttpRequest, input: SaleIn):
    client, created = Client.objects.get_or_create(nit=input.nit, defaults=input.dict(exclude={'products'}))
    print(client, created)
    sale = Sale.objects.create(client=client, user=request.user)
    for product in input.products:
        prod_instance = Product.objects.get(pk=product.product_id)
        SaleDetail.objects.create(
            sale=sale,
            product=prod_instance,
            amount=product.amount,
            unit_price=product.unit_price,
            subtotal=product.amount * product.unit_price
        )
        prod_instance.stock -= product.amount
        prod_instance.save()

    return {'msg': 'Sale created successfully'}


@api.get('clients/{nit}/', response=ClientSchema)
def get_client_by_nit(request: HttpRequest, nit: str):
    qs = get_object_or_404(Client, nit=nit)
    return qs
