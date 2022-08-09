from django.contrib import admin
from django.urls import path, include
from home import views

urlpatterns = [
    path('', views.home, name='home'),
    path('search/search-routine', views.search, name='search'),
    path('tutorial', views.tutorial, name='tutorial'),
    path('create/select-device', views.select_device, name='select_device'),
    path('create/execution-indication', views.create_execution_indication, name='create_execution_indication'),
    path('create/routine', views.create_routine, name='create_routine'),
    path('create/edit-delete-routine', views.edit_delete_routine, name='edit_delete_routine'),
    path('create/confirmation', views.confirmation, name='confirmation'),
    path('create/complete', views.complete, name='complete'),
]