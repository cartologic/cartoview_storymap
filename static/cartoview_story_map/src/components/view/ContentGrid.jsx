import React, { Component } from 'react'

import CartoviewList from './CartoviewList'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { upperPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import IconButton from 'material-ui/IconButton';
import LocationIcon from 'material-ui-icons/LocationSearching';
import TextField from 'material-ui/TextField';
import Geolocation from 'ol/geolocation';
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
} from '../../containers/staticMethods'
import ol from 'openlayers'
import Button from 'material-ui/Button'
import { styleFunction } from '../../containers/styling.jsx'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';


const styles = theme => ({
    root: {
        [theme.breakpoints.up('md')]: {
            height: `calc(100% - 64px)`,
        },
        [theme.breakpoints.down('md')]: {
            height: `calc(100% - 64px)`,
        },
    },
    paper: {
        height: "100%",
        overflowY: 'overlay'
    },
    mapPanel: {
        height: '100%'
    }
})
class ContentGrid extends Component {
    state = {

        add: false,
        switch: true,
        success: false,
        access: true
    }
geolocation=()=>{
var map = this.props.map
      // create a Geolocation object setup to track the position of the device
      var geolocation = new ol.Geolocation({
        tracking: true
      });
      geolocation.on('change', function(evt) {
       console.log(geolocation.getPosition());
       



       this.feature = new ol.Feature({
       geom: new ol.geom.Point([geolocation.getPosition()[0], geolocation.getPosition()[1]]),
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

           src: 
        "https://cdn1.iconfinder.com/data/icons/streamline-map-location-2/60/cell-0-2-120.png"
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
 var  vectorSource=map.getView().getSource()
//    this.feature.setGeometry(new ol.geom.Point(this.props.map.getView().getCenter()))
vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([geolocation.getPosition()[0], geolocation.getPosition()[1]], 200)));
  map.addLayer(this.vectorLayer)
   this.vectorLayer.setZIndex(10)


      });
      console.log(geolocation,geolocation.getProperties(),geolocation.getPosition())
  }  
    componentDidMount() {
        const { map } = this.props

        map.setTarget(this.mapDiv)
        map.getView().fit(props.extent, map.getSize())
        this.checkPermissions(loggedUser)
    }

    componentDidUpdate(prevProps, prevState) {
        prevProps.map.updateSize()
    }
    openDrawerShowDialog = () => {
        const { childrenProps, handleOpen } = this.props
        childrenProps.openDialog(false)
        handleOpen()
    }
    addEntry = () => {

        this.setState({ add: true }, this.openDrawerShowDialog)

    }
    handleRequestClose = () => {
        const { childrenProps } = this.props
        childrenProps.openDialog(false)
    };
    handleSwitch = () => {
        this.setState({ switch: true })
        this.props.childrenProps.removeLocation()
    }
    handleScroll = () => {

    }
    checkPermissions = (name) => {

        props.access.access.map((user) => {

            if (user.value == name) {

                this.setState({ access: true })
            }

        })

    }
    render() {

        const { classes, childrenProps } = this.props
        return (
            <Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} style={{ position: "relative" }}>
                    <div ref={(mapDiv) => this.mapDiv = mapDiv} className={classes.mapPanel}>
                    </div>
                    {this.state.access &&
                        <div>
                            {this.state.switch &&
                                <Button style={{ position: "absolute", bottom: 10, left: 10, zIndex: 100 }} fab color="primary" aria-label="add" onClick={() => {
                                    this.setState({ switch: false })

                                    this.props.childrenProps.getLocation()
                                }}>
                                    <AddIcon />
                                </Button>}
                            {!this.state.switch &&
                            <div>

{/* 
<TextField style={{ position: "absolute", top:10, left:50, zIndex: 100 ,width:"300px",color:"black"}}
          id="name"
       
          label="Search Location by address"
          className={classes.textField}
          value={this.state.name}
          onChange={console.log("k")}
          margin="normal"
        />

                                         <Button style={{ position: "absolute", bottom:70, left: 10, zIndex: 100 }} fab color="primary" aria-label="add" onClick={() => {
                                    // this.setState({ switch: true, add: false })
                                    // this.props.childrenProps.removeLocation()
                                    this.geolocation()
                                }}>
                                    <LocationIcon />
                                </Button>
                                 */}


                                <Button style={{ position: "absolute", bottom: 10, left: 10, zIndex: 100 }} fab color="primary" aria-label="add" onClick={() => {
                                    this.setState({ switch: true, add: false })
                                    this.props.childrenProps.removeLocation()
                                }}>
                                    <RemoveIcon />
                                </Button>
                                </div>}
                        </div>
                    }
                </Grid>
                <Grid item md={4} lg={4} xl={4} hidden={{ smDown: true }}>
                    <Paper onScroll={this.handleScroll} className={classes.paper}><CartoviewList handleSwitch={this.handleSwitch} handleOpen={this.handleOpen} addEntry={this.state.add} {...childrenProps} /></Paper>
                </Grid>
                <div>
                    <Dialog open={childrenProps.showDialog} onRequestClose={this.handleRequestClose}>
                        <DialogTitle>{"Save this location to feature ?"}</DialogTitle>
                        <DialogContent>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleRequestClose} color="primary">
                                Disagree
                            </Button>
                            <Button onClick={this.addEntry} color="primary" autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            </Grid>
        )
    }
}
ContentGrid.propTypes = {
    ...upperPropTypes,
    map: PropTypes.object.isRequired,
    width: PropTypes.string,
};
export default compose(withStyles(styles), withWidth())(ContentGrid)
