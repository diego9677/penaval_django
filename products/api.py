from typing import List
from django.http import HttpRequest
from django.db.models import Q
from ninja import Router

from .schemas import ProductSchema, ProductIn, PlaceSchema, BrandSchema, TypeProductSchema, PlaceIn, BrandIn, TypeProductIn
from .models import Product, Place, Brand, TypeProduct

router = Router()


@router.get('products/', response=List[ProductSchema])
def get_products(request: HttpRequest, search: str):
    qs = Product.objects.select_related('brand', 'place', 'type_product').filter(
        Q(code__icontains=search) |
        Q(measures__startswith=search) |
        Q(brand__name__icontains=search)
    ).order_by('id')
    return qs


@router.get('products/{id}/', response=ProductSchema)
def get_one_product(request: HttpRequest, id: int):
    qs = Product.objects.select_related('brand', 'place', 'type_product').get(pk=id)
    return qs


@router.post('products/', response=ProductSchema)
def create_product(request: HttpRequest, input: ProductIn):
    qs = Product.objects.create(**input.dict())
    return qs


@router.put('products/{id}/', response=ProductSchema)
def update_product(request: HttpRequest, id: int, input: ProductIn):
    Product.objects.filter(id=id).update(**input.dict())
    qs = Product.objects.select_related('brand', 'place', 'type_product').get(id=id)
    return qs


@router.delete('products/{id}/', response=ProductSchema)
def delete_product(request: HttpRequest, id: int):
    qs = Product.objects.get(pk=id)
    qs.delete()
    return qs


# places section
@router.get('places/', response=List[PlaceSchema])
def get_places(request: HttpRequest, search: str):
    qs = Place.objects.prefetch_related('products').filter(name__iendswith=search).order_by('id')
    return qs


@router.get('places/{id}', response=PlaceSchema)
def get_one_place(request: HttpRequest, id: int):
    qs = Place.objects.get(id=id)
    return qs


@router.post('places/', response=PlaceSchema)
def create_place(request: HttpRequest, input: PlaceIn):
    qs = Place.objects.create(**input.dict())
    return qs


@router.put('places/{id}/', response=PlaceSchema)
def update_place(request: HttpRequest, id: int, input: PlaceIn):
    Place.objects.filter(id=id).update(**input.dict())
    qs = Place.objects.get(id=id)
    return 200, qs


@router.delete('places/{id}/', response=PlaceSchema)
def delete_place(request: HttpRequest, id: int):
    qs = Place.objects.get(pk=id)
    qs.delete()
    return qs


# brands section
@router.get('brands/', response=List[BrandSchema])
def get_brands(request: HttpRequest, search: str, limit: int):
    qs = Brand.objects.filter(name__icontains=search).order_by('id')[:limit]
    return qs


@router.get('brands/{id}/', response=BrandSchema)
def get_one_brand(request: HttpRequest, id: int):
    qs = Brand.objects.get(id=id)
    return qs


@router.post('brands/', response=BrandSchema)
def create_brand(request: HttpRequest, input: BrandIn):
    qs = Brand.objects.create(**input.dict())
    return qs


@router.put('brands/{id}/', response=BrandSchema)
def update_brand(request: HttpRequest, id: int, input: BrandIn):
    Brand.objects.filter(id=id).update(**input.dict())
    qs = Brand.objects.get(id=id)
    return qs


@router.delete('brands/{id}/', response=BrandSchema)
def delete_brand(request: HttpRequest, id: int):
    qs = Brand.objects.get(pk=id)
    qs.delete()
    return qs


# type product section
@router.get('type-products/', response=List[TypeProductSchema])
def get_type_products(request: HttpRequest, search: str):
    qs = TypeProduct.objects.filter(name__icontains=search).order_by('id')
    return qs


@router.get('type-products/{id}/', response=TypeProductSchema)
def get_one_type_product(request: HttpRequest, id: int):
    qs = TypeProduct.objects.get(id=id)
    return qs


@router.post('type-products/', response=TypeProductSchema)
def create_type_product(request: HttpRequest, input: TypeProductIn):
    qs = TypeProduct.objects.create(**input.dict())
    return qs


@router.put('type-products/{id}/', response=TypeProductSchema)
def update_type_product(request: HttpRequest, id: int, input: TypeProductIn):
    TypeProduct.objects.filter(id=id).update(**input.dict())
    qs = TypeProduct.objects.get(id=id)
    return qs


@router.delete('type-products/{id}/', response=TypeProductSchema)
def delete_type_product(request: HttpRequest, id: int):
    qs = TypeProduct.objects.get(pk=id)
    qs.delete()
    return qs
