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
class EditForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formValue: this.props.featureEdit.getProperties(),
            success: false,
            id: this.props.featureEdit.getProperties()['featureIndex'],
            geometry: { name: "the_geom", srsName: "EPSG:3857", x: -11684820.440542927, y: 4824883.141910212 }
        }

    }

    WFS = new WFSClient(this.props.urls)
    componentDidMount() {

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
    save = () => {

        this.WFS.updateFeature(this.props.config.layer, this.state.id, this.state.formValue).then(res =>
            res.text()).then((res) => {
                this.setState({ success: true }, this.props.back())
            }).catch((error) => {
                throw Error(error)
            })
        this.props.handleOpen("Feature updated Successfully")
        this.props.handleSwitch()
        this.props.back()
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
                            if (feature.localType != "boolean" && feature.localType != "Point" && feature.localType != "dateTime") {
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
                    <Button raised color="primary" onClick={this.save} className={classes.button} style={{ float: "right" }}>
                        Save
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
