import React, { Component } from 'react';
import ol from 'openlayers'
import { render } from 'react-dom'




export default class MapViewer extends Component {
    constructor(props) {
        super(props)
        this.state = {
          extent:this.props.extent
        }
    
            this.map = new ol.Map({
            view: new ol.View({
                center: [0, 0],
                zoom: 4
            }),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            target: 'map'
        })
        
        
    }
   
    componentDidMount(){
        this.map.setTarget(this.mapRef)
        if(this.state.extent)
        { console.log("in did mount",this.state.extent)
        this.map.getView().fit(this.state.extent,this.map.getSize())}
          this.map.updateSize()
    }
    save() {

         this.props.onComplete(this.map.getView().calculateExtent(this.map.getSize()))
    }

    render() {
        return (
            <div className="row">
                <div className="row">
                    <div className="col-xs-12 col-sm-8 col-md-8 col-lg-8">
                        <h4>{'Select Map'}</h4>
                    </div>

                    <div className="col-xs-6 col-md-4">
                        <div className="btn-group" style={{
                            float: "right"
                        }}>
                          

                            <button
                                type='button'
                                className="btn btn-sm btn-primary"
                                onClick={this.save.bind(this)}>Next
								<i className="fa fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div ref={(mapRef) => this.mapRef = mapRef} style={{ border: "2px solid lightgray", borderRadius: "8px", height: 400 }} className={'map-ct'}>
                    {this.props.children}
                </div>
            
            </div>
      )  }}