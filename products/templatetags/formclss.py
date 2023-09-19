from django import template

register = template.Library()


@register.filter(name='addclss')
def addclss(field, clss):
    return field.as_widget(attrs={'class': clss})