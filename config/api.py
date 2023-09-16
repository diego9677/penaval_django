from datetime import datetime
from django.shortcuts import get_object_or_404
from django.db.models import Q, Prefetch
from django.http import HttpRequest
from products.models import Brand, Place, Product
from shopping.models import Provider, Shopping, ShoppingDetail
from ninja import NinjaAPI, ModelSchema, Schema

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
        model_fields = ['id', 'code', 'place', 'brand', 'stock', 'price', 'pucharse_price', 'measures']


class ProviderSchema(ModelSchema):
    class Config:
        model = Provider
        model_fields = ['id', 'name', 'address']


class ProductIn(ModelSchema):
    place_id: int
    brand_id: int

    class Config:
        model = Product
        model_fields = ['code', 'stock', 'price', 'measures']


class PlaceIn(ModelSchema):
    class Config:
        model = Place
        model_fields = ['name', 'description']


class BrandIn(ModelSchema):
    class Config:
        model = Brand
        model_fields = ['name', 'description']


class ProviderIn(ModelSchema):
    class Config:
        model = Provider
        model_fields = ['name', 'address']


class ShoppingCart(Schema):
    product_code: str
    product_id: int
    pucharse_price: float
    sale_price: float
    amount: int


class ShoppingIn(Schema):
    provider_id: int
    products: list[ShoppingCart]


class SaleCart(Schema):
    product_code: str
    product_id: str
    sale_price: float
    quantity: int


class SaleIn(Schema):
    nit: str
    first_name: str
    last_name: str
    phone: str
    products: list[SaleCart]


class ShoppingDetailSchema(ModelSchema):
    product: ProductSchema

    class Config:
        model = ShoppingDetail
        model_fields = ['id', 'amount', 'unit_price_shopping', 'unit_price_sale']


class ShoppingSchema(Schema):
    id: int
    date: str
    provider: ProviderSchema
    shopping_detail: list[ShoppingDetailSchema]



# products section
@api.get('products/', response=list[ProductSchema])
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
    print(qs)
    return qs


@api.post('products/', response=ProductSchema)
def create_product(request: HttpRequest, input: ProductIn):
    qs = Product.objects.create(**input.dict())
    return qs


@api.put('products/{id}/', response=ProductSchema)
def update_product(request: HttpRequest, id: int, input: ProductIn):
    Product.objects.filter(id=id).update(**input.dict())
    qs = Product.objects.select_related('brand', 'place').filter(id=id)[:1].get()
    return qs;


@api.delete('products/{id}/', response=ProductSchema)
def delete_product(request: HttpRequest, id: int):
    qs = get_object_or_404(Product, id=id);
    qs.delete()
    return qs


#places section
@api.get('places/', response=list[PlaceSchema])
def get_places(request: HttpRequest, search: str):
    qs = Place.objects.filter(name__iendswith=search).order_by('id')[:20]
    return qs

@api.get('places/{id}', response=PlaceSchema)
def get_one_place(request: HttpRequest, id: int):
    qs = Place.objects.filter(id=id)[:1].get()
    return qs


@api.post('places/', response=PlaceSchema)
def create_place(request: HttpRequest, input: PlaceIn):
    qs = Place.objects.create(**input.dict())
    return qs


@api.put('places/{id}/', response=PlaceSchema)
def update_place(request: HttpRequest, id: int, input: PlaceIn):
    Place.objects.filter(id=id).update(**input.dict())
    qs = Place.objects.filter(id=id)[:1].get()
    return qs


@api.delete('places/{id}/', response=PlaceSchema)
def delete_place(request: HttpRequest, id: int):
    qs = get_object_or_404(Place, id=id)
    qs.delete()
    return qs


# brands section
@api.get('brands/', response=list[BrandSchema])
def get_brands(request: HttpRequest, search: str):
    qs = Brand.objects.filter(name__icontains=search).order_by('id')[:20]
    return qs

@api.get('brands/{id}/', response=BrandSchema)
def get_one_brand(request: HttpRequest, id: int):
    qs = Brand.objects.filter(id=id)[:1].get()
    return qs


@api.post('brands/', response=BrandSchema)
def create_brand(request: HttpRequest, input: BrandIn):
    qs = Brand.objects.create(**input.dict())
    return qs


@api.put('brands/{id}/', response=BrandSchema)
def update_brand(request: HttpRequest, id: int, input: BrandIn):
    Brand.objects.filter(id=id).update(**input.dict())
    qs = Brand.objects.filter(id=id)[:1].get()
    return qs


@api.delete('brands/{id}/', response=BrandSchema)
def delete_brand(request: HttpRequest, id: int):
    qs = get_object_or_404(Brand, id=id)
    qs.delete()
    return qs


# provider section
@api.get('providers/', response=list[ProviderSchema])
def get_providers(request: HttpRequest, search: str):
    qs = Provider.objects.filter(name__icontains=search).order_by('id')[:20]
    return qs

@api.get('providers/{id}/', response=ProviderSchema)
def get_one_provider(request: HttpRequest, id: int):
    qs = Provider.objects.filter(id=id)[:1].get()
    return qs


@api.post('providers/', response=ProviderSchema)
def create_provider(request: HttpRequest, input: ProviderIn):
    qs = Provider.objects.create(**input.dict())
    return qs


@api.put('providers/{id}/', response=ProviderSchema)
def update_provider(request: HttpRequest, id: int, input: ProviderIn):
    Provider.objects.filter(id=id).update(**input.dict())
    qs = Provider.objects.filter(id=id)[:1].get()
    return qs


@api.delete('providers/{id}/', response=ProviderSchema)
def delete_provider(request: HttpRequest, id: int):
    qs = get_object_or_404(Provider, id=id)
    qs.delete()
    return qs


# shopping section
@api.get('shopping/', response=ShoppingSchema)
def get_shopping(request: HttpRequest, begin: str, end: str):
    date1 = datetime.fromisoformat(begin)
    date2 = datetime.fromisoformat(end)
    qs = Shopping.objects.select_related('provider').prefetch_related(
            Prefetch('shopping_detail', queryset=ShoppingDetail.objects.select_related('product'))
        ).filter(date__range=(date1, date2))
    print(qs.query)
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


# # sales section
# @api.get('sales/')
# def get_sales(request: HttpRequest):
#     pass


# @api.post('sales/')
# def create_sales(reqeust: HttpRequest):
#     pass