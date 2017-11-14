import './css/app.css'

import React, { Component } from 'react'

import EditService from './services/editService.jsx'
import General from './components/edit/General.jsx'
import ListOptions from './components/edit/ListOptions.jsx'
import NavigationTools from './components/edit/NavigationTools.jsx'
import Navigator from './components/edit/Navigator.jsx'
import ResourceSelector from './components/edit/ResourceSelector.jsx'
import MapViewer from './components/edit/MapViewer.jsx'
import permissions from './components/edit/permissions.jsx'
import { getCRSFToken } from './helpers/helpers.jsx'

export default class Edit extends Component {
    constructor( props ) {
        super( props )
        const { config,extent,access } = this.props
        this.state = {
            step: 0,
            access: this.props.access? this.props.access : null,           
            config: config ? config.config : null,
            id: config ? config.id : null,
            extent: this.props.extent ? this.props.extent:null,

        }
    }
    goToStep( step ) {
        this.setState( { step } )
    }
    onPrevious() {
        let { step } = this.state
        this.goToStep( step -= 1 )
    }
    save = ( instanceConfig ) => {
        console.log("configggg",this.state.config.config.title)
        this.state.config['extent']=this.state.extent
        this.state.config['access']=this.state.access
        var config={title:this.state.config.config.title,config:this.state.config,extent:this.state.extent,access:this.state.access}
        const { urls } = this.props
        const { id } = this.state
        const url = id ? urls.editURL( id ) : urls.newURL
        this.setState( {
            config: instanceConfig
        } )
        fetch( url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers( { "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() } ),
            body: JSON.stringify( config )
        } ).then( ( response ) => response.json() ).then( result => {
            if ( result.success === true ) {
                this.setState( {
                    success: true,
                    id: result.id

                } )

                window.location.href = urls.viewURL(result.id)
            }
        } )
    }
    render() {
        let { urls, username, keywords } = this.props
        let {
            step,
            selectedResource,
            config,
            success,
            abstract,
            title,
            id,
            extent
        } = this.state
        const steps = [
            {   
                label: "Select Map",
                component: MapViewer,
                props: {
                    resourcesUrl: urls.resources_url,
                    username: username,
                    extent:config,
                    onComplete: (extent) => {
                        
                        var { step, config } = this.state
                        this.setState( { extent } )
                        
                           
                       
                        this.goToStep( ++step )
                    }
                },
			
             
            },{
                label: "Permissions",
                component: permissions,
                props: {
                    instance: selectedResource,
                    config,
                    urls,
                    success,
                    id: id,
                    access:this.state.access?this.state.access:null,
                    onComplete: ( access) => {
                       console.log(access,"access")
                        this.setState({access},this.goToStep( ++step ))
                       
                       
                    },
                    onPrevious: () => {
                        this.onPrevious()
                    }
                }
			},
            
            {  label: "General ",
                component: General,
                props: {
                    keywords: config && config.keywords ? config.keywords : keywords,
                    urls,
                    abstract,
                    title,
                  
                    config,
                    onComplete: ( basicConfig ) => {
                        console.log("general",basicConfig)
                        let { step, config } = this.state
                        this.setState( {
                            config: {
                                ...basicConfig,
                                
                            }
                        },()=>this.save( this.state.config ) )
                        
                    },
                    onPrevious: () => {
                        this.onPrevious()
                    }
                }
			}, 
		]
        return (
            <div className="wrapping">
				<Navigator
					steps={steps}
					step={step}
					onStepSelected={(step) => this.goToStep(step)} />
				<div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel">
					{steps.map((s, index) => index == step && <s.component key={index} {...s.props} />)}
				</div>
			</div>
        )
    }
}
