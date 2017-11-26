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
        access: false,
        currentlocation:false
    }
    showCurrentLocation=()=>{
        this.setState({currentlocation:true})
    }
    hideCurrentLocation=()=>{
        this.setState({currentlocation:false})
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
             
                </Grid>
                <Grid item md={4} lg={4} xl={4} hidden={{ smDown: true }}>
                    <Paper onScroll={this.handleScroll} className={classes.paper}><CartoviewList 
                     addEntry={this.state.add} {...childrenProps} /></Paper>
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
