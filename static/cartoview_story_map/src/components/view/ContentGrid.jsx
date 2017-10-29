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
import IconButton from 'material-ui/IconButton';

import Button from 'material-ui/Button'
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
    
        add:false
    }
    componentDidMount(){
        const {map}=this.props
        map.setTarget(this.mapDiv)
    }
    componentDidUpdate(prevProps, prevState) {
        prevProps.map.updateSize()
    }
    addEntry=()=>{
        this.setState({add:true})
        }
    render() {
        const { classes, childrenProps } = this.props
        return (
            <Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8} style={{position:"relative"}}>
                    <div ref={(mapDiv)=>this.mapDiv=mapDiv} className={classes.mapPanel}>
                   
                    </div>
                   
                
                    {/* {loggedUser==owner?
          <Button style={{position:"absolute",bottom:10,left:10,zIndex:100}} fab color="primary" aria-label="add" onClick={()=>{this.addEntry()}}>
        <AddIcon />
      </Button>:""} */}
                </Grid>
                <Grid item md={4} lg={4} xl={4} hidden={{ smDown: true }}>
                    <Paper className={classes.paper}><CartoviewList addEntry={this.state.add} {...childrenProps} /></Paper>
                </Grid>
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
