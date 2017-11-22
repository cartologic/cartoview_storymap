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
import Control from 'ol/control';
import Geocoder from 'ol-geocoder'
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
        access: false
    }
    geolocation = () => {
        console.log("geo")
        var map = this.props.map
        // create a Geolocation object setup to track the position of the device
        var geolocation = new ol.Geolocation({
            tracking: true,
            projection: 'EPSG:3857'
        });
        geolocation.on('change', (evt) => {
            console.log(geolocation.getPosition());
            this.props.childrenProps.removeLocation()
            this.props.childrenProps.getLocation(geolocation.getPosition()[0], geolocation.getPosition()[1])
            this.setState({ geolocation })
        })

        this.props.childrenProps.getLocation(this.state.geolocation.getPosition()[0], this.state.geolocation.getPosition()[1])
        //   this.props.childrenProps.removeLocation() 
    }
    componentWillMount(){
        this.checkPermissions(loggedUser)
    }
    componentDidMount() {
        const { map } = this.props
        // var control = new ol.Control();
        map.setTarget(this.mapDiv)
        map.getView().fit(props.extent, map.getSize())
        this.checkPermissions(loggedUser)
        // var geocoder = new Geocoder('nominatim', {
        //     provider: 'mapquest',
        //     key: '__some_key__',
        //     lang: 'pt-BR', //en-US, fr-FR
        //     placeholder: 'Search for ...',
        //     targetType: 'text-input',
        //     limit: 5,
        //     keepOpen: true
        // });
        // var control =new Control
        // map.addControl(control);
        // geocoder.on('addresschosen', function (evt) {
        //     var feature = evt.feature,
        //         coord = evt.coordinate,
        //         address = evt.address;
        //     // some popup solution
        //     // content.innerHTML = '<p>'+ address.formatted +'</p>';
        //     overlay.setPosition(coord);
        // });
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
console.log(user,"pp",props.access.access,name)
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
                                    <Button style={{ position: "absolute", bottom: 70, left: 10, zIndex: 100 }} fab color="primary" aria-label="add" onClick={() => {
                                        this.geolocation()
                                    }}>
                                        <LocationIcon />
                                    </Button>
                                    <Button style={{ position: "absolute", bottom: 10, left: 10, zIndex: 100 }} fab color="primary" aria-label="add" onClick={() => {
                                        this.state['add'] = false
                                        this.setState({ switch: true }, console.log("ss", this.state.add))
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
