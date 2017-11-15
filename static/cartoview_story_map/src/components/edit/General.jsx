// import 'react-select/dist/react-select.css'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import t from 'tcomb-form'

const filter = t.struct({
    type: t.String,
    name: t.String
})
const Color = t.enums({
    bluemarker: 'Blue',
    yellowmarker: 'Yellow',
    blackmarker: 'Black',
    redmarker: 'Red'
});
const formConfig = t.struct({
    // layer: t.String,
    title: t.String,
    abstract: t.String,
    // subtitleAttribute: t.maybe(t.String),
    // filters: t.maybe(t.String),
    // description:t.maybe(t.String),
    // pagination: t.String,
    color: Color,
    DisplayNumbersOnMarkers: t.maybe(t.Boolean),
    // enableImageListView: t.Boolean

    zoomOnClick: t.maybe(t.Boolean)
})
const Form = t.form.Form
const getPropertyFromConfig = (config, property, defaultValue) => {
    // const propertyValue = config[property] ? config[property] : defaultValue
    // const nestedPropertyValue = config.config && config.config[property] ?
    //     config.config[property] : propertyValue
    // return nestedPropertyValue
}
export default class General extends Component {
    constructor(props) {
        super(props)
        const { config } = this.props
     
        this.state = {

            value: {
                title: this.props.general&&this.props.general.title?this.props.general.title:null,
                abstract: this.props.general&&this.props.general.abstract?this.props.general.abstract:null,
                DisplayNumbersOnMarkers:this.props.general&& this.props.general.DisplayNumbersOnMarkers?this.props.general.DisplayNumbersOnMarkers:null,
                color: this.props.general&&this.props.general.color?this.props.general.color:null,
                zoomOnClick: this.props.general&&this.props.general.zoomOnClick?this.props.general.zoomOnClick:null,
            },
            attributeOptions: [],
            attributes: [],
            loading: false
        }
     
    }


    componentDidMount() {

    }
    save = () => {
        const value = this.form.getValue()
        if (value) {
            this.props.onComplete({
                config: {
                    ...value
                }
            })
        }
    }

    getFormOptions = () => {
        let {
            attributeOptions,
        } = this.state
        const options = {
            fields: {
                //     layer: {
                //         factory: t.form.Select,
                //         nullOption: { value: '', text: 'Choose Layer' },
                //         options: this.getLayerOptions()
                //     },
                //     titleAttribute: {
                //         factory: t.form.Select,
                //         nullOption: { value: '', text: 'Choose Title Attribute' },
                //         options: attributeOptions
                //     },
                //     subtitleAttribute: {
                //         label: "Subtitle Attribute (optional)",
                //         factory: t.form.Select,
                //         nullOption: { value: '', text: 'Choose subTitle Attribute' },
                //         options: attributeOptions
                //     },
                //     description:{
                //         label: "Description Attribute (optional)",
                //         factory: t.form.Select,
                //         nullOption: { value: '', text: 'Choose Description Attribute' },
                //         options: attributeOptions
                //     },

                //     filters: {
                //         factory: t.form.Select,
                //         nullOption: { value: '', text: 'Choose Search Attribute' },
                //         options: attributeOptions
                //     },
                // pagination: {
                //     factory: t.form.Select,
                //     nullOption: { value: '', text: 'Choose number of Features' },
                //     options: [
                //         { value: '10', text: "10" },
                //         { value: '20', text: "20" },
                //         { value: '40', text: "40" },
                //         { value: '80', text: "80" }
                //     ]
                // } 
                color: {
                    label: "Marker Color"
                }
            }
        }
        return options
    }
    render() {
        let {
            loading,
            value
        } = this.state
        const options = this.getFormOptions()
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
							className={this.state.success === true
							? "btn btn-primary btn-sm pull-right disabled"
							: "btn btn-primary btn-sm pull-right"}
							onClick={this.save.bind( this )}>Save</button>

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
                    options={options} />}
                {loading && < Spinner name="line-scale-pulse-out" color="steelblue" />}
            </div>
        )
    }
}

