from datetime import datetime
from typing import List
from django.core.handlers.asgi import ASGIRequest
from django.db.models import Prefetch
from ninja import Router

from products.models import Product

from .schemas import SaleSchema, ClientSchema, SaleIn, ProformIn, ProformSchema
from .models import Sale, SaleDetail, Client, Proform, ProformDetail

router = Router()


@router.get('sales/', response=List[SaleSchema])
def get_sales(request: ASGIRequest, begin: str, end: str):
    date1 = datetime.fromisoformat(begin)
    date2 = datetime.fromisoformat(end)
    qs = Sale.objects.select_related('client')\
        .prefetch_related(
            Prefetch('sale_detail', queryset=SaleDetail.objects.select_related('product').all())
    ).filter(date__range=(date1, date2))
    return qs


@router.post('sales/')
def create_sales(request: ASGIRequest, input: SaleIn):
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
def get_client_by_nit(request: ASGIRequest, nit: str):
    try:
        qs = Client.objects.get(nit=nit)
        return qs
    except Client.DoesNotExist:
        return 404, {'error': 'client not found'}


@router.get('/proform/{proform_id}/', response=List[ProformSchema])
def get_proform(request: ASGIRequest, proform_id: int):
    proforms = Proform.objects.prefetch_related('products').filter(pk=proform_id)
    return proforms


@router.post('/proform/', response=ProformSchema)
def create_proform(request: ASGIRequest, input: ProformIn):
    proform = Proform.objects.select_related('products').create(user=request.user)
    for product in input.products:
        ProformDetail.objects.create(
            proforma=proform,
            product_id=product.product_id,
            amount=product.amount,
            unit_price=product.unit_price,
            subtotal=product.amount * product.unit_price
        )
    return proform


@router.delete('/proform/{proform_id}/')
def delete_proform(request: ASGIRequest, proform_id: int):
    proform = Proform.objects.delete(pk=proform_id)
    print(proform)
    return {'msg': 'Proform deleted successfully'}
