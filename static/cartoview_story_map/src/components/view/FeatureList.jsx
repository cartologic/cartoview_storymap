import '../../vendor/ol3-layerswitcher/src/ol3-layerswitcher.css'

import { IntlProvider, addLocaleData } from 'react-intl'
import React, { Component } from 'react'

import ContentGrid from './ContentGrid'
import { MuiThemeProvider } from 'material-ui/styles'
import NavBar from './NavBar.jsx'
import PropTypes from 'prop-types'
import enLocaleData from 'react-intl/locale-data/en'
import enMessages from '@boundlessgeo/sdk/locale/en'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { theme } from './theme.jsx'
import { upperPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        height: '100%'
    }
})
injectTapEventPlugin()

addLocaleData(enLocaleData)
class FeatureList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: false,
            addEntry: false,
            switch:true
        }
    }
    handleOpen = () => {
        this.setState({ open: true, addEntry: true })
    }
handleSwitch(){
this.setstate({switch:true})
this.props.childrenProps.removeLocation()
}
    render() {
        let { classes, map, childrenProps } = this.props
        return (
            <IntlProvider locale='en' messages={enMessages}>
                <MuiThemeProvider theme={theme}>
                    <div className={classes.root}>
                        <NavBar handeSwitch={this.handleSwitch} childrenProps={childrenProps} open={this.state.open} addEntry={this.state.addEntry} />
                        <ContentGrid handleSwitch={this.handleSwitch} handleOpen={this.handleOpen} childrenProps={childrenProps} map={map} />
                    </div>
                </MuiThemeProvider>
            </IntlProvider>
        )
    }
}
FeatureList.propTypes = {
    ...upperPropTypes,
    map: PropTypes.object.isRequired,
}
export default withStyles(styles)(FeatureList)
