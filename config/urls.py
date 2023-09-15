"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import RedirectView, TemplateView
from .api import api


class WebAppView(LoginRequiredMixin, TemplateView):
    template_name = 'registration/home.html'

FRONTEND_URLS = [
    'products',
    'products/form',
    'brands',
    'brands/form',
    'providers',
    'providers/form',
    'sales',
    'sales/form',
    'shopping',
    'shopping/form',
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('api/', api.urls),
] + [path(url, WebAppView.as_view()) for url in FRONTEND_URLS] + [path('', WebAppView.as_view(), name='index')]

