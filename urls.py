from django.conf.urls import url

from . import APP_NAME, views

urlpatterns = [
    url(r'^new/$', views.new,
        name='%s.new' % APP_NAME),
    url(r'^(?P<instance_id>\d+)/edit/$',
        views.edit, name='%s.edit' % APP_NAME),
    url(r'^(?P<instance_id>\d+)/view/$',
        views.view_app, name='%s.view' % APP_NAME)
]
