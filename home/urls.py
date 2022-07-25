from django.contrib import admin
from django.urls import path, include
from home import views

urlpatterns = [
    path('', views.home, name='home'),
    path('search', views.search, name='search'),
    path('tutorial', views.tutorial, name='tutorial'),
    path('device_list', views.device_list, name='device_list'),
    path('create_routine', views.create_routine, name='create_routine'),
    path('confirmation', views.confirmation, name='confirmation'),
    path('complete', views.complete, name='complete'),
]