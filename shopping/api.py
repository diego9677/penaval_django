from datetime import datetime
from typing import List
from django.http import HttpRequest
from django.db.models import Prefetch
from ninja import Router

from products.models import Product

from .schemas import ProviderSchema, ProviderIn, ShoppingSchema, ShoppingIn
from .models import Provider, Shopping, ShoppingDetail

router = Router()


@router.get('providers/', response=List[ProviderSchema])
def get_providers(request: HttpRequest, search: str):
    qs = Provider.objects.filter(name__icontains=search).order_by('id')[:20]
    return qs


@router.get('providers/{id}/', response=ProviderSchema)
def get_one_provider(request: HttpRequest, id: int):
    qs = Provider.objects.get(id=id)
    return qs


@router.post('providers/', response=ProviderSchema)
def create_provider(request: HttpRequest, input: ProviderIn):
    qs = Provider.objects.create(**input.dict())
    return qs


@router.put('providers/{id}/', response=ProviderSchema)
def update_provider(request: HttpRequest, id: int, input: ProviderIn):
    Provider.objects.filter(id=id).update(**input.dict())
    qs = Provider.objects.get(id=id)
    return qs


@router.delete('providers/{id}/', response=ProviderSchema)
def delete_provider(request: HttpRequest, id: int):
    qs = Provider.objects.get(pk=id)
    qs.delete()
    return qs


@router.get('shopping/', response=List[ShoppingSchema])
def get_shopping(request: HttpRequest, begin: str, end: str):
    date1 = datetime.fromisoformat(begin)
    date2 = datetime.fromisoformat(end)
    qs = Shopping.objects.select_related('provider')\
        .prefetch_related(
            Prefetch('shopping_detail', queryset=ShoppingDetail.objects.select_related('product').all())
    ).filter(date__range=(date1, date2))
    return qs


@router.post('shopping/')
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
