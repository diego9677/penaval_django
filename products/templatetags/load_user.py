import json
from django import template

register = template.Library()

@register.filter(name='userdumps')
def userdumps(object):
    return json.dumps({ 'id': object.id, 'username': object.username, 'email': object.email })