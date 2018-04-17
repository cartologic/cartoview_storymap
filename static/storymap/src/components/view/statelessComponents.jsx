import List, { ListItem, ListItemText } from 'material-ui/List'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import ReactDOM from 'react-dom'
import Button from 'material-ui/Button'
import { Carousel } from 'react-responsive-carousel'
import CartoviewList from './CartoviewList'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft'
import ChevronRightIcon from 'material-ui-icons/ChevronRight'
import { CircularProgress } from 'material-ui/Progress'
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import Grid from 'material-ui/Grid'
import IconButton from 'material-ui/IconButton'
import Img from 'react-image'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import SendIcon from 'material-ui-icons/Send'
import ErrorIcon from 'material-ui-icons/Error'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import { checkURL } from '../../containers/staticMethods'
import noImage from '../../img/no-img.png'
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import AddIcon from 'material-ui-icons/Add';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import URLS from '../../containers/URLS'
import { getCRSFToken } from '../../helpers/helpers.jsx'
import Snackbar from 'material-ui/Snackbar';
import Dropzone from 'react-dropzone'
import Badge from 'material-ui/Badge';
import Tooltip from 'material-ui/Tooltip';
import { getNameSpacerUri } from '../../containers/staticMethods'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import * as Scroll from 'react-scroll';
import { Link, DirectLink, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import update from 'react-addons-update'
import { transactWFS } from '../../containers/staticMethods'

export const Loader = (props) => {
    const style = { textAlign: 'center' }
    return (
        <div style={style} >
            <CircularProgress size={50} thickness={5} style={style}></CircularProgress>
        </div>
    )
}
export const Message = (props) => {
    const { align, type, message } = props
    return <Typography type={type} align={align || "center"} color="inherit" style={{ flex: 1 }}>{message}</Typography>
}
Message.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string
}



