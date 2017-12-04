// import 'react-select/dist/react-select.css'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import t from 'tcomb-form'
import { CircularProgress } from 'material-ui/Progress'

const filter = t.struct({
    type: t.String,
    name: t.String
})
const formConfig = t.struct({
    title: t.String,
    abstract: t.String,
    DisplayNumbersOnMarkers: t.maybe(t.Boolean),
    zoomOnClick: t.maybe(t.Boolean)
})
const Form = t.form.Form
export default class General extends Component {
    constructor(props) {
        super(props)
        const { config } = this.props
     
        this.state = {
            value: {
                title: this.props.general&&this.props.general.title?this.props.general.title:null,
                abstract: this.props.general&&this.props.general.abstract?this.props.general.abstract:null,
                DisplayNumbersOnMarkers:this.props.general&& this.props.general.DisplayNumbersOnMarkers?this.props.general.DisplayNumbersOnMarkers:true,
                zoomOnClick: this.props.general&&this.props.general.zoomOnClick?this.props.general.zoomOnClick:true,
            },
            attributeOptions: [],
            attributes: [],
            loading: false
        }
     
    }

    save = () => {
      
        const value = this.form.getValue()
        if (value) {
			this.setState({loading:true})
            this.props.onComplete({
                config: {
                    ...value
                }
            })
        }
    }


    render() {
        let {
            loading,
            value
        } = this.state
        return (
            <div className="row">
				<div className="row">
					<div className="col-xs-5 col-md-4"></div>
					<div className="col-xs-7 col-md-8">
						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right disabled"
							onClick={this.save.bind( this )}>{"next "}<i className="fa fa-arrow-right"></i></button>

						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className="btn btn-primary btn-sm pull-right"
							onClick={( ) => this.props.onPrevious( )}><i className="fa fa-arrow-left"></i>{" Previous"}</button>
					</div>
				</div>
				<div className="row" style={{
					marginTop: "3%"
				}}>
					<div className="col-xs-5 col-md-4">
						<h4>{'General '}</h4>
					</div>
					<div className="col-xs-7 col-md-8">
						<a
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className={this.state.success === true
							? "btn btn-primary btn-sm pull-right"
							: "btn btn-primary btn-sm pull-right disabled"}
							href={`/apps/cartoview_story_map/${ this.props.id }/view/`}>
							View
						</a>

						<a
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
							className={this.state.success === true
							? "btn btn-primary btn-sm pull-right"
							: "btn btn-primary btn-sm pull-right disabled"}
							href={`/apps/appinstance/${ this.props.id }/`}
							target={"_blank"}>
							Details
						</a>

						<button
							style={{
							display: "inline-block",
							margin: "0px 3px 0px 3px"
						}}
                            disabled={this.state.loading}
							className={this.state.success === true
							? "btn btn-primary btn-sm pull-right disabled"
							: "btn btn-primary btn-sm pull-right"}
							onClick={this.save.bind( this )}>
                            
                             { this.state.loading?'saving':'save'}
                            { this.state.loading&&<CircularProgress size={20}/>}
               
                            
                            </button>

						<p
							style={this.state.success == true
							? {
								display: "inline-block",
								margin: "0px 3px 0px 3px",
								float: "right"
							}
							: {
								display: "none",
								margin: "0px 3px 0px 3px",
								float: "right"
							}}>App instance successfully created!</p>
					</div>
				</div>
				<hr></hr>
              
                {!loading && <Form
                    ref={(form) => this.form = form}
                    type={formConfig}
                    value={value}
                    onChange={this.onChange}
                    />}
            </div>
        )
    }
}

