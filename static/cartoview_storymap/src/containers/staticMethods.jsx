import LayerSwitcher from '../vendor/ol3-layerswitcher/src/ol3-layerswitcher'
import isURL from 'validator/lib/isURL'
import ol from 'openlayers'
import Map from 'ol/map';
import URLS from './URLS';
import WFS from 'ol/format/wfs';

export const isWMSLayer = (layer) => {
    return layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol
        .source.ImageWMS
}
export const wmsGetFeatureInfoFormats = {
    'application/json': new ol.format.GeoJSON(),
    'application/vnd.ogc.gml': new ol.format.WMSGetFeatureInfo()
}
export const getFeatureInfoUrl = (layer, coordinate, view, infoFormat) => {
    const resolution = view.getResolution(),
        projection = view.getProjection()
    const url = layer.getSource().getGetFeatureInfoUrl(coordinate,
        resolution, projection, {
            'INFO_FORMAT': infoFormat
        })
    return `${url}&FEATURE_COUNT=10`
}
export function getMap() {

    let map = new ol.Map({
        view: new ol.View({
            center: [0, 0],

        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map'
    })



    return map
}
export const getAttachmentTags = (config) => {
    const configTags = config.attachmentTags
    const tags = (configTags && configTags.length > 0) ? configTags : [
        `feature_list_${layerName(config.layer)}`]
    return tags
}
export const getFilterByName = (attrs, attrName) => {
    let attributeType = null
    if (attrs) {
        attrs.forEach(attr => {
            if (attr.attribute === attrName) {
                attributeType = attr.attribute_type
            }
        })
    }
    return attributeType
}
export const getWMSLayer = (name, layers) => {
    let wmsLayer = null
    layers.forEach((layer) => {
        if (layer instanceof ol.layer.Group) {
            wmsLayer = getWMSLayer(name, layer.getLayers())
        } else if (isWMSLayer(layer) && layer.getSource().getParams()
            .LAYERS == name) {
            wmsLayer = layer
        }
        if (wmsLayer) {
            return false
        }
    })
    return wmsLayer
}
export const checkURL = (value) => {
    /* validator validate strings only */
    if (typeof (value) === "string") {
        return isURL(value)
    }
    return false
}
export const checkImageSrc = (src, good, bad) => {
    var img = new Image()
    img.onload = good
    img.onerror = bad
    img.src = src
}
export const addSelectionLayer = (map, featureCollection, styleFunction) => {

    const layer = new ol.layer.Vector({
        source: new ol.source.Vector({ features: featureCollection }),
        style: styleFunction,
        title: "Selected Features",

        format: new ol.format.GeoJSON({
            defaultDataProjection: map.getView().getProjection(),
            featureProjection: map.getView().getProjection()
        }),
        // map: map
    })
    map.addLayer(layer)
    return layer
}
export const getdescribeFeatureType = (typename = props.layername) => {
    var proxy_urls = new URLS(urls)
    var url = urls.describeFeatureType(typename)
    var proxy_url = proxy_urls.getProxiedURL(url)

    return fetch(proxy_url).then((response) => { 
        
        return response.json()
     }).then((data) => { 
       
         return data.featureTypes[0].properties })


}
export const getNameSpacerUri = (typename = props.layername) => {
    var proxy_urls = new URLS(urls)
    var url = urls.describeFeatureType(typename)
    var proxy_url = proxy_urls.getProxiedURL(url)

    return fetch(proxy_url).then((response) => { 
        
        return response.json()
     }).then((data) => { 
       
         return data.targetNamespace})


}
export const transactWFS = (action,feature,  nameSpaceUri,layerName, crs) => {
    var formatWFS = new WFS

    const [namespace, name] = layerName.split(":")

    var formatGMLOptions = {
        featureNS: nameSpaceUri,
        featurePrefix: namespace,
        
        featureType: name,
        gmlOptions: {
            srsName: "EPSG:" + crs
        },

    };
    var node = ""
   
    switch (action) {
        case 'insert':
            node = formatWFS.writeTransaction([feature], null, null, formatGMLOptions);
            break;
        case 'update':
            node = formatWFS.writeTransaction(null, [feature], null, formatGMLOptions);
            break;
        case 'delete':
            node = formatWFS.writeTransaction(null, null, [feature], formatGMLOptions);
            break;
    }

    var s = new XMLSerializer()
    var str = s.serializeToString(node)
    return str
}
export const getLayers = (layers) => {
    var children = []
    layers.forEach((layer) => {
        if (layer instanceof ol.layer.Group) {
            children = children.concat(getLayers(layer.getLayers()))
        } else if (layer.getVisible() && isWMSLayer(layer)) {
            children.push(layer)
        }
    })
    return children
}
// export const layerName = (typeName) => {
//     return typeName.split(":").pop()
// }
// export const layerNameSpace = (typeName) => {
//     return typeName.split(":")[0]
// }
export const getFilter = (config, filterType, value) => {
    /* 
    this function should return the proper filter based on 
    filter type
    working with strings & numbers
    test Needed 😈
    */
    let olFilter = ol.format.filter.like(config.filters, '%' + value +
        '%', undefined, undefined, undefined, false)
    if (filterType !== 'string') {
        olFilter = ol.format.filter.equalTo(config.filters, value)
    }
    return olFilter
}