export class FeatureListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            features: this.props.features ? this.props.features : [],
            accessAdd: false,
            accessEdit: false,
            accessDelete: false,
            crs: "",
            openDeleteDialoge: false,
            deletedFeature: {},
            openSnackBar: false,
            loading: false,
            editMode: false,
            alert: true,
            nameSpace:""

        }
        getNameSpacerUri().then((data)=>{this.setState({nameSpace:data})})
    }
    closeAlert = () => {
        this.setState({ alert: false })
    }
    deleteDialogeClickOpen = (feature) => {

        this.setState({ deletedFeature: feature, openDeleteDialoge: true })

    };

    deleteDialogeRequestClose = () => {
        this.setState({ openDeleteDialoge: false });
    };
    deleteFeature = () => {
        this.setState({ loading: true })
        var xml = transactWFS("delete", this.state.deletedFeature, this.state.nameSpace,props.layername, this.props.crs)
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
            this.props.removeFeatureMarker(this.state.deletedFeature)
            var index= this.state.features.indexOf(this.state.deletedFeature)

            let {features}=this.state
            let newFeatures=features
            newFeatures.splice(index,1)

          
            this.setState({ openDeleteDialoge: false, openSnackBar: true, loading: false ,features:newFeatures})
        })

    }
    swapFeature = (f1, f2, i1, i2) => {

        f1.set("order", i2 + 1)
        f2.set("order", i1 + 1)
        f1.unset("featureIndex")
        f1.unset('geometry')
        f2.unset("featureIndex")
        f2.unset('geometry')

        var xml1 = transactWFS("update", f1,this.state.nameSpace, props.layername, this.props.crs)
        var xml2 = transactWFS("update", f2,this.state.nameSpace, props.layername, this.props.crs)
        var proxy_urls = new URLS(urls)
        const proxiedURL = proxy_urls.getProxiedURL(urls.wfsURL)

        return fetch(proxiedURL, {
            method: 'POST',
            body: xml1,
            credentials: 'include',
            headers: new Headers({
                'Content-Type': 'text/xml',
                "X-CSRFToken": getCRSFToken()
            })
        }).then((res) => {

            return fetch(proxiedURL, {
                method: 'POST',
                body: xml2,
                credentials: 'include',
                headers: new Headers({
                    'Content-Type': 'text/xml',
                    "X-CSRFToken": getCRSFToken()
                })
            }).then((res) => {




            }).catch((error) => {
                throw Error(error)
            })


        }).catch((error) => {
            throw Error(error)
        })



    }
    onSortEnd = ({ oldIndex, newIndex }) => {



        const { openDetails } = this.props


        if (oldIndex == newIndex) {
            $('.image-container').removeClass("inFocus").addClass("outFocus");
            $('#id' + newIndex).removeClass("outFocus").addClass("inFocus");
            openDetails({ detailsOfFeature: this.state.features[newIndex] })
        }
        else {
            var firstFeature = this.state.features[oldIndex]
            var secondFeature = this.state.features[newIndex]
            this.swapFeature(firstFeature, secondFeature, oldIndex, newIndex)
        }
        this.setState({
            features: arrayMove(this.state.features, oldIndex, newIndex),
        });
    };
    checkPermissions = (name) => {
     

        { if (props.access){
            props.access.whoCanEditStory && props.access.whoCanEditStory.map((user) => {
                if (user.value == name || loggedUser == owner) {
               this.setState({ accessEdit: true })
                }

            })
        }
  }
    
        {  if (props.access){
            props.access.whoCanSubmitStory && props.access.whoCanSubmitStory.map((user) => {
            
                if (user.value == name || loggedUser == owner) {
                  
                    this.setState({ accessAdd: true })
                }

            })
        }
        { {  if (props.access){
            props.access.whoCanDeleteStory && props.access.whoCanDeleteStory.map((user) => {
                if (user.value == name || loggedUser == owner) {
                this.setState({ accessDelete: true })
                }

            })
        }}}}
        if (loggedUser == owner) {
         
            this.setState({ accessAdd: true, accessEdit: true, accessDelete: true })

        }
    }
    handleCloseSnackBar = () => {
        this.setState({ openSnackBar: false })
    }
    componentDidMount() {
        this.checkPermissions(loggedUser)
        Events.scrollEvent.register('begin',  function(to, element) {
           
          });
      
          Events.scrollEvent.register('end', function(to, element) {
           
          });
      
          scrollSpy.update();
    }
    componentWillReceiveProps(nextProps) {
           
          if(nextProps.zoomedFeature){ 
            
          
       
            
           
           
        }
        this.setState({ features: nextProps.features, crs: nextProps.crs })
    }
    addDefaultSrc = (ev) => {

        ev.target.src = urls.static + 'storymap/img/no-img.png'
    }
    enableEdit = () => {
        this.setState({ editMode: true })
    }
    disableEdit = () => {
        this.setState({ editMode: false })
    }
    render() {


        const vertical = 'bottom', horizontal = 'center'

        const {
            features,
            featuresIsLoading,
            subheader,
            message,
            classes,
            config,
            attachmentIsLoading,
            searchFilesById,
            openDetails,
            addEntry,
            feature
        } = this.props
        const SortableItem = SortableElement(({ value, sortIndex, index }) =>
            <div className="card-div" >

                < Card  ref={(div) => {value.getProperties()['order'] = div; }}  id={"id" + sortIndex} className='image-container'  onClick={() => 
            
                    openDetails({ detailsOfFeature:value})}>
                    <div style={{ display: "flex" }}   >
                        <div style={{ "flexGrow": "1" }}>
                            <Badge className={classes.badge} badgeContent={`${value.getProperties()['order']}`} color="primary">  </Badge>
                            <CardHeader
                            title={value.getProperties()['title']!=null ?  unescape(value.getProperties()['title']):"No Title"}

                                subheader={`${config.ubtitleAttribute ? value.getProperties()[config.subtitleAttribute] : ''}`} />

                        </div>
                        <div>
                            {this.state.accessEdit && this.state.editMode && <IconButton onMouseDown={() => {
                                this.props.editFeature(value)
                                this.props.handleEditFeature(value)
                            }}
                                className={classes.button} aria-label="edit" color="primary">
                                <EditIcon />
                            </IconButton>}

                            {this.state.accessDelete && this.state.editMode && <IconButton onMouseDown={() => {
                                this.deleteDialogeClickOpen(value)
                            }}
                                className={classes.button} aria-label="edit" color="primary">
                                <DeleteIcon />
                            </IconButton>}

                        </div>
                    </div>
                    <img className={classes.bigAvatar} style={{ height: "250px" }} src={[value.getProperties()['imageurl'] ? value.getProperties()['imageurl'] : urls.static + 'storymap/img/no-img.png'
                    ]}

                        onError={this.addDefaultSrc}
                    />
                    <CardContent>
                        <Typography component="p">
                            { unescape(value.getProperties()['description'])}
                        </Typography>
                        {value.getProperties()['link'] && value.getProperties()['link'] != 'null' && <Typography component="p" onMouseDown={() => {

                        }}>

                            <a href={ unescape(value.getProperties()['link'])}>visit link</a>
                        </Typography>}
                    </CardContent>

                </Card>
                <Divider />
                <br />
            </div>
        );
        const SortableList = SortableContainer(({ items }) => {
            return (
                <div id="cards" >
                    {items.map((value, index) => (
                        <SortableItem
                            key={`item-${index}`}
                            index={index}
                            sortIndex={index}
                            value={value}
                            disabled={!this.state.editMode}
                        />
                    ))}
                </div>
            );
        });
        return (

            <div>
                {this.state.editMode && this.state.alert &&



                    <div className="alert info">
                        <span className="closebtn" onClick={() => { this.closeAlert() }}>&times;</span>
                        <strong>Info!</strong> Drag Cards to reorder

</div>
                }
                <Dialog open={this.state.openDeleteDialoge} onClose={this.deleteDialogeRequestClose}>
                    <DialogTitle>{"Are you sure you want to delete this feature?"}</DialogTitle>
                    <DialogContent>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.deleteDialogeRequestClose} color="primary" autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={this.deleteFeature} color="primary" disabled={this.state.loading}>


                            {this.state.loading ? 'Deleting' : 'Delete'}
                            {this.state.loading && <CircularProgress size={20} />}
                        </Button>
                    </DialogActions>
                </Dialog>
                

                <Dialog open={this.props.error} >
                    <DialogTitle> Error</DialogTitle>
                    <DialogContent>
                   {"Layer can not be accessed !"}
                    </DialogContent>
                    <DialogActions>
                      
                    </DialogActions>
                </Dialog>


                <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={this.state.openSnackBar}
                    onClose={this.handleCloseSnackBar}
                    SnackbarContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">"Feature Deleted Successfully"</span>}
                />
                {!featuresIsLoading && !attachmentIsLoading && features && features.length >
                    0 ?
                    <div id="contents"  >


                        <List style={{ "marginBottom": "10%" }}  >
                            <SortableList items={this.state.features.length > 0 ? this.state.features : features} onSortEnd={this.onSortEnd} />
                        </List>
                     
                    </div> :
                    features && features.length == 0 ?
                        <Message message={message} type="body2" /> :
                        <Loader />}
                <Paper className='fixed-container'>
                    {this.state.accessAdd && !featuresIsLoading &&!this.props.error &&<Button onClick={() => this.props.showAddPanel()} raised color="primary" className={classes.button} style={{ width: '45%' }} >
                        submit
      </Button>}
                    {this.state.accessEdit && !this.state.editMode && !featuresIsLoading && this.state.features && this.state.features.length > 0 &&
                        <Button onClick={() => this.enableEdit()} raised color="primary" className={classes.button} style={{ width: '45%', float: "right" }} >
                            Edit
      </Button>}
                    {this.state.accessEdit && this.state.editMode && !featuresIsLoading && this.state.features && this.state.features.length > 0 && <Button onClick={() => this.disableEdit()} raised color="primary" className={classes.button} style={{ width: '45%', float: "right" }} >
                        Back
      </Button>}
      
                </Paper>
            </div>
        )
    }
}
FeatureListComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    features: PropTypes.array,
    config: PropTypes.object.isRequired,
    openDetails: PropTypes.func.isRequired,

    message: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    attachmentIsLoading: PropTypes.bool.isRequired,
    searchFilesById: PropTypes.func.isRequired
}
export const URL = (props) => {
    const { classes, url } = props
    return <Button  href={url} className={classes.button}>
        Link
        </Button>
}
URL.propTypes = {
    classes: PropTypes.object.isRequired,
    url: PropTypes.string.isRequired
}
export const PropsTable = (props) => {
    const { classes, selectedFeature } = props
    return <Table>
        <TableHead>
            <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Value</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {Object.keys(selectedFeature.getProperties()).map((key, i) => {
                const value = selectedFeature.getProperties()[key]
                if (key != "geometry" && key != "_layerTitle") {
                    return <TableRow key={i}>
                        <TableCell>{key}</TableCell>
                        <TableCell style={{ whiteSpace: 'pre-line' }}>{checkURL(value) ? <URL url={value} classes={classes} /> : value}</TableCell>
                    </TableRow>
                }
            })}
        </TableBody>
    </Table>
}
PropsTable.propTypes = {
    classes: PropTypes.object.isRequired,
    selectedFeature: PropTypes.object.isRequired
}

