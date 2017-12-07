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
import URLS from '../../containers/URLS';
import Feature from 'ol/feature';
import ol from 'openlayers'
import { CircularProgress } from 'material-ui/Progress'
import { transactWFS } from '../../containers/staticMethods'
import Switch from 'material-ui/Switch';
import GeoCodeSearchInput from './SearchInput';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import StarIcon from 'material-ui-icons/Star';
import TriangleIcon from 'material-ui-icons/ChangeHistory';
import SquareIcon from 'material-ui-icons/Stop'
import CrossIcon from 'material-ui-icons/Add'
import CircleIcon from 'material-ui-icons/FiberManualRecord';
import Select from 'material-ui/Select';
import XICon from 'material-ui-icons/Clear'
import MaterialColorPicker from 'react-material-color-picker';
import Radio, { RadioGroup } from 'material-ui/Radio';


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
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
})
class addForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formValue: {},
            success: false,
            loading: false,
            fileName: "",
            fileId:"",
            clicked: false,
            coordinates: false,
            markercolor: "#000000",
            numberscolor: "#ffffff",
            markershape: "circle",
            shapeMenuOpen: false,
            locationAddress: true,
            locationMap: '',
            markerColorOpen: false,
            numberColorOpen: false,
            onAddress:true

        }

        //console.log(this.props)
    }
    WFS = new WFSClient(this.props.urls)

    componentWillReceiveProps(nextProps) {
      
        if (nextProps.attachments) {

            if (nextProps.attachments.file) {
                this.setState({ fileName: nextProps.attachments.file,fileId:nextProps.attachments.file })
            }
            else { this.setState({ fileName: nextProps.attachments[1].file,fileId:nextProps.attachments[1].id }) }
        }
    }
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

    sendRequest = () => {
        this.setState({ loading: true })
        var feature = this.props.newFeature

        Object.keys(this.state.formValue).map(property => {
            feature.set(property, this.state.formValue[property])
        })
        feature.set("order", this.props.features.length+1)
        feature.set("imageurl", this.state.fileName)
        feature.set("imageid", this.state.fileId)
        feature.set("markercolor", this.state.markercolor)
        feature.set("numberscolor", this.state.numberscolor)
        feature.set("markershape", this.state.markershape)
        //console.log(feature)
        feature.getGeometry().transform(this.props.mapProjection, "EPSG:" + this.props.crs)
        var xml = transactWFS("insert", this.props.newFeature, props.layername, this.props.crs)
        var proxy_urls = new URLS(urls)
        const proxiedURL = proxy_urls.getProxiedURL(urls.wfsURL)
        return fetch(proxiedURL, {
            method: 'POST',
            body: xml,
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'text/xml',
                "X-CSRFToken": getCRSFToken()
            })
        }).then((res) => {
            this.setState({ success: true })
            // this.props.handleSwitch()
            this.props.handleOpen("Feature created Successfully")
            this.props.removeLocation()
             this.props.back()
            this.cancel()
            this.setState({ loading: false })
            feature.set("featureIndex", ++this.props.features.length)
            this.props.refreshMap(feature)

        }).catch((error) => {
            throw Error(error)
        })
    }
    save = () => {


        while (true) {
            if (this.state.clicked == true && this.state.fileName != "") {
                this.sendRequest()
                break
            }

            else if (this.state.clicked == false) {
                this.sendRequest()
                break
            }
        }
    }
    locationOnMap = (event) => {

        this.setState({ checked: event.target.checked })
        if (event.target.checked) {
            this.props.showCurrentLocation()
            this.props.getLocation()
        } else {
            this.props.hideCurrentLocation()
            this.props.removeLocation()
        }

    }
    zoomToLocation = (pointArray) => {
        //console.log(pointArray)
        var center = ol.proj.transform(pointArray, "EPSG:4326",
            this.props.map.getView().getProjection())
        //console.log(center)
        // this.setState({coordinates:center})
        this.props.getLocation(center[0], center[1])

    }
    cancel = () => {
        // this.props.handleSwitch()
        this.props.removeLocation()
        // this.props.hideCurrentLocation()
        this.props.back()
        this.props.hideAddPanel()
    }
    click = () => {
        this.setState({ clicked: true })
    }
    geolocation = () => {
        //console.log("geo")
        var map = this.props.map
        // create a Geolocation object setup to track the position of the device
        var geolocation = new ol.Geolocation({
            tracking: true,
            projection: 'EPSG:3857'
        });
        geolocation.on('change', (evt) => {
            //console.log(geolocation.getPosition());
            this.props.removeLocation()
            this.props.getLocation(geolocation.getPosition()[0], geolocation.getPosition()[1])
            this.setState({ geolocation })
        })

        this.props.getLocation(this.state.geolocation.getPosition()[0], this.state.geolocation.getPosition()[1])

    }
    handleShape = (event) => {
        //console.log("sss",event.target.value )
        this.setState({ markershape: event.target.value });
    };
    handleColor(value, color) {
        //console.log(value,color.target.value)
        this.setState({ [value]: color.target.value })
        this.handleMarkerColorClose()
        this.handleNumberColorClose()
    }
    handleChangeLocation = (event, value) => {
        if (value=='onAddress'){
        this.setState({onAddress:true})
        }else{this.setState({onAddress:false})}
        this.setState({ locationMap: value });
        if (value == 'onMap') {
            //console.log("on map")
            //  this.props.showCurrentLocation()
            this.props.getLocation()
        } else if(value=='current') {
            // this.props.hideCurrentLocation()
            // this.props.removeLocation()
            this.geolocation()
        }
    };
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
            featureTypes,
            getImageFromURL
        } = this.props
        return (
            <div>

                <IconButton className={classes.button} aria-label="Delete" onClick={() => this.cancel()} >
                    <BackIcon />
                </IconButton>

                <div>
                    
                        
                            <TextField 
                                    fullWidth
           
                                
                                    label={"Title"}
                                    className={classes.textField}
                                    onChange={this.handleChange("title")}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField 
                                    fullWidth
           
                                
                                    label={"Description"}
                                    className={classes.textField}
                                    onChange={this.handleChange("description")}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                <TextField 
                                    fullWidth
           
                                   
                                    label={"Link"}
                                    className={classes.textField}
                                    onChange={this.handleChange("link")}
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                                
                     
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-simple">Marker Shape</InputLabel>
                        <Select

                            value={this.state.markershape}
                            onChange={(e) => this.handleShape(e)}
                            input={<Input id="age-simple" />}
                        >

                            <MenuItem value={'circle'}><CircleIcon /> circle</MenuItem>
                            <MenuItem value={'triangle'}><TriangleIcon />triangle</MenuItem>
                            <MenuItem value={'square'}><SquareIcon /> square</MenuItem>
                            <MenuItem value={'star'}><StarIcon /> star</MenuItem>
                            <MenuItem value={'cross'}><CrossIcon /> cross</MenuItem>
                            <MenuItem value={'X'}><XICon /> x</MenuItem>
                            {/* <MenuItem value={'food'}><img style={{width:"30px",height:"30px"}} src={urls.static + 'cartoview_storymap/blue-restourant.png'}/>Food</MenuItem> */}
                        </Select>
                    </FormControl>
                    <div className={'color-picker'}>




                        <br />

                        <div style={{ display: "flex" }}>
                            <label style={{ "flexGrow": "1" }} className="lab">Marker's color</label> <Button onClick={this.handleMarkerColorOpen} style={{ minWidth: 0, padding: 3 }}> <div className="box" style={{ backgroundColor: this.state.markercolor }}></div></Button>
                            <Dialog open={this.state.markerColorOpen} onRequestClose={this.handleMarkerColorClose}>
                                <DialogTitle>{"Please choose a color for the marker"}</DialogTitle>
                                <DialogContent>

                                    <MaterialColorPicker
                                        initColor={this.state.markercolor}
                                        onSubmit={(color) => this.handleColor('markercolor', color)}
                                        onReset={this.handleMarkerColorClose}
                                        style={{ width: 300, backgroundColor: '#c7c7c7' }}
                                        submitLabel='Apply'
                                        resetLabel='Cancel'
                                    />
                                </DialogContent>

                            </Dialog>
                        </div>

                        <br />
                        <Divider />






                        <div style={{ display: "flex" }}>
                            <label style={{ "flexGrow": "1" }} className="lab"> Marker Label's Color</label><Button onClick={this.handleNumberColorOpen} style={{ minWidth: 0, padding: 3 }}> <div className="box" style={{ backgroundColor: this.state.numberscolor }}></div></Button>
                            <Dialog open={this.state.numberColorOpen} onRequestClose={this.handleNumberColorClose}>
                                <DialogTitle>{"Please choose a color for the numbers on marker"}</DialogTitle>
                                <DialogContent>



                                    <MaterialColorPicker
                                        initColor={this.state.numberscolor}
                                        onSubmit={(color) => this.handleColor('numberscolor', color)}
                                        onReset={this.handleNumberColorClose}
                                        style={{ width: 300, backgroundColor: '#c7c7c7' }}
                                        submitLabel='Apply'
                                        resetLabel='Cancel'
                                    />

                                </DialogContent>

                            </Dialog>
                        </div>
                    </div>
                    <br />
                    <Divider />
                    <div onClick={() => this.click()}>
                        <Slider attachments={[]} />
                        <ImageDialog onClick={() => this.click} getImageFromURL={getImageFromURL} SaveImageBase64={SaveImageBase64} featureId={this.props.features.length + 1} />
                    </div>
                    <Divider />

                   
                

                    <br />

           
                        <div>

                            <FormControl component="fieldset" required className={classes.formControl}>
                                <RadioGroup

                                    name="location"
                                    className={classes.group}
                                    value={this.state.locationMap}
                                    onChange={this.handleChangeLocation}

                                >   
                       
                                      <FormControlLabel value="onAddress" control={<Radio />} label={  <GeoCodeSearchInput search={this.props.geocodeSearch} action={this.zoomToLocation} /> }/> 
                                    
                                                                
                                    <FormControlLabel value="onMap" control={<Radio />} label="add location on map" />
                                    <FormControlLabel value="current" control={<Radio />} label="add my current location" />
                                </RadioGroup>
                            </FormControl>


                        </div>
                    <div>

                        <Button disabled={this.state.loading || (!this.props.newFeature && !this.state.coordinates)} raised color="primary" onClick={this.save} className={classes.button} style={{ "float": "right" }} >

                            {this.state.loading ? 'saving' : 'save'}
                            {this.state.loading && <CircularProgress size={20} />}
                        </Button>
                    <Button  raised color="primary" onClick={()=>this.cancel()} className={classes.button} style={{marginLeft:"150px"}} >Cancel</Button>


                    </div>
                </div>
                <div className={classes.textCenter}>

                </div>

            </div>
        )
    }
}

export default withStyles(styles)(addForm)