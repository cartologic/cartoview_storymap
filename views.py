
import json
from cartoview.app_manager.models import App, AppInstance
from cartoview.app_manager.views import StandardAppViews
from django.shortcuts import HttpResponse
from django.shortcuts import redirect
from geonode.geoserver.helpers import ogc_server_settings, get_store, get_sld_for
from . import APP_NAME
from django.template.defaultfilters import slugify
from django.shortcuts import HttpResponse, render
from .utils import create_layer
from geoserver.catalog import Catalog, FailedRequestError

username, password = ogc_server_settings.credentials
gs_catalog = Catalog(ogc_server_settings.internal_rest, username, password)
geonode_workspace = gs_catalog.get_workspace("geonode")

print(username,geonode_workspace.__dict__)
def save(request, instance_id=None, app_name=APP_NAME):
    res_json = dict(success=False)
    data = json.loads(request.body)
    config = data.get('config', None)
    title =  data.get('title', None)
    access = data.get('access', None)
    extent = data.get('extent', [])

    # config.update(access=access, keywords=keywords)
   
    abstract = data.get('abstract', "")

    if instance_id is None:
        instance_obj = AppInstance()
        instance_obj.app = App.objects.get(name=app_name)
        instance_obj.owner = request.user
        # name = form.cleaned_data['name']
        name = title+'_'+app_name
        layer_title = title+'_'+app_name
        geometry_type = "Point"
        config.update(layername=layer_title)
        attributes = json.dumps({"title":"string","description":"string","title":"string","imageUrl":"string","order":"integer","link":"string"})
        # permissions = form.cleaned_data["permissions"]
        layer = create_layer(name, layer_title, request.user.username, geometry_type,attributes)
    
        # layer.set_permissions(json.loads(permissions))
        # return redirect(layer)


    else:
        instance_obj = AppInstance.objects.get(pk=instance_id)
    config = json.dumps(data.get('config', None))
    instance_obj.title = title
    instance_obj.config = config
    instance_obj.abstract = abstract
    # instance_obj.map_id = map_id
    
    instance_obj.save()

    owner_permissions = [
        'view_resourcebase',
        'download_resourcebase',
        'change_resourcebase_metadata',
        'change_resourcebase',
        'delete_resourcebase',
        'change_resourcebase_permissions',
        'publish_resourcebase',
    ]
    # access limited to specific users
    users_permissions = {'{}'.format(request.user): owner_permissions}
    for user in access:
        if isinstance(user, dict) and \
                user.get('value', None) != request.user.username:
            users_permissions.update(
                {user.get('value', None): ['view_resourcebase', 'download_resourcebase','change_resourcebase_metadata','change_resourcebase','delete_resourcebase', ]})
    permessions = {
        'users': users_permissions
    }
    # set permissions so that no one can view this appinstance other than
    #  the user
    instance_obj.set_permissions(permessions)

    # update the instance keywords
    # if hasattr(instance_obj, 'keywords') and keywords:
    #     new_keywords = [k.get('value', None) for k in keywords if k.get(
    #         'value', None) not in instance_obj.keyword_list()]
    #     instance_obj.keywords.add(*new_keywords)

    res_json.update(dict(success=True, id=instance_obj.id))
    return HttpResponse(json.dumps(res_json),content_type="application/json")

    
def view_app(
        request,
        instance_id,
        template="%s/view.html" %
        APP_NAME,
        context={}):
    print("id",instance_id)
    print(username,geonode_workspace.__dict__)
    # instance = _resolve_appinstance(
    #     request, instance_id, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)
    instance = AppInstance.objects.get(pk=instance_id)
    context.update(instance=instance,id=instance_id,app=APP_NAME)
    return render(request, template, context)

def new(
        request,
        template="%s/new.html" %
        APP_NAME,
        app_name=APP_NAME,
        context={}):
    context.update(app=APP_NAME)
    if request.method == 'POST':
        return save(request, app_name=app_name)
    return render(request, template, context)


def edit(request, instance_id, template="%s/edit.html" % APP_NAME, context={}):
    if request.method == 'POST':
        return save(request, instance_id)
    instance = AppInstance.objects.get(pk=instance_id)
    
    context.update(instance=instance,id=instance_id,app=APP_NAME,config=json.dumps(instance.config))
    return render(request, template, context)
