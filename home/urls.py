from django.contrib import admin
from django.urls import path, include
from home import views

urlpatterns = [
    path('', views.home, name='home'),
    path('search-routine', views.search, name='search'),
    path('tutorial', views.tutorial, name='tutorial'),
    path('device-list', views.device_list, name='device_list'),
    path('create-routine', views.create_routine, name='create_routine'),
    path('confirmation', views.confirmation, name='confirmation'),
    path('complete', views.complete, name='complete'),
]