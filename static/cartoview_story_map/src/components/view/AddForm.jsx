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
import URLS from '../../containers/URLS'
import Feature from 'ol/feature';
import ol from 'openlayers'
import { CircularProgress } from 'material-ui/Progress'
import { transactWFS } from '../../containers/staticMethods'

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
        // width: 200,
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
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
            clicked: false
        }

        console.log(this.props)
    }
    WFS = new WFSClient(this.props.urls)

    componentWillReceiveProps(nextProps) {
        if (nextProps.attachments) {

            this.setState({ fileName: nextProps.attachments.file })
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
        feature.set("order", this.props.features.length + 1)
        feature.set("imageurl", this.state.fileName)
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
            this.props.handleSwitch()
            this.props.handleOpen("Feature created Successfully")
            this.props.back()
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

    cancel = () => {
        this.props.handleSwitch()
        this.props.removeLocation()

    }
    click = () => {
        this.setState({ clicked: true }, console.log("clicked true"))
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
            featureTypes,
            getImageFromURL
        } = this.props
        return (
            <div>
                <Hidden smDown>
                    <IconButton className={classes.button} aria-label="Delete" onClick={() => this.cancel()} >
                        <BackIcon />
                    </IconButton>
                </Hidden>
                <div>
                    {
                        featureTypes && featureTypes.map((feature, i) => {

                            if (feature.localType != "boolean" && feature.localType != "Point" && feature.localType != "dateTime" && feature.name != "order" && feature.name != "imageurl") {
                                return <TextField key={i}
                                    fullWidth
                                    required={!feature.nillable}
                                    type={this.getType(feature.localType)}
                                    id={feature.name}
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

                    <div onClick={() => this.click()}>
                        <Slider attachments={[]} />
                        <ImageDialog onClick={() => this.click} getImageFromURL={getImageFromURL} SaveImageBase64={SaveImageBase64} featureId={this.props.features.length + 1} />
                    </div>

                    <Button disabled={this.state.loading} raised color="primary" onClick={this.save} className={classes.button} style={{ "float": "right" }} >

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

export default withStyles(styles)(addForm)
