import 'openlayers/dist/ol.css'
import'../app.css'
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
    wmsGetFeatureInfoFormats
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
            xyValue:null,
            showDialog:false
        }
        this.urls = new URLS(this.props.urls)
        this.map=getMap()
        this.featureCollection = new ol.Collection()
        addSelectionLayer(this.map, this.featureCollection, styleFunction)

    }
    openDialog=(bool)=>{
        this.setState({showDialog:bool})
    }
    onFeatureMove = (event) => {

        
        console.log(this.map.getView().getProjection().getCode())
        const crs ='EPSG:'+this.state.crs
        console.log(crs)
        var center=ol.proj.transform(event.mapBrowserEvent.coordinate, crs,
            this.map.getView().getProjection())

        const geometry = {
            name: 'the_geom',
            srsName: crs,
            x: center[0],
            y: center[1]
        }
                


            this.setState({geometry,showDialog:true})
    }
            getLocation=()=>{
                
                console.log("in get location ")
                this.feature = new ol.Feature({
                    geometry: new ol.geom.Point([0, 0]),
                    geometryName: 'the_geom'
                })
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
                    zIndex:50000
                })
                this.vectorLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [this.feature]
                    }),
                    style: featureStyle,
                    zIndex:10000
                })
                this.modifyInteraction = new ol.interaction.Modify({
                    features: new ol.Collection([this.feature]),
                    pixelTolerance: 32,
                    style: [] 
                })
                this.modifyInteraction.on('modifyend', this.onFeatureMove)
                this.feature.setGeometry(new ol.geom.Point(this.map.getView().getCenter()))
                this.setState({vectorLayer:this.vectorLayer})
             
                this.map.addLayer(this.vectorLayer)
                console.log(this.map.getLayers())
                this.map.addInteraction(this.modifyInteraction)          
                addSelectionLayer(this.map, this.featureCollection, styleFunction)
               }
            removeLocation=()=>{
                console.log("remoce")
               this.map.removeLayer(this.state.vectorLayer);
                
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
        this.loadMap(urls.mapJsonUrl, urls.proxy)
        this.getFeatures(0)
        this.loadAttachments(urls.attachmentUploadUrl(layerName(config.layer)))
        this.loadComments(urls.commentsUploadUrl(layerName(config.layer)))
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
            } else {
                fetch("https://epsg.io/?format=json&q=" + crs).then(
                    response => response.json()).then(
                    projres => {
                        proj4.defs('EPSG:' + crs, projres.results[
                            0].proj4)
                        resolve(crs)
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
            typeNames: config.layer,
            outputFormat: 'json',
            srsName: this.map.getView().getProjection().getCode(),
           
            startIndex
        })
        fetch(this.urls.getProxiedURL(requestUrl)).then((response) =>
            response.json()).then(
            (data) => {


            const crs = data.features.length > 0 ? data.crs
                .properties.name.split(":").pop() : null
                this.getCRS(crs).then((newCRS) => {
            this.setState({crs})
                }, (error) => {
                    throw (error)
                })
                this.setState({ featuresIsLoading: false })
                let features = new ol.format.GeoJSON().readFeatures(
                    data, {
                        featureProjection: this.map.getView().getProjection()
                    })
                features.forEach((f,i)=>{
                   
                    f.set('featureIndex',i+1)
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
    SaveImageBase64 = (file, featureId) => {
        const { config } = this.props
        const {attachments}=this.state
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
                    feature_id: featureId,
                    tags: [
                        `feature_list_${layerName(config.layer)}`
                    ]
                }
                resolve(data)
            }
            reader.onerror = (error) => {
                reject(Error(error.message))
            }
        })
        promise.then((apiData) => {
            this.saveAttachment(apiData).then(result=>{
                this.setState({attachments:[...attachments,result]})
            })
        }, (error) => {
            throw (error)
        })
    }
    saveAttachment = (data) => {
        const { urls, config } = this.props
        const url = urls.attachmentUploadUrl(layerName(config.layer))
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
    zoomToFeature = (feature,done=()=>{}) => {
        var duration = 1000;
        // console.log(feature.getGeometry()[0],feature.getGeometry().getFirstCoordinate(),feature.getGeometry())
        var location = feature.getGeometry().getFirstCoordinate()
        var view=this.map.getView()
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
            // this.map.getView().fit(feature.getGeometry().getExtent(),
            //     this.map.getSize(), { duration: 10000 })
            // console.log("cordinate",feature)
         
        }
    }
    singleClickListner = () => {
        this.map.on('singleclick', (e) => {
            
        })
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
            getLocation:this.getLocation,
            removeLocation:this.removeLocation,
            showDialog:this.state.showDialog,
            geometry:this.state.geometry,
            openDialog:this.openDialog

          
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
