from ninja import NinjaAPI

from products.api import router as product_router
from shopping.api import router as shopping_router
from sales.api import router as sale_router

api = NinjaAPI()


api.add_router('', product_router)
api.add_router('', shopping_router)
api.add_router('', sale_router)
