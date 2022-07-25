from django.contrib import admin
from django.urls import path, include
from home import views

urlpatterns = [
    path('', views.home, name='home'),
    path('home/search', views.search, name='search'),
    path('tutorial', views.tutorial, name='tutorial'),
    path('home/device_list', views.device_list, name='device_list'),
    path('home/create_routine', views.create_routine, name='create_routine'),
    path('home/confirmation', views.confirmation, name='confirmation'),
    path('home/complete', views.complete, name='complete'),
]