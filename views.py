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
from geonode.maps.models import Map
username, password = ogc_server_settings.credentials
gs_catalog = Catalog(ogc_server_settings.internal_rest, username, password)
geonode_workspace = gs_catalog.get_workspace("geonode")
_js_permissions_mapping = {
    'whoCanView': 'view_resourcebase',
    'whoCanChangeMetadata': 'change_resourcebase_metadata',
    'whoCanDelete': 'delete_resourcebase',
    'whoCanChangeConfiguration': 'change_resourcebase'
}
def change_dict_None_to_list(access):
    for permission, users in list(access.items()):
        if not users:
            access[permission] = []
def get_users_permissions(access, initial, owner):
        change_dict_None_to_list(access)
        users = []
        for permission_users in list(access.values()):
            if permission_users:
                users.extend(permission_users)
        users = set(users)
        for user in users:
            user_permissions = []
            for js_permission, gaurdian_permission in \
                    list(_js_permissions_mapping.items()):
                if user in access[js_permission]:
                    user_permissions.append(gaurdian_permission)
            if len(user_permissions) > 0 and user != owner:
                initial['users'].update({'{}'.format(user): user_permissions})
            if len(access["whoCanView"]) == 0:
                initial['users'].update({'AnonymousUser': [
                    'view_resourcebase',
                ]})
def get_groups_permissions(access, initial, owner):
        change_dict_None_to_list(access)
        groups = []
        for permission_groups in list(access.values()):
            if permission_groups:
                groups.extend(permission_groups)
        groups = set(groups)
        for group in groups:
            group_permissions = []
            for js_permission, gaurdian_permission in \
                    list(_js_permissions_mapping.items()):
                if group in access[js_permission]:
                    group_permissions.append(gaurdian_permission)
            if len(group_permissions) > 0 :
                initial['groups'].update({'{}'.format(group): group_permissions})
            if len(access["whoCanView"]) == 0:
                initial['groups'].update({'AnonymousUser': [
                    'view_resourcebase',
                ]})
def save(request, instance_id=None, app_name=APP_NAME):
    res_json = dict(success=False)
    data = json.loads(request.body)
    config = data.get('config', None)
    title =  data.get('title', None)
    access = data.get('permissions', None)
    groupAccess=data.get('groupPermissions', None)
    print(groupAccess)
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
        attributes = json.dumps({"title":"string","description":"string","markerColor":"string","markerShape":"string","numbersColor":"string","title":"string","imageUrl":"string","order":"integer","link":"string"})
        # permissions = form.cleaned_data["permissions"]
        layer = create_layer(name, layer_title, request.user.username, geometry_type,attributes)
        # maps=Map(title=name,center_x=0,center_y=0,zoom=3,owner=request.user)
        # map_obj=maps.save()
        # instance_obj.map = Map.objects.get(title=name)
        # bundle.obj.map=instance_obj.map
  
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
    permessions = {
            'users': {
                '{}'.format(request.user.username): owner_permissions,
            },
            'groups':{}
        }
    get_users_permissions(access, permessions, request.user.username)
    get_groups_permissions(groupAccess, permessions, request.user.username)
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