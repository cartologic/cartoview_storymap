import React, { Component } from 'react'
import {
    getAccessOptions,
    getGroupOptions,
    getAccessTemplate,
    getKeywordsOptions,
    getKeywordsTemplate
} from './AutoCompleteInput'

import PropTypes from 'prop-types'
import t from 'tcomb-form'

const Form = t.form.Form
const selectAccessItem = t.struct( {
    value: t.String,
    label: t.String,
    email: t.String
} )
const selectGroupItem = t.struct( {
    value: t.String,
    label: t.String,
    
} )
const selectKeywordItem = t.struct( {
    value: t.String,
    label: t.String
} )
const options = {
    fields: {
        // title: {
        //     label: "App Title"
        // },
   
        whoCanView: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getAccessOptions,
                message:"Select Users or empty for anyone"
            } )
        }
        ,
      
        whoCanChangeMetadata: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getAccessOptions,
                message: "Select Users or empty for owner(you) only"
                
            } )
        },
        whoCanDelete: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getAccessOptions,
                message: "Select Users or empty for owner(you) only"
            } )
        },
        whoCanChangeConfiguration: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getAccessOptions,
                message: "Select Users or empty for owner(you) only"
            } )
        },
        whoCanSubmitStory: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getAccessOptions,
                message: "Select Users or empty for owner(you) only"
            } )
        },
          whoCanEditStory: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getAccessOptions,
                message: "Select Users or empty for owner(you) only"
            } )
        },
       whoCanDeleteStory: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getAccessOptions,
                message: "Select Users or empty for owner(you) only"
            } )
        }
     
     
    }
}
const groupOptions = {
    fields: {
        // title: {
        //     label: "App Title"
        // },
   
        whoCanView: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getGroupOptions,
                message:"Select groups or empty for anyone"
            } )
        }
        ,
      
        whoCanChangeMetadata: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getGroupOptions,
                message: "Select groups or empty for owner(you) only"
                
            } )
        },
        whoCanDelete: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getGroupOptions,
                message: "Select groups or empty for owner(you) only"
            } )
        },
        whoCanChangeConfiguration: {
            factory: t.form.Textbox,
            template: getAccessTemplate( {
                loadOptions: getGroupOptions,
                message: "Select groups or empty for owner(you) only"
            } )
        }
     
    }
}
export default class Permissions extends Component {
    constructor( props ) {
      
        super( props )
        let { config, keywords, selectedResource, title, abstract,access } = this.props
        this.state = {
            defaultConfig: {
                           
                whoCanView: access?access.whoCanView: [],
                whoCanEdit: access?access.whoCanEdit: [],
                whoCanChangeMetadata:access?access.whoCanChangeMetadata: [],
                whoCanDelete:  access?access.whoCanDelete: [],
                whoCanChangeConfiguration: access?access.whoCanChangeConfiguration: [],
                whoCanSubmitStory: access?access.whoCanSubmitStory:[],
                whoCanEditStory: access?access.whoCanEditStory:[],
                whoCanDeleteStory: access?access.whoCanDeleteStory:[]
            },
            groupDefaultConfig: {
                           
                whoCanView: access?access.whoCanView: [],
                whoCanEdit: access?access.whoCanEdit: [],
                whoCanChangeMetadata:access?access.whoCanChangeMetadata: [],
                whoCanDelete:  access?access.whoCanDelete: [],
                whoCanChangeConfiguration: access?access.whoCanChangeConfiguration: [],
            },
        }
   }
   flattenedUsers = (users) => {
        return users.map(obj => obj.value)
    }
    getFormValueForSaving = (value) => {
        let data = {}
        Object.keys(value).map(attr => {
            const attributeValue = value[attr]
            data[attr] = attributeValue ? this.flattenedUsers(attributeValue) : null
        })
        return data
    }
    componentWillUnmount(){

       this.save()
    }
    save( ) {
        var basicConfig = this.form.getValue( )
         var groupconf=this.groupform.getValue()
       
        if ( basicConfig ) {
            
            this.props.onComplete(basicConfig,this.getFormValueForSaving(basicConfig),this.getFormValueForSaving(groupconf))
        }
    }
    render( ) {
        let { onPrevious } = this.props
        let mapConfig = t.struct( {
          
            whoCanView:  t.maybe(t.list( selectAccessItem )),
            whoCanChangeMetadata:  t.maybe(t.list( selectAccessItem )),
            whoCanDelete: t.maybe( t.list( selectAccessItem )),
            whoCanChangeConfiguration:  t.maybe(t.list( selectAccessItem )),
            whoCanSubmitStory: t.maybe(t.list( selectAccessItem )),
            whoCanEditStory: t.maybe(t.list( selectAccessItem )),
            whoCanDeleteStory: t.maybe(t.list( selectAccessItem )),
        } )
        let groupConfig = t.struct( {
          
            whoCanView:  t.maybe(t.list( selectGroupItem )),
            whoCanChangeMetadata:  t.maybe(t.list( selectGroupItem )),
            whoCanDelete: t.maybe( t.list( selectGroupItem )),
            whoCanChangeConfiguration:  t.maybe(t.list( selectGroupItem )),
            
        } )
        return (
            <div className="row">
                <div className="row">
                    <div className="col-xs-5 col-md-4">
                        <h4>{'Permissions'}</h4>
                    </div>
                    <div className="col-xs-7 col-md-8">
                        <button
                            className="btn navigation-buttons btn-primary btn-sm pull-right"
                            onClick={()=>this.props.save()}>{"Save"}
                        
                        </button>

                             </div>
                </div>
                <hr></hr>
                <div className="panel-group" style={{overFlow: "visible" }}>
  <div className="panel-default panel" style={{  overFlow: "visible"}}>
    <div className="panel-heading">
      <h4 className="panel-title">
        <a data-toggle="collapse" href="#collapse1">Users permissions</a>
      </h4>
    </div>
    <div id="collapse1" className="panel-collapse collapse" style={{"padding":"20px"}}>
    <Form
    ref={(form) => this.form = form}
    value={this.state.defaultConfig}
    type={mapConfig}
    onChange={this.onChange}
    options={options} />
    </div>
  </div>
</div>
<div className="panel panel-default">
    <div className="panel-heading">
      <h4 className="panel-title">
        <a data-toggle="collapse" href="#collapse2">Groups permissions</a>
      </h4>
    </div>
    <div id="collapse2" className="panel-collapse collapse" style={{"padding":"20px"}}>
    <Form
    ref={(form) => this.groupform = form}
    value={this.state.groupDefaultConfig}
    type={groupConfig}
    onChange={this.onChange}
    options={groupOptions} />
    </div>
  </div>

                

            </div>
        )
    }
}
