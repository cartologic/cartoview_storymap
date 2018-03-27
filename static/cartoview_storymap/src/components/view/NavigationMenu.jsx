import Menu, { MenuItem } from 'material-ui/Menu'

import GridIcon from 'material-ui-icons/GridOn'
import IconButton from 'material-ui/IconButton'
import LayerIcon from 'material-ui-icons/Layers'
import ListIcon from 'material-ui-icons/List'
import MapIcon from 'material-ui-icons/Map'
import MenuIcon from 'material-ui-icons/MoreVert'
import React from 'react'
import { parentProptypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
})
class NavigationMenu extends React.Component {
    state = {
        open: false,
    }
    handleClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget })
    }
    handleRequestClose = (e,url) => {
        this.setState({ open: false })
        if(typeof(url)!=="undefined"){
            window.location.href=url
        }
        
    }
    render() {
        const { classes,urls } = this.props
        return (
            <div>
               
            </div>
        );
    }
}
NavigationMenu.protoTypes = parentProptypes
export default withStyles(styles)(NavigationMenu)
