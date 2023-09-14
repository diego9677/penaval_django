from django.shortcuts import get_object_or_404
from typing import List
from django.db.models import Q
from django.http import HttpRequest
from products.models import Brand, Place, Product
from ninja import NinjaAPI, ModelSchema

api = NinjaAPI()


class BrandSchema(ModelSchema):
    class Config:
        model = Brand
        model_fields = ['id', 'name', 'description']


class PlaceSchema(ModelSchema):
    class Config:
        model = Place
        model_fields = ['id', 'name', 'description']


class ProductSchema(ModelSchema):
    place: PlaceSchema = None
    brand: BrandSchema = None

    class Config:
        model = Product
        model_fields = ['id', 'code', 'place', 'brand', 'stock', 'price', 'measures']


class ProductIn(ModelSchema):
    class Config:
        model = Product
        model_fields = ['code', 'place', 'brand', 'stock', 'price', 'measures']


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
    qs = Product.objects.select_related('brand', 'place').filter(id=id)[:1].get()
    return qs


@api.post('products/', response=ProductSchema)
def create_product(request: HttpRequest, input: ProductIn):
    qs = Product.objects.create(**input.dict())
    return qs


@api.put('products/{id}/')
def update_product(request: HttpRequest, id: int, input: ProductIn):
    count = Product.objects.filter(id=id).update(**input.dict())
    return { 'count': count };


@api.delete('products/{id}/', response=ProductSchema)
def delete_product(request: HttpRequest, id: int):
    qs = get_object_or_404(Product, id=id);
    qs.delete()
    return qs


#places section
@api.get('places/', response=List[PlaceSchema])
def get_places(request: HttpRequest, search: str):
    qs = Place.objects.filter(name__iendswith=search).order_by('id')[:20]
    return qs


# brands section
@api.get('brands/', response=List[BrandSchema])
def get_places(request: HttpRequest, search: str):
    qs = Brand.objects.filter(name__icontains=search).order_by('id')[:20]
    return qs
