from ninja import ModelSchema
from products.models import Brand, Place, Product, TypeProduct


class BrandSchema(ModelSchema):
    class Config:
        model = Brand
        model_fields = ['id', 'name', 'description']


class TypeProductSchema(ModelSchema):
    class Config:
        model = TypeProduct
        model_fields = ['id', 'name', 'description']


class PlaceSchema(ModelSchema):
    products_count: int = 0

    class Config:
        model = Place
        model_fields = ['id', 'name', 'description']


class ProductSchema(ModelSchema):
    place: PlaceSchema = None
    brand: BrandSchema = None
    type_product: TypeProductSchema = None

    class Config:
        model = Product
        model_fields = ['id', 'code', 'place', 'brand', 'stock', 'price', 'pucharse_price', 'measures']


class ProductIn(ModelSchema):
    place_id: int
    brand_id: int
    type_product_id: int

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


class TypeProductIn(ModelSchema):
    class Config:
        model = TypeProduct
        model_fields = ['name', 'description']
