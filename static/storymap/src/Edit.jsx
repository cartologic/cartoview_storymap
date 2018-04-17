import './css/app.css'
import './app.css'
import React, { Component } from 'react'

import EditService from './services/editService.jsx'
import General from './components/edit/General.jsx'
import ListOptions from './components/edit/ListOptions.jsx'
import NavigationTools from './components/edit/NavigationTools.jsx'
import Navigator from './components/edit/Navigator.jsx'
import ResourceSelector from './components/edit/ResourceSelector.jsx'
import MapViewer from './components/edit/MapViewer.jsx'
import Permissions from './components/edit/permissions.jsx'
import { getCRSFToken } from './helpers/helpers.jsx'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
export default class Edit extends Component {
    constructor(props) {
        super(props)
        const { config, extent, access } = this.props
        this.state = {
            step: 0,
            access:config && this.props.config.config.access ? this.props.config.config.access : null,
            config: config ? config.config : null,
            id: config ? config.id : null,
            extent: config &&this.props.config.config.extent ? this.props.config.config.extent : null,
            general: config && this.props.config.config.config ? this.props.config.config.config : null,
            error:null,
            save_flag:null
        }

    }
    goToStep(step) {
      
        this.setState({ step })
    }
    onPrevious() {
        let { step } = this.state
        this.goToStep(step -= 1)
    }
    save = (instanceConfig) => {
        if (this.state.config){
        this.state.config['extent'] = this.state.extent
        this.state.config['zoom']=this.state.zoom
        this.state.config['projection']=this.state.projection
        this.state.config['center']=this.state.center
        this.state.config['access'] = this.state.access
        this.state.config['permissions'] = this.state.miniAccess
        this.state.config['groupPermissions'] = this.state.groupAccess
        var config = { projection:this.state.projection,center:this.state.center,zoom:this.state.zoom,abstract:this.state.config.config.abstract,title: this.state.config.config.title, config: this.state.config, extent: this.state.extent, access: this.state.access ,permissions:this.state.miniAccess,groupPermissions:this.state.groupAccess}
        const { urls } = this.props
        const { id } = this.props
      
        const url = id ? urls.editURL(id) : urls.newURL
        this.setState({
            config: instanceConfig
        })
        fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({ "Content-Type": "application/json; charset=UTF-8", "X-CSRFToken": getCRSFToken() }),
            body: JSON.stringify(config)
        }).then((response) => response.json()).then(result => {
            if (result.success === true) {
                this.setState({
                    success: true,
                    id: result.id

                })

                window.location.href = urls.viewURL(result.id)
            }
        }).catch((error)=>{
            this.setState({error:true})
        })
    }else{
        console.log("not ready")
        this.setState({save_flag:true})
    }}
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
        console.log("step",step)
        const steps = [
            {
                label: "Select Extent",
                component: MapViewer,
                props: {
                    resourcesUrl: urls.resources_url,
                    username: username,
                    extent: extent,
                    save_flag:this.state.save_flag,
                    save:()=>{this.save(this.state.config)},
                    onComplete: (extent,zoom,projection,center) => {
                
                        var { step, config } = this.state
                        this.setState({ extent ,zoom,projection,center})
                     
                    }
                },


            }, {
                label: "Permissions",
                component: Permissions,
                props: {
                    instance: selectedResource,
                    save_flag:this.state.save_flag,
                    config,
                    urls,
                    success,
                    id: id,
                    access: this.state.access ? this.state.access : null,
                    save:()=>{this.save(this.state.config)},
                    onComplete: (access,miniAccess,groupAccess) => {
                      
                        this.setState({ access,miniAccess,groupAccess })


                    },
                    onPrevious: () => {
                        this.onPrevious()
                    }
                }
            },

            {
                label: "General ",
                component: General,
                props: {
                    keywords: config && config.keywords ? config.keywords : keywords,
                    urls,
                    abstract,
                    title,
                    general: this.props.config &&this.props.config.config.config ? this.props.config.config.config : this.state.config?this.state.config.config:null,
                    save:(basicConfig)=>{
                    console.log(basicConfig)
                    let { step, config } = this.state
                    this.setState({
                        config: {
                            ...basicConfig,

                        }
                    }, () => this.save(this.state.config)
                )

                        },
                 save: (basicConfig) => {

                            let { step, config } = this.state
                            this.setState({
                                config: {
                                    ...basicConfig,
    
                                }
                            }, () => this.save(this.state.config))
    
                        },
                        onComplete: (basicConfig) => {

                            let { step, config } = this.state
                            this.setState({
                                config: {
                                    ...basicConfig,
    
                                }
                            })
    
                        },
                    onPrevious: () => {
                        this.onPrevious()
                    }
                }
            },
        ]
        return (
            <div className="wrapping">
            <div style={{'display':'none'}}>
   
           </div>
                <Navigator
                    steps={steps}
                    step={step}
                    save_flag= {this.state.save_flag}
                    onStepSelected={(step) => this.goToStep(step)} />
                <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 right-panel">
                    {steps.map((s, index) => index == step && <s.component key={index} {...s.props} />)}
                </div>
                <Dialog open={this.state.error} >
                    <DialogTitle> </DialogTitle>
                    <DialogContent>
                   {"Error saving app instance !"}
                    </DialogContent>
                    <DialogActions>
                      
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
