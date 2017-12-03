import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { PropsTable, Slider } from './statelessComponents'
import Button from 'material-ui/Button'
import Collapsible from './CollapsibleItem'
import CommentsList from './CommentsList'
import Divider from 'material-ui/Divider'
import ImageDialog from './ImageUploadDialog'
import { Message } from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
import Hidden from 'material-ui/Hidden'
import { commentsPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui-icons/ArrowBack';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import WFSClient from '../../utils/WFSClient.jsx'
import { getCRSFToken } from '../../helpers/helpers.jsx'
import WFS from 'ol/format/wfs';
import URLS from '../../containers/URLS'
import Feature from 'ol/feature';
import ol from 'openlayers'
import { transactWFS } from '../../containers/staticMethods'
import { CircularProgress } from 'material-ui/Progress'
import StarIcon from 'material-ui-icons/Star';
import TriangleIcon from 'material-ui-icons/ChangeHistory';
import SquareIcon  from 'material-ui-icons/Stop'
import CrossIcon from 'material-ui-icons/Add'
import CircleIcon from 'material-ui-icons/FiberManualRecord';
import Select from 'material-ui/Select';
import XICon from 'material-ui-icons/Clear'
import MaterialColorPicker from 'react-material-color-picker';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import GeoCodeSearchInput from './SearchInput';
import ColorPicker from 'material-ui-color-picker';
import { MenuItem } from 'material-ui/Menu';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';
const styles = theme => ({
    root: {
        background: theme.palette.background.paper,
        padding: theme.spacing.unit * 2
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: "80%",
        marginLeft: "10%",
        height: "auto",

    },
    loadingCenter: {
        textAlign: 'center'
    },
    pagination: {
        [theme.breakpoints.down('md')]: {
            marginBottom: 40,
        },
    },
    searchMargin: {
        marginBottom: theme.spacing.unit * 2
    },
    flex: {
        flex: 1
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
         width: '100%'
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
     formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})
class EditForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formValue: this.props.editedFeature ? this.props.editedFeature.getProperties() : this.props.featureEdit.getProperties(),
            success: false,
            loading: false,
            markershape:this.props.featureEdit.getProperties()['markershape'],
            markercolor:this.props.featureEdit.getProperties()['markercolor'],
            numberscolor:this.props.featureEdit.getProperties()['numberscolor'],
            id: this.props.featureEdit.getProperties()['featureIndex'],
            geometry: { name: "the_geom", srsName: "EPSG:3857", x: -11684820.440542927, y: 4824883.141910212 },
            markerColorOpen:false,
            numberColorOpen:false
        }
        this.WFS = new WFSClient(this.props.urls)
    }

    componentDidMount() {

    }
      handleShape = (event) =>{
     
    this.setState({ markershape: event.target.value });
     this.state.formValue['markershape']=event.target.value
  };
    getType = (type) => {
        var result = ""
        if (type == "string") { result = "" }
        else if (type == "int" || type == 'long' || type == 'double') { result = "number" }
        else if (type == "date-time") {
            result = "datetime-local"
        }
        return result
    }
    handleChange = attr => event => {
        this.state.formValue[attr] = event.target.value

    }
    handleMarkerColorOpen = () => {
    this.setState({ markerColorOpen: true });
  };

  handleMarkerColorClose = () => {
    this.setState({ markerColorOpen: false });
  };
  handleNumberColorOpen = () => {
    this.setState({ numberColorOpen: true });
  };

  handleNumberColorClose = () => {
    this.setState({ numberColorOpen: false });
  };
    save = () => {
         this.setState({ loading: true })
        // var feature = this.props.editedFeature ? this.props.editedFeature : this.props.featureEdit
        // var coordinate = feature.getGeometry().getCoordinates();
        // feature.getGeometry().transform(this.props.mapProjection, "EPSG:" + this.props.crs)
        // feature.setGeometryName("the_geom")
        // console.log(coordinate)
        // var newFeature = new ol.Feature({
        //     geom: new ol.geom.Point([coordinate[0], coordinate[1]]),
        //     geometryName: 'the_geom'
        // })
        // Object.keys(this.state.formValue).map(property => {
        //     if (property != 'geometry' && property != 'featureIndex') {
        //         feature.set(property, this.state.formValue[property])
        //         newFeature.set(property, this.state.formValue[property])
        //     }
        // })
        
        // console.log(this.props.mapProjection, "EPSG:" + this.props.crs)
      
        // feature.unset("featureIndex")
        // //feature.unset('geometry')
        // var xml = transactWFS("update", feature, props.layername, this.props.crs)
        // var proxy_urls = new URLS(urls)
        // const proxiedURL = proxy_urls.getProxiedURL(urls.wfsURL)
        // return fetch(proxiedURL, {
        //     method: 'POST',
        //     body: xml,
        //     credentials: 'include',
        //     headers: new Headers({
        //         'Content-Type': 'text/xml',
        //         "X-CSRFToken": getCRSFToken()
        //     })
        // }).then((res) => {
        //     this.setState({ success: true })
        //     this.props.handleOpen("Feature updated Successfully")
        //     this.props.handleSwitch()
        //     this.props.back()
        //     this.setState({ loading: false })
        //     // feature.set("featureIndex",++this.props.features.length)
        //     this.props.refreshMapEdit(feature)
        //     // return res.json()
        // }).catch((error) => {
        //     throw Error(error)
        // })
        //-----------------------------------------------------------------------------
        var feature = this.props.editedFeature ? this.props.editedFeature : this.props.featureEdit
        var coordinate = feature.getGeometry().getCoordinates();
        const geometry = this.props.geometry?this.props.geometry:{
            name: 'the_geom',
            srsName: "EPSG:"+this.props.crs,
            x: coordinate[0],
            y: coordinate[1]
        }
            Object.keys(this.state.formValue).map(property => {
                    if (property != 'geometry' && property != 'featureIndex') {
                        feature.set(property, this.state.formValue[property])
                       
                    }
                })
               feature.set('markershape',this.state.markershape) 
            this.WFS.updateFeature(props.layername, feature.getId(), this.state.formValue,geometry).then(res =>
            res.text()).then((res) => {
                this.setState({ success: true })
         
            
                
                  this.props.handleOpen("Feature edited Successfully")
                //   this.props.handleSwitch()
                this.props.back()
                  this.props.refreshMapEdit(feature)
                  
            }).catch((error) => {
                throw Error(error)
            })
    }
