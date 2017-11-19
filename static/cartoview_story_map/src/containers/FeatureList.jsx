import 'openlayers/dist/ol.css'
import '../app.css'
import update from 'react-addons-update'
import React, { Component } from 'react'
import {
    addSelectionLayer,
    getFeatureInfoUrl,
    getFilter,
    getFilterByName,
    getMap,
    getWMSLayer,
    layerName,
    layerNameSpace,
    wmsGetFeatureInfoFormats,

    getAttachmentTags
} from './staticMethods'

import FeatureList from '../components/view/FeatureList'
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService'
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService'
import PropTypes from 'prop-types'
import URLS from './URLS'
import { getCRSFToken } from '../helpers/helpers.jsx'
import ol from 'openlayers'
import { render } from 'react-dom'
import { styleFunction } from './styling.jsx'
import { wfsQueryBuilder } from "../helpers/helpers.jsx"

class FeatureListContainer extends Component {
    constructor(props) {
        super(props)
       
        this.state = {
            mapIsLoading: false,
            featuresIsLoading: false,
            totalFeatures: 0,
            features: null,
            searchResultIsLoading: false,
            searchModeEnable: false,
            searchTotalFeatures: 0,
            searchResult: null,
            attachmentIsLoading: false,
            commentsIsLoading: false,
            attachments: null,
            comments: null,
            selectionModeEnabled: false,
            featureIdentifyLoading: false,
            featureIdentifyResult: null,
            activeFeatures: null,
            filterType: null,
            ImageBase64: null,
            xyValue: null,
            showDialog: false,
            crs:"3857",
            result:"",
            fileName:"",


        }

        this.urls = new URLS(this.props.urls)
        this.map = getMap()
        this.featureCollection = new ol.Collection()
        this.selectionLayer = addSelectionLayer(this.map, this.featureCollection, styleFunction)

    }
    openDialog = (bool) => {
        this.setState({ showDialog: bool })
    }
    onFeatureMove = (event) => {

        const crs = 'EPSG:' + this.state.crs

        var center = ol.proj.transform(event.mapBrowserEvent.coordinate, crs,
            this.map.getView().getProjection())

        const geometry = {
            name: 'the_geom',
            srsName: crs,
            x: center[0],
            y: center[1]
        }


     
        this.setState({ geometry, showDialog: true, mapProjection: this.map.getView().getProjection() })
    }

