from typing import List
from datetime import datetime
from ninja import ModelSchema, Schema
# from ninja.orm import create_schema

from products.schemas import TypeProductSchema
# from products.models import Product
from .models import Client, SaleDetail


# ProductSchemaShort = create_schema(Product, fields=['id', 'code', 'type_product'])

class ProductSchemaShort(Schema):
    id: int
    code: str
    type_product: TypeProductSchema


class SaleCart(Schema):
    product_code: str
    product_id: str
    unit_price: float
    amount: int


class SaleIn(Schema):
    nit: str
    first_name: str
    last_name: str
    phone: str
    products: List[SaleCart]


class ClientSchema(ModelSchema):
    class Config:
        model = Client
        model_fields = ['id', 'nit', 'first_name', 'last_name', 'phone']


class SaleDetailSchema(ModelSchema):
    product: ProductSchemaShort

    class Config:
        model = SaleDetail
        model_fields = ['id', 'amount',  'unit_price', 'subtotal']


class SaleSchema(Schema):
    id: int
    date: datetime
    client: ClientSchema
    sale_detail: List[SaleDetailSchema]


class ProformIn(Schema):
    nit: str
    first_name: str
    last_name: str
    phone: str
    products: List[SaleCart]


class UpdateURLInSchema(Schema):
    url: str


class ProformSchema(Schema):
    id: int
    date: datetime
    client: ClientSchema
    proform_detail: List[SaleDetailSchema]
