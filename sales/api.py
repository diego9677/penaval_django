from datetime import datetime
from typing import List
from django.http import HttpRequest
from django.db.models import Prefetch
from ninja import Router

from products.models import Product

from .schemas import SaleSchema, ClientSchema, SaleIn
from .models import Sale, SaleDetail, Client

router = Router()


@router.get('sales/', response=List[SaleSchema])
def get_sales(request: HttpRequest, begin: str, end: str):
    date1 = datetime.fromisoformat(begin)
    date2 = datetime.fromisoformat(end)
    qs = Sale.objects.select_related('client')\
        .prefetch_related(
            Prefetch('sale_detail', queryset=SaleDetail.objects.select_related('product').all())
    ).filter(date__range=(date1, date2))
    return qs


@router.post('sales/')
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


@router.get('clients/{nit}/', response={200: ClientSchema, 404: dict})
def get_client_by_nit(request: HttpRequest, nit: str):
    try:
        qs = Client.objects.get(nit=nit)
        return qs
    except Client.DoesNotExist:
        return 404, {'error': 'client not found'}