    refreshMap=(feature)=>{

        this.map.removeInteraction(this.modifyInteraction)
        this.featureCollection.push(feature)
        this.state.features.push(feature)
        // this.getLocation()
       
    }
    refreshMapEdit=(feature)=>{
     
          this.map.removeInteraction(this.modifyInteractionEdit)
        //   this.featureCollection.removeAt(feature.getProperties()['order']-1)
        //   this.featureCollection.push(feature)
          
          
        //   this.state.features[feature.getProperties()['order']-1]=feature
          
        //   console.log(feature)
        //   this.getLocation()
         
      }
    getLocation = () => {

        this.feature = new ol.Feature({
            geom: new ol.geom.Point([0, 0]),
            geometryName: 'the_geom'
        })
        this.feature.setGeometryName("the_geom")

        const featureStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [
                    0.5, 31
                ],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',

                src: this.props.urls.static +
                'cartoview_story_map/greenmarker.png'
            }),
            text: new ol.style.Text({
                text: '+',
                fill: new ol.style.Fill({ color: '#fff' }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                }),
                textAlign: 'center',
                offsetY: -20,
                font: '18px serif'
            }),

        })
        this.vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [this.feature]
            }),
            style: featureStyle,

        })
        this.modifyInteraction = new ol.interaction.Modify({
            features: new ol.Collection([this.feature]),
            pixelTolerance: 32,
            style: []
        })
        this.modifyInteraction.on('modifyend', this.onFeatureMove)
        this.feature.setGeometry(new ol.geom.Point(this.map.getView().getCenter()))
        this.setState({ vectorLayer: this.vectorLayer })

        this.map.addLayer(this.vectorLayer)
        this.vectorLayer.setZIndex(10)
        this.map.addInteraction(this.modifyInteraction)

    }
    removeLocation = () => {

        this.map.removeLayer(this.state.vectorLayer);

    }
    onFeatureMoveEdit = (event) => {

        const crs = 'EPSG:' + this.state.crs
                
                var center = ol.proj.transform(event.mapBrowserEvent.coordinate, crs,
                    this.map.getView().getProjection())
        
                const geometry = {
                    name: 'the_geom',
                    srsName: crs,
                    x: center[0],
                    y: center[1]
                }
        
        
             
                this.setState({ geometry, mapProjection: this.map.getView().getProjection() })
        
    }
    
    editFeature = (feature) => {
        this.editedFeature=feature
        this.setState({removedFeature:feature})
        const featureStyle = new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [
                    0.5, 31
                ],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',

                src: this.props.urls.static +
                'cartoview_story_map/greenmarker.png'
            }),
            text: new ol.style.Text({
                text: '',
                fill: new ol.style.Fill({ color: '#fff' }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 2
                }),
                textAlign: 'center',
                offsetY: -20,
                font: '18px serif'
            }),
        })
        this.vectorLayerEdit = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [feature]
            }),
            style: featureStyle,

        })
       this.setState({vectorLayerEdit:this.vectorLayerEdit})
        // feature.setStyle(featureStyle)
        // this.selectionLayer.getSource().addFeature(feature)

        this.modifyInteractionEdit = new ol.interaction.Modify({
            features: new ol.Collection([feature]),
            pixelTolerance: 32,
             style: []
        })
        // console.log(feature.getProperties().featureIndex)
        this.setState({featureCollection:this.featureCollection})
        this.featureCollection.removeAt(feature.getProperties().featureIndex-1)
        this.map.addLayer(this.vectorLayerEdit)
        
        this.modifyInteractionEdit.on('modifyend', this.onFeatureMoveEdit)
        this.map.addInteraction(this.modifyInteractionEdit)
    }
    removeFeatureMarker=(feature)=>{
        this.featureCollection.removeAt(feature.getProperties().featureIndex-1)

        this.setState({
            features: update(this.state.features, {$splice: [[feature.getProperties().featureIndex-1, 1]]})
           })
    }
    addComment = (data) => {
        const { urls, config } = this.props
        const apiData = { ...data, username: config.username }
        const { comments } = this.state
        const url = urls.commentsUploadUrl(layerName(config.layer))
        const proxiedURL = this.urls.getProxiedURL(url)
        return fetch(proxiedURL, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            }),
            body: JSON.stringify(apiData)
        }).then((response) => response.json()).then(result => {
            this.setState({ comments: [...comments, result] })
        })
    }
    getFilterType = () => {
        const { urls, config } = this.props
        fetch(`${urls.layerAttributes}?layer__typename=${config.layer}`, {
            method: "GET",
            credentials: 'include'
        }).then((response) => response.json()).then((data) => {
            const filterType = getFilterByName(data.objects,
                config.filters).split(":").pop()
            this.setState({ filterType })
        }).catch((error) => {
            throw Error(error)
        })
    }
    componentWillMount() {
        const { urls, config } = this.props
        if (config.filters) {
            this.getFilterType()
        }
        // this.loadMap(urls.mapJsonUrl, urls.proxy)
        this.getFeatures(0)
        // this.loadAttachments(urls.attachmentUploadUrl(layerName(config.layer)))
        // this.loadComments(urls.commentsUploadUrl(layerName(config.layer)))
    }
    searchFilesById = (id) => {
        const { attachments } = this.state
        let result = []
        attachments.map((imageObj) => {
            if (imageObj.is_image && imageObj.feature_id === id) {
                result.push(imageObj)
            }
        })
        return result
    }
    searchCommentById = (id) => {
        const { comments } = this.state
        let result = []
        comments.map((comment) => {
            if (comment.feature_id === id) {
                result.push(comment)
            }
        })
        return result
    }
    componentDidMount() {
        this.singleClickListner()
    }
    loadMap = (mapUrl, proxyURL) => {

        this.setState({ mapIsLoading: true })
        fetch(mapUrl, {
            method: "GET",
            credentials: 'include'
        }).then((response) => {

            return response.json()
        }).then((config) => {
            if (config) {
                this.setState({ mapIsLoading: false })
            }
        }).catch((error) => {
            throw Error(error)
        })
    }
    getCRS = (crs) => {
        let promise = new Promise((resolve, reject) => {
            if (proj4.defs('EPSG:' + crs)) {
                resolve(crs)
            } 
            else {
                fetch("https://epsg.io/?format=json&q=" + crs).then(
                    response => response.json()).then(
                    projres => {
                        if( projres.results[0]){
                        proj4.defs('EPSG:' + crs, projres.results[
                            0].proj4)
                        resolve(crs)}
                    })
            }
        })
        return promise
    }

    getFeatures = (startIndex) => {
        let { totalFeatures } = this.state
        const { urls, config } = this.props
        this.setState({ featuresIsLoading: true })
        const requestUrl = wfsQueryBuilder(urls.wfsURL, {
            service: 'wfs',
            version: '2.0.0',
            request: 'GetFeature',
            typeNames: props.layername,
            outputFormat: 'json',
            srsName: this.map.getView().getProjection().getCode(),
            sortBy:'order',
            startIndex
        })
        fetch(this.urls.getProxiedURL(requestUrl)).then((response) =>
            response.json()).then(
            (data) => {


                const crs = data.features.length > 0 ? data.crs
                    .properties.name.split(":").pop() : null
                this.getCRS(crs).then((newCRS) => {
                    this.setState({ crs })
                }, (error) => {
                    throw (error)
                })
                this.setState({ featuresIsLoading: false })
                let features = new ol.format.GeoJSON().readFeatures(
                    data, {
                        featureProjection: this.map.getView().getProjection()
                    })
                features.forEach((f, i) => {

                    f.set('featureIndex', i + 1)
                })
                this.featureCollection.extend(features)
                const total = data.totalFeatures
                if (totalFeatures == 0) {
                    this.setState({ totalFeatures: total })
                }
                this.setState({ features })
            })
    }

    search = (text) => {
        /* 
        Openlayer build request to avoid errors
        undefined passed to filter to skip paramters and
        use default values
        */
        const { urls, config } = this.props
        const { filterType } = this.state
        this.setState({ searchResultIsLoading: true, searchModeEnable: true })
        var request = new ol.format.WFS().writeGetFeature({
            srsName: this.map.getView().getProjection().getCode(),
            featureNS: 'http://www.geonode.org/',
            featurePrefix: layerNameSpace(config.layer),
            outputFormat: 'application/json',
            featureTypes: [layerName(config.layer)],
            filter: getFilter(config, filterType, text),
            maxFeatures: 20
        })
        return fetch(this.urls.getProxiedURL(urls.wfsURL), {
            method: 'POST',
            credentials: 'include',
            body: new XMLSerializer().serializeToString(request)
        }).then((response) => {
            return response.json()
        })
    }
    loadAttachments = (attachmentURL) => {
        this.setState({ attachmentIsLoading: true })
        const proxiedURL = this.urls.getProxiedURL(attachmentURL)
        fetch(proxiedURL).then((response) => response.json()).then(
            (data) => {
                this.setState({
                    attachmentIsLoading: false,
                    attachments: data
                })
            }).catch((error) => {
                throw Error(error)
            })
    }
    loadComments = (commentsURL) => {
        this.setState({ commentsIsLoading: true })
        const proxiedURL = this.urls.getProxiedURL(commentsURL)
        fetch(proxiedURL).then((response) => response.json()).then(
            (data) => {
                this.setState({
                    commentsIsLoading: false,
                    comments: data
                })
            }).catch((error) => {
                throw Error(error)
            })
    }
    SaveImageBase64 = (file) => {
        const { config } = this.props
        const { attachments } = this.state
        let promise = new Promise((resolve, reject) => {
            // do a thing, possibly async, then…
            var reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const data = {
                    file: reader.result,
                    file_name: file.name,
                    username: config.username,
                    is_image: true,
                    feature_id: 0,
                    tags: [
                        `storymap_${props.layer}`
                    ]
                }
                resolve(data)
            }
            reader.onerror = (error) => {
                reject(Error(error.message))
            }
        })
        promise.then((apiData) => {
            this.saveAttachment(apiData).then(result => {
                console.log("result",result)
                this.setState({ attachments: [...attachments, result] })
            })
        }, (error) => {
            throw (error)
        })
    }

    readThenSave = ( file, featureId ) => {
        const { config } = this.props
        const { attachments } = this.state
        var reader = new FileReader()
        reader.readAsDataURL( file )
        reader.onload = () => {
            const apiData = {
                file: reader.result,
                file_name: `${props.layer}_${featureId}.png`,
                username: loggedUser,
                is_image: true,
                feature_id: 0,
                tags: ["a"]
            }
            this.saveAttachment( apiData ).then( result => {
                console.log("------------",result)
                this.setState( {
                    attachments:result 
                } )
            } )
        }
        reader.onerror = ( error ) => {
            throw ( error )
        }
    }
    getImageFromURL = ( url, featureId ) => {
        const proxiedURL = this.urls.getProxiedURL( url )
        fetch( proxiedURL, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "image/*"
            }
        } ).then( response => response.blob() ).then( blob => {
            this.readThenSave( blob, featureId )
        } )
    }
    saveAttachment = (data) => {
        const { urls, config } = this.props
        const url = urls.attachmentUploadUrl(props.layer)
        return fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            }),
            body: JSON.stringify(data)
        }).then((response) => response.json())
    }
    zoomToFeature = (feature, done = () => { }) => {
        if(props.config.zoomOnClick){
        var duration = 1000;
        // console.log(feature, feature.getGeometry())
        var location = feature.getGeometry().getFirstCoordinate()
        // console.log(this.feature.getGeometry())
        var view = this.map.getView()
        var zoom = view.getZoom();

        var parts = 2;
        var called = false;
        function callback(complete) {
            --parts;
            if (called) {
                return;
            }
            if (parts === 0 || !complete) {
                called = true;
                done(complete);
            }
        }
        view.animate({
            center: location,
            duration: duration
        }, callback);
        view.animate({
            zoom: zoom - 1,
            duration: duration / 2
        }, {
                zoom: zoom,
                duration: duration / 2
            }, callback);

        const { config } = this.props

        if (config && config.zoomOnSelect) {

        }
    }}
    singleClickListner = () => {
        this.map.on('singleclick', (e) => {

        })
    }
    backFromEdit=()=>{
        this.featureCollection.insertAt(this.state.removedFeature.featureIndex-1, this.state.removedFeature)

       
        this.map.removeLayer(this.state.vectorLayerEdit)
    }
    backToAllFeatures = () => {
        this.setState({
            selectionModeEnabled: false,
            featureIdentifyResult: null
        })
        this.addStyleToFeature([])
    }
    transformFeatures = (layer, features, map, crs) => {

        let transformedFeatures = []
        features.forEach((feature) => {
            feature.getGeometry().transform('EPSG:' + crs, map.getView()
                .getProjection())
            feature.set("_layerTitle", layer.get('title'))
            transformedFeatures.push(feature)
        })
        this.setState({
            featureIdentifyResult: transformedFeatures,
            activeFeatures: null,
            featureIdentifyLoading: false
        }, () => this.addStyleToFeature(this.state.featureIdentifyResult))
        document.body.style.cursor = "default"
    }
    addStyleToFeature = (features) => {
        // this.featureCollection.clear()
        if (features && features.length > 0) {
            this.featureCollection.extend(features)
        }
    }
    featureIdentify = (map, coordinate) => {
        const { config } = this.props
        const view = map.getView()
        const layer = getWMSLayer(config.layer, this.map.getLayers().getArray())
        const url = getFeatureInfoUrl(layer, coordinate, view,
            'application/json')
        fetch(this.urls.getProxiedURL(url)).then((response) =>
            response.json(Car)).then(
            (result) => {
                if (result.features.length > 0) {
                    const features = wmsGetFeatureInfoFormats[
                        'application/json'].readFeatures(result)
                    const crs = result.features.length > 0 ? result.crs
                        .properties.name.split(":").pop() : null
                    if (proj4.defs('EPSG:' + crs)) {
                        this.transformFeatures(layer, features, map,
                            crs)
                    } else {
                        fetch("https://epsg.io/?format=json&q=" + crs)
                            .then(response => response.json()).then(
                            projres => {
                                proj4.defs('EPSG:' + crs, projres
                                    .results[0].proj4)
                                this.transformFeatures(layer,
                                    features, map, crs)
                            })
                    }

                } else {
                    this.setState({
                        featureIdentifyResult: [],
                        activeFeatures: null,
                        featureIdentifyLoading: false,
                    })
                    document.body.style.cursor = "default"
                }
            })
    }

    render() {
        const { config, urls } = this.props
        let childrenProps = {
            config,
            ...this.state,
            getFeatures: this.getFeatures,
            searchFilesById: this.searchFilesById,
            zoomToFeature: this.zoomToFeature,
            addStyleToFeature: this.addStyleToFeature,
            backToAllFeatures: this.backToAllFeatures,
            layerName,
            layerNameSpace,
            search: this.search,
            addComment: this.addComment,
            searchCommentById: this.searchCommentById,
            urls,
            SaveImageBase64: this.SaveImageBase64,
            getLocation: this.getLocation,
            removeLocation: this.removeLocation,
            openDialog: this.openDialog,
            editFeature: this.editFeature,
            newFeature: this.feature,
            refreshMap:this.refreshMap,
            refreshMapEdit:this.refreshMapEdit,
            editedFeature:this.editedFeature,
            geometry:this.state.geometry,
            backFromEdit:this.backFromEdit,
            removeFeatureMarker:this.removeFeatureMarker,
            crs:this.state.crs?this.state.crs:"3857",
            getImageFromURL: this.getImageFromURL,
            result:this.state.result
            
        }
        return <FeatureList childrenProps={childrenProps} map={this.map} />
    }
}
FeatureListContainer.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
}
global.CartoviewFeatureList = {
    show: (el, props, urls) => {
        render(<FeatureListContainer urls={urls} config={props} />,
            document.getElementById(el))
    }
}
