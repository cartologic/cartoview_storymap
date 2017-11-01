import React, { Component } from 'react'

import CartoviewList from './CartoviewList'
import Grid from 'material-ui/Grid'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import {upperPropTypes} from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'
import AddIcon from 'material-ui-icons/Add';
import RemoveIcon from 'material-ui-icons/Remove';
import IconButton from 'material-ui/IconButton';
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
        }
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
    
        add:false,
        showDialoge:this.props.childrenProps.showDialoge,
        switch:true
    }
    componentDidMount(){
        const {map}=this.props
        map.setTarget(this.mapDiv)
    }
    componentDidUpdate(prevProps, prevState) {
        prevProps.map.updateSize()
    }
    componentWillReceiveProps(nextProps){
    
        this.setState({showDialoge:nextProps.childrenProps.showDialoge},console.log(this.state))
    }
    addEntry=()=>{
        this.setState({showDialoge:false,add:true})
        }
        handleRequestClose = () => {
            this.setState({ showDialoge: false });
          };
    render() {
  
        const { classes, childrenProps } = this.props
        return (
            <Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} style={{position:"relative"}}>
                    <div ref={(mapDiv)=>this.mapDiv=mapDiv} className={classes.mapPanel}>
                   
                    </div>
                   
                
                    {loggedUser==owner&& 
                    <div>
                      {this.state.switch&&
          <Button style={{position:"absolute",bottom:10,left:10,zIndex:100}} fab color="primary" aria-label="add" onClick={()=>{
              this.setState({switch:false})
              this.props.childrenProps.getLocation()}}>
                <AddIcon />
            </Button>}
        
        
            {!this.state.switch&& <Button style={{position:"absolute",bottom:10,left:10,zIndex:100}} fab color="primary" aria-label="add" onClick={()=>{this.setState({switch:true})
             this.props.childrenProps.removeLocation()}}>
                <RemoveIcon />
            </Button>}
        </div>
        }
                </Grid>
                <Grid item md={4} lg={4} xl={4} hidden={{ smDown: true }}>
                    <Paper className={classes.paper}><CartoviewList addEntry={this.state.add} {...childrenProps} /></Paper>
                </Grid>




            <div>
       
        <Dialog open={this.state.showDialoge} onRequestClose={this.handleRequestClose}>
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
