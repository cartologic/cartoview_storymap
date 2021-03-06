// import 'react-select/dist/react-select.css'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import t from 'tcomb-form'
import { CircularProgress } from 'material-ui/Progress'

const title_length = t.refinement(t.String, (n) => {
  if (n.length < 50){
      return true
  } else {
      return false
  }
})
title_length.getValidationErrorMessage = (value) => {
  if (!value) {
      return 'Required'
  } else {
      return 'Title too long'
  }
}

const filter = t.struct({
    type: t.String,
    name: t.String
})
const formConfig = t.struct({
    title: title_length,
    abstract: t.String,
    DisplayNumbersOnMarkers: t.maybe(t
.Boolean),
    zoomOnClick: t.maybe(t.Boolean)
})
const options = {
  fields: {
    
      title:{label:"Title*"},
      abstract: { type: 'textarea',label: "Abstract*",attrs: {
          rows: 4
       }}
      
  }
};
const Form = t.form.Form
export default class General extends Component {
    constructor(props) {
        super(props)
        const { config } = this.props
     
        this.state = {
            config:{},
            value: {
                title: this.props.general&&this.props.general.title?this.props.general.title:null,
                abstract: this.props.general&&this.props.general.abstract?this.props.general.abstract:null,
                DisplayNumbersOnMarkers:this.props.general&& this.props.general.DisplayNumbersOnMarkers?this.props.general.DisplayNumbersOnMarkers:true,
                zoomOnClick: this.props.general&&this.props.general.zoomOnClick?this.props.general.zoomOnClick:true,
            },
            attributeOptions: [],
            attributes: [],
			loading: false,
			themeColor:this.props.general&& this.props.general.themeColor
			? this.props.general.themeColor
      : "#009688",
      themeColorName:this.props.general&& this.props.general.themeColorName
			? this.props.general.themeColorName
      : "teal",
      
        }
     
    }
    componentWillUnmount(){
      this.next()
   }
   next=()=>{
     const value = this.form.getValue()
    
        if (value) {
        this.state['value']=value
			var val= Object.assign({'themeColor':this.state.themeColor,'themeColorName':this.state.themeColorName}, value);
			this.setState({loading:true})
		
            this.props.onComplete({
                config: {
                    ...val
                }
            })
        }
   }
    save = () => {
      
		const value = this.form.getValue()
    this.setState({loading:true})
        if (value) {
        this.state['value']=value
			var val= Object.assign({'themeColor':this.state.themeColor,'themeColorName':this.state.themeColorName}, value);
			this.setState({loading:true})
		
            this.props.save({
                config: {
                    ...val
                }
            })
        }
    }


    render() {
		const style = {
			backgroundColor: this.state.themeColor,
			borderRadius: "6px",
			width: "inherit",
			height: "25px"
		  }
		 
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
              className="btn btn-primary btn-sm pull-right"
              disabled={this.state.loading}
							onClick={()=>this.save()}>{"Save "}</button>

									</div>
				</div>
				<div className="row" style={{
					marginTop: "3%"
				}}>
					<div className="col-xs-5 col-md-4">
						<h4>{'General '}</h4>
					</div>
				
				</div>
				<hr></hr>
              
               <Form
                    ref={(form) => this.form = form}
                    type={formConfig}
                    value={value}
                    options={options}
                
					/>
					<h5>Select Theme Color</h5>
              <button style={{
                width: "100%"
              }} className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <div style={style}></div>
              </button>

              <ul className="dropdown-menu" aria-labelledby="dropdownMenu1" style={{
                  width: "100%",
                  position:"initial"
                        }}>
                <li style={{
                  width: "100%"
                }}>
                  <div style={{
                    backgroundColor: "#03A9F4",
                    borderRadius: "6px",
                    width: "95%",
                    height: "25px",
                    margin: "2% auto 2% auto"
                  }} onClick={() => {
                    this.state['value']=this.form.getValue()
                    this.setState({themeColor: "#03A9F4",themeColorName: "blue"})
                  }}></div>
                </li>
                <li style={{
                  width: "100%"
                }}>
                  <div style={{
                    backgroundColor: "#009688",
                    borderRadius: "6px",
                    width: "95%",
                    height: "25px",
                    margin: "2% auto 2% auto"
                  }} onClick={() => {
                    this.state['value']=this.form.getValue()
                    this.setState({themeColor: "#009688",themeColorName:"teal"})
                  }}></div>
                </li>
                <li style={{
                  width: "100%"
                }}>
                  <div style={{
                    backgroundColor: "#3f51B5",
                    borderRadius: "6px",
                    width: "95%",
                    height: "25px",
                    margin: "2% auto 2% auto"
                  }} onClick={() => {
                    this.state['value']=this.form.getValue()
                    this.setState({themeColor: "#3f51B5",themeColorName:"purple"})
                  }}></div>
                </li>
                <li style={{
                  width: "100%"
                }}>
                  <div style={{
                    backgroundColor: "#607D8B",
                    borderRadius: "6px",
                    width: "95%",
                    height: "25px",
                    margin: "2% auto 2% auto"
                  }} onClick={() => {
                    this.state['value']=this.form.getValue()
                    this.setState({themeColor: "#607D8B",themeColorName:"blueGrey"})
                  }}></div>
                </li>
              </ul>
            </div>
        )
    }
}

