import json
import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJBZG1pbiIsImlhdCI6MTY5NTA3NjIyMCwiZXhwIjoxNjk1NTA4MjIwfQ.lpDNvhNEaxRqRzGoyOkhjj8GrIIN7Vg26G1pCmi_0bU'

brands_response = requests.get("https://penaval.com/api/brands?limit=1000", headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
places_response = requests.get("https://penaval.com/api/places?limit=1000", headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
products_response = requests.get("https://penaval.com/api/products?limit=1000", headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
providers_response = requests.get("https://penaval.com/api/providers?limit=1000", headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})

brands_json: list[dict] = brands_response.json()
places_json: list[dict] = places_response.json()
products_json: list[dict] = products_response.json()
providers_json: list[dict] = providers_response.json()

result = []

for data in brands_json:
    new_dict = {
        'model': 'products.brand',
        'pk': data.get('id'),
        'fields': {
            'name': data.get('name'),
            'description': data.get('description')
        }
    }

    result.append(new_dict)

for data in places_json:
    new_dict = {
        'model': 'products.place',
        'pk': data.get('id'),
        'fields': {
            'name': data.get('name'),
            'description': data.get('description')
        }
    }

    result.append(new_dict)



for data in products_json:
    new_dict = {
        'model': 'products.product',
        'pk': data.get('id'),
        'fields': {
            'code': data.get('code'),
            'brand_id': data.get('brand').get('id'),
            'place_id': data.get('place').get('id'),
            'stock': data.get('stock') if data.get('stock') > 0 else 0,
            'pucharse_price': data.get('pucharsePrice'),
            'price': data.get('price'),
            'measures': data.get('measures')
        }
    }

    result.append(new_dict)


for data in providers_json:
    new_dict = {
        'model': 'shopping.provider',
        'pk': data.get('id'),
        'fields': {
            'name': data.get('name'),
            'address': data.get('address'),
        }
    }

    result.append(new_dict)


json_writer = json.dumps(result, indent=2)

with open("seed.json", "w") as file:
    file.write(json_writer)