from datetime import datetime
from typing import List
from ninja import ModelSchema, Schema

from sales.schemas import ProductSchemaShort

from .models import Provider, ShoppingDetail


class ProviderSchema(ModelSchema):
    class Config:
        model = Provider
        model_fields = ['id', 'name', 'address']


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
    products: List[ShoppingCart]


class ShoppingDetailSchema(ModelSchema):
    product: ProductSchemaShort

    class Config:
        model = ShoppingDetail
        model_fields = ['id', 'amount', 'unit_price_shopping', 'unit_price_sale']


class ShoppingSchema(Schema):
    id: int
    date: datetime
    provider: ProviderSchema
    shopping_detail: List[ShoppingDetailSchema]
