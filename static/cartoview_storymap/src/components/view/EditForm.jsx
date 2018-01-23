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
import SquareIcon from 'material-ui-icons/Stop'
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
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import DeleteIcon from 'material-ui-icons/Delete';
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
            markershape: this.props.featureEdit.getProperties()['markershape'],
            markercolor: unescape(this.props.featureEdit.getProperties()['markercolor']),
            numberscolor: unescape(this.props.featureEdit.getProperties()['numberscolor']),
            imageurl: this.props.featureEdit.getProperties()['imageurl'],
            imageid: this.props.featureEdit.getProperties()['imageid'],
            id: this.props.featureEdit.getProperties()['featureIndex'],
            geometry: { name: "the_geom", srsName: "EPSG:3857", x: -11684820.440542927, y: 4824883.141910212 },
            markerColorOpen: false,
            numberColorOpen: false,
            fileName: "",
            fileId: "",
            id: null,
            clicked: false,
            DeleteOpen: false,
        }
        this.WFS = new WFSClient(this.props.urls)
    }
    componentDidMount() {
        Object.keys(this.state.formValue).map(property => {
            if (property != 'geometry' && property != 'featureIndex') {
                // feature.set(property, unescape(this.state.formValue[property]))
                this.state.formValue[property] = unescape(this.state.formValue[property])
                if (property == 'markercolor' || property != 'numberscolor') { this.state.formValue[property] = this.state.formValue[property] }
            }
        })
        this.state.formValue['markercolor'] = this.state.markercolor
        this.setState({ formValue: this.state.formValue })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.attachments) {
            if (nextProps.attachments.file) {
                this.setState({ fileName: nextProps.attachments.file, fileId: nextProps.attachments.file })
            }
            else { this.setState({ fileName: nextProps.attachments[1].file, fileId: nextProps.attachments[1].id }) }
        }
    }
    handleShape = (event) => {

        this.setState({ markershape: event.target.value });
        this.state.formValue['markershape'] = event.target.value
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
    deletePhoto = () => {

        this.setState({ DeleteOpen: true })
    }
    handleDeleteClickOpen = () => {
        this.setState({ DeleteOpen: true });
    };
    handleDeleteClose = () => {
        this.setState({ DeleteOpen: false });
    };
    deleteRequest = () => {
        var feature = this.props.editedFeature ? this.props.editedFeature : this.props.featureEdit
        this.setState({ fileName: "", fileId: null })
        this.setState({ id: feature.getProperties()['imageid'] })
        feature.set("imageurl", )
        this.state.formValue['imageurl'] = null
        this.state.formValue['imageid'] = null
        var feature = this.props.editedFeature ? this.props.editedFeature : this.props.featureEdit
        var id = feature.getProperties()['imageid']
        const url = urls.attachmentDeleteUrl(props.typename, this.state.id)
        return fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'text/xml',
                "X-CSRFToken": getCRSFToken()
            })
        }).then((res) => {
            this.setState({ DeleteOpen: false })
        })
    }
    save = () => {
        this.setState({ loading: true })
        var feature = this.props.editedFeature ? this.props.editedFeature : this.props.featureEdit
        var coordinate = feature.getGeometry().getCoordinates();
        const geometry = this.props.geometry ? this.props.geometry : {
            name: 'the_geom',
            srsName: "EPSG:" + this.props.crs,
            x: coordinate[0],
            y: coordinate[1]
        }
        Object.keys(this.state.formValue).map(property => {
            if (property != 'geometry' && property != 'featureIndex') {
                feature.set(property, unescape(this.state.formValue[property]))

                if (property == 'markercolor' || property != 'numberscolor') {
                    this.state.formValue[property] = this.state.formValue[property]
                }

            }
        })
        if (this.state.clicked == true && this.state.fileName != "") {

            feature.set('imageurl', this.state.fileName)
            this.state.formValue["imageurl"] = this.state.fileName
            this.state.formValue["imageid"] = this.state.fileId

        }
        feature.set('markershape', this.state.markershape)
        this.WFS.updateFeature(props.layername, feature.getId(), this.state.formValue, geometry).then(res =>
            res.text()).then((res) => {
                this.setState({ success: true })
                this.props.back()
            }).catch((error) => {
                throw Error(error)
            })
    }
    handleColor(value, color) {
        this.setState({ [value]: color.target.value })
        this.state.formValue[value] = color.target.value
        this.handleMarkerColorClose()
        this.handleNumberColorClose()
    }
    click = () => {
        this.setState({ clicked: true })
    }
    render() {
        console.log(this.props.editedFeature,this.props.featureEdit.getProperties()["imageurl"] )
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
            getImageFromURL,
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
                    <TextField
                        fullWidth
                        defaultValue={unescape(this.props.featureEdit.getProperties()['title'])}
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
                        defaultValue={unescape(this.props.featureEdit.getProperties()["description"])}
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
                        defaultValue={unescape(this.props.featureEdit.getProperties()["link"])}
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
                        </Select>
                    </FormControl>
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
                        <label style={{ "flexGrow": "1" }} className="lab">  Marker Label's Color</label><Button onClick={this.handleNumberColorOpen} style={{ minWidth: 0, padding: 3 }}> <div className="box" style={{ backgroundColor: this.state.numberscolor }}></div></Button>
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
                {this.props.featureEdit.getProperties()["imageurl"] && this.props.featureEdit.getProperties()["imageurl"] != "null" &&
                    <Card style={{ margin: "10px" }} className={classes.card}>
                        <div className={"row"} style={{ display: "flex" }}>
                            <div style={{ flex: 1 }}>
                                <CardHeader


                                    subheader="Edit photo"
                                />
                            </div>
                            <div> <IconButton>
                                <DeleteIcon onClick={() => this.deletePhoto()} />
                            </IconButton></div>
                        </div>
                        <div>
                            <img
                                className={classes.media}
                                style={{ width: "100%" }}
                                src={this.props.featureEdit.getProperties()["imageurl"]}

                            />
                        </div>
                    </Card>
                }
                { !this.props.featureEdit.getProperties()["imageurl"] &&
                    <div onClick={() => this.click()}>
                        <Slider attachments={[]} />
                        <ImageDialog onClick={() => this.click} getImageFromURL={getImageFromURL} SaveImageBase64={SaveImageBase64} featureId={this.props.features.length + 1} />
                    </div>}
                
                <div>
                    <Button disabled={this.state.loading} raised color="primary" onClick={this.save} className={classes.button} style={{ float: "right" }}>
                        {this.state.loading ? 'saving' : 'save'}
                        {this.state.loading && <CircularProgress size={20} />}
                    </Button>
                </div>
                <div>
                    <Button raised color="primary" onClick={() => back()} className={classes.button} style={{ marginLeft: "150px" }} >Cancel</Button>
                </div>
                <div className={classes.textCenter}>
                </div>
                <Dialog
                    open={this.state.DeleteOpen}
                    onClose={this.handleDeleteClose}

                >
                    <DialogTitle id="alert-dialog-title">{"are you sure you want to delete this photo?"}</DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDeleteClose} color="primary">
                            Cancel
            </Button>
                        <Button onClick={this.deleteRequest} color="primary" autoFocus>
                            Delete
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(styles)(EditForm)