handleColor(value,color){
        this.setState({[value]:color.target.value})
        this.state.formValue[value]=color.target.value
        this.handleMarkerColorClose()
        this.handleNumberColorClose()
    }

    render() {
        const vertical = 'bottom', horizontal = 'center'
        const {
            selectedFeature,
            searchFilesById,
            classes,
            back,
            searchCommentById,
            addComment,
            username,
            SaveImageBase64,
            featureTypes
        } = this.props
        return (
            <div>

                <Hidden smDown>
                    <IconButton className={classes.button} aria-label="Delete" onClick={() => back()} >
                        <BackIcon />
                    </IconButton>
                </Hidden>
                <div>
                    {
                        featureTypes && featureTypes.map((feature, i) => {
                            if (feature.localType != "boolean" && feature.localType != "Point" && feature.localType != "dateTime" && feature.name != "order"&&feature.name != "order" && feature.name != "imageurl" && feature.name != "markercolor" && feature.name != "markershape" && feature.name != "numberscolor") {
                                return <TextField key={i}
                                    fullWidth
                                    required={!feature.nillable}
                                    type={this.getType(feature.localType)}
                                    id={feature.name}
                                    defaultValue={this.props.featureEdit.getProperties()[feature.name]}
                                    label={feature.name}
                                    className={classes.textField}
                                    onChange={this.handleChange(feature.name)}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            }
                            else if (feature.localType == "boolean") {
                                return <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={"true"}
                                            onChange={this.handleChange(feature.name)}
                                            value="checkedA"
                                        />
                                    }
                                    label={feature.name}
                                />

                            }
                        })
                    }

<FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Marker Shape</InputLabel>
                <Select
                    value={"this.state.markershape"}
                    onChange={(e)=>this.handleShape(e)}
                    input={<Input id="age-simple" />}
                >
            
                        <MenuItem value={'circle'}><CircleIcon/> circle</MenuItem>
                        <MenuItem value={'triangle'}><TriangleIcon/>triangle</MenuItem>
                        <MenuItem value={'square'}><SquareIcon/> square</MenuItem>
                        <MenuItem value={'star'}><StarIcon/> star</MenuItem>
                        <MenuItem value={'cross'}><CrossIcon/> cross</MenuItem>
                        <MenuItem value={'X'}><XICon/> x</MenuItem>
                </Select>
        </FormControl>    
   


<br/>



<div style={{display:"flex"}}>
       <label style={{ "flexGrow": "1" }} className="lab">Marker color</label> <Button onClick={this.handleMarkerColorOpen} style={{minWidth:0,padding:3}}> <div className="box" style={{backgroundColor:this.state.markercolor}}></div></Button>
        <Dialog open={this.state.markerColorOpen} onRequestClose={this.handleMarkerColorClose}>
          <DialogTitle>{"Please choose a color for the marker"}</DialogTitle>
          <DialogContent>

          <MaterialColorPicker 
    initColor={this.state.markercolor}
    onSubmit={(color)=> this.handleColor('markercolor',color)}
    onReset={console.log("s")}
    style={{width: 300, backgroundColor: '#c7c7c7'}}
    submitLabel='Apply'
    resetLabel='Undo'
/>
          </DialogContent>
         
        </Dialog>
      </div>

<br/>
<Divider/>






 <div style={{display:"flex"}}>
     <label style={{ "flexGrow": "1" }} className="lab"> Numbers on Marker color</label><Button onClick={this.handleNumberColorOpen} style={{minWidth:0,padding:3}}> <div className="box" style={{backgroundColor:this.state.numberscolor}}></div></Button>
        <Dialog open={this.state.numberColorOpen} onRequestClose={this.handleNumberColorClose}>
          <DialogTitle>{"Please choose a color for the numbers on marker"}</DialogTitle>
          <DialogContent>



          <MaterialColorPicker 
    initColor={this.state.numberscolor}
    onSubmit={(color)=> this.handleColor('numberscolor',color)}
    onReset={console.log("s")}
    style={{width: 300, backgroundColor: '#c7c7c7'}}
    submitLabel='Apply'
    resetLabel='Undo'
/>

</DialogContent>
         
        </Dialog>
</div>



 
  
</div>
       
        <div>
        <Button disabled={this.state.loading} raised color="primary" onClick={this.save} className={classes.button} style={{ float: "right" }}>
            {this.state.loading ? 'saving' : 'save'}
            {this.state.loading && <CircularProgress size={20} />}
        </Button>
        </div>
                <div className={classes.textCenter}>

                </div>

            </div>
        )
    }
}
// ItemDetails.propTypes = { ...commentsPropTypes,
// searchFilesById: PropTypes.func.isRequired,
// back: PropTypes.func.isRequired,
// searchCommentById: PropTypes.func.isRequired,
// username: PropTypes.string.isRequired,
// SaveImageBase64: PropTypes.func.isRequired,
// }
export default withStyles(styles)(EditForm)
