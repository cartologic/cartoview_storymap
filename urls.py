from django.conf.urls import patterns, url

from . import APP_NAME, views

urlpatterns = patterns('',
                       url(r'^new/$', views.story_map.new,
                           name='%s.new' % APP_NAME),
                       url(r'^(?P<instance_id>\d+)/edit/$',
                           views.story_map.edit, name='%s.edit' % APP_NAME),
                       url(r'^(?P<instance_id>\d+)/view/$',
                           views.story_map.view_app, name='%s.view' % APP_NAME)
                       )
