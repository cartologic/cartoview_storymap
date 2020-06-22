from django.urls import path
from . import APP_NAME, views

urlpatterns = [
    path('new/', views.new, name='%s.new' % APP_NAME),
    path('<int:instance_id>/edit/', views.edit, name='%s.edit' % APP_NAME),
    path('<int:instance_id>/view/', views.view_app, name='%s.view' % APP_NAME)
]