export const DropZoneComponent = (props) => {
    const { classes, files, onDrop } = props
    return (
        <div className="center-div">
            <Dropzone maxSize={5242880} multiple={false} accept="image/*" onDrop={onDrop}>
                <div>
                    <Message message={"Click to select Image to upload."} type="body1" />
                    {files.map(f => <img src={f.preview} style={{ "width": "200px", "height": "180px" }} />)}
                </div>
            </Dropzone>
        </div>
    )
}
export const Slider = (props) => {
    const { attachments } = props
    return <div>
        <Grid container alignItems={'center'} justify={'center'} spacing={0}>
            {attachments.length > 0 ? <Grid item xs={10} sm={10} md={10} lg={10} xl={10} >
                <Carousel showArrows={true}>
                    {attachments.map(
                        (imageObj, i) => {
                            return <div key={i}>
                                <img src={imageObj.file} />
                                <p className="legend">{`Uploaded by ${imageObj.username}`}</p>
                            </div>
                        }
                    )}
                </Carousel>
            </Grid> : <Message align="center" message={""} type="body1" />}
        </Grid>
    </div>
}
Slider.propTypes = {
    attachments: PropTypes.array.isRequired
}
export const MobileDrawer = (props) => {
    const { theme, mobileOpen, classes, handleDrawerToggle, childrenProps, addEntry } =
        props
    return (
        <Drawer
            type="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            classes={{
                paper: classes.drawerPaper,
            }}

            ModalProps={{
                keepMounted: true,
            }}
        >
            <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerToggle}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <Paper className={classes.paper}><CartoviewList addEntry={addEntry} {...childrenProps} /></Paper>
        </Drawer>
    )
}
MobileDrawer.propTypes = {
    mobileOpen: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    handleDrawerToggle: PropTypes.func.isRequired,
    childrenProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
}
export const CommentBox = (props) => {
    const { classes, value, handleChange, addComment, hasError } = props
    return (
        <div className={classes.textCenter}>
            {!hasError ? <TextField
                id="multiline-flexible"
                label="Comment"
                multiline
                rowsMax="4"
                value={value}
                onChange={handleChange}
                className={classes.textField}
                margin="normal"
                fullWidth
            /> : <TextField
                    error
                    id="multiline-flexible"
                    label="Comment"
                    multiline
                    rowsMax="4"
                    value={value}
                    onChange={handleChange}
                    className={classes.textField}
                    margin="normal"
                    fullWidth
                />}
            <Button onClick={addComment} raised  className={classes.button}>
                {`Send`} <SendIcon />
            </Button>
        </div>
    )
}
CommentBox.propTypes = {
    value: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    hasError: PropTypes.bool.isRequired
